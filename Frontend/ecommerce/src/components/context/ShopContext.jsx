import React, { createContext, useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import api from "../../api/axios.js";
import {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
} from "../../services/cartService.js";
import AuthGateModal from "../AuthGateModal.jsx";

export const ShopContext = createContext();

const normalizeCartItem = (item) => {
  if (!item) return null;
  const product = item.Product || {};
  return {
    id: item.id ?? item.productId ?? product.id,
    productId: item.productId ?? product.id ?? item.id,
    qty: Number(item.qty ?? item.quantity ?? 1),
    name: item.name ?? product.title ?? product.name ?? item.title ?? "Product",
    price: Number(item.price ?? product.price ?? 0),
    image: item.image ?? product.imageUrl ?? product.image ?? item.imageUrl ?? "",
    Product: item.Product,
  };
};

const normalizeCart = (rawCart) => (rawCart || []).map(normalizeCartItem).filter(Boolean);

export const ShopProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const saved = typeof window !== "undefined" ? localStorage.getItem("cart") : null;
      return saved ? normalizeCart(JSON.parse(saved)) : [];
    } catch (e) {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [productsError, setProductsError] = useState(null);

  // ── Guest checkout gate ────────────────────────────────────────────────
  // authModalOpen: controls the "please log in" modal.
  // redirectPath: where to send the user after they successfully log in
  // or register, IF they hit the gate via requireAuthForCheckout. Stays
  // null on a normal, un-gated login (e.g. visiting /login directly),
  // so Login/Register can safely fall back to "/" when it's null.
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [redirectPath, setRedirectPath] = useState(null);

  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.authentication.isAuthenticated);

  const refetchProducts = useCallback(async () => {
    setProductsError(null);
    try {
      const response = await api.get("/api/products");

      const parsedProducts = response.data.data.map((product) => ({
        ...product,
        images:
          typeof product.images === "string"
            ? JSON.parse(product.images)
            : product.images,
      }));

      setProducts(parsedProducts);
    } catch (error) {
      console.error("[ShopContext] Failed to load products:", error.response?.data || error.message);
      setProductsError(
        error.response?.data?.message ||
          "Could not reach the server. Check your connection and try again."
      );
    }
  }, []);

  useEffect(() => {
    refetchProducts();
  }, [refetchProducts]);

  // Sync cart to localStorage whenever it changes
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("cart", JSON.stringify(cart));
      }
    } catch (e) {
      console.error("[ShopContext] Failed to persist cart:", e);
    }
  }, [cart]);

  // ── Server cart sync ───────────────────────────────────────────────────
  const syncServerCart = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const response = await getCart();
      const serverItems = response?.cart || [];
      if (Array.isArray(serverItems) && serverItems.length > 0) {
        setCart(normalizeCart(serverItems));
      }
    } catch (error) {
      console.log("[ShopContext] Failed to load server cart:", error.response?.data || error.message);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      syncServerCart();
    }
  }, [isAuthenticated, syncServerCart]);

  // ── Guest cart → server cart merge ──────────────────────────────────────
  const cartRef = useRef(cart);
  useEffect(() => {
    cartRef.current = cart;
  }, [cart]);

  const wasAuthenticatedRef = useRef(isAuthenticated);
  useEffect(() => {
    const wasAuthenticated = wasAuthenticatedRef.current;
    wasAuthenticatedRef.current = isAuthenticated;

    if (!wasAuthenticated && isAuthenticated) {
      const guestItems = cartRef.current;
      if (guestItems.length === 0) {
        syncServerCart();
        return;
      }

      const mergeGuestCart = async () => {
        let latestCart = null;
        for (const item of guestItems) {
          try {
            const response = await addToCart(item.productId, item.qty);
            latestCart = response.cart;
          } catch (error) {
            console.log(error.response?.data || error.message);
          }
        }
        if (latestCart) {
          setCart(normalizeCart(latestCart));
        } else {
          syncServerCart();
        }
      };

      mergeGuestCart();
    }
  }, [isAuthenticated, syncServerCart]);

  const HandleAddToCart = async (product, quantity = 1) => {
    if (!isAuthenticated) {
      // Look the full product up from the already-loaded catalog so the
      // local cart line has real name/price/image regardless of whether
      // the caller passed a full product object or just { id }.
      const fullProduct = products.find((p) => p.id === product.id) || product;

      setCart((prev) => {
        const existing = prev.find((item) => item.productId === product.id);
        if (existing) {
          return prev.map((item) =>
            item.productId === product.id
              ? { ...item, qty: item.qty + quantity }
              : item
          );
        }
        return [
          ...prev,
          {
            id: product.id, // no server cart-line id yet — productId stands in
            productId: product.id,
            qty: quantity,
            name: fullProduct.title,
            price: fullProduct.price,
            image: fullProduct.imageUrl,
          },
        ];
      });
      return;
    }

    try {
      const response = await addToCart(product.id, quantity);
      setCart(normalizeCart(response.cart));
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  const HandleIncreaseQty = async (cartItem) => {
    if (!isAuthenticated) {
      setCart((prev) =>
        prev.map((item) =>
          item.productId === cartItem.productId
            ? { ...item, qty: item.qty + 1 }
            : item
        )
      );
      return;
    }

    try {
      const response = await updateCartItem(cartItem.id, cartItem.qty + 1);
      setCart(normalizeCart(response.cart));
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  // Decreases an existing cart line's quantity by 1. If quantity would
  // drop to 0, we remove the line entirely instead of sending qty: 0.
  const HandleDecreaseQty = async (cartItem) => {
    if (!isAuthenticated) {
      setCart((prev) => {
        if (cartItem.qty <= 1) {
          return prev.filter((item) => item.productId !== cartItem.productId);
        }
        return prev.map((item) =>
          item.productId === cartItem.productId
            ? { ...item, qty: item.qty - 1 }
            : item
        );
      });
      return;
    }

    try {
      const response =
        cartItem.qty <= 1
          ? await removeFromCart(cartItem.id)
          : await updateCartItem(cartItem.id, cartItem.qty - 1);
      setCart(normalizeCart(response.cart));
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  // Removes a cart line entirely, regardless of its quantity.
  const HandleRemoveFromCart = async (cartItem) => {
    if (!isAuthenticated) {
      setCart((prev) => prev.filter((item) => item.productId !== cartItem.productId));
      return;
    }

    try {
      const response = await removeFromCart(cartItem.id);
      setCart(normalizeCart(response.cart));
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  // Call this instead of navigate("/billing") anywhere "go to checkout"
  // happens. Logged-in users go straight through — behavior identical to
  // before. Guests get the modal instead of the page, and the path they
  // wanted is remembered so Login/Register can send them there after.
  const requireAuthForCheckout = (path = "/billing") => {
    if (isAuthenticated) {
      navigate(path);
    } else {
      setRedirectPath(path);
      setAuthModalOpen(true);
    }
  };

  // Login/Register call this on success. Falls back to "/" if the user
  // arrived there some other way (not through the checkout gate).
  const consumeRedirectPath = () => {
    const path = redirectPath || "/";
    setRedirectPath(null);
    return path;
  };

  const clearCart = () => {
    setCart([]);
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem("cart");
      }
    } catch (e) {
      // ignore
    }
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        productsError,
        refetchProducts,
        cart,
        setCart,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        HandleAddToCart,
        HandleIncreaseQty,
        HandleDecreaseQty,
        HandleRemoveFromCart,
        authModalOpen,
        setAuthModalOpen,
        requireAuthForCheckout,
        consumeRedirectPath,
      }}
    >
      {children}
      <AuthGateModal />
    </ShopContext.Provider>
  );
};