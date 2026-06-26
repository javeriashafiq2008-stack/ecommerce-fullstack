import { useState } from "react";


export default function Navbar({ cartItems, onCartClick }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  return (
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
          <div className="text-2xl font-semibold text-white tracking-wide cursor-pointer">
            Jaydor
          </div>

          {/* DESKTOP LINKS */}
          <div className="hidden md:flex items-center space-x-10 text-sm font-medium uppercase tracking-wider">
            <a href="#" className="relative text-white/90 hover:text-white transition after:absolute after:left-0 after:-bottom-1 after:h-px after:w-0 after:bg-white after:transition-all after:duration-300 hover:after:w-full">Home</a>
            <a href="#" className="relative text-white/90 hover:text-white transition after:absolute after:left-0 after:-bottom-1 after:h-px after:w-0 after:bg-white after:transition-all after:duration-300 hover:after:w-full">Contact</a>
          </div>

          {/* RIGHT ACTIONS */}
          <div className="flex items-center space-x-5 relative">

            {/* 🛍️ CART - Click event aur function handle lagaya bina style badle */}
            <div 
              onClick={onCartClick} 
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
                {cartItems?.length || 0}
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
                  <a
                    href="#"
                    className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-[#f0f7f3] hover:text-[#0f3d2e] hover:pl-5 transition-all duration-200"
                  >
                    Login
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-[#f0f7f3] hover:text-[#0f3d2e] hover:pl-5 transition-all duration-200 border-t border-gray-100"
                  >
                    Register
                  </a>
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
            <a href="#home" className="block text-white/90 hover:text-white transition">Home</a>
            <a href="#contact" className="block text-white/90 hover:text-white transition">Contact</a>

            <div className="border-t border-[#1a4d3c] pt-3 space-y-3">
              <a href="#login" className="block text-white/90 hover:text-white transition">Login</a>
              <a href="#register" className="block text-white/90 hover:text-white transition">Register</a>
            </div>
          </div>
        )}

      </div>
    </nav>
  );
}