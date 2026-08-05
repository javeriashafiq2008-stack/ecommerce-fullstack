import { useEffect } from "react";
import { AlertTriangle, X, Loader2 } from "lucide-react";

// Generic confirm dialog — the parent decides WHEN it's shown (mount it
// conditionally, e.g. `{confirmOpen && <ConfirmModal ... />}`), so there's
// no separate "open" prop to manage here.
//
// Props: title, message, onConfirm, onCancel, loading
export default function ConfirmModal({ title, message, onConfirm, onCancel, loading = false }) {
  // Escape closes the modal, but not while a confirm action is in flight.
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape" && !loading) onCancel();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onCancel, loading]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 font-[Poppins]">
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes popIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
      `}</style>

      {/* Overlay — click closes, disabled while loading */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        style={{ animation: "fadeIn 0.2s ease-out" }}
        onClick={() => !loading && onCancel()}
      />

      <div
        className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6"
        style={{ animation: "popIn 0.2s ease-out" }}
      >
        <button
          onClick={() => !loading && onCancel()}
          aria-label="Close"
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition disabled:opacity-50"
          disabled={loading}
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-11 h-11 rounded-full bg-amber-50 flex items-center justify-center mb-4">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
        </div>

        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">{message}</p>

        <div className="flex items-center gap-3 mt-6">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-2.5 rounded-full border border-gray-200 text-sm font-medium text-gray-600
              hover:bg-gray-50 transition-all duration-200 disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2.5 rounded-full bg-[#0f3d2e] hover:bg-[#1a4d3c] text-white text-sm font-medium
              transition-all duration-200 disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? "Processing..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}