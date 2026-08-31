import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import { ShopContext } from "../components/context/ShopContext.jsx"
// Import mock products as fallback
import { mockProducts } from '../components/product/mockProducts.js';

function AccordionRow({ title, isOpen, onToggle, children }) {
  return (
    <div className="border-t border-gray-100">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-4 text-left group"
      >
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-800 group-hover:text-[#0f3d2e] transition-colors">
          {title}
        </span>
        <span
          className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
            isOpen ? "bg-[#0f3d2e] text-white rotate-180" : "bg-gray-50 text-gray-500"
          }`}
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>
      <div
        className="grid transition-[grid-template-rows] duration-300 ease-in-out"
        style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <div className="pb-4">{children}</div>
        </div>
      </div>
    </div>
  );
}

function RelatedCard({ item, onClick }) {
  const hasMember = typeof item.memberPrice === "number";
  const [loaded, setLoaded] = useState(false);
  const displayImg = item.imageUrl || item.image;

  return (
    <button
      onClick={onClick}
      className="group text-left animate-[riseIn_0.4s_ease-out]"
    >
      <div className="aspect-square bg-[#f0f7f3] overflow-hidden rounded-xl">
        {displayImg ? (
          <img
            src={displayImg}
            alt={item.title || item.name}
            loading="lazy"
            decoding="async"
            onLoad={() => setLoaded(true)}
            className={`w-full h-full object-cover transition-all duration-500 ease-out group-hover:scale-110 ${
              loaded ? "opacity-100" : "opacity-0"
            }`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-10 h-10 text-[#0f3d2e]/25" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M14 8h.01M6 20h12a2 2 0 002-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>
      <p className="text-sm text-gray-800 font-medium mt-3 line-clamp-1 group-hover:text-[#0f3d2e] transition-colors">
        {item.title || item.name}
      </p>
      <div className="flex items-center gap-2 mt-0.5">
        <p className={`text-sm ${hasMember ? "text-gray-400 line-through" : "text-gray-500"}`}>
          ${Number(item.price).toFixed(2)}
        </p>
        {hasMember && (
          <p className="text-sm font-medium text-[#0f3d2e]">
            ${Number(item.memberPrice).toFixed(2)}
          </p>
        )}
      </div>
    </button>
  );
}

export default function ProductDetails() {
  const { id } = useParams();
  const context = useContext(ShopContext) || {};
  
  // Fallback to mockProducts if context products array is empty
  const allProducts = (context.products && context.products.length > 0) 
    ? context.products 
    : (mockProducts || []);

  const cart = context.cart || [];
  const setIsCartOpen = context.setIsCartOpen || (() => {});
  const HandleAddToCart = context.HandleAddToCart || (() => {});
  const HandleIncreaseQty = context.HandleIncreaseQty || (() => {});
  const HandleDecreaseQty = context.HandleDecreaseQty || (() => {});
  const requireAuthForCheckout = context.requireAuthForCheckout;

  // Search by _id OR id with string coercion
  const product = allProducts.find((p) => String(p._id || p.id) === String(id)) || allProducts[0];

  const cartItem = cart.find((item) => String(item.productId) === String(product?._id || product?.id));

  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [openSection, setOpenSection] = useState("description");
  const [wishlisted, setWishlisted] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [pulseQty, setPulseQty] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [zooming, setZooming] = useState(false);
  const [mainImageLoaded, setMainImageLoaded] = useState(true);

  const addedTimeout = useRef(null);
  const mainImageRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setActiveImage(0);
    setQty(1);
    if (product) setWishlisted(product.isFavorite ?? false);
  }, [id, product]);

  useEffect(() => () => clearTimeout(addedTimeout.current), []);

  if (!product) {
    return (
      <div className="bg-white font-[Poppins] max-w-5xl mx-auto px-4 sm:px-6 py-20 text-center">
        <p className="text-sm text-gray-500">
          We couldn't find that product. It may have been removed.
        </p>
      </div>
    );
  }

  const rawImages = Array.isArray(product.images)
    ? product.images
    : product.images
    ? [product.images]
    : [];

  const mainCover = product.imageUrl || product.image;
  const gallery = [mainCover, ...rawImages].filter(
    (img, idx, arr) => Boolean(img) && arr.indexOf(img) === idx
  );

  const sameCategory = allProducts.filter(
    (p) => String(p._id || p.id) !== String(product._id || product.id) && p.category === product.category
  );
  const others = allProducts.filter(
    (p) => String(p._id || p.id) !== String(product._id || product.id) && p.category !== product.category
  );
  const related = [...sameCategory, ...others].slice(0, 4);

  const toggleSection = (key) =>
    setOpenSection((prev) => (prev === key ? null : key));

  const hasMemberPrice = typeof product.memberPrice === "number";
  const memberSaving = hasMemberPrice
    ? Math.round(product.price - product.memberPrice)
    : null;

  const changeImage = (i) => {
    if (i === activeImage) return;
    setActiveImage(i);
    if (mainImageRef.current && mainImageRef.current.complete) {
      setMainImageLoaded(true);
    } else {
      setMainImageLoaded(false);
    }
  };

  const bumpQty = (next) => {
    setQty(next);
    setPulseQty(true);
    setTimeout(() => setPulseQty(false), 180);
  };

  const displayedQty = cartItem ? cartItem.qty : qty;

  const handleDecrease = () => {
    if (cartItem) {
      HandleDecreaseQty(cartItem);
    } else {
      bumpQty(Math.max(1, qty - 1));
    }
  };

  const handleIncrease = () => {
    if (cartItem) {
      HandleIncreaseQty(cartItem);
    } else {
      bumpQty(qty + 1);
    }
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setZoomPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const addToCart = (goToCheckout) => {
    const prodId = product._id || product.id;
    if (!cartItem) {
      HandleAddToCart({ id: prodId }, qty);
    }

    if (goToCheckout) {
      if (typeof requireAuthForCheckout === "function") {
        requireAuthForCheckout("/billing");
      } else {
        navigate("/billing");
      }
      return;
    }
    setJustAdded(true);
    clearTimeout(addedTimeout.current);
    addedTimeout.current = setTimeout(() => setJustAdded(false), 1600);
  };

  return (
    <div className="bg-white font-[Poppins] max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="grid md:grid-cols-2 gap-10">
        {/* IMAGE GALLERY */}
        <div className="space-y-3">
          <div
            className="relative aspect-square bg-[#f0f7f3] overflow-hidden flex items-center justify-center rounded-2xl group"
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setZooming(true)}
            onMouseLeave={() => setZooming(false)}
          >
            {gallery.length > 0 ? (
              <img
                ref={mainImageRef}
                key={activeImage}
                src={gallery[activeImage]}
                alt={product.title || product.name}
                loading="eager"
                decoding="async"
                onLoad={() => setMainImageLoaded(true)}
                className={`w-full h-full object-cover transition-all duration-300 ease-out ${
                  mainImageLoaded ? "opacity-100" : "opacity-0"
                }`}
                style={
                  zooming
                    ? {
                        transform: "scale(1.6)",
                        transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                      }
                    : { transform: "scale(1)" }
                }
              />
            ) : (
              <svg className="w-20 h-20 text-[#0f3d2e]/30" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M14 8h.01M6 20h12a2 2 0 002-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            )}

            <button
              onClick={() => setWishlisted((w) => !w)}
              aria-label="Add to wishlist"
              className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-sm hover:scale-105 active:scale-95 transition-transform"
            >
              <svg
                className={`w-4.5 h-4.5 transition-all duration-300 ${
                  wishlisted ? "text-[#0f3d2e] scale-110" : "text-gray-400 scale-100"
                }`}
                fill={wishlisted ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s-7-4.35-9.5-8.5C.5 9 2 5.5 5.5 5c2-.3 3.5.7 4.5 2 1-1.3 2.5-2.3 4.5-2 3.5.5 5 4 3 7.5C19 16.65 12 21 12 21z" />
              </svg>
            </button>

            {gallery.length > 1 && (
              <span className="absolute bottom-3 right-3 text-[11px] font-medium text-white bg-black/40 backdrop-blur px-2 py-0.5 rounded-full">
                {activeImage + 1} / {gallery.length}
              </span>
            )}
          </div>

          {gallery.length > 1 && (
            <div className="grid grid-cols-3 gap-3">
              {gallery.map((img, i) => (
                <button
                  key={i}
                  onClick={() => changeImage(i)}
                  className={`relative aspect-square bg-[#f0f7f3] overflow-hidden rounded-xl border-2 transition-all duration-200 ${
                    activeImage === i
                      ? "border-[#0f3d2e] scale-[0.97]"
                      : "border-transparent hover:border-[#0f3d2e]/30"
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.title || product.name} view ${i + 1}`}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* PRODUCT INFO */}
        <div className="flex flex-col animate-[riseIn_0.4s_ease-out]">
          {product.category && (
            <p className="text-xs uppercase tracking-wider text-[#1a4d3c] font-medium">
              {product.category}
            </p>
          )}
          <h1 className="text-3xl font-semibold text-gray-900 mt-1">
            {product.title || product.name}
          </h1>

          {product.delivery && (
            <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
              <svg className="w-4 h-4 text-[#0f3d2e]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h13l4 4v6h-2M3 7v10h2m11-10v10m-11 0a2 2 0 104 0m-4 0H8m9 0a2 2 0 104 0m-4 0h-3" />
              </svg>
              {product.delivery}
            </div>
          )}

          <div className="mt-6">
            <AccordionRow
              title="Description"
              isOpen={openSection === "description"}
              onToggle={() => toggleSection("description")}
            >
              <p className="text-sm text-gray-500 leading-relaxed">
                {product.description || "No description available yet."}
              </p>
            </AccordionRow>
          </div>

          <div className="border-t border-gray-100 py-5 flex items-center gap-10">
            <div>
              <p className="text-xs text-gray-400">
                {hasMemberPrice ? "Regular price" : "Price"}
              </p>
              <p className={`text-xl font-semibold mt-0.5 ${hasMemberPrice ? "text-gray-400 line-through decoration-1" : "text-gray-900"}`}>
                ${Number(product.price || 0).toFixed(2)}
              </p>
            </div>
            {hasMemberPrice && (
              <div className="relative">
                <p className="text-xs text-gray-400">Member price</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <p className="text-xl font-semibold text-[#0f3d2e]">
                    ${Number(product.memberPrice).toFixed(2)}
                  </p>
                  <span className="text-[10px] font-bold text-white bg-[#0f3d2e] px-2 py-0.5 rounded-full">
                    SAVE ${memberSaving}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 pb-5">
            <div className="inline-flex items-center bg-[#f5f0ea] rounded-full px-1 py-1">
              <button
                onClick={handleDecrease}
                aria-label="Decrease quantity"
                disabled={!cartItem && qty <= 1}
                className="w-8 h-8 rounded-full flex items-center justify-center text-gray-600 hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent transition"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" d="M5 12h14" />
                </svg>
              </button>
              <span className={`w-8 text-center text-sm font-medium text-gray-800 transition-transform duration-150 ${pulseQty ? "scale-125" : "scale-100"}`}>
                {displayedQty}
              </span>
              <button
                onClick={handleIncrease}
                aria-label="Increase quantity"
                className="w-8 h-8 rounded-full flex items-center justify-center bg-[#0f3d2e] text-white hover:bg-[#154d3b] active:scale-90 transition"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" d="M12 5v14M5 12h14" />
                </svg>
              </button>
            </div>

            {wishlisted && (
              <span className="text-xs text-[#0f3d2e] font-medium flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21s-7-4.35-9.5-8.5C.5 9 2 5.5 5.5 5c2-.3 3.5.7 4.5 2 1-1.3 2.5-2.3 4.5-2 3.5.5 5 4 3 7.5C19 16.65 12 21 12 21z" />
                </svg>
                Saved to wishlist
              </span>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={() => (cartItem ? setIsCartOpen(true) : addToCart(false))}
              className={`relative flex-1 overflow-hidden border py-3.5 rounded-full text-sm font-medium transition-all duration-300 ${
                justAdded
                  ? "border-[#0f3d2e] bg-[#0f3d2e] text-white"
                  : "border-[#0f3d2e] text-[#0f3d2e] hover:bg-[#f0f7f3]"
              }`}
            >
              <span className={`flex items-center justify-center gap-1.5 transition-all duration-300 ${justAdded ? "-translate-y-8 opacity-0" : "translate-y-0 opacity-100"}`}>
                {cartItem ? "Go to cart" : "Add to cart"}
              </span>
              <span className={`absolute inset-0 flex items-center justify-center gap-1.5 transition-all duration-300 ${justAdded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Added
              </span>
            </button>
            <button
              onClick={() => addToCart(true)}
              className="flex-1 bg-[#0f3d2e] hover:bg-[#154d3b] active:scale-[0.98] text-white py-3.5 rounded-full text-sm font-medium transition-all duration-200"
            >
              Buy now
            </button>
          </div>

          {product.dimensions && (
            <div className="mt-2">
              <AccordionRow
                title="Dimensions"
                isOpen={openSection === "dimensions"}
                onToggle={() => toggleSection("dimensions")}
              >
                <dl className="space-y-2 text-sm">
                  {Object.entries(product.dimensions).map(([label, value]) => (
                    <div key={label} className="flex justify-between text-gray-500">
                      <dt>{label}</dt>
                      <dd className="text-gray-800 font-medium">{value}</dd>
                    </div>
                  ))}
                </dl>
              </AccordionRow>
            </div>
          )}

          {product.fabricDetails && (
            <AccordionRow
              title="Fabric details"
              isOpen={openSection === "fabric"}
              onToggle={() => toggleSection("fabric")}
            >
              <p className="text-sm text-gray-500 leading-relaxed">
                {product.fabricDetails}
              </p>
            </AccordionRow>
          )}

          {product.deliveryReturns && (
            <div className="border-b border-gray-100">
              <AccordionRow
                title="Delivery & returns"
                isOpen={openSection === "delivery"}
                onToggle={() => toggleSection("delivery")}
              >
                <p className="text-sm text-gray-500 leading-relaxed">
                  {product.deliveryReturns}
                </p>
              </AccordionRow>
            </div>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-16 pt-10 border-t border-gray-100">
          <div className="flex items-baseline justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">You may also like</h2>
            <button
              onClick={() => navigate("/products")}
              className="text-xs font-medium text-[#0f3d2e] hover:underline"
            >
              View all
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {related.map((item) => (
              <RelatedCard
                key={item._id || item.id}
                item={item}
                onClick={() => navigate(`/product/${item._id || item.id}`)}
              />
            ))}
          </div>
        </div>
      )}

      <style>{`
        @keyframes riseIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}