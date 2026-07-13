/**
 * Returns true when the user prefers reduced motion.
 * Safe for SSR/test environments without matchMedia.
 */
export const prefersReducedMotion = () => {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

export default prefersReducedMotion;
