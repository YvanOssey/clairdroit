import { describe, expect, it } from "vitest";
import { SITE_SETTINGS_DEFAULTS } from "@shared/siteSettings";
import { parsePageContent, serializePageContent } from "./db";

describe("page content persistence", () => {
  it("round-trips edited page content through the JSON representation", () => {
    const edited = structuredClone(SITE_SETTINGS_DEFAULTS.pageContent);
    edited.about.titleMain = "Une revue qui explique";
    edited.contact.description = "Écrivez à la rédaction pour proposer un sujet.";

    const persisted = serializePageContent(edited);
    const restored = parsePageContent(persisted);

    expect(restored.about.titleMain).toBe("Une revue qui explique");
    expect(restored.contact.description).toBe("Écrivez à la rédaction pour proposer un sujet.");
    expect(restored.featured.emptyTitle).toBe(SITE_SETTINGS_DEFAULTS.pageContent.featured.emptyTitle);
  });

  it("falls back safely when older rows have no page content", () => {
    expect(parsePageContent(null)).toEqual(SITE_SETTINGS_DEFAULTS.pageContent);
    expect(parsePageContent("invalid-json")).toEqual(SITE_SETTINGS_DEFAULTS.pageContent);
  });
});
