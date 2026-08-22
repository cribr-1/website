/**
 * CRIBR Centralized Navigation & History Manager
 * Ensures predictable, app-like SPA routing, tracks internal CRIBR route stack,
 * and prevents users from being dropped out of CRIBR when pressing Back.
 */

const HISTORY_STORAGE_KEY = "cribr_navigation_history_v1";

export function normalizePath(path: string): string {
  if (!path) return "/";
  let p = path.trim();
  // Strip query string and hash for path normalization if needed, or keep clean path
  const [pathname] = p.split("?");
  let clean = pathname || "/";
  if (!clean.startsWith("/")) clean = "/" + clean;
  if (clean.length > 1 && clean.endsWith("/")) clean = clean.slice(0, -1);
  return clean;
}

function getStoredHistory(): string[] {
  try {
    const raw = sessionStorage.getItem(HISTORY_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map(normalizePath);
      }
    }
  } catch (e) {
    // Ignore storage errors
  }
  return [normalizePath(window.location.pathname)];
}

function saveStoredHistory(history: string[]): void {
  try {
    sessionStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
  } catch (e) {
    // Ignore storage errors
  }
}

let internalHistory: string[] = getStoredHistory();

/**
 * Initialize history tracking on application startup.
 * Seeds a root '/' fallback entry if the user landed directly on a sub-route
 * so that both internal Back and browser Back stay within CRIBR.
 */
export function initNavigation(): void {
  const currentPath = normalizePath(window.location.pathname);

  if (internalHistory.length <= 1) {
    if (currentPath !== "/") {
      internalHistory = ["/", currentPath];
      saveStoredHistory(internalHistory);
      try {
        window.history.replaceState({ cribr: true, path: "/" }, "", "/");
        window.history.pushState({ cribr: true, path: currentPath }, "", currentPath);
      } catch (e) {
        // Fallback
      }
    } else {
      internalHistory = ["/"];
      saveStoredHistory(internalHistory);
      try {
        window.history.replaceState({ cribr: true, path: "/" }, "", "/");
      } catch (e) {
        // Fallback
      }
    }
  } else {
    // Sync current path into history if needed
    if (internalHistory[internalHistory.length - 1] !== currentPath) {
      internalHistory.push(currentPath);
      saveStoredHistory(internalHistory);
    }
  }
}

type RouteListener = (path: string) => void;
const listeners = new Set<RouteListener>();

export function subscribeToRoute(listener: RouteListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function notifyRouteListeners(path: string): void {
  listeners.forEach((fn) => {
    try {
      fn(path);
    } catch (e) {
      console.error("[CRIBR Route Listener Error]", e);
    }
  });
  window.dispatchEvent(new CustomEvent("cribr_route_change", { detail: { path } }));
}

/**
 * Navigate to a specific CRIBR route using SPA pushState / replaceState.
 */
export function navigate(toPath: string, options?: { replace?: boolean; scroll?: boolean; silent?: boolean }): void {
  const target = normalizePath(toPath);
  const current = normalizePath(window.location.pathname);

  if (options?.replace) {
    if (internalHistory.length > 0) {
      internalHistory[internalHistory.length - 1] = target;
    } else {
      internalHistory = [target];
    }
    saveStoredHistory(internalHistory);
    try {
      window.history.replaceState({ cribr: true, path: target }, "", target);
    } catch (e) {
      // Ignore
    }
  } else {
    if (current !== target) {
      internalHistory.push(target);
      saveStoredHistory(internalHistory);
      try {
        window.history.pushState({ cribr: true, path: target }, "", target);
      } catch (e) {
        // Ignore
      }
    }
  }

  if (options?.scroll !== false) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (!options?.silent) {
    notifyRouteListeners(target);
  }
}

/**
 * Controlled Back Navigation
 * Determines if there is a valid previous CRIBR route.
 * If yes -> returns to previous CRIBR route.
 * If no -> safely navigates to fallback (default '/').
 * Guarantees the user is NEVER thrown outside CRIBR.
 */
export function goBack(fallbackPath: string = "/"): void {
  const safeFallback = normalizePath(fallbackPath);

  if (internalHistory.length > 1) {
    internalHistory.pop(); // Remove current route
    saveStoredHistory(internalHistory);
    const prevRoute = internalHistory[internalHistory.length - 1] || safeFallback;

    try {
      window.history.replaceState({ cribr: true, path: prevRoute }, "", prevRoute);
    } catch (e) {
      // Fallback
    }

    notifyRouteListeners(prevRoute);
    window.scrollTo({ top: 0, behavior: "smooth" });
  } else {
    // No previous internal route exists -> Navigate safely to fallback / Home
    internalHistory = [safeFallback];
    saveStoredHistory(internalHistory);
    try {
      window.history.replaceState({ cribr: true, path: safeFallback }, "", safeFallback);
    } catch (e) {
      // Fallback
    }
    notifyRouteListeners(safeFallback);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

/**
 * Returns the previous CRIBR path from internal history, or fallback if none.
 */
export function getPreviousPath(fallbackPath: string = "/"): string {
  if (internalHistory.length > 1) {
    return internalHistory[internalHistory.length - 2];
  }
  return normalizePath(fallbackPath);
}

/**
 * Handle browser PopState event (Browser Back / Forward buttons).
 */
export function handlePopStateEvent(): string {
  const currentPath = normalizePath(window.location.pathname);

  if (internalHistory.length > 0 && internalHistory[internalHistory.length - 1] !== currentPath) {
    const prevIdx = internalHistory.lastIndexOf(currentPath);
    if (prevIdx !== -1) {
      internalHistory = internalHistory.slice(0, prevIdx + 1);
    } else {
      internalHistory.push(currentPath);
    }
    saveStoredHistory(internalHistory);
  }

  notifyRouteListeners(currentPath);
  return currentPath;
}
