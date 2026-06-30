import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router";
import { ShopContext } from "../components/context/ShopContext";
  
export default function ProductDetail() 




{
  const { id } = useParams();
  const { products,  HandleAddToCart } = useContext(ShopContext);
 const product = products.find((p) => p.id === Number(id));;

  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [openSection, setOpenSection] = useState("description");
  const [wishlisted, setWishlisted] = useState(false);

  // Reset local UI state whenever the viewed product changes
  
  useEffect(() => {
    setActiveImage(0);
    setQty(1);
    setWishlisted(product?.isFavorite ?? false);
  }, [id]);

  if (!product) {
    return (
      <div className="bg-white font-[Poppins] max-w-5xl mx-auto px-4 sm:px-6 py-20 text-center">
        <p className="text-sm text-gray-500">
          We couldn't find that product. It may have been removed.
        </p>
      </div>
    );
  }

  // Build the gallery from `image` plus any extra `images`, filtering out
  // missing entries (some of your mock items, like id 17, have no image yet).
  const gallery = [product.image, ...(product.images || [])].filter(Boolean);

  const toggleSection = (key) =>
    setOpenSection((prev) => (prev === key ? null : key));

  const hasMemberPrice = typeof product.memberPrice === "number";
  const memberSaving = hasMemberPrice
    ? Math.round(product.price - product.memberPrice)
    : null;

  return (
    <div className="bg-white font-[Poppins] max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="grid md:grid-cols-2 gap-10">

        {/* IMAGE GALLERY */}
        <div className="space-y-3">
          <div className="aspect-square bg-[#f0f7f3] overflow-hidden flex items-center justify-center">
            {gallery.length > 0 ? (
              <img
                src={gallery[activeImage]}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <svg
                className="w-20 h-20 text-[#0f3d2e]/30"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M14 8h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            )}
          </div>

          {gallery.length > 1 && (
            <div className="grid grid-cols-3 gap-3">
              {gallery.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`aspect-square bg-[#f0f7f3] overflow-hidden border transition ${
                    activeImage === i
                      ? "border-[#0f3d2e]"
                      : "border-transparent hover:border-[#0f3d2e]/30"
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.title} view ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* PRODUCT INFO */}
        <div className="flex flex-col">

          {product.category && (
            <p className="text-xs uppercase tracking-wider text-[#1a4d3c] font-medium">
              {product.category}
            </p>
          )}
          <h1 className="text-3xl font-semibold text-gray-900 mt-1">
            {product.title}
          </h1>

          {product.delivery && (
            <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
              <svg
                className="w-4 h-4 text-[#0f3d2e]"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 7h13l4 4v6h-2M3 7v10h2m11-10v10m-11 0a2 2 0 104 0m-4 0H8m9 0a2 2 0 104 0m-4 0h-3"
                />
              </svg>
              {product.delivery}
            </div>
          )}

          {/* DESCRIPTION (collapsible) */}
          <div className="mt-6 border-t border-gray-100">
            <button
              onClick={() => toggleSection("description")}
              className="w-full flex items-center justify-between py-4 text-left"
            >
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-800">
                Description
              </span>
              <svg
                className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${
                  openSection === "description" ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {openSection === "description" && (
              <p className="text-sm text-gray-500 leading-relaxed pb-4 animate-[fadeSlide_0.2s_ease-out]">
                {product.description || "No description available yet."}
              </p>
            )}
          </div>

          {/* PRICING */}
          <div className="border-t border-gray-100 py-5 flex items-center gap-10">
            <div>
              <p className="text-xs text-gray-400">
                {hasMemberPrice ? "Regular price" : "Price"}
              </p>
              <p className="text-xl font-semibold text-gray-900 mt-0.5">
                ${Number(product.price).toFixed(2)}
              </p>
            </div>
            {hasMemberPrice && (
              <div>
                <p className="text-xs text-gray-400">
                  Member (save ${memberSaving})
                </p>
                <p className="text-xl font-semibold text-[#0f3d2e] mt-0.5">
                  ${Number(product.memberPrice).toFixed(2)}
                </p>
              </div>
            )}
          </div>

          {/* QUANTITY + WISHLIST */}
          <div className="flex items-center gap-3 pb-5">
            <div className="inline-flex items-center bg-[#f5f0ea] rounded-full px-1 py-1">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
                className="w-8 h-8 rounded-full flex items-center justify-center text-gray-600 hover:bg-white transition"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" d="M5 12h14" />
                </svg>
              </button>
              <span className="w-8 text-center text-sm font-medium text-gray-800">
                {qty}
              </span>
              <button
                onClick={() => setQty((q) => q + 1)}
                aria-label="Increase quantity"
                className="w-8 h-8 rounded-full flex items-center justify-center bg-[#0f3d2e] text-white hover:bg-[#154d3b] transition"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" d="M12 5v14M5 12h14" />
                </svg>
              </button>
            </div>

            <button
              onClick={() => setWishlisted((w) => !w)}
              aria-label="Add to wishlist"
              className="w-11 h-11 rounded-full border border-gray-200 flex items-center justify-center hover:border-[#0f3d2e]/40 transition flex-shrink-0"
            >
              <svg
                className={`w-4.5 h-4.5 transition-colors ${
                  wishlisted ? "text-[#0f3d2e]" : "text-gray-400"
                }`}
                fill={wishlisted ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 21s-7-4.35-9.5-8.5C.5 9 2 5.5 5.5 5c2-.3 3.5.7 4.5 2 1-1.3 2.5-2.3 4.5-2 3.5.5 5 4 3 7.5C19 16.65 12 21 12 21z"
                />
              </svg>
            </button>
          </div>

          {/* ACTIONS — both feed straight into your existing HandleAddToCart */}
          <div className="flex items-center gap-3">
            <button
              onClick={() =>
                HandleAddToCart({
                  id: product.id,
                  name: product.title,
                  price: product.price,
                  image: product.image,
                  qty,
                })
              }
              className="flex-1 border border-[#0f3d2e] text-[#0f3d2e] py-3.5 rounded-full text-sm font-medium hover:bg-[#f0f7f3] transition"
            >
              Add to cart
            </button>
            <button
              onClick={() => {
                HandleAddToCart({
                  id: product.id,
                  name: product.title,
                  price: product.price,
                  image: product.image,
                  qty,
                });
                // Hook your checkout/navigation logic here later
                // e.g. navigate("/checkout")
              }}
              className="flex-1 bg-[#0f3d2e] hover:bg-[#154d3b] text-white py-3.5 rounded-full text-sm font-medium transition"
            >
              Buy now
            </button>
          </div>

          {/* DIMENSIONS (collapsible, only shown if data exists) */}
          {product.dimensions && (
            <div className="mt-6 border-t border-gray-100">
              <button
                onClick={() => toggleSection("dimensions")}
                className="w-full flex items-center justify-between py-4 text-left"
              >
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-800">
                  Dimensions
                </span>
                <svg
                  className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${
                    openSection === "dimensions" ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openSection === "dimensions" && (
                <dl className="pb-4 space-y-2 text-sm animate-[fadeSlide_0.2s_ease-out]">
                  {Object.entries(product.dimensions).map(([label, value]) => (
                    <div key={label} className="flex justify-between text-gray-500">
                      <dt>{label}</dt>
                      <dd className="text-gray-800 font-medium">{value}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>
          )}

          {/* FABRIC DETAILS (collapsible, only shown if data exists) */}
          {product.fabricDetails && (
            <div className={`${product.dimensions ? "" : "mt-6"} border-t border-gray-100`}>
              <button
                onClick={() => toggleSection("fabric")}
                className="w-full flex items-center justify-between py-4 text-left"
              >
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-800">
                  Fabric details
                </span>
                <svg
                  className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${
                    openSection === "fabric" ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openSection === "fabric" && (
                <p className="text-sm text-gray-500 leading-relaxed pb-4 animate-[fadeSlide_0.2s_ease-out]">
                  {product.fabricDetails}
                </p>
              )}
            </div>
          )}

          {/* DELIVERY & RETURNS (collapsible, only shown if data exists) */}
          {product.deliveryReturns && (
            <div
              className={`${
                product.dimensions || product.fabricDetails ? "" : "mt-6"
              } border-t border-b border-gray-100`}
            >
              <button
                onClick={() => toggleSection("delivery")}
                className="w-full flex items-center justify-between py-4 text-left"
              >
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-800">
                  Delivery &amp; returns
                </span>
                <svg
                  className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${
                    openSection === "delivery" ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openSection === "delivery" && (
                <p className="text-sm text-gray-500 leading-relaxed pb-4 animate-[fadeSlide_0.2s_ease-out]">
                  {product.deliveryReturns}
                </p>
              )}
            </div>
          )}

        </div>
      </div>

      <style>{`
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}