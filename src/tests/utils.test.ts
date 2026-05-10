import { describe, expect, it } from "vitest";
import { cn, formatDateRange, initials } from "@/lib/utils";

describe("utils", () => {
  describe("cn", () => {
    it("merges class names correctly", () => {
      expect(cn("a", "b")).toBe("a b");
      expect(cn("a", { b: true, c: false })).toBe("a b");
      expect(cn("p-4", "p-2")).toBe("p-2"); // tailwind-merge test
    });
  });

  describe("initials", () => {
    it("returns initials for names", () => {
      expect(initials("John Doe")).toBe("JD");
      expect(initials("Alice")).toBe("A");
      expect(initials("")).toBe("RP");
    });
  });

  describe("formatDateRange", () => {
    it("formats date ranges correctly", () => {
      expect(formatDateRange("2023-01-01", "2023-12-31")).toContain("Jan 2023");
      expect(formatDateRange("2023-01-01", null)).toContain("Present");
    });
  });
});
