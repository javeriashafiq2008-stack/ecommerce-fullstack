// Reusable colored badge for the three status "kinds" used across the admin
// dashboard. `type` picks which map to read from; `value` is matched
// case-insensitively so it works whether the backend sends "Paid" or "paid".

const ROLE_STYLES = {
  buyer: "bg-[#f0f7f3] text-[#0f3d2e]",
  vendor: "bg-amber-100 text-amber-800",
  admin: "bg-red-100 text-red-700",
};

const ORDER_STATUS_STYLES = {
  pending: "bg-amber-100 text-amber-800",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-indigo-100 text-indigo-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const PAYMENT_STATUS_STYLES = {
  paid: "bg-green-100 text-green-700",
  pending: "bg-amber-100 text-amber-800",
  failed: "bg-red-100 text-red-700",
};

const STYLE_MAPS = {
  role: ROLE_STYLES,
  orderStatus: ORDER_STATUS_STYLES,
  paymentStatus: PAYMENT_STATUS_STYLES,
};

// Usage:
//   <StatusBadge type="role" value={user.role} />
//   <StatusBadge type="orderStatus" value={order.orderStatus} />
//   <StatusBadge type="paymentStatus" value={order.paymentStatus} />
export default function StatusBadge({ type, value }) {
  const map = STYLE_MAPS[type] || {};
  const key = value ? String(value).toLowerCase() : "";
  const styleClass = map[key] || "bg-gray-100 text-gray-600";
  const label = value ? String(value).charAt(0).toUpperCase() + String(value).slice(1) : "Unknown";

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${styleClass}`}>
      {label}
    </span>
  );
}