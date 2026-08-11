import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Loader2, Trash2, AlertCircle } from "lucide-react";
import api from "../../api/axios.js";
import DataTable from "../../components/admin/DataTable.jsx";
import StatusBadge from "../../components/admin/StatusBadge.jsx";
import ConfirmModal from "../../components/admin/ConfirmModel.jsx";
import SearchBar from "../../components/admin/SearchBar.jsx";

const ROLE_OPTIONS = ["buyer", "vendor", "admin"];

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Per-row role-change loading state — keyed by user id so only the row
  // being saved shows a spinner, not the whole table.
  const [updatingUserId, setUpdatingUserId] = useState(null);

  // Delete confirmation — the target user (or null) drives whether the
  // modal is mounted at all.
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Logged-in admin's own id, so their own row's Delete button can be
  // disabled client-side — the backend already blocks this, but no point
  // letting the request round-trip just to get rejected.
  const { user: currentAdmin } = useSelector((state) => state.authentication);

  useEffect(() => {
    const controller = new AbortController();

    const fetchUsers = async () => {
      try {
        setLoading(true);
        setActionError("");
        const response = await api.get("/api/admin/users", { signal: controller.signal });
        if (response.data?.success) {
          setUsers(response.data.users || []);
        } else {
          setActionError("Unable to load users.");
        }
      } catch (err) {
        if (err.name === "CanceledError" || err.name === "AbortError") return;
        console.log(err.response?.data || err.message);
        setActionError(err.response?.data?.message || "Something went wrong while loading users.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
    return () => controller.abort();
  }, []);

  // Client-side filter by name/email — getAllUsers doesn't take a query
  // param, so search happens against the already-fetched list.
  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) return users;
    const term = searchTerm.trim().toLowerCase();
    return users.filter(
      (u) => u.name?.toLowerCase().includes(term) || u.email?.toLowerCase().includes(term)
    );
  }, [users, searchTerm]);

  const formatDate = (value) => {
    if (!value) return "—";
    return new Date(value).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  };

  // ── Role change — saves immediately on select, no confirmation needed ──
  const handleRoleChange = async (targetUser, newRole) => {
    if (newRole === targetUser.role) return;
    setActionError("");
    setUpdatingUserId(targetUser.id);
    try {
      const response = await api.put(`/api/admin/users/${targetUser.id}`, { role: newRole });
      if (response.data?.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === targetUser.id ? { ...u, role: response.data.user.role } : u))
        );
      }
    } catch (err) {
      console.log(err.response?.data || err.message);
      setActionError(err.response?.data?.message || "Unable to update role.");
    } finally {
      setUpdatingUserId(null);
    }
  };

  // ── Delete flow ──────────────────────────────────────────────────────
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setActionError("");
    try {
      const response = await api.delete(`/api/admin/users/${deleteTarget.id}`);
      if (response.data?.success) {
        setUsers((prev) => prev.filter((u) => u.id !== deleteTarget.id));
        setDeleteTarget(null);
      }
    } catch (err) {
      console.log(err.response?.data || err.message);
      setActionError(err.response?.data?.message || "Unable to delete user.");
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    { key: "name", label: "Name", render: (row) => row.name || "Not Provided" },
    {
      key: "email",
      label: "Email",
      render: (row) => <span className="truncate max-w-[200px] inline-block align-bottom">{row.email}</span>,
    },
    { key: "role", label: "Role", render: (row) => <StatusBadge type="role" value={row.role} /> },
    { key: "createdAt", label: "Joined", render: (row) => formatDate(row.createdAt) },
  ];

  return (
    <div className="min-h-screen bg-[#f5f0ea] py-6 sm:py-10 px-3 sm:px-6 lg:px-8 font-[Poppins]">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900">Manage Users</h1>
            <p className="text-sm text-gray-500 mt-1">View, update roles, and remove user accounts.</p>
          </div>
          <div className="w-full sm:w-auto">
            <SearchBar placeholder="Search by name or email..." onSearch={setSearchTerm} />
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
          data={filteredUsers}
          loading={loading}
          emptyMessage={searchTerm ? "No users match your search." : "No users found."}
          rowKey="id"
          actions={(row) => {
            const isSelf = row.id === currentAdmin?.id;
            const isSavingRole = updatingUserId === row.id;

            return (
              <div className="flex flex-wrap items-center justify-end gap-2">
                {/* Inline role change */}
                <select
                  value={row.role}
                  disabled={isSavingRole}
                  onChange={(e) => handleRoleChange(row, e.target.value)}
                  className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 text-gray-700
                    outline-none focus:border-[#0f3d2e] focus:ring-2 focus:ring-[#0f3d2e]/15
                    transition-all duration-200 disabled:opacity-50 capitalize min-w-[90px]"
                >
                  {ROLE_OPTIONS.map((r) => (
                    <option key={r} value={r} className="capitalize">
                      {r}
                    </option>
                  ))}
                </select>
                {isSavingRole && <Loader2 className="w-3.5 h-3.5 text-[#0f3d2e] animate-spin flex-shrink-0" />}

                {/* Delete */}
                <button
                  onClick={() => setDeleteTarget(row)}
                  disabled={isSelf}
                  title={isSelf ? "You can't delete your own account" : "Delete user"}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400
                    hover:text-red-500 hover:bg-red-50 transition-all duration-200 flex-shrink-0
                    disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          }}
        />
      </div>

      {/* DELETE CONFIRMATION */}
      {deleteTarget && (
        <ConfirmModal
          title="Delete User"
          message={`Are you sure you want to delete "${deleteTarget.name || deleteTarget.email}"? This action cannot be undone.`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
        />
      )}
    </div>
  );
}