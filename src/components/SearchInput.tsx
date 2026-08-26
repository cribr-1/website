import React from "react";
import { ArrowUp } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (query: string) => void;
  placeholder?: string;
  isCompact?: boolean;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  onSearch,
  placeholder = "e.g. best projects in Sarjapur under ₹1Cr",
  isCompact = false,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSearch(value.trim());
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative w-full bg-white border border-neutral-300/80 rounded-xl flex items-center transition-all duration-200 ${
        isCompact ? "h-11 px-3.5" : "h-[54px] px-4"
      }`}
    >
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full bg-transparent text-neutral-900 font-medium focus:outline-none placeholder-neutral-400 ${
          isCompact ? "text-sm" : "text-base"
        }`}
      />
      <button
        type="submit"
        aria-label="Submit search"
        className={`bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-lg flex items-center justify-center transition-all duration-200 shrink-0 cursor-pointer ml-2 ${
          isCompact ? "w-8 h-8" : "w-9 h-9"
        }`}
      >
        <ArrowUp className={isCompact ? "w-4 h-4 stroke-[2.5]" : "w-5 h-5 stroke-[2.5]"} />
      </button>
    </form>
  );
};

export default SearchInput;
