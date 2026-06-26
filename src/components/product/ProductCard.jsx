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


  const navigate =useNavigate();
  return (
    <div
  onClick={() => navigate(`/product/${product.id}`)}
  className="bg-white border border-gray-100 hover:border-[#0f3d2e]/20 transition group max-w-[260px] cursor-pointer"
>

      {/* IMAGE */}
      <div className="relative aspect-square bg-[#f0f7f3] overflow-hidden flex items-center justify-center">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          />
        ) : (
          <svg
            className="w-16 h-16 text-[#0f3d2e]/30"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M14 8h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        )}

        {/* WISHLIST */}
        <button
        onClick={(e) => {
        e.stopPropagation();}}
          aria-label="Add to wishlist"
          className="absolute top-3 right-3 w-8 h-8 bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
        >
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
              d="M12 21s-7-4.35-9.5-8.5C.5 9 2 5.5 5.5 5c2-.3 3.5.7 4.5 2 1-1.3 2.5-2.3 4.5-2 3.5.5 5 4 3 7.5C19 16.65 12 21 12 21z"
            />
          </svg>
        </button>
      </div>

      {/* CONTENT */}
      <div className="p-4 space-y-1.5">

        {/* RATING */}
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg
              key={i}
              className={`w-3 h-3 ${i < rating ? "text-[#0f3d2e]" : "text-gray-200"}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 1.5l2.6 5.6 6 .8-4.4 4.2 1.1 6-5.3-3-5.3 3 1.1-6L1.4 7.9l6-.8L10 1.5z" />
            </svg>
          ))}
          <span className="text-[11px] text-gray-400 ml-1">({reviews})</span>
        </div>

        {/* NAME */}
        <h3 className="text-sm font-medium text-gray-800 leading-snug">
          {name}
        </h3>

        {/* PRICE + CART */}
        <div className="flex items-center justify-between pt-1">
          {/* Agar price string nahi hai toh format lag jaye ($) ka */}
          <span className="text-sm font-semibold text-[#0f3d2e]">
            {typeof price === 'number' ? `$${price}` : price}
          </span>

       
         <button
  onClick={(e) => {
    e.stopPropagation();
    onAddToCart({ name, price, image });
  }}
  aria-label="Add to cart"
  className="w-8 h-8 flex items-center justify-center border border-[#0f3d2e]/20 hover:bg-[#0f3d2e] hover:border-[#0f3d2e] text-[#0f3d2e] hover:text-white transition cursor-pointer"
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