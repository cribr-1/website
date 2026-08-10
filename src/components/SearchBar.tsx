import React, { useState, useEffect } from "react";
import { ArrowUp, Sparkles } from "lucide-react";

interface SearchBarProps {
  initialValue?: string;
  placeholder?: string;
  onSearch: (query: string) => void;
  isCompact?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  initialValue = "",
  placeholder = "e.g. best projects in Sarjapur under ₹1Cr",
  onSearch,
  isCompact = false,
}) => {
  const [query, setQuery] = useState(initialValue);

  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div
        className={`relative flex items-center bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm transition-all duration-300 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-500/20 ${
          isCompact
            ? "rounded-2xl p-1.5 md:p-2"
            : "rounded-3xl p-2 md:p-3 shadow-lg hover:shadow-xl dark:shadow-neutral-950/50"
        }`}
      >
        <div className="pl-3.5 pr-2 text-neutral-400 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-pulse" />
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          aria-label="Ask anything about a project or locality"
          className="w-full bg-transparent text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 font-sans text-sm md:text-base focus:outline-none pr-12 font-medium"
        />

        <button
          type="submit"
          aria-label="Send search request"
          className={`absolute right-2 md:right-3 flex items-center justify-center bg-[#2563EB] hover:bg-blue-700 active:scale-95 text-white rounded-full transition-all shadow-md cursor-pointer ${
            isCompact ? "w-8 h-8 md:w-9 md:h-9" : "w-10 h-10 md:w-11 md:h-11"
          }`}
        >
          <ArrowUp className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
