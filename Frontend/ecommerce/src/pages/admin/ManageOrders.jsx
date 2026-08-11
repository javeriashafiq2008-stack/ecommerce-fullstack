import { useEffect, useMemo, useState } from "react";
import { AlertCircle } from "lucide-react";
import api from "../../api/axios.js";
import DataTable from "../../components/admin/DataTable.jsx";
import StatusBadge from "../../components/admin/StatusBadge.jsx";
import ConfirmModal from "../../components/admin/ConfirmModel.jsx";
import SearchBar from "../../components/admin/SearchBar.jsx";

// Must match the ENUM on the Order model / the `allowed` list in
// updateOrderStatus on the backend.
const ORDER_STATUS_OPTIONS = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Unlike the role dropdown in Manage Users, order status changes go
  // through ConfirmModal first — the select just stages the intended
  // change; nothing is sent to the API until the admin confirms.
  const [pendingChange, setPendingChange] = useState(null); // { order, newStatus }
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const fetchOrders = async () => {
      try {
        setLoading(true);
        setActionError("");
        const response = await api.get("/api/admin/orders", { signal: controller.signal });
        if (response.data?.success) {
          setOrders(response.data.orders || []);
        } else {
          setActionError("Unable to load orders.");
        }
      } catch (err) {
        if (err.name === "CanceledError" || err.name === "AbortError") return;
        console.log(err.response?.data || err.message);
        setActionError(err.response?.data?.message || "Something went wrong while loading orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
    return () => controller.abort();
  }, []);

  // Client-side filter by customer name/email or order id — getAllOrders
  // doesn't take a query param.
  const filteredOrders = useMemo(() => {
    if (!searchTerm.trim()) return orders;
    const term = searchTerm.trim().toLowerCase();
    return orders.filter(
      (o) =>
        o.id?.toLowerCase().includes(term) ||
        o.User?.name?.toLowerCase().includes(term) ||
        o.User?.email?.toLowerCase().includes(term)
    );
  }, [orders, searchTerm]);

  const formatDate = (value) => {
    if (!value) return "—";
    return new Date(value).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  };

  const formatCurrency = (value) =>
    `$${Number(value ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  // Select changed — stage it and open the confirm modal. The select stays
  // bound to the order's actual current status, so if the admin cancels,
  // it visually reverts on its own (nothing in state changed yet).
  const handleStatusSelect = (order, newStatus) => {
    if (newStatus === order.orderStatus) return;
    setPendingChange({ order, newStatus });
  };

  const handleConfirmStatusChange = async () => {
    if (!pendingChange) return;
    const { order, newStatus } = pendingChange;
    setUpdating(true);
    setActionError("");
    try {
      const response = await api.put(`/api/admin/orders/${order.id}/status`, {
        orderStatus: newStatus,
      });
      if (response.data?.success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === order.id ? { ...o, orderStatus: response.data.order.orderStatus } : o))
        );
        setPendingChange(null);
      }
    } catch (err) {
      console.log(err.response?.data || err.message);
      setActionError(err.response?.data?.message || "Unable to update order status.");
      setPendingChange(null);
    } finally {
      setUpdating(false);
    }
  };

  const columns = [
    {
      key: "id",
      label: "Order ID",
      render: (row) => <span className="font-mono text-xs text-gray-500">#{row.id.slice(0, 8)}</span>,
    },
    {
      key: "customer",
      label: "Customer",
      render: (row) => (
        <div className="min-w-[140px]">
          <p className="font-medium text-gray-800">{row.User?.name || "Not Provided"}</p>
          <p className="text-xs text-gray-400 truncate max-w-[200px]">{row.User?.email || ""}</p>
        </div>
      ),
    },
    { key: "totalAmount", label: "Total", render: (row) => formatCurrency(row.totalAmount) },
    {
      key: "paymentStatus",
      label: "Payment",
      render: (row) => <StatusBadge type="paymentStatus" value={row.paymentStatus} />,
    },
    {
      key: "orderStatus",
      label: "Status",
      render: (row) => <StatusBadge type="orderStatus" value={row.orderStatus} />,
    },
    { key: "createdAt", label: "Date", render: (row) => formatDate(row.createdAt) },
  ];

  return (
    <div className="min-h-screen bg-[#f5f0ea] py-6 sm:py-10 px-3 sm:px-6 lg:px-8 font-[Poppins]">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900">Manage Orders</h1>
            <p className="text-sm text-gray-500 mt-1">Track orders and update their fulfillment status.</p>
          </div>
          <div className="w-full sm:w-auto">
            <SearchBar placeholder="Search by customer or order ID..." onSearch={setSearchTerm} />
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
          data={filteredOrders}
          loading={loading}
          emptyMessage={searchTerm ? "No orders match your search." : "No orders found."}
          rowKey="id"
          actions={(row) => (
            <select
              value={row.orderStatus}
              onChange={(e) => handleStatusSelect(row, e.target.value)}
              className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 text-gray-700
                outline-none focus:border-[#0f3d2e] focus:ring-2 focus:ring-[#0f3d2e]/15
                transition-all duration-200"
            >
              {ORDER_STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          )}
        />
      </div>

      {/* STATUS CHANGE CONFIRMATION */}
      {pendingChange && (
        <ConfirmModal
          title="Update Order Status"
          message={`Change order #${pendingChange.order.id.slice(0, 8)} status from "${pendingChange.order.orderStatus}" to "${pendingChange.newStatus}"?`}
          onConfirm={handleConfirmStatusChange}
          onCancel={() => setPendingChange(null)}
          loading={updating}
        />
      )}
    </div>
  );
}