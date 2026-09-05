import { mockProducts } from "../components/product/mockProducts.js";

// Helper to determine if we are in Demo Mode
export const isDemoModeActive = () => {
  // If explicitly enabled via environment variable
  if (import.meta.env.VITE_DEMO_MODE === "true") return true;
  // If explicitly disabled via environment variable
  if (import.meta.env.VITE_DEMO_MODE === "false") return false;
  // If explicitly logged in as demo
  if (typeof window !== "undefined" && localStorage.getItem("demo_role")) return true;
  // If demo mode toggle is set in localStorage
  if (typeof window !== "undefined" && localStorage.getItem("demo_mode_active") === "true") return true;
  // If live backend URL is provided, never default to demo mode
  if (import.meta.env.VITE_API_BASE_URL) return false;

  return false;
};

// Initialize localized mock database
export function initMockDb() {
  if (!localStorage.getItem("demo_initialized")) {
    // Products initialization
    const initialProducts = mockProducts.map((p) => ({
      ...p,
      imageUrl: p.image, // Ensure both imageUrl and image are set
      images: [p.image],
      VendorId: "demo-vendor-id",
      Vendor: { id: "demo-vendor-id", name: "Demo Vendor" },
      createdAt: new Date().toISOString(),
    }));
    localStorage.setItem("demo_products", JSON.stringify(initialProducts));

    // Users initialization
    const defaultUsers = [
      {
        id: "demo-buyer-id",
        name: "Demo Buyer",
        email: "buyer@demo.com",
        role: "buyer",
        createdAt: new Date().toISOString(),
      },
      {
        id: "demo-vendor-id",
        name: "Demo Vendor",
        email: "vendor@demo.com",
        role: "vendor",
        createdAt: new Date().toISOString(),
      },
      {
        id: "demo-admin-id",
        name: "Demo Admin",
        email: "admin@demo.com",
        role: "admin",
        createdAt: new Date().toISOString(),
      },
    ];
    localStorage.setItem("demo_users", JSON.stringify(defaultUsers));

    // Orders initialization
    const defaultOrders = [
      {
        id: "demo-order-1",
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        totalAmount: 139.49,
        paymentStatus: "Completed",
        orderStatus: "Processing",
        paymentMethod: "Credit Card",
        shippingAddress: {
          address: "123 Demo St",
          city: "Demo City",
          postalCode: "12345",
        },
        User: {
          id: "demo-buyer-id",
          name: "Demo Buyer",
          email: "buyer@demo.com",
        },
        OrderItems: [
          {
            id: "item-1",
            productId: 1,
            quantity: 1,
            price: 89.99,
            Product: {
              title: "Minimalist Wireless Headphones",
              imageUrl:
                "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
            },
          },
          {
            id: "item-2",
            productId: 2,
            quantity: 1,
            price: 49.5,
            Product: {
              title: "Smart Fitness Watch v2",
              imageUrl:
                "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
            },
          },
        ],
      },
    ];
    localStorage.setItem("demo_orders", JSON.stringify(defaultOrders));
    localStorage.setItem("demo_cart", JSON.stringify([]));
    localStorage.setItem("demo_initialized", "true");
  }
}

// Helper to retrieve data from localStorage or object
const getFormDataValue = (formData, key) => {
  if (formData instanceof FormData) {
    return formData.get(key);
  }
  return formData ? formData[key] : undefined;
};

// Main request router/handler for Demo Mode
export async function handleMockRequest(config) {
  initMockDb();

  const url = config.url || "";
  const method = (config.method || "get").toLowerCase();
  
  let parsedData = {};
  if (config.data) {
    if (typeof config.data === "string") {
      try {
        parsedData = JSON.parse(config.data);
      } catch (e) {
        parsedData = config.data;
      }
    } else {
      parsedData = config.data;
    }
  }

  // Response builders matching Axios schema
  const successResponse = (data) => ({
    data,
    status: 200,
    statusText: "OK",
    headers: {},
    config,
  });

  const errorResponse = (message, status = 400) => {
    const err = new Error(message);
    err.response = {
      data: { message, success: false },
      status,
      statusText: "Bad Request",
      headers: {},
      config,
    };
    throw err;
  };

  // Local storage table getter/setters
  const getProducts = () => JSON.parse(localStorage.getItem("demo_products") || "[]");
  const setProducts = (p) => localStorage.setItem("demo_products", JSON.stringify(p));

  const getUsers = () => JSON.parse(localStorage.getItem("demo_users") || "[]");
  const setUsers = (u) => localStorage.setItem("demo_users", JSON.stringify(u));

  const getOrders = () => JSON.parse(localStorage.getItem("demo_orders") || "[]");
  const setOrders = (o) => localStorage.setItem("demo_orders", JSON.stringify(o));

  const getCart = () => JSON.parse(localStorage.getItem("demo_cart") || "[]");
  const setCart = (c) => localStorage.setItem("demo_cart", JSON.stringify(c));

  const role = localStorage.getItem("demo_role") || "buyer";

  // 1. Authentication endpoints
  if (url === "/api/auth/me") {
    const loggedInRole = localStorage.getItem("demo_role");
    if (!loggedInRole) {
      return errorResponse("Not authenticated", 401);
    }
    return successResponse({
      success: true,
      data: {
        id: `demo-${loggedInRole}-id`,
        name: `Demo ${loggedInRole.charAt(0).toUpperCase() + loggedInRole.slice(1)}`,
        email: `${loggedInRole}@demo.com`,
        role: loggedInRole,
        isDemo: true,
      },
    });
  }

  if (url === "/api/auth/login") {
    const targetRole = role;
    localStorage.setItem("demo_role", targetRole);
    return successResponse({
      success: true,
      data: {
        id: `demo-${targetRole}-id`,
        name: `Demo ${targetRole.charAt(0).toUpperCase() + targetRole.slice(1)}`,
        email: `${targetRole}@demo.com`,
        role: targetRole,
        isDemo: true,
      },
    });
  }

  if (url === "/api/auth/register") {
    const regRole = parsedData.role || "buyer";
    localStorage.setItem("demo_role", regRole);
    return successResponse({
      success: true,
      id: `demo-${regRole}-id`,
      name: parsedData.name || `Demo ${regRole}`,
      email: parsedData.email || `${regRole}@demo.com`,
      role: regRole,
      isDemo: true,
    });
  }

  if (url === "/api/auth/logout") {
    localStorage.removeItem("demo_role");
    localStorage.removeItem("demo_mode_active");
    return successResponse({ success: true, message: "Logged out successfully" });
  }

  if (url === "/api/auth/update-profile") {
    const updatedName = getFormDataValue(parsedData, "name") || `Demo ${role}`;
    return successResponse({
      success: true,
      message: "Profile updated",
      data: {
        id: `demo-${role}-id`,
        name: updatedName,
        email: `${role}@demo.com`,
        role,
        isDemo: true,
      },
    });
  }

  // 2. Products Catalog endpoint
  if (url === "/api/products" && method === "get") {
    return successResponse({ success: true, data: getProducts() });
  }

  // 3. Cart endpoints
  if (url === "/api/cart" && method === "get") {
    return successResponse({ success: true, cart: getCart() });
  }

  if (url === "/api/cart/addtocart" && method === "post") {
    const productId = Number(parsedData.productId);
    const quantity = Number(parsedData.quantity || 1);
    
    const products = getProducts();
    const product = products.find((p) => p.id === productId);
    if (!product) return errorResponse("Product not found");

    let cart = getCart();
    const idx = cart.findIndex((item) => item.productId === productId);
    if (idx > -1) {
      cart[idx].quantity += quantity;
    } else {
      cart.push({
        id: `cart-item-${Date.now()}`,
        productId,
        quantity,
        Product: {
          id: product.id,
          title: product.title,
          price: product.price,
          imageUrl: product.imageUrl || product.image,
        },
      });
    }
    setCart(cart);
    return successResponse({ success: true, cart });
  }

  if (url === "/api/cart/update" && method === "patch") {
    const cartItemId = parsedData.cartItemId;
    const quantity = Number(parsedData.quantity);

    let cart = getCart();
    const idx = cart.findIndex((item) => item.id === cartItemId);
    if (idx > -1) {
      cart[idx].quantity = quantity;
      setCart(cart);
      return successResponse({ success: true, cart });
    }
    return errorResponse("Cart item not found");
  }

  if (url.startsWith("/api/cart/remove/") && method === "delete") {
    const cartItemId = url.split("/").pop();
    let cart = getCart();
    cart = cart.filter((item) => item.id !== cartItemId);
    setCart(cart);
    return successResponse({ success: true, cart });
  }

  // 4. Checkout / Orders endpoints
  if (url === "/api/checkout" && method === "post") {
    const { shippingAddress, paymentMethod } = parsedData;
    const cart = getCart();
    if (cart.length === 0) return errorResponse("Cart is empty");

    const totalAmount = cart.reduce((sum, item) => sum + item.quantity * item.Product.price, 0) + 5.0;

    const newOrder = {
      id: `demo-order-${Date.now()}`,
      createdAt: new Date().toISOString(),
      totalAmount,
      paymentStatus: "Completed",
      orderStatus: "Pending",
      paymentMethod: paymentMethod || "Card",
      shippingAddress,
      User: {
        id: "demo-buyer-id",
        name: "Demo Buyer",
        email: "buyer@demo.com",
      },
      OrderItems: cart.map((item, index) => ({
        id: `item-${Date.now()}-${index}`,
        productId: item.productId,
        quantity: item.quantity,
        price: item.Product.price,
        Product: {
          title: item.Product.title,
          imageUrl: item.Product.imageUrl,
        },
      })),
    };

    const orders = getOrders();
    orders.unshift(newOrder);
    setOrders(orders);

    // Clear cart
    setCart([]);
    return successResponse({ success: true, message: "Order placed successfully", order: newOrder });
  }

  if (url === "/api/checkout/myorders" && method === "get") {
    const orders = getOrders().filter((o) => o.User?.id === "demo-buyer-id");
    return successResponse({ success: true, orders });
  }

  // 5. Vendor Dashboard endpoints
  if (url === "/api/vendor/all" && method === "get") {
    const products = getProducts().filter((p) => p.VendorId === "demo-vendor-id");
    return successResponse({ success: true, data: products });
  }

  if (url === "/api/vendor/add" && method === "post") {
    const title = getFormDataValue(parsedData, "title");
    const price = Number(getFormDataValue(parsedData, "price"));
    const description = getFormDataValue(parsedData, "description");
    const category = getFormDataValue(parsedData, "category") || "Other";
    const stock = Number(getFormDataValue(parsedData, "stock") || 10);
    const sku = getFormDataValue(parsedData, "sku") || `SKU-${Date.now()}`;

    const files = parsedData instanceof FormData ? parsedData.getAll("images") : [];
    let imageUrl = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80";
    if (files.length > 0 && files[0] instanceof File) {
      imageUrl = URL.createObjectURL(files[0]);
    }

    const newProduct = {
      id: Date.now(),
      title,
      price,
      description,
      category,
      stock,
      sku,
      image: imageUrl,
      imageUrl: imageUrl,
      images: [imageUrl],
      rating: 5.0,
      inStock: stock > 0,
      VendorId: "demo-vendor-id",
      Vendor: { id: "demo-vendor-id", name: "Demo Vendor" },
      createdAt: new Date().toISOString(),
    };

    const products = getProducts();
    products.unshift(newProduct);
    setProducts(products);

    return successResponse({ success: true, product: newProduct, data: newProduct });
  }

  if (url.startsWith("/api/vendor/update/") && method === "put") {
    const id = Number(url.split("/").pop());
    const title = getFormDataValue(parsedData, "title");
    const price = Number(getFormDataValue(parsedData, "price"));
    const description = getFormDataValue(parsedData, "description");

    let products = getProducts();
    const idx = products.findIndex((p) => p.id === id);
    if (idx > -1) {
      const updatedProduct = {
        ...products[idx],
        title: title || products[idx].title,
        price: price !== undefined && !isNaN(price) ? price : products[idx].price,
        description: description || products[idx].description,
      };

      const files = parsedData instanceof FormData ? parsedData.getAll("images") : [];
      if (files.length > 0 && files[0] instanceof File) {
        const imageUrl = URL.createObjectURL(files[0]);
        updatedProduct.image = imageUrl;
        updatedProduct.imageUrl = imageUrl;
        updatedProduct.images = [imageUrl];
      }

      products[idx] = updatedProduct;
      setProducts(products);
      return successResponse({ success: true, product: updatedProduct, data: updatedProduct });
    }
    return errorResponse("Product not found");
  }

  if (url.startsWith("/api/vendor/delete/") && method === "delete") {
    const id = Number(url.split("/").pop());
    let products = getProducts();
    products = products.filter((p) => p.id !== id);
    setProducts(products);
    return successResponse({ success: true, message: "Product deleted" });
  }

  // 6. Admin endpoints
  if (url === "/api/admin/dashboard" && method === "get") {
    const products = getProducts();
    const users = getUsers();
    const orders = getOrders();

    const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
    const totalVendors = users.filter((u) => u.role === "vendor").length;
    const totalUsers = users.length;
    const totalProducts = products.length;
    const totalOrders = orders.length;

    return successResponse({
      success: true,
      data: {
        totalUsers,
        totalVendors,
        totalProducts,
        totalOrders,
        totalRevenue,
      },
    });
  }

  if (url === "/api/admin/users" && method === "get") {
    return successResponse({ success: true, users: getUsers() });
  }

  if (url.startsWith("/api/admin/users/") && method === "put") {
    const userId = url.split("/").pop();
    const { role: newRole } = parsedData;

    let users = getUsers();
    const idx = users.findIndex((u) => u.id === userId);
    if (idx > -1) {
      users[idx].role = newRole;
      setUsers(users);
      return successResponse({ success: true, user: users[idx] });
    }
    return errorResponse("User not found");
  }

  if (url.startsWith("/api/admin/users/") && method === "delete") {
    const userId = url.split("/").pop();
    let users = getUsers();
    users = users.filter((u) => u.id !== userId);
    setUsers(users);
    return successResponse({ success: true });
  }

  if (url === "/api/admin/products" && method === "get") {
    return successResponse({ success: true, products: getProducts() });
  }

  if (url.startsWith("/api/admin/products/") && method === "delete") {
    const id = Number(url.split("/").pop());
    let products = getProducts();
    products = products.filter((p) => p.id !== id);
    setProducts(products);
    return successResponse({ success: true });
  }

  if (url === "/api/admin/orders" && method === "get") {
    return successResponse({ success: true, orders: getOrders() });
  }

  if (url.includes("/orders/") && url.endsWith("/status") && method === "put") {
    const parts = url.split("/");
    const orderId = parts[parts.length - 2];
    const { orderStatus } = parsedData;

    let orders = getOrders();
    const idx = orders.findIndex((o) => o.id === orderId);
    if (idx > -1) {
      orders[idx].orderStatus = orderStatus;
      setOrders(orders);
      return successResponse({ success: true, order: orders[idx] });
    }
    return errorResponse("Order not found");
  }

  // Fallback to error response if endpoint is not matched
  return errorResponse(`Mock endpoint not implemented: ${method.toUpperCase()} ${url}`, 404);
}
