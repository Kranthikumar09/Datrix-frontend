/**
 * Build a user-facing message for failed fetch/axios requests.
 * Distinguishes network/DNS failures from HTTP and unexpected errors.
 */
export function networkErrorMessage(err, fallback = "Something went wrong. Please try again.") {
  if (!err) return fallback;

  const message = typeof err.message === "string" ? err.message : "";
  const code = err.code || "";
  const hasHttpResponse = Boolean(err.response);

  if (
    code === "ERR_NETWORK" ||
    code === "ECONNABORTED" ||
    code === "ERR_NAME_NOT_RESOLVED" ||
    (!hasHttpResponse && /network error/i.test(message)) ||
    /failed to fetch|networkerror|load failed|name not resolved|enotfound/i.test(message)
  ) {
    return "Unable to reach the server. Check your connection or API configuration, then try again.";
  }

  if (err.response?.status) {
    return `Request failed (${err.response.status}). ${fallback}`;
  }

  if (message) return message;
  return fallback;
}
