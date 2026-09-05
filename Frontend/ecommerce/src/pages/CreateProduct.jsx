import { useState, useRef, useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createVendorProduct, clearVendorStatus } from "../features/vendorSlice.js";
import { ShopContext } from "../components/context/ShopContext.jsx";

// ── helpers ───────────────────────────────────────────────────────────────────
function Section({ title, children }) {
  return (
    <div className="bg-white border border-gray-100 p-6 space-y-5">
      <h2 className="text-xs font-bold uppercase tracking-widest text-[#0f3d2e]">{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, required, error, hint, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 flex items-center gap-1">
        {label}{required && <span className="text-[#0f3d2e]">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-[11px] text-gray-400">{hint}</p>}
      {error && (
        <p className="text-[11px] text-red-500 flex items-center gap-1 animate-[fadeIn_0.2s_ease-out]">
          <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}

const inputCls = (err) =>
  `w-full border rounded-lg px-4 py-2.5 text-sm text-gray-800 bg-white placeholder-gray-300
   transition-all duration-200 focus:outline-none focus:ring-2
   ${err ? "border-red-400 focus:ring-red-200" : "border-gray-200 focus:border-[#0f3d2e] focus:ring-[#0f3d2e]/15"}`;

const CATEGORIES = ["Tech", "Accessories", "Clothing", "Footwear", "Travel", "Home Decor", "Fitness", "Other"];

const EMPTY_FORM = { title: "", category: "", price: "", stock: "", sku: "", description: "", tags: "" };

// Image validation limits — used by handleImages below.
const MAX_IMAGES = 6;
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

// Validates a single field and returns an error string, or undefined if valid.
// Shared by both submit-time validation and per-keystroke validation, so the
// two never disagree with each other.
function validateField(key, value, imagesCount) {
  switch (key) {
    case "title":
      return value.trim() ? undefined : "Product name is required";
    case "category":
      return value ? undefined : "Pick a category";
    case "price":
      return value && !isNaN(value) && +value > 0 ? undefined : "Enter a valid price";
    case "stock":
      return value && !isNaN(value) && +value >= 0 ? undefined : "Enter available stock";
    case "description":
      return value.trim() ? undefined : "Add a product description";
    case "images":
      return imagesCount > 0 ? undefined : "Upload at least one image";
    default:
      return undefined;
  }
}

let imgIdCounter = 0;
const nextImgId = () => `img-${Date.now()}-${imgIdCounter++}`;

// ─────────────────────────────────────────────────────────────────────────────

export default function CreateProduct() {
  const dispatch = useDispatch();

  // Pull loading, error, success from Redux vendor state
  const { loading, error, success } = useSelector((state) => state.vendor);

  // NEW: ShopContext's addProduct — this is what makes the new product
  // show up on the storefront immediately instead of only after a reload.
  // CreateProduct writes through Redux (vendorSlice), which ShopContext
  // has no visibility into on its own, so this call is the missing link
  // between the two state trees.
  const { addProduct } = useContext(ShopContext);

  const [form,   setForm]   = useState(EMPTY_FORM);
  const [images, setImages] = useState([]); // [{ id, file, preview }]
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef();

  // ── Reset form when Redux reports success ──────────────────────────────────
  useEffect(() => {
    if (success) {
      images.forEach((img) => URL.revokeObjectURL(img.preview));
      setForm(EMPTY_FORM);
      setImages([]);
      setErrors({});
      // Clear the success flag after 3s so it doesn't block future submits
      const t = setTimeout(() => dispatch(clearVendorStatus()), 3000);
      return () => clearTimeout(t);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success, dispatch]);

  // ── Clear Redux error when user starts typing again ───────────────────────
  useEffect(() => {
    if (error) dispatch(clearVendorStatus());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  // Revoke every remaining preview URL on unmount, so navigating away
  // mid-form doesn't leak memory.
  useEffect(() => {
    return () => images.forEach((img) => URL.revokeObjectURL(img.preview));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Field handlers ─────────────────────────────────────────────────────────
  // Updates the field AND re-validates just that field, so a red border
  // clears the moment the value becomes valid — not just on next submit.
  const set = (key) => (e) => {
    const value = e.target.value;
    setForm((p) => ({ ...p, [key]: value }));
    setErrors((prev) => {
      const fieldError = validateField(key, value, images.length);
      if (!fieldError) {
        if (!(key in prev)) return prev;
        const next = { ...prev };
        delete next[key];
        return next;
      }
      // Still invalid — keep showing (possibly updated) message.
      return { ...prev, [key]: fieldError };
    });
  };

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Validate file size up front — oversized files are excluded from the
    // selection entirely rather than being staged for upload.
    const oversized = files.filter((f) => f.size > MAX_IMAGE_SIZE_BYTES);
    const validSizedFiles = files.filter((f) => f.size <= MAX_IMAGE_SIZE_BYTES);

    const newImgs = validSizedFiles.map((file) => ({
      id: nextImgId(),
      file,
      preview: URL.createObjectURL(file),
    }));

    setImages((prev) => {
      const combinedAll = [...prev, ...newImgs];
      const combined = combinedAll.slice(0, MAX_IMAGES);
      // Any preview beyond the 6-image cap was created but never kept —
      // revoke those right away instead of leaking them.
      const dropped = combinedAll.slice(MAX_IMAGES);
      dropped.forEach((img) => URL.revokeObjectURL(img.preview));

      const exceededMax = combinedAll.length > MAX_IMAGES;

      setErrors((prevErrors) => {
        const next = { ...prevErrors };

        if (oversized.length > 0) {
          next.images = "Each image must be 5 MB or smaller.";
        } else if (exceededMax) {
          next.images = "You can upload a maximum of 6 images.";
        } else if (combined.length > 0) {
          // Valid selection — clear any previous images error.
          delete next.images;
        }

        return next;
      });

      return combined;
    });

    // Reset the input's value so selecting the SAME file again (e.g. after
    // removing it) still fires onChange — browsers don't fire change events
    // when the file list is unchanged from last time.
    e.target.value = "";
  };

  const removeImage = (id) => {
    setImages((prev) => {
      const target = prev.find((img) => img.id === id);
      if (target) URL.revokeObjectURL(target.preview);
      const next = prev.filter((img) => img.id !== id);

      // Bring the "upload at least one image" error back immediately if
      // that was the last image, rather than waiting for next submit.
      if (next.length === 0) {
        setErrors((prevErrors) => ({ ...prevErrors, images: validateField("images", null, 0) }));
      }
      return next;
    });
  };

  // ── Client-side validation ─────────────────────────────────────────────────
  const validate = () => {
    const e = {};
    ["title", "category", "price", "stock", "description"].forEach((key) => {
      const err = validateField(key, form[key], images.length);
      if (err) e[key] = err;
    });
    const imgErr = validateField("images", null, images.length);
    if (imgErr) e.images = imgErr;
    return e;
  };

  // ── Submit — build FormData and dispatch ───────────────────────────────────
  const handleSubmit = (e) => {
    e.preventDefault();
    const clientErrors = validate();
    if (Object.keys(clientErrors).length) { setErrors(clientErrors); return; }
    setErrors({});

    // Build FormData — Multer on the backend picks this up directly
    const payload = new FormData();
    Object.entries(form).forEach(([k, v]) => payload.append(k, v));
    images.forEach(({ file }) => payload.append("images", file));

    // CHANGED: was a fire-and-forget dispatch with no way to react to the
    // result. .unwrap() lets us grab the created product straight from the
    // thunk's fulfilled payload and push it into ShopContext the instant
    // the request succeeds — this is the actual fix for "new products
    // don't appear until refresh". createVendorProduct's fulfilled payload
    // is assumed to be the created product object (matching what
    // createProduct's controller returns as `data`); adjust the
    // `.then(product => ...)` line below if your thunk normalizes it
    // differently (e.g. `payload.data` instead of `payload`).
    dispatch(createVendorProduct(payload))
      .unwrap()
      .then((createdProduct) => {
        addProduct(createdProduct);
      })
      .catch(() => {
        // Redux `error` state already surfaces this in the banner below —
        // nothing extra to do here.
      });
  };

  // ── Success screen ─────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="min-h-screen bg-[#f5f0ea] flex items-center justify-center font-[Poppins]">
        <div className="bg-white border border-gray-100 p-12 text-center max-w-sm mx-4">
          <div className="w-14 h-14 rounded-full bg-[#f0f7f3] flex items-center justify-center mx-auto mb-5">
            <svg className="w-7 h-7 text-[#0f3d2e]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Product Listed!</h2>
          <p className="text-sm text-gray-400 mt-2">Your product is now live on Jaydor.</p>
          <button
            onClick={() => dispatch(clearVendorStatus())}
            className="mt-6 w-full py-2.5 bg-[#0f3d2e] hover:bg-[#1a4d3c] text-white text-sm font-medium rounded-full transition"
          >
            Add Another Product
          </button>
        </div>
      </div>
    );
  }

  // ── Main form ──────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes popIn { from{opacity:0;transform:scale(0.9)} to{opacity:1;transform:scale(1)} }
        .fade-up { animation: fadeUp 0.35s ease-out both; }
        .thumb-pop { animation: popIn 0.25s ease-out both; }
      `}</style>

      <div className="min-h-screen bg-[#f5f0ea] font-[Poppins]">

        {/* Top bar */}
        <div className="bg-[#0f3d2e] sticky top-0 z-10 border-b border-[#1a4d3c]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-white font-semibold tracking-wide">Jaydor</span>
              <span className="text-white/30 text-xs">|</span>
              <span className="text-white/70 text-xs uppercase tracking-widest">Vendor Portal</span>
            </div>
            <span className="text-white/50 text-xs uppercase tracking-widest">Add Product</span>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
          <div className="mb-8 fade-up">
            <h1 className="text-2xl font-semibold text-gray-900">New Product</h1>
            <p className="text-sm text-gray-400 mt-1">Fill in the details below to list a product on Jaydor.</p>
          </div>

          {/* Redux server error banner */}
          {error && (
            <div className="mb-6 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm px-5 py-3 flex items-center gap-2 fade-up">
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-5h2v2h-2v-2zm0-6h2v4h-2V5z" clipRule="evenodd"/>
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="grid lg:grid-cols-3 gap-6">

              {/* LEFT — images + info */}
              <div className="lg:col-span-2 space-y-6">

                {/* IMAGES */}
                <div className="bg-white border border-gray-100 p-6 space-y-4 fade-up" style={{ animationDelay:"0.05s" }}>
                  <h2 className="text-xs font-bold uppercase tracking-widest text-[#0f3d2e]">Product Images</h2>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {images.map((img, idx) => (
                      <div key={img.id} className="relative aspect-square bg-[#f0f7f3] overflow-hidden group thumb-pop">
                        <img src={img.preview} alt="" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => removeImage(img.id)}
                          className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                        {idx === 0 && (
                          <span className="absolute bottom-1 left-1 bg-[#0f3d2e] text-white text-[9px] px-1.5 py-0.5 uppercase tracking-wider">Cover</span>
                        )}
                      </div>
                    ))}
                    {images.length < 6 && (
                      <button type="button" onClick={() => fileInputRef.current?.click()}
                        className={`aspect-square border-2 border-dashed flex flex-col items-center justify-center gap-1 transition
                          ${errors.images ? "border-red-300 bg-red-50" : "border-gray-200 hover:border-[#0f3d2e]/40 hover:bg-[#f0f7f3]"}`}>
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                        <span className="text-[10px] text-gray-400 uppercase tracking-wider">Add</span>
                      </button>
                    )}
                  </div>
                  <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImages} />
                  {errors.images && (
                    <p className="text-[11px] text-red-500 flex items-center gap-1 animate-[fadeIn_0.2s_ease-out]">
                      <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.images}
                    </p>
                  )}
                  <p className="text-[11px] text-gray-400">Up to 6 images, 5MB each. First is the cover shown in listings.</p>
                </div>

                {/* PRODUCT INFO */}
                <div className="bg-white border border-gray-100 p-6 space-y-5 fade-up" style={{ animationDelay:"0.10s" }}>
                  <h2 className="text-xs font-bold uppercase tracking-widest text-[#0f3d2e]">Product Info</h2>
                  <Field label="Product Name" required error={errors.title}>
                    <input type="text" value={form.title} onChange={set("title")} placeholder="e.g. Premium Wireless Headphones" className={inputCls(errors.title)} />
                  </Field>
                  <Field label="Description" required error={errors.description} hint="Describe materials, size, use-case, and standout features.">
                    <textarea value={form.description} onChange={set("description")} placeholder="Tell buyers what makes this product special..." rows={4} className={`${inputCls(errors.description)} resize-none`} />
                  </Field>
                  <Field label="Tags" hint="Comma-separated — helps buyers find your product.">
                    <input type="text" value={form.tags} onChange={set("tags")} placeholder="e.g. wireless, noise-cancelling, premium" className={inputCls(false)} />
                  </Field>
                </div>
              </div>

              {/* RIGHT — category, pricing, inventory, actions */}
              <div className="space-y-6">

                <div className="bg-white border border-gray-100 p-6 space-y-5 fade-up" style={{ animationDelay:"0.12s" }}>
                  <h2 className="text-xs font-bold uppercase tracking-widest text-[#0f3d2e]">Category</h2>
                  <Field label="Category" required error={errors.category}>
                    <select value={form.category} onChange={set("category")} className={`${inputCls(errors.category)} appearance-none cursor-pointer`}>
                      <option value="">Select category</option>
                      {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </Field>
                </div>

                <div className="bg-white border border-gray-100 p-6 space-y-5 fade-up" style={{ animationDelay:"0.15s" }}>
                  <h2 className="text-xs font-bold uppercase tracking-widest text-[#0f3d2e]">Pricing</h2>
                  <Field label="Price (USD)" required error={errors.price}>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                      <input type="number" min="0" step="0.01" value={form.price} onChange={set("price")} placeholder="0.00" className={`${inputCls(errors.price)} pl-8`} />
                    </div>
                  </Field>
                </div>

                <div className="bg-white border border-gray-100 p-6 space-y-5 fade-up" style={{ animationDelay:"0.18s" }}>
                  <h2 className="text-xs font-bold uppercase tracking-widest text-[#0f3d2e]">Inventory</h2>
                  <Field label="Stock Quantity" required error={errors.stock}>
                    <input type="number" min="0" value={form.stock} onChange={set("stock")} placeholder="0" className={inputCls(errors.stock)} />
                  </Field>
                  <Field label="SKU" hint="Your internal product code (optional).">
                    <input type="text" value={form.sku} onChange={set("sku")} placeholder="e.g. WH-2024-BLK" className={inputCls(false)} />
                  </Field>
                </div>

                {/* ACTIONS */}
                <div className="space-y-3 fade-up" style={{ animationDelay:"0.22s" }}>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full  bg-[#0f3d2e] hover:bg-red-700 active:scale-[0.98] text-white py-3.5 rounded-full text-sm font-semibold tracking-wide transition-all duration-200 shadow-md shadow-red-600/25 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
                          <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        Publishing...
                      </>
                    ) : "Publish Product"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      images.forEach((img) => URL.revokeObjectURL(img.preview));
                      setForm(EMPTY_FORM);
                      setImages([]);
                      setErrors({});
                      dispatch(clearVendorStatus());
                    }}
                    className="w-full border border-gray-200 text-gray-500 hover:border-[#0f3d2e]/30 hover:text-[#0f3d2e] py-3 rounded-full text-sm font-medium transition-all duration-200"
                  >
                    Clear Form
                  </button>
                </div>

              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}