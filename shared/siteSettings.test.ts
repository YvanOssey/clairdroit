import { describe, expect, it } from "vitest";
import { SITE_SETTINGS_DEFAULTS, type SocialLink } from "./siteSettings";

describe("site identity social links", () => {
  it("keeps an empty social list in the default identity", () => {
    expect(SITE_SETTINGS_DEFAULTS.socialLinks).toEqual([]);
  });

  it("round-trips configured links through the database representation", () => {
    const links: SocialLink[] = [
      { platform: "linkedin", label: "LinkedIn", icon: "linkedin", url: "https://www.linkedin.com/company/droit-de-regard", visible: true },
      { platform: "instagram", label: "Instagram", icon: "instagram", url: "https://www.instagram.com/droit_de_regard", visible: false },
    ];
    expect(JSON.parse(JSON.stringify(links))).toEqual(links);
  });
});
