/**
 * Central application configuration.
 *
 * Required environment variables (see .env.example):
 * - REACT_APP_API_BASE_URL
 * - REACT_APP_ASSET_BASE_URL
 * - REACT_APP_PUBLIC_SITE_URL
 *
 * Do not invent production hostnames. Set these from your deployment environment
 * to the operational API, asset, and public site URLs.
 */

const trimTrailingSlash = (value = "") => value.replace(/\/+$/, "");

const readEnv = (key) => {
  const value = process.env[key];
  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }
  return "";
};

const apiBaseURL = trimTrailingSlash(readEnv("REACT_APP_API_BASE_URL"));
const assetBaseURL = trimTrailingSlash(readEnv("REACT_APP_ASSET_BASE_URL"));
const publicSiteURL = trimTrailingSlash(readEnv("REACT_APP_PUBLIC_SITE_URL"));

const missing = [];
if (!apiBaseURL) missing.push("REACT_APP_API_BASE_URL");
if (!assetBaseURL) missing.push("REACT_APP_ASSET_BASE_URL");
if (!publicSiteURL) missing.push("REACT_APP_PUBLIC_SITE_URL");

if (missing.length > 0 && process.env.NODE_ENV !== "test") {
  // eslint-disable-next-line no-console
  console.warn(
    `[Datrix config] Missing required environment variable(s): ${missing.join(
      ", "
    )}. Copy .env.example to .env.local and set the operational API, asset, and public site URLs. Requests will not fall back to a guessed domain.`
  );
}

const joinUrl = (base, path = "") => {
  if (!path) return base || "";
  if (/^https?:\/\//i.test(path)) return path;
  if (!base) return "";
  const clean = String(path).replace(/^\/+/, "");
  return `${base}/${clean}`;
};

const config = {
  /** Backend API root, e.g. https://host/backend/api */
  baseURL: apiBaseURL,
  /** Asset/CDN root used for uploads and media */
  assetBaseURL,
  /** Public frontend origin used for canonical / Open Graph URLs */
  publicSiteURL,
  /** True when all required env vars are present */
  isConfigured: missing.length === 0,
  missingEnv: missing,

  /** Build an absolute asset URL from a relative upload path */
  assetUrl(path = "") {
    return joinUrl(assetBaseURL, path);
  },

  /** Build a public site URL (canonical / OG) from a path */
  siteUrl(path = "/") {
    if (!publicSiteURL) {
      return path.startsWith("/") ? path : `/${path}`;
    }
    if (!path || path === "/") return publicSiteURL;
    const clean = path.startsWith("/") ? path : `/${path}`;
    return `${publicSiteURL}${clean}`;
  },
};

export default config;
