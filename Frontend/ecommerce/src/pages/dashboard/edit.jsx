import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation, Link } from "react-router";
import { getVendorProducts, updateVendorProduct } from "../../services/vendorDashboardservice";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    title: "",
    price: "",
    description: "",
  });

  // Images that already exist on the product (URLs from the server).
  // Shown as a preview grid — these stay as-is unless the vendor picks
  // new files below, matching the "replace whole gallery on new upload"
  // behavior decided on the backend.
  const [existingImages, setExistingImages] = useState([]);

  // Newly selected files (not yet uploaded) + their local preview URLs.
  const [newFiles, setNewFiles] = useState([]);
  const [newPreviews, setNewPreviews] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const productFromState = location.state?.product;

    if (productFromState) {
      fillForm(productFromState);
      setLoading(false);
      return;
    }

    // Fallback if the page was opened directly / refreshed (no state passed)
    const fetchProduct = async () => {
      try {
        const res = await getVendorProducts();
        const found = (res.data.data || []).find((p) => p.id === id);
        if (found) {
          fillForm(found);
        } else {
          setError("Product not found.");
        }
      } catch (err) {
        console.log(err.response?.data || err.message);
        setError("Unable to load product.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Clean up local object URLs when they're replaced or on unmount,
  // otherwise they leak memory.
  useEffect(() => {
    return () => newPreviews.forEach((url) => URL.revokeObjectURL(url));
  }, [newPreviews]);

  const fillForm = (product) => {
    setForm({
      title: product.title || "",
      price: product.price ?? "",
      description: product.description || "",
    });
    // imageUrl is the cover/first image; images is the full gallery array.
    // Combine + dedupe so the vendor sees everything currently on the product.
    const all = [product.imageUrl, ...(product.images || [])].filter(
      (img, idx, arr) => Boolean(img) && arr.indexOf(img) === idx
    );
    setExistingImages(all);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilesChange = (e) => {
    const files = Array.from(e.target.files || []).slice(0, 6);
    newPreviews.forEach((url) => URL.revokeObjectURL(url));
    setNewFiles(files);
    setNewPreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      // multipart/form-data is required here because the update route now
      // runs through upload.array("images", 6) on the backend — a plain
      // JSON body would never populate req.files.
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("price", form.price);
      formData.append("description", form.description);
      newFiles.forEach((file) => formData.append("images", file));

      await updateVendorProduct(id, formData);

      setSuccess(true);
      setTimeout(() => navigate("/vendordashboard"), 900);
    } catch (err) {
      console.log(err.response?.data || err.message);
      setError("Unable to update product.");
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F5F0] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 animate-[fadeIn_.3s_ease]">
          <div className="h-10 w-10 rounded-full border-4 border-[#123328]/20 border-t-[#123328] animate-spin" />
          <p className="text-gray-500">Loading product...</p>
        </div>
      </div>
    );
  }

  // Show new selections if the vendor picked files, otherwise show what's
  // already saved on the product.
  const previewImages = newPreviews.length > 0 ? newPreviews : existingImages;

  return (
    <div className="min-h-screen bg-[#F7F5F0] p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-[fadeIn_.3s_ease]">
          <div>
            <h1 className="text-3xl font-bold text-[#123328]">Edit Product</h1>
            <p className="text-gray-500">Update your product details.</p>
          </div>

          <Link
            to="/vendordashboard"
            className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
          >
            ← Back
          </Link>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 animate-[fadeIn_.2s_ease]">
            {error}
          </div>
        )}

        {/* Form card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow p-6 space-y-5 animate-[fadeIn_.35s_ease]"
        >
          {/* Image previews */}
          <div>
            <div className="flex flex-wrap justify-center gap-3">
              {previewImages.length > 0 ? (
                previewImages.map((src, i) => (
                  <div
                    key={i}
                    className="w-24 h-24 rounded-xl overflow-hidden bg-[#F7F5F0] border border-gray-200"
                  >
                    <img src={src} alt={`Preview ${i + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))
              ) : (
                <div className="w-24 h-24 rounded-xl bg-[#F7F5F0] border border-gray-200 flex items-center justify-center">
                  <span className="text-gray-400 text-sm">No image</span>
                </div>
              )}
            </div>
            {newPreviews.length > 0 && (
              <p className="text-xs text-gray-400 text-center mt-2">
                These new images will replace all existing product images when saved.
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none
                focus:border-[#123328] focus:ring-2 focus:ring-[#123328]/20 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price ($)
            </label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none
                focus:border-[#123328] focus:ring-2 focus:ring-[#123328]/20 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Images (up to 6)
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFilesChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none
                focus:border-[#123328] focus:ring-2 focus:ring-[#123328]/20 transition
                file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0
                file:bg-[#123328] file:text-white file:text-sm hover:file:bg-[#1B4332]"
            />
            <p className="text-xs text-gray-400 mt-1">
              Leave empty to keep the current images.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none
                focus:border-[#123328] focus:ring-2 focus:ring-[#123328]/20 transition resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate("/vendordashboard")}
              disabled={saving}
              className="px-5 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition disabled:opacity-60"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving || success}
              className="min-w-[140px] flex items-center justify-center gap-2 bg-[#123328] text-white px-5 py-2 rounded-lg
                hover:bg-[#1B4332] transition disabled:opacity-70"
            >
              {success ? (
                <span className="animate-[fadeIn_.2s_ease]">✓ Saved</span>
              ) : saving ? (
                <>
                  <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}