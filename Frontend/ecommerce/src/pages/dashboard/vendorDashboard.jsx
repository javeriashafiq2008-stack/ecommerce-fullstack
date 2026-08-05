import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { getVendorProducts, deleteVendorProduct } from "../../services/vendorDashboardservice";
import DeleteModal from "../dashboard/deleteModel";

const IMAGE_FALLBACK =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" fill="#F7F5F0"/><path d="M20 40l8-10 6 7 6-9 10 12" stroke="#123328" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/><circle cx="24" cy="20" r="4" fill="#123328"/></svg>`
  );

export default function VendorDashboard() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await getVendorProducts();
      setProducts(res.data.data || []);
    } catch (err) {
      console.log(err.response?.data || err.message);
      setError("Unable to load products.");
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (product) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    if (isDeleting) return;
    setShowDeleteModal(false);
    setSelectedProduct(null);
  };

  const handleDelete = async () => {
    if (!selectedProduct) return;

    setIsDeleting(true);
    try {
      await deleteVendorProduct(selectedProduct.id);
      setProducts((prev) => prev.filter((p) => p.id !== selectedProduct.id));
      setMessage("Product deleted successfully.");
      setShowDeleteModal(false);
      setSelectedProduct(null);
    } catch (err) {
      console.log(err.response?.data || err.message);
      setError("Unable to delete product.");
    } finally {
      setIsDeleting(false);
      setTimeout(() => {
        setMessage("");
        setError("");
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F5F0] p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#123328]">Vendor Dashboard</h1>
            <p className="text-gray-500">Manage your products from here.</p>
          </div>

          <Link
            to="/create"
            className="group flex items-center gap-2 bg-[#123328] text-white px-5 py-2.5 rounded-lg
              shadow-sm hover:shadow-md hover:bg-[#1B4332] hover:-translate-y-0.5 active:translate-y-0
              active:scale-95 transition-all duration-200 self-start"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              className="w-4 h-4 transition-transform duration-200 group-hover:rotate-90"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
            </svg>
            Add Product
          </Link>
        </div>

        {/* Feedback messages */}
        {message && (
          <div className="mb-6 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 animate-[fadeIn_.3s_ease]">
            {message}
          </div>
        )}
        {error && (
          <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 animate-[fadeIn_.3s_ease]">
            {error}
          </div>
        )}

        {/* Stat cards */}
        <div className="grid sm:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6 flex items-center gap-4
            transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <div className="w-11 h-11 rounded-lg bg-[#123328]/10 flex items-center justify-center text-[#123328] shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Products</p>
              <h2 className="text-2xl font-bold text-[#123328]">{products.length}</h2>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6 flex items-center gap-4
            transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <div className="w-11 h-11 rounded-lg bg-[#123328]/10 flex items-center justify-center text-[#123328] shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m-10 4a1 1 0 102 0 1 1 0 00-2 0zm10 0a1 1 0 102 0 1 1 0 00-2 0z" />
              </svg>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Orders</p>
              <h2 className="text-xl font-bold text-[#123328]">Coming Soon</h2>
            </div>
          </div>
        </div>

        {/* Products */}
        <h2 className="text-xl font-semibold text-[#123328] mb-5">My Products</h2>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow p-4 animate-pulse">
                <div className="w-full h-32 bg-gray-200 rounded-lg mb-4" />
                <div className="h-3 w-2/3 bg-gray-200 rounded mb-4" />
                <div className="flex gap-2">
                  <div className="h-8 flex-1 bg-gray-200 rounded-lg" />
                  <div className="h-8 flex-1 bg-gray-200 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-12 text-center animate-[fadeIn_.4s_ease]">
            <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-[#F7F5F0] flex items-center justify-center text-2xl">
              📦
            </div>
            <p className="text-gray-500 mb-5">No products found.</p>
            <Link
              to="/create"
              className="inline-block bg-[#123328] text-white px-5 py-2 rounded-lg font-medium
                hover:bg-[#1B4332] hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
            >
              + Add Product
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden
                  transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <div className="relative h-32 bg-[#F7F5F0] overflow-hidden">
                  <img
                    src={product.imageUrl || IMAGE_FALLBACK}
                    alt={product.title}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = IMAGE_FALLBACK;
                    }}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute top-2 right-2 bg-white/95 text-[#123328] text-xs font-bold px-2.5 py-1 rounded-full shadow">
                    ${Number(product.price).toFixed(2)}
                  </span>
                </div>

                <div className="p-3">
                  <h3 className="font-medium text-sm text-gray-800 truncate mb-2.5">
                    {product.title}
                  </h3>

                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        navigate(`/edit/${product.id}`, { state: { product } })
                      }
                      className="flex-1 flex items-center justify-center gap-1 bg-[#123328] hover:bg-[#1B4332]
                        text-white text-xs font-medium px-2 py-1.5 rounded-lg
                        active:scale-95 transition-all duration-200"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </button>

                    <button
                      onClick={() => openDeleteModal(product)}
                      className="flex-1 flex items-center justify-center gap-1 bg-red-50 hover:bg-red-100
                        text-red-600 text-xs font-medium px-2 py-1.5 rounded-lg
                        active:scale-95 transition-all duration-200"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 7h12M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m-7 0h10l-.867 12.142A2 2 0 0115.138 21H8.862a2 2 0 01-1.995-1.858L6 7z" />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showDeleteModal && (
        <DeleteModal
          product={selectedProduct}
          isDeleting={isDeleting}
          onCancel={closeDeleteModal}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}