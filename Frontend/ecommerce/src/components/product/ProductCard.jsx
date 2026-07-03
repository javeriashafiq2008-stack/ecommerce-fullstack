import { useState } from "react";
import { useNavigate } from "react-router";

export default function ProductCard({
  product,
  onAddToCart,
  image,
  name = "Conbox Electric Fan",
  price = 48.00,
  rating = 4,
  reviews = 18,
}) {
  const navigate = useNavigate();
  const [wishlisted, setWishlisted] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    onAddToCart({ name, price, image });
    // Brief "added" confirmation before the cart icon returns
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <div
      onClick={() => navigate(`/product/${product.id}`)}
      className="group relative bg-white rounded-2xl border border-gray-100 overflow-hidden max-w-[260px] cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#0f3d2e]/10 hover:border-[#0f3d2e]/15"
    >
      {/* IMAGE */}
      <div className="relative aspect-square bg-[#f0f7f3] overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg
              className="w-16 h-16 text-[#0f3d2e]/30"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M14 8h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {/* Subtle gradient for depth on hover, sits under the wishlist button */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* WISHLIST */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setWishlisted((w) => !w);
          }}
          aria-label="Add to wishlist"
          className={`absolute top-3 right-3 w-8 h-8 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-sm transition-all duration-300 hover:scale-110 ${
            wishlisted ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
        >
          <svg
            className={`w-4 h-4 transition-all duration-300 ${
              wishlisted ? "text-[#0f3d2e] scale-110" : "text-[#0f3d2e]"
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

        {/* Quick-add overlay button — slides up from the bottom edge on hover */}
        <button
          onClick={handleAddToCart}
          aria-label="Add to cart"
          className="absolute left-3 right-3 bottom-3 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out bg-[#0f3d2e] hover:bg-[#154d3b] text-white text-xs font-semibold py-2.5 rounded-full flex items-center justify-center gap-1.5"
        >
          {justAdded ? (
            <>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Added
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 7h12l1 14H5L6 7z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 7V5a3 3 0 016 0v2" />
              </svg>
              Add to cart
            </>
          )}
        </button>
      </div>

      {/* CONTENT */}
      <div className="p-4 space-y-1.5">

        {/* RATING */}
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg
              key={i}
              className={`w-3 h-3 transition-colors duration-200 ${
                i < rating ? "text-[#0f3d2e]" : "text-gray-200"
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 1.5l2.6 5.6 6 .8-4.4 4.2 1.1 6-5.3-3-5.3 3 1.1-6L1.4 7.9l6-.8L10 1.5z" />
            </svg>
          ))}
          <span className="text-[11px] text-gray-400 ml-1">({reviews})</span>
        </div>

        {/* NAME */}
        <h3 className="text-sm font-medium text-gray-800 leading-snug line-clamp-2">
          {name}
        </h3>

        {/* PRICE + CART (small icon button stays for non-hover / touch devices) */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-sm font-semibold text-[#0f3d2e]">
            {typeof price === "number" ? `$${price.toFixed(2)}` : price}
          </span>

          <button
            onClick={handleAddToCart}
            aria-label="Add to cart"
            className="w-8 h-8 rounded-full flex items-center justify-center border border-[#0f3d2e]/20 hover:bg-[#0f3d2e] hover:border-[#0f3d2e] text-[#0f3d2e] hover:text-white transition-all duration-300 hover:scale-110 cursor-pointer sm:hidden"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 7h12l1 14H5L6 7z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 7V5a3 3 0 016 0v2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}