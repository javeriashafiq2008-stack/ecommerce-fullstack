import { useState, useContext, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import { ShopContext } from "./context/ShopContext";
import { userLogout } from "../features/authentication/authenticationSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  Menu,
  X,
  Home,
  ShoppingBag,
  Info,
  Mail,
  ClipboardList,
  Heart,
  PlusSquare,
  LayoutDashboard,
  Package,
  Users,
  Settings,
  User,
  LogIn,
  UserPlus,
  LogOut,
} from "lucide-react";

// Small internal helper — NOT a separate file, just keeps the repeated
// sidebar link markup (icon + label + active state) DRY within this file.
function SidebarLink({ to, icon: Icon, label, onNavigate }) {
  return (
    <NavLink
      to={to}
      onClick={onNavigate}
      className={({ isActive }) =>
        `group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium
         transition-all duration-200 hover:translate-x-0.5
         ${isActive ? "bg-white/10 text-white" : "text-white/70 hover:text-white hover:bg-white/5"}`
      }
    >
      {({ isActive }) => (
        <>
          <span
            className={`absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full bg-white
              transition-transform duration-200 origin-center
              ${isActive ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0"}`}
          />
          <Icon className="w-[18px] h-[18px] flex-shrink-0" />
          <span className="truncate">{label}</span>
        </>
      )}
    </NavLink>
  );
}

export default function Navbar() {
  const [authOpen, setAuthOpen] = useState(false);

  // ── Sidebar state ────────────────────────────────────────────────────────
  // Same shouldRender / isVisible pattern already used below for the cart
  // drawer, so the slide-in/out animation feel is identical across both.
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [shouldRenderSidebar, setShouldRenderSidebar] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    HandleIncreaseQty,
    HandleDecreaseQty,
    HandleRemoveFromCart,
    requireAuthForCheckout,
  } = useContext(ShopContext);

  const [shouldRenderCart, setShouldRenderCart] = useState(false);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    setAuthOpen(false);
    setSidebarOpen(false);
    await dispatch(userLogout()).unwrap();
    navigate("/login");
  };

  const isAuthenticated = useSelector((state) => state.authentication.isAuthenticated);
  const { user } = useSelector((state) => state.authentication);
  const role = user?.role; // "buyer" | "vendor" | "admin" | undefined (guest)

  // ── Cart drawer animation — unchanged ──────────────────────────────────
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

  // ── Sidebar animation — same lifecycle, applied to the sidebar ─────────
  useEffect(() => {
    let rafId;
    let timeoutId;
    if (sidebarOpen) {
      setShouldRenderSidebar(true);
      rafId = requestAnimationFrame(() => {
        rafId = requestAnimationFrame(() => setIsSidebarVisible(true));
      });
    } else {
      setIsSidebarVisible(false);
      timeoutId = setTimeout(() => setShouldRenderSidebar(false), 300);
    }
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [sidebarOpen]);

  // Close sidebar on Escape.
  useEffect(() => {
    if (!sidebarOpen) return;
    const handleKey = (e) => {
      if (e.key === "Escape") setSidebarOpen(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [sidebarOpen]);

  // Lock body scroll while the sidebar is open.
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  const totalAmount = cart.reduce(
    (total, item) => total + Number(item?.price || 0) * Number(item?.qty || 1),
    0
  );
  const shippingAndTax = cart.length > 0 ? 5.0 : 0;
  const grandTotal = totalAmount + shippingAndTax;

  const closeSidebar = () => setSidebarOpen(false);

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

            {/* HAMBURGER + LOGO */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                aria-label="Open menu"
                className={`text-white/90 hover:text-white transition-all duration-300 hover:scale-110 p-1 -ml-1 ${
                  isAuthenticated ? "block" : "block md:hidden"
                }`}
              >
                <Menu className="w-6 h-6" />
              </button>

              <Link to="/" className="text-2xl font-semibold text-white tracking-wide cursor-pointer">
                Jaydor
              </Link>
            </div>

            {/* DESKTOP LINKS — deliberately minimal per spec */}
            <div className="hidden md:flex items-center space-x-10 text-sm font-medium uppercase tracking-wider">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `relative transition after:absolute after:left-0 after:-bottom-1 after:h-px after:bg-white after:transition-all after:duration-300
                   ${isActive ? "text-white after:w-full" : "text-white/90 hover:text-white after:w-0 hover:after:w-full"}`
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/products"
                className={({ isActive }) =>
                  `relative transition after:absolute after:left-0 after:-bottom-1 after:h-px after:bg-white after:transition-all after:duration-300
                   ${isActive ? "text-white after:w-full" : "text-white/90 hover:text-white after:w-0 hover:after:w-full"}`
                }
              >
                Products
              </NavLink>
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `relative transition after:absolute after:left-0 after:-bottom-1 after:h-px after:bg-white after:transition-all after:duration-300
                   ${isActive ? "text-white after:w-full" : "text-white/90 hover:text-white after:w-0 hover:after:w-full"}`
                }
              >
                About
              </NavLink>
              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  `relative transition after:absolute after:left-0 after:-bottom-1 after:h-px after:bg-white after:transition-all after:duration-300
                   ${isActive ? "text-white after:w-full" : "text-white/90 hover:text-white after:w-0 hover:after:w-full"}`
                }
              >
                Contact
              </NavLink>
            </div>

            {/* RIGHT ACTIONS — Cart + Account only */}
            <div className="flex items-center space-x-5 relative">

              {/* CART */}
              <div onClick={() => setIsCartOpen(!isCartOpen)} className="relative cursor-pointer group">
                <svg
                  className="w-5 h-5 text-white/90 group-hover:text-white transition-all duration-300 group-hover:scale-110 group-hover:-rotate-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 7h12l1 14H5L6 7z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 7V5a3 3 0 016 0v2" />
                </svg>
                <span className="absolute -top-2 -right-2 bg-white text-black text-xs rounded-full px-1.5 font-bold">
                  {cart.reduce((sum, item) => sum + Number(item?.qty || 1), 0) || 0}
                </span>
              </div>

              {/* ACCOUNT DROPDOWN */}
              <div className="relative">
                <button
                  onClick={() => setAuthOpen(!authOpen)}
                  aria-label="Account"
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-white/90
                    hover:text-white hover:bg-white/20 transition-all duration-300 hover:scale-105"
                >
                  <User className="w-4 h-4" />
                </button>

                {authOpen && (
                  <div className="absolute right-0 mt-3 w-44 bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden animate-[fadeSlide_0.2s_ease-out]">
                    {isAuthenticated ? (
                      <>
                        <Link
                          to="/profile"
                          onClick={() => setAuthOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-[#f0f7f3] hover:text-[#0f3d2e] transition-all duration-200"
                        >
                          <User className="w-4 h-4" /> Profile
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-[#f0f7f3] hover:text-[#0f3d2e] transition-all duration-200 border-t border-gray-100"
                        >
                          <LogOut className="w-4 h-4" /> Logout
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/login"
                          onClick={() => setAuthOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-[#f0f7f3] hover:text-[#0f3d2e] transition-all duration-200"
                        >
                          <LogIn className="w-4 h-4" /> Login
                        </Link>
                        <Link
                          to="/register"
                          onClick={() => setAuthOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-[#f0f7f3] hover:text-[#0f3d2e] transition-all duration-200 border-t border-gray-100"
                        >
                          <UserPlus className="w-4 h-4" /> Register
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Sliding Sidebar Cart — unchanged from before, still lives in Navbar
          so it works anywhere Navbar is rendered. */}
      {shouldRenderCart && (
        <div className="fixed inset-0 z-50 overflow-hidden font-[Poppins]">
          <div
            className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${
              isDrawerVisible ? "opacity-100" : "opacity-0"
            }`}
            onClick={() => setIsCartOpen(false)}
          />

          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full sm:pl-10 pl-0">
            <div
              className={`pointer-events-auto w-screen sm:max-w-md transform bg-[#f5f0ea] shadow-xl flex flex-col transition-transform duration-300 ease-in-out ${
                isDrawerVisible ? "translate-x-0" : "translate-x-full"
              }`}
            >
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

              <div className="mx-4 mb-4 bg-white rounded-2xl shadow-sm flex-1 overflow-y-auto">
                {cart.length === 0 ? (
                  <div className="text-center py-16 text-gray-400 text-sm">Your cart is empty</div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {cart.map((item, index) => (
                      <div key={item.id ?? item.name ?? index} className="relative flex gap-3 p-3 sm:p-4 items-start">
                        <button
                          onClick={() => HandleRemoveFromCart(item)}
                          aria-label="Remove item"
                          className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center text-gray-300 hover:text-[#0f3d2e] hover:bg-[#f0f7f3] transition"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>

                        <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-xl bg-[#f0f7f3] flex-shrink-0" />
                        <div className="flex-1 min-w-0 pr-4 sm:pr-6">
                          <h4 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2">{item.name}</h4>
                          <p className="text-xs text-[#1a4d3c] mt-0.5">Jaydor</p>
                          <p className="text-sm font-semibold text-gray-900 mt-1.5">${Number(item.price).toFixed(2)}</p>

                          <div className="mt-2.5 inline-flex items-center bg-[#f5f0ea] rounded-full px-1 py-1">
                            <button
                              onClick={() => HandleDecreaseQty(item)}
                              className="w-7 h-7 rounded-full flex items-center justify-center text-gray-500 hover:bg-white transition"
                              aria-label="Decrease quantity"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" d="M5 12h14" />
                              </svg>
                            </button>
                            <span className="w-7 text-center text-sm font-medium text-gray-800">{item.qty}</span>
                            <button
                              onClick={() => HandleIncreaseQty(item)}
                              className="w-7 h-7 rounded-full flex items-center justify-center bg-[#0f3d2e] text-white hover:bg-[#154d3b] transition"
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

                  <button
                    className="w-full bg-[#0f3d2e] hover:bg-[#154d3b] text-white py-3.5 rounded-full font-medium transition text-center text-sm cursor-pointer"
                    onClick={() => {
                      setIsCartOpen(false);
                      requireAuthForCheckout("/billing");
                    }}
                  >
                    Checkout Now
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Left Sidebar Navigation ──────────────────────────────────────
          Slides from the left, ~300px wide, dark green theme, closes on
          outside click (overlay) and Escape, active route highlighted,
          role-based sections rendered off Redux auth state.

          Each role block below has a `key` + fadeSlide animation so that
          when `role` changes (e.g. right after login populates the full
          user object), the newly-mounted section fades/slides in instead
          of just popping into place. The `key` is what forces React to
          treat a role switch as a fresh mount rather than reusing the
          same DOM node, which is what makes the animation replay. */}
      {shouldRenderSidebar && (
        <div className="fixed inset-0 z-50 overflow-hidden font-[Poppins]">
          <div
            className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${
              isSidebarVisible ? "opacity-100" : "opacity-0"
            }`}
            onClick={closeSidebar}
          />

          <div className="pointer-events-none fixed inset-y-0 left-0 flex max-w-full pr-10">
            <div
              className={`pointer-events-auto w-[300px] transform bg-[#0f3d2e] shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
                isSidebarVisible ? "translate-x-0" : "-translate-x-full"
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 h-16 border-b border-white/10 flex-shrink-0">
                <span className="text-white font-semibold text-xl tracking-wide">Jaydor</span>
                <button
                  onClick={closeSidebar}
                  aria-label="Close menu"
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Nav sections */}
              <div className="flex-1 overflow-y-auto px-3 py-5 space-y-6">

                {/* Mobile Main Navigation Links (Visible only on mobile/tablet) */}
                <div className="md:hidden space-y-1">
                  <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-white/35">Menu</p>
                  <SidebarLink to="/" icon={Home} label="Home" onNavigate={closeSidebar} />
                  <SidebarLink to="/products" icon={ShoppingBag} label="Products" onNavigate={closeSidebar} />
                  <SidebarLink to="/about" icon={Info} label="About" onNavigate={closeSidebar} />
                  <SidebarLink to="/contact" icon={Mail} label="Contact" onNavigate={closeSidebar} />
                </div>

                {/* BUYER — only for logged-in buyers */}
                {role === "buyer" && (
                  <div key="buyer-section" className="space-y-1 animate-[fadeSlide_0.25s_ease-out]">
                    <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-white/35">Buyer</p>
                    <SidebarLink to="/buyer/orders" icon={ClipboardList} label="Orders" onNavigate={closeSidebar} />
                  </div>
                )}

                {/* VENDOR — only if user.role === "vendor" */}
                {role === "vendor" && (
                  <div key="vendor-section" className="space-y-1 animate-[fadeSlide_0.25s_ease-out]">
                    <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-white/35">Vendor</p>
                    <SidebarLink to="/vendordashboard" icon={LayoutDashboard} label="Vendor Dashboard" onNavigate={closeSidebar} />
                  </div>
                )}

                {/* ADMIN — only if user.role === "admin" */}
                {role === "admin" && (
                  <div key="admin-section" className="space-y-1 animate-[fadeSlide_0.25s_ease-out]">
                    <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-white/35">Admin</p>
                    <SidebarLink to="/admin/dashboard" icon={LayoutDashboard} label="Admin Dashboard" onNavigate={closeSidebar} />
                    <SidebarLink to="/admin/users" icon={Users} label="Manage Users" onNavigate={closeSidebar} />
                    <SidebarLink to="/admin/products" icon={ShoppingBag} label="Manage Products" onNavigate={closeSidebar} />
                    <SidebarLink to="/admin/orders" icon={ClipboardList} label="Manage Orders" onNavigate={closeSidebar} />
                  </div>
                )}
              </div>

              {/* ACCOUNT — footer, always last */}
              <div className="border-t border-white/10 px-3 py-4 space-y-1 flex-shrink-0">
                <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-white/35">Account</p>
                {isAuthenticated ? (
                  <>
                    <SidebarLink to="/profile" icon={User} label="Profile" onNavigate={closeSidebar} />
                    <button
                      onClick={handleLogout}
                      className="group w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium
                        text-white/70 hover:text-white hover:bg-white/5 transition-all duration-200 hover:translate-x-0.5"
                    >
                      <LogOut className="w-[18px] h-[18px] flex-shrink-0" />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <SidebarLink to="/login" icon={LogIn} label="Login" onNavigate={closeSidebar} />
                    <SidebarLink to="/register" icon={UserPlus} label="Register" onNavigate={closeSidebar} />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}