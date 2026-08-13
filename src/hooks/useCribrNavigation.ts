import { useEffect, useCallback } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";

export function useCribrNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize Root Boundary History Trap
  useEffect(() => {
    const currentState = window.history.state;

    if (!currentState || !currentState.cribrApp) {
      // Replace current entry with the root boundary
      window.history.replaceState(
        { cribrApp: true, cribrRoot: true, depth: 0 },
        "",
        "/"
      );

      // If we are already at root or at a deep link, push the active state
      const currentPath = location.pathname + location.search;
      window.history.pushState(
        { cribrApp: true, cribrRoot: false, depth: 1 },
        "",
        currentPath === "/" ? "/" : currentPath
      );
    }

    const handlePopState = (event: PopStateEvent) => {
      const state = event.state;

      // If popped to root boundary or non-cribr state, catch it and force stay on CRIBR Home
      if (!state || !state.cribrApp || state.cribrRoot) {
        window.history.pushState(
          { cribrApp: true, cribrRoot: false, depth: 1 },
          "",
          "/"
        );
        navigate("/", { replace: true });
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [navigate, location.pathname, location.search]);

  // Safe Back action for UI buttons
  const goBack = useCallback(() => {
    const state = window.history.state;
    if (state && typeof state.depth === "number" && state.depth > 1) {
      navigate(-1);
    } else {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  // Safe navigation function that tags history state
  const goTo = useCallback(
    (to: string, options?: { replace?: boolean; state?: any }) => {
      const currentDepth = window.history.state?.depth || 1;
      const newDepth = options?.replace ? currentDepth : currentDepth + 1;

      navigate(to, {
        replace: options?.replace,
        state: {
          ...(options?.state || {}),
          cribrApp: true,
          cribrRoot: false,
          depth: newDepth,
        },
      });
    },
    [navigate]
  );

  return {
    navigate: goTo,
    goBack,
    location,
    searchParams,
    setSearchParams,
  };
}
