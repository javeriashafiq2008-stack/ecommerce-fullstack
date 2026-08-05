import { useEffect, useState } from "react";
import api from "../../api/axios.js";


export default function AdminDashboard() {
  
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
 
    const controller = new AbortController();

    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/api/admin/dashboard", {
          signal: controller.signal,
        });

        // Backend returns { success, data: { totalUsers, totalVendors, ... } }
        if (response.data?.success) {
          setStats(response.data.data);
        } else {
          setError("Unable to load dashboard data.");
        }
      } catch (err) {
        if (err.name === "CanceledError" || err.name === "AbortError") return;
        console.log(err.response?.data || err.message);
        setError(
          err.response?.data?.message || "Something went wrong while loading the dashboard."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();

    return () => controller.abort();
  }, []);

  // Formats totalRevenue as currency; every other stat is shown as a plain
  // integer. Falls back gracefully if a value is missing for any reason.
  const formatCurrency = (value) =>
    `$${Number(value ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  // ── Loading state ─────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f0ea] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 rounded-full border-4 border-[#0f3d2e]/20 border-t-[#0f3d2e] animate-spin" />
          <p className="text-gray-500 text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // ── Error state ───────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="min-h-screen bg-[#f5f0ea] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-sm p-8 max-w-sm w-full text-center">
          <p className="text-red-500 font-medium">{error}</p>
          <p className="text-gray-400 text-sm mt-2">
            Please refresh the page or try again later.
          </p>
        </div>
      </div>
    );
  }

  // ── Main dashboard ────────────────────────────────────────────────────
  // Five stat cards, defined inline as plain data so the JSX below stays a
  // single .map() rather than five near-identical blocks — still no
  // separate component, just an array literal inside this same file.
  const statCards = [
    { label: "Total Users", value: stats?.totalUsers ?? 0 },
    { label: "Total Vendors", value: stats?.totalVendors ?? 0 },
    { label: "Total Products", value: stats?.totalProducts ?? 0 },
    { label: "Total Orders", value: stats?.totalOrders ?? 0 },
    { label: "Total Revenue", value: formatCurrency(stats?.totalRevenue) },
  ];

  return (
    <div className="min-h-screen bg-[#f5f0ea] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">Admin Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            A quick snapshot of your store's users, vendors, products, and revenue.
          </p>
        </div>

        {/* STAT CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-10">
          {statCards.map((card) => (
            <div
              key={card.label}
              className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200"
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                {card.label}
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{card.value}</p>
            </div>
          ))}
        </div>

        {/* ADMIN OVERVIEW SECTION */}
        <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Admin Overview</h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            This dashboard gives you a real-time summary of activity across the platform —
            registered buyers, active vendors, listed products, orders placed, and total
            revenue collected from paid orders. Use it as a starting point before diving into
            user management, product moderation, or order tracking.
          </p>
        </div>

      </div>
    </div>
  );
}