import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";

// Debounced search box. Calls onSearch(value) `debounceMs` after the user
// stops typing — not on every keystroke — to avoid firing an API call per
// character. Clearing is instant (no debounce delay).
export default function SearchBar({ placeholder = "Search...", onSearch, debounceMs = 400 }) {
  const [value, setValue] = useState("");
  const debounceRef = useRef(null);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onSearch?.(value);
    }, debounceMs);
    return () => clearTimeout(debounceRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handleClear = () => {
    setValue("");
    clearTimeout(debounceRef.current);
    onSearch?.("");
  };

  return (
    <div className="relative w-full sm:max-w-xs">
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-9 py-2.5 text-sm border border-gray-200 rounded-full bg-white
          outline-none focus:border-[#0f3d2e] focus:ring-2 focus:ring-[#0f3d2e]/15 transition-all duration-200"
      />
      {value && (
        <button
          onClick={handleClear}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}