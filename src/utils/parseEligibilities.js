/**
 * Parse course eligibility JSON from API (may be double-encoded string).
 */
export const parseEligibilities = (eligibilities) => {
  if (!eligibilities) return [];
  if (Array.isArray(eligibilities)) return eligibilities;
  try {
    let parsed = eligibilities;
    if (typeof parsed === "string") {
      if (parsed.startsWith('"') && parsed.endsWith('"')) {
        parsed = parsed.slice(1, -1);
      }
      parsed = parsed.replace(/\\"/g, '"');
      parsed = JSON.parse(parsed);
    }
    return Array.isArray(parsed) ? parsed : parsed ? [parsed] : [];
  } catch (error) {
    console.error("Error parsing eligibilities:", error);
    return [];
  }
};

export default parseEligibilities;
