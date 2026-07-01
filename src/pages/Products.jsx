import React, { useContext, useState, useEffect, useRef } from 'react';
import ProductCard from '../components/product/ProductCard';
import { ShopContext } from '../components/context/ShopContext';

// Animates each card in with a staggered fade+slide when it enters the viewport
function AnimatedCard({ children, index }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Stagger delay based on card position in the row (index % 6)
          setTimeout(() => setVisible(true), (index % 6) * 60);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [index]);

  return (
    <div
      ref={ref}
      className={`transition-all duration-500 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      {children}
    </div>
  );
}

const SORT_OPTIONS = [
  { label: "Featured", value: "featured" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Name A–Z", value: "name_asc" },
];

function Products() {
  const { products, HandleAddToCart } = useContext(ShopContext);

  const [sort, setSort] = useState("featured");
  const [search, setSearch] = useState("");
  const [sortOpen, setSortOpen] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(false);

  // Entrance animation for the header on mount
  useEffect(() => {
    const t = setTimeout(() => setHeaderVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  // Filter + sort
  const filtered = products
    .filter((p) =>
      p.title.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sort === "price_asc") return a.price - b.price;
      if (sort === "price_desc") return b.price - a.price;
      if (sort === "name_asc") return a.title.localeCompare(b.title);
      return 0; // featured — keep original order
    });

  const currentSortLabel = SORT_OPTIONS.find((o) => o.value === sort)?.label;

  return (
    <div className="min-h-screen bg-[#f5f0ea] font-[Poppins]">

     

      {/* ── TOOLBAR: SEARCH + SORT ── */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-3">

          {/* Search */}
          <div className="relative flex-1 max-w-xs">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search products…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-[#f5f0ea] border border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-[#0f3d2e]/30 focus:border-[#0f3d2e] transition placeholder:text-gray-400 text-gray-800"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Result count */}
          <p className="text-xs text-gray-400 hidden sm:block">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </p>

          {/* Sort dropdown */}
          <div className="relative ml-auto">
            <button
              onClick={() => setSortOpen((o) => !o)}
              className="flex items-center gap-2 text-sm text-gray-700 font-medium bg-[#f5f0ea] border border-transparent hover:border-[#0f3d2e]/20 px-4 py-2 rounded-full transition"
            >
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M6 12h12M9 17h6" />
              </svg>
              <span className="hidden sm:inline">{currentSortLabel}</span>
              <svg
                className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${sortOpen ? "rotate-180" : ""}`}
                fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {sortOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl border border-gray-100 shadow-lg overflow-hidden z-40 animate-[fadeSlide_0.18s_ease-out]">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => { setSort(opt.value); setSortOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                      sort === opt.value
                        ? "bg-[#0f3d2e] text-white font-medium"
                        : "text-gray-700 hover:bg-[#f5f0ea]"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── GRID ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-4xl mb-4">🔍</p>
            <p className="text-gray-500 text-sm">No products match "{search}"</p>
            <button
              onClick={() => setSearch("")}
              className="mt-4 text-sm text-[#0f3d2e] font-semibold hover:underline"
            >
              Clear search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filtered.map((item, index) => (
              <AnimatedCard key={item.id} index={index}>
                <ProductCard
                  product={item}
                  image={item.image}
                  name={item.title}
                  price={item.price}
                  rating={4}
                  reviews={18}
                  onAddToCart={HandleAddToCart}
                />
              </AnimatedCard>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default Products;