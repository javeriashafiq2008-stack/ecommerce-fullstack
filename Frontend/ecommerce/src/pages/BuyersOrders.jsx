import { useEffect, useMemo, useState } from "react";
import { X, AlertCircle, PackageSearch, ImageOff } from "lucide-react";
import api from "../api/axios.js";
import DataTable from "../components/admin/DataTable.jsx";
import StatusBadge from "../components/admin/Statusbadge.jsx";


export default function BuyerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Selected order for the "View Order Details" overlay — null means closed.
  // Everything the overlay needs (line items, shipping address, payment
  // method, totals) is already present on this object, since getMyOrders
  // includes OrderItem + Product. No second fetch required.
  const [viewOrder, setViewOrder] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await api.get("/api/checkout/myorders", { signal: controller.signal });
        if (response.data?.success) {
          setOrders(response.data.orders || []);
        } else {
          setError("Unable to load your orders.");
        }
      } catch (err) {
        if (err.name === "CanceledError" || err.name === "AbortError") return;
        console.log(err.response?.data || err.message);
        setError(err.response?.data?.message || "Something went wrong while loading your orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
    return () => controller.abort();
  }, []);

  // Close the details overlay on Escape.
  useEffect(() => {
    if (!viewOrder) return;
    const handleKey = (e) => {
      if (e.key === "Escape") setViewOrder(null);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [viewOrder]);

  const formatDate = (value) => {
    if (!value) return "—";
    return new Date(value).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  };

  const formatCurrency = (value) =>
    `$${Number(value ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const columns = useMemo(
    () => [
      {
        key: "id",
        label: "Order ID",
        render: (row) => <span className="font-mono text-xs text-gray-500">#{row.id.slice(0, 8)}</span>,
      },
      { key: "createdAt", label: "Order Date", render: (row) => formatDate(row.createdAt) },
      { key: "totalAmount", label: "Total Amount", render: (row) => formatCurrency(row.totalAmount) },
      {
        key: "paymentStatus",
        label: "Payment Status",
        render: (row) => <StatusBadge type="paymentStatus" value={row.paymentStatus} />,
      },
      {
        key: "orderStatus",
        label: "Order Status",
        render: (row) => <StatusBadge type="orderStatus" value={row.orderStatus} />,
      },
    ],
    []
  );

  return (
    <div className="min-h-screen bg-[#f5f0ea] py-10 px-4 sm:px-6 lg:px-8 font-[Poppins]">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">My Orders</h1>
          <p className="text-sm text-gray-500 mt-1">Track your past orders and their current status.</p>
        </div>

        {/* ERROR BANNER */}
        {error && (
          <div className="mb-5 flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* TABLE */}
        <DataTable
          columns={columns}
          data={orders}
          loading={loading}
          emptyMessage="You haven't placed any orders yet."
          rowKey="id"
          actions={(row) => (
            <button
              onClick={() => setViewOrder(row)}
              className="px-3 py-1.5 rounded-full border border-[#0f3d2e]/20 text-xs font-medium text-[#0f3d2e]
                hover:bg-[#0f3d2e] hover:text-white transition-all duration-200"
            >
              View
            </button>
          )}
        />
      </div>

      {/* ORDER DETAILS OVERLAY */}
      {viewOrder && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 font-[Poppins]">
          <style>{`
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            @keyframes popIn { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }
          `}</style>

          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            style={{ animation: "fadeIn 0.2s ease-out" }}
            onClick={() => setViewOrder(null)}
          />

          <div
            className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[85vh] overflow-y-auto"
            style={{ animation: "popIn 0.2s ease-out" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100 sticky top-0 bg-white">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Order Details</h2>
                <p className="text-xs text-gray-400 font-mono mt-0.5">#{viewOrder.id}</p>
              </div>
              <button
                onClick={() => setViewOrder(null)}
                aria-label="Close"
                className="w-9 h-9 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-6">

              {/* Status badges */}
              <div className="flex items-center gap-2">
                <StatusBadge type="orderStatus" value={viewOrder.orderStatus} />
                <StatusBadge type="paymentStatus" value={viewOrder.paymentStatus} />
              </div>

              {/* Ordered products */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#0f3d2e] mb-3">
                  Ordered Products
                </h3>
                <div className="space-y-3">
                  {(viewOrder.OrderItems || []).map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#f0f7f3] flex items-center justify-center flex-shrink-0">
                        {item.Product?.imageUrl ? (
                          <img
                            src={item.Product.imageUrl}
                            alt={item.Product.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ImageOff className="w-5 h-5 text-[#0f3d2e]/30" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">
                          {item.Product?.title || "Product no longer available"}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Qty {item.quantity} × {formatCurrency(item.price)}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-gray-900">
                        {formatCurrency(Number(item.price) * Number(item.quantity))}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping address */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#0f3d2e] mb-2">
                  Shipping Address
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {viewOrder.shippingAddress?.address}
                  {viewOrder.shippingAddress?.city ? `, ${viewOrder.shippingAddress.city}` : ""}
                  {viewOrder.shippingAddress?.postalCode ? ` ${viewOrder.shippingAddress.postalCode}` : ""}
                </p>
              </div>

              {/* Payment method */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#0f3d2e] mb-2">
                  Payment Method
                </h3>
                <p className="text-sm text-gray-600">{viewOrder.paymentMethod || "Not Provided"}</p>
              </div>

              {/* Total */}
              <div className="border-t border-dashed border-gray-200 pt-4 flex justify-between items-center">
                <p className="text-sm font-semibold text-gray-900">Order Total</p>
                <p className="text-lg font-bold text-gray-900">{formatCurrency(viewOrder.totalAmount)}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}