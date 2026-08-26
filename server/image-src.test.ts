import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const readClientFile = (relativePath: string) =>
  readFileSync(resolve(process.cwd(), "client/src", relativePath), "utf8");

describe("rendu des images optionnelles", () => {
  it("ne passe pas directement les URLs optionnelles du logo aux balises img", () => {
    const source = readClientFile("components/SiteLayout.tsx");

    expect(source).toContain("settings.logoUrl ? (");
    expect(source).toContain("src={settings.logoUrl}");
    expect(source).toContain('aria-hidden="true"');
    expect(source).toContain("CD");
  });

  it("ne monte pas le portrait avant la disponibilité de son URL", () => {
    const source = readClientFile("pages/About.tsx");

    expect(source).toContain("{photoUrl ? (");
    expect(source).toContain("Le portrait de Corinne sera bientôt disponible.");
  });
});
