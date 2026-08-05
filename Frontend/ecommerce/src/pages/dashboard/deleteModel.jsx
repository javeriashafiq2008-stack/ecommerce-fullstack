import { useEffect } from "react";

export default function DeleteModal({ product, isDeleting, onCancel, onConfirm }) {
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape" && !isDeleting) onCancel();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isDeleting, onCancel]);

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-[400px] shadow-2xl animate-[fadeIn_.2s_ease]">
        <h2 className="text-xl font-bold text-gray-800">Delete Product?</h2>

        <p className="text-gray-500 mt-3">
          Are you sure you want to delete
          <span className="font-semibold text-[#123328]"> {product?.title}</span>
          ? This action cannot be undone.
        </p>

        <div className="flex justify-end gap-3 mt-8">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="px-5 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition disabled:opacity-60"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition disabled:opacity-60"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}