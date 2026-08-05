import { useContext } from "react";
import { useNavigate } from "react-router";
import { ShopContext } from "./context/ShopContext";

export default function AuthGateModal() {
  const { authModalOpen, setAuthModalOpen } = useContext(ShopContext);
  const navigate = useNavigate();

  if (!authModalOpen) return null;

  const close = () => setAuthModalOpen(false);

  const goTo = (path) => {
    close();
    navigate(path);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 font-[Poppins]">
      <style>{`
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        onClick={close}
      />

      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 animate-[fadeSlide_0.25s_ease-out]">
        <button
          onClick={close}
          aria-label="Close"
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-[#0f3d2e] hover:bg-[#f0f7f3] transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="w-12 h-12 rounded-full bg-[#f0f7f3] flex items-center justify-center mb-4">
          <svg className="w-5 h-5 text-[#0f3d2e]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14c-4 0-7 2-7 5v1h14v-1c0-3-3-5-7-5z" />
          </svg>
        </div>

        <h2 className="text-lg font-semibold text-gray-900">Log in to continue</h2>
        <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">
          You'll need an account to check out. Log in or create one — your cart will be right here.
        </p>

        <div className="mt-6 space-y-2.5">
          <button
            onClick={() => goTo("/login")}
            className="w-full bg-[#0f3d2e] hover:bg-[#154d3b] text-white py-3 rounded-full text-sm font-medium transition"
          >
            Login
          </button>
          <button
            onClick={() => goTo("/register")}
            className="w-full border border-[#0f3d2e] text-[#0f3d2e] hover:bg-[#f0f7f3] py-3 rounded-full text-sm font-medium transition"
          >
            Register
          </button>
          <button
            onClick={close}
            className="w-full text-gray-400 hover:text-gray-600 py-2 text-sm font-medium transition"
          >
            Continue shopping
          </button>
        </div>
      </div>
    </div>
  );
}