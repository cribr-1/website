import React from "react";

interface SuggestionItem {
  icon: string;
  title: string;
  query: string;
}

interface SearchSuggestionsProps {
  onSelectQuery: (query: string) => void;
  customSuggestions?: SuggestionItem[];
}

const DEFAULT_SUGGESTIONS: SuggestionItem[] = [
  {
    icon: "🏢",
    title: "Lowest density projects in Whitefield",
    query: "Lowest density projects in Whitefield",
  },
  {
    icon: "🛡️",
    title: "Is Prestige Elm Park safe to buy?",
    query: "Is Prestige Elm Park safe to buy?",
  },
  {
    icon: "🕒",
    title: "Most delayed projects in North Bangalore",
    query: "Most delayed projects in North Bangalore",
  },
  {
    icon: "🚗",
    title: "Best commute score under ₹80L in Sarjapur",
    query: "Best commute score under ₹80L in Sarjapur",
  },
];

export const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  onSelectQuery,
  customSuggestions,
}) => {
  const suggestions = customSuggestions || DEFAULT_SUGGESTIONS;

  return (
    <div className="w-full text-left space-y-3">
      <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider font-mono px-1">
        Try asking
      </span>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {suggestions.map((item, index) => (
          <div
            key={index}
            onClick={() => onSelectQuery(item.query)}
            className="group bg-white dark:bg-neutral-800/60 border border-neutral-200/90 dark:border-neutral-700/80 hover:border-blue-400/80 dark:hover:border-sky-500/80 rounded-2xl p-4 flex items-center space-x-3.5 cursor-pointer shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
          >
            <div className="w-10 h-10 rounded-xl bg-neutral-50 dark:bg-neutral-800 group-hover:bg-blue-50/60 dark:group-hover:bg-neutral-700 border border-neutral-100 dark:border-neutral-700 flex items-center justify-center text-xl shrink-0 transition-colors">
              {item.icon}
            </div>
            <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 group-hover:text-blue-600 dark:group-hover:text-sky-400 transition-colors line-clamp-2 leading-snug">
              {item.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchSuggestions;

