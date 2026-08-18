import React, { Component, ReactNode, ErrorInfo } from "react";
import { RefreshCw, AlertCircle } from "lucide-react";

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackMessage?: string;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
    this.handleReset = this.handleReset.bind(this);
  }

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[CRIBR ErrorBoundary caught an error]:", error.message, errorInfo.componentStack);
  }

  public handleReset() {
    this.setState({ hasError: false });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="w-full max-w-xl mx-auto my-8 p-8 bg-white border border-neutral-200/80 rounded-2xl shadow-xs text-center space-y-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200/60">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-display font-bold text-neutral-900">
              {this.props.fallbackTitle || "Unable to display this section"}
            </h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto leading-relaxed">
              {this.props.fallbackMessage || "An unexpected issue occurred while rendering this component. Please try reloading."}
            </p>
          </div>
          <button
            onClick={this.handleReset}
            className="px-5 py-2.5 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-semibold rounded-xl transition-all shadow-xs inline-flex items-center space-x-2 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reload Section</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
