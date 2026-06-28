import { useState, useContext, useEffect } from "react";
import { Link } from "react-router";
import { ShopContext } from "./context/ShopContext";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  // Pulling cart-related state directly from global context
  // so Navbar no longer depends on props from Home.jsx
  const { cart, isCartOpen, setIsCartOpen, HandleAddToCart } = useContext(ShopContext);

  // Keeps the drawer mounted briefly during close so the slide-out
  // animation can finish before it's removed from the DOM
  const [shouldRenderCart, setShouldRenderCart] = useState(false);
  
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);

  useEffect(() => {
    let rafId;
    let timeoutId;
    if (isCartOpen) {
      setShouldRenderCart(true);
      rafId = requestAnimationFrame(() => {
        rafId = requestAnimationFrame(() => setIsDrawerVisible(true));
      });
    } else {
      setIsDrawerVisible(false);
      timeoutId = setTimeout(() => setShouldRenderCart(false), 300);
    }
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isCartOpen]);

  // Order total calculations
  const totalAmount = cart.reduce((total, item) => total + Number(item?.price || 0), 0);
  const shippingAndTax = cart.length > 0 ? 5.00 : 0;
  const grandTotal = totalAmount + shippingAndTax;

  // Aggregate duplicate line items into a single display with quantities
  const groupedCart = cart.reduce((acc, item) => {
    if (!item) return acc;
    const existing = acc.find((g) => g.name === item.name);
    if (existing) {
      existing.qty += 1;
    } else {
      acc.push({ ...item, qty: 1 });
    }
    return acc;
  }, []);

  return (
    <>
    <nav className="bg-[#0f3d2e] border-b border-[#1a4d3c] sticky top-0 z-50 font-[Poppins]">
      <style>{`
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex items-center justify-between h-16">

          {/* LOGO */}
          <Link to="/" className="text-2xl font-semibold text-white tracking-wide cursor-pointer">
            Jaydor
          </Link>

          {/* DESKTOP LINKS */}
          <div className="hidden md:flex items-center space-x-10 text-sm font-medium uppercase tracking-wider">
            <Link to="/" className="relative text-white/90 hover:text-white transition after:absolute after:left-0 after:-bottom-1 after:h-px after:w-0 after:bg-white after:transition-all after:duration-300 hover:after:w-full">Home</Link>
            <Link to="/contact" className="relative text-white/90 hover:text-white transition after:absolute after:left-0 after:-bottom-1 after:h-px after:w-0 after:bg-white after:transition-all after:duration-300 hover:after:w-full">Contact</Link>
          </div>

          {/* RIGHT ACTIONS */}
          <div className="flex items-center space-x-5 relative">

            {/* 🛍️ CART - now toggles using context state directly */}
            <div
              onClick={() => setIsCartOpen(!isCartOpen)}
              className="relative cursor-pointer group"
            >
              <svg
                className="w-5 h-5 text-white/90 group-hover:text-white transition-all duration-300 group-hover:scale-110 group-hover:-rotate-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 7h12l1 14H5L6 7z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 7V5a3 3 0 016 0v2"
                />
              </svg>

              <span className="absolute -top-2 -right-2 bg-white text-black text-xs rounded-full px-1.5 font-bold">
                {cart?.length || 0}
              </span>
            </div>

            {/* ACCOUNT DROPDOWN */}
            <div className="relative">
              <button
                onClick={() => setAuthOpen(!authOpen)}
                aria-label="Account"
                className="flex items-center text-white/90 hover:text-white transition-all duration-300 hover:scale-110"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 12a4 4 0 100-8 4 4 0 000 8z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 20c1.5-3.5 4.5-5 7.5-5s6 1.5 7.5 5"
                  />
                </svg>
              </button>

              {authOpen && (
                <div className="absolute right-0 mt-3 w-40 bg-white border border-gray-100 shadow-sm overflow-hidden animate-[fadeSlide_0.2s_ease-out]">
                  <Link
                    to="/login"
                    className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-[#f0f7f3] hover:text-[#0f3d2e] hover:pl-5 transition-all duration-200"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-[#f0f7f3] hover:text-[#0f3d2e] hover:pl-5 transition-all duration-200 border-t border-gray-100"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>

            {/* MOBILE TOGGLE */}
            <button
              className="md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              <svg
                className={`w-6 h-6 text-white transition-transform duration-300 ${mobileOpen ? "rotate-90" : ""}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

          </div>
        </div>

        {/* MOBILE MENU */}
        {mobileOpen && (
          <div className="md:hidden border-t border-[#1a4d3c] py-4 space-y-3 text-sm font-medium uppercase tracking-wider animate-[fadeSlide_0.25s_ease-out]">
            <Link to="/" className="block text-white/90 hover:text-white transition" onClick={() => setMobileOpen(false)}>Home</Link>
            <Link to="/contact" className="block text-white/90 hover:text-white transition" onClick={() => setMobileOpen(false)}>Contact</Link>

            <div className="border-t border-[#1a4d3c] pt-3 space-y-3">
              <Link to="/login" className="block text-white/90 hover:text-white transition" onClick={() => setMobileOpen(false)}>Login</Link>
              <Link to="/register" className="block text-white/90 hover:text-white transition" onClick={() => setMobileOpen(false)}>Register</Link>
            </div>
          </div>
        )}

      </div>
    </nav>

    {/* Sliding Sidebar Cart - now lives inside Navbar so it works dynamically anywhere Navbar is used */}
    {shouldRenderCart && (
      <div className="fixed inset-0 z-50 overflow-hidden font-[Poppins]">
        {/* Background Overlay */}
        <div
          className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${
            isDrawerVisible ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setIsCartOpen(false)}
        />

        {/* Drawer Slide Container */}
        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
          <div
            className={`pointer-events-auto w-screen max-w-md transform bg-[#f5f0ea] shadow-xl flex flex-col transition-transform duration-300 ease-in-out ${
              isDrawerVisible ? "translate-x-0" : "translate-x-full"
            }`}
          >
            {/* Cart Header */}
            <div className="flex items-center justify-between px-5 pt-5 pb-4">
              <button
                onClick={() => setIsCartOpen(false)}
                className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#0f3d2e] shadow-sm hover:bg-[#f0f7f3] transition"
                aria-label="Close cart"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <h2 className="text-lg font-semibold text-gray-900">Cart</h2>

              <button className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#0f3d2e] shadow-sm hover:bg-[#f0f7f3] transition" aria-label="More options">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <circle cx="5" cy="12" r="1.6" />
                  <circle cx="12" cy="12" r="1.6" />
                  <circle cx="19" cy="12" r="1.6" />
                </svg>
              </button>
            </div>

            {/* Product Line Items */}
            <div className="mx-4 mb-4 bg-white rounded-2xl shadow-sm flex-1 overflow-y-auto">
              {cart.length === 0 ? (
                <div className="text-center py-16 text-gray-400 text-sm">Your cart is empty</div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {groupedCart.map((item, index) => (
                    <div key={item.name ?? index} className="flex gap-4 p-4 items-start">
                      <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-xl bg-[#f0f7f3] flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2">{item.name}</h4>
                        <p className="text-xs text-[#1a4d3c] mt-0.5">Jaydor</p>
                        <p className="text-sm font-semibold text-gray-900 mt-1.5">${Number(item.price).toFixed(2)}</p>

                        {/* Quantity Adjustment */}
                        <div className="mt-2.5 inline-flex items-center bg-[#f5f0ea] rounded-full px-1 py-1">
                          <button className="w-6 h-6 rounded-full flex items-center justify-center text-gray-500 hover:bg-white transition" aria-label="Decrease quantity">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                              <path strokeLinecap="round" d="M5 12h14" />
                            </svg>
                          </button>
                          <span className="w-7 text-center text-sm font-medium text-gray-800">{item.qty}</span>
                          <button
                            onClick={() => HandleAddToCart({ name: item.name, price: item.price, image: item.image })}
                            className="w-6 h-6 rounded-full flex items-center justify-center bg-[#0f3d2e] text-white hover:bg-[#154d3b] transition"
                            aria-label="Increase quantity"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                              <path strokeLinecap="round" d="M12 5v14M5 12h14" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Checkout & Totals Breakdown */}
            {cart.length > 0 && (
              <div className="mx-4 mb-5 bg-white rounded-2xl shadow-sm p-5 space-y-3">
                <div className="flex justify-between text-sm text-gray-500">
                  <p>Sub total</p>
                  <p className="font-semibold text-gray-900">${totalAmount.toFixed(2)}</p>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <p>Shipping &amp; tax</p>
                  <p className="font-semibold text-gray-900">${shippingAndTax.toFixed(2)}</p>
                </div>

                <div className="border-t border-dashed border-gray-200 pt-3 flex justify-between items-center">
                  <p className="text-base font-semibold text-gray-900">Total</p>
                  <p className="text-base font-bold text-gray-900">${grandTotal.toFixed(2)}</p>
                </div>

                <button className="w-full bg-[#0f3d2e] hover:bg-[#154d3b] text-white py-3.5 rounded-full font-medium transition text-center text-sm cursor-pointer">
                  Checkout Now
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    )}
    </>
  );
}