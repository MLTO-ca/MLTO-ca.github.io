import { formatDateToStr, getTimeZoneAbbr } from "../utils.js";

describe("utils", () => {
  it("formats date to YYYY-MM-DD", () => {
    const date = new Date("2025-06-10T12:00:00Z");
    expect(formatDateToStr(date)).toBe("2025-06-10");
  });

  it("gets timezone abbreviation", () => {
    const date = new Date("2025-06-10T12:00:00Z");
    const abbr = getTimeZoneAbbr(date, "America/Toronto");
    expect(typeof abbr).toBe("string");
    expect(abbr.length).toBeGreaterThan(0);
  });
});