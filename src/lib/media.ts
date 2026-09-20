import { existsSync } from "node:fs";
import { join } from "node:path";

/**
 * Which media files actually exist in public/.
 *
 * Resolved on the server at render time rather than inferred from a browser
 * error event: a lazy-loaded image below the fold never requests anything, so
 * it never errors, and the placeholder would silently never appear. This is
 * deterministic, survives SSR, and costs one stat per slot.
 */
export function mediaExists(publicPath?: string): boolean {
  if (!publicPath) return false;
  const clean = publicPath.replace(/^\/+/, "").split("?")[0];
  if (clean.includes("..")) return false;
  return existsSync(join(process.cwd(), "public", clean));
}
