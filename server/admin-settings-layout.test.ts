import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const source = readFileSync(
  resolve(process.cwd(), "client/src/pages/AdminSiteSettings.tsx"),
  "utf8"
);

describe("organisation de l’identité du site", () => {
  it("déclare les repères des principales zones éditoriales conservées", () => {
    expect(source).toContain('title: "Marque"');
    expect(source).toContain('title: "Navigation"');
    expect(source).toContain('title: "Accueil"');
    expect(source).toContain('title: "À la une"');
    expect(source).toContain('title: "Nous écrire"');
    expect(source).toContain('title="Photo de la page À propos"');
    expect(source).toContain("function SectionHeading");
  });

  it("rend le logo et le portrait non éditables manuellement", () => {
    expect(source).toContain('key: "logoUrl"');
    expect(source).toContain("about.photoUrl");
    expect(source).toContain("Téléverser le portrait");
    expect(source).toContain("editable: false");
    expect(source).toContain("Lecture seule");
    expect(source).toContain("disabled={field.editable === false}");
  });

  it("n’affiche plus les anciens blocs supprimés du site public", () => {
    expect(source).not.toContain('title: "Décryptages"');
    expect(source).not.toContain('key: "intentionTitleMain"');
    expect(source).not.toContain('key: "principleOneTitle"');
    expect(source).not.toContain('key: "quoteAttribution"');
    expect(source).not.toContain('label: "URL du portrait"');
  });
});
