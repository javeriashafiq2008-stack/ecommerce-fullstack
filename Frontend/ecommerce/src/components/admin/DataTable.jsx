import { Loader2 } from "lucide-react";


export default function DataTable({
  columns,
  data,
  loading = false,
  emptyMessage = "No records found.",
  actions,
  rowKey = "id",
}) {
  const columnCount = columns.length + (actions ? 1 : 0);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* overflow-x-auto is what makes this responsive — the table scrolls
          horizontally on narrow screens instead of squashing columns */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="border-b border-gray-100 bg-[#f5f0ea]/50">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 whitespace-nowrap"
                >
                  {col.label}
                </th>
              ))}
              {actions && (
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 text-right whitespace-nowrap">
                  Actions
                </th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={columnCount} className="px-5 py-16 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="w-6 h-6 text-[#0f3d2e] animate-spin" />
                    <span className="text-sm text-gray-400">Loading...</span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columnCount} className="px-5 py-16 text-center text-sm text-gray-400">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr key={row[rowKey]} className="hover:bg-[#f5f0ea]/40 transition-colors duration-150">
                  {columns.map((col) => (
                    <td key={col.key} className="px-5 py-3.5 text-gray-700 whitespace-nowrap">
                      {col.render ? col.render(row) : row[col.key] ?? "—"}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">{actions(row)}</div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}