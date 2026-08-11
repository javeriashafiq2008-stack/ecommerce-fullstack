import { useEffect, useMemo, useState } from "react";
import { Trash2, AlertCircle, ImageOff } from "lucide-react";
import api from "../../api/axios.js";
import DataTable from "../../components/admin/DataTable.jsx";
import ConfirmModal from "../../components/admin/ConfirmModel.jsx";
import SearchBar from "../../components/admin/SearchBar.jsx";

// NOTE: there is no admin "update product" endpoint in adminController —
// only getAllProducts and deleteProduct. Editing a product's own details
// happens through the vendor's own route (/api/vendor/update/:id), not
// here. So this page is intentionally list + delete only.
export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setActionError("");
        const response = await api.get("/api/admin/products", { signal: controller.signal });
        if (response.data?.success) {
          setProducts(response.data.products || []);
        } else {
          setActionError("Unable to load products.");
        }
      } catch (err) {
        if (err.name === "CanceledError" || err.name === "AbortError") return;
        console.log(err.response?.data || err.message);
        setActionError(err.response?.data?.message || "Something went wrong while loading products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    return () => controller.abort();
  }, []);

  // Client-side filter by product title or vendor name — getAllProducts
  // doesn't take a query param.
  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return products;
    const term = searchTerm.trim().toLowerCase();
    return products.filter(
      (p) => p.title?.toLowerCase().includes(term) || p.Vendor?.name?.toLowerCase().includes(term)
    );
  }, [products, searchTerm]);

  const formatDate = (value) => {
    if (!value) return "—";
    return new Date(value).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  };

  const formatCurrency = (value) => `$${Number(value ?? 0).toFixed(2)}`;

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setActionError("");
    try {
      const response = await api.delete(`/api/admin/products/${deleteTarget.id}`);
      if (response.data?.success) {
        setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
        setDeleteTarget(null);
      }
    } catch (err) {
      console.log(err.response?.data || err.message);
      setActionError(err.response?.data?.message || "Unable to delete product.");
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    {
      key: "imageUrl",
      label: "",
      render: (row) => (
        <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#f0f7f3] flex items-center justify-center flex-shrink-0">
          {row.imageUrl ? (
            <img src={row.imageUrl} alt={row.title} className="w-full h-full object-cover" />
          ) : (
            <ImageOff className="w-4 h-4 text-[#0f3d2e]/30" />
          )}
        </div>
      ),
    },
    {
      key: "title",
      label: "Product",
      render: (row) => (
        <span className="font-medium text-gray-800 line-clamp-2 max-w-[180px] inline-block">{row.title}</span>
      ),
      wrap: true,
    },
    {
      key: "vendor",
      label: "Vendor",
      render: (row) => (
        <div className="min-w-[140px]">
          <p className="text-gray-700">{row.Vendor?.name || "Not Provided"}</p>
          <p className="text-xs text-gray-400 truncate max-w-[200px]">{row.Vendor?.email || ""}</p>
        </div>
      ),
    },
    { key: "price", label: "Price", render: (row) => formatCurrency(row.price) },
    { key: "createdAt", label: "Listed", render: (row) => formatDate(row.createdAt) },
  ];

  return (
    <div className="min-h-screen bg-[#f5f0ea] py-6 sm:py-10 px-3 sm:px-6 lg:px-8 font-[Poppins]">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900">Manage Products</h1>
            <p className="text-sm text-gray-500 mt-1">Browse listed products and remove any that violate policy.</p>
          </div>
          <div className="w-full sm:w-auto">
            <SearchBar placeholder="Search by product or vendor..." onSearch={setSearchTerm} />
          </div>
        </div>

        {/* ACTION ERROR BANNER */}
        {actionError && (
          <div className="mb-5 flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {actionError}
          </div>
        )}

        {/* TABLE */}
        <DataTable
          columns={columns}
          data={filteredProducts}
          loading={loading}
          emptyMessage={searchTerm ? "No products match your search." : "No products found."}
          rowKey="id"
          actions={(row) => (
            <button
              onClick={() => setDeleteTarget(row)}
              title="Delete product"
              className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400
                hover:text-red-500 hover:bg-red-50 transition-all duration-200"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        />
      </div>

      {/* DELETE CONFIRMATION */}
      {deleteTarget && (
        <ConfirmModal
          title="Delete Product"
          message={`Are you sure you want to delete "${deleteTarget.title}"? This action cannot be undone.`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
        />
      )}
    </div>
  );
}