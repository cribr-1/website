import React from "react";
import ReactMarkdown from "react-markdown";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

/**
 * Renders AI markdown responses with premium styling.
 * Supports headings, bold, lists, inline code, and blockquotes.
 */
export default function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  if (!content) return null;

  return (
    <div className={`cribr-md ${className}`}>
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h2 className="text-lg font-bold text-neutral-950 mt-5 mb-2 pb-2 border-b border-neutral-200/70 flex items-center gap-2">
              {children}
            </h2>
          ),
          h2: ({ children }) => (
            <h3 className="text-base font-bold text-neutral-900 mt-5 mb-2 pb-1.5 border-b border-neutral-100">
              {children}
            </h3>
          ),
          h3: ({ children }) => (
            <h4 className="text-sm font-bold text-blue-800 mt-4 mb-1.5 flex items-center gap-1.5">
              <span className="w-1 h-4 bg-blue-500 rounded-full inline-block" />
              {children}
            </h4>
          ),
          h4: ({ children }) => (
            <h5 className="text-sm font-semibold text-neutral-800 mt-3 mb-1">
              {children}
            </h5>
          ),
          p: ({ children }) => (
            <p className="text-sm text-neutral-700 leading-relaxed mb-2.5">
              {children}
            </p>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-neutral-950">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="text-neutral-600 italic">{children}</em>
          ),
          ul: ({ children }) => (
            <ul className="space-y-1.5 my-2 pl-1">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="space-y-1.5 my-2 pl-1 list-none counter-reset-item">
              {children}
            </ol>
          ),
          li: ({ children, ...props }) => {
            const isOrdered = (props as any).ordered;
            return (
              <li className="flex items-start gap-2 text-sm text-neutral-700 leading-relaxed">
                <span className={`mt-1.5 flex-shrink-0 ${isOrdered
                  ? "w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold flex items-center justify-center"
                  : "w-1.5 h-1.5 rounded-full bg-blue-500"
                  }`}>
                  {isOrdered ? (props as any).index + 1 : null}
                </span>
                <span className="flex-1">{children}</span>
              </li>
            );
          },
          code: ({ children, className: codeClassName }) => {
            const isInline = !codeClassName;
            if (isInline) {
              return (
                <code className="bg-blue-50 text-blue-800 px-1.5 py-0.5 rounded-md text-xs font-mono border border-blue-100">
                  {children}
                </code>
              );
            }
            return (
              <pre className="bg-neutral-900 text-neutral-100 rounded-xl p-4 text-xs font-mono overflow-x-auto my-3 border border-neutral-800">
                <code>{children}</code>
              </pre>
            );
          },
          blockquote: ({ children }) => (
            <blockquote className="border-l-3 border-blue-500 bg-blue-50/50 rounded-r-xl p-4 my-3 text-sm text-blue-900 italic">
              {children}
            </blockquote>
          ),
          hr: () => (
            <hr className="my-4 border-none h-px bg-gradient-to-r from-transparent via-neutral-200 to-transparent" />
          ),
          a: ({ children, href }) => (
            <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline underline-offset-2 decoration-blue-300 hover:decoration-blue-500 transition-colors">
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
