/** Preserve only internal paths provided by the protected-route guard. */
export function getAuthDestination(state: unknown): string {
  const from = (state as { from?: { pathname?: unknown; search?: unknown; hash?: unknown } } | null)?.from;
  const path = from?.pathname;
  if (typeof path !== "string" || !path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return "/";
  return path + (typeof from?.search === "string" ? from.search : "") + (typeof from?.hash === "string" ? from.hash : "");
}
