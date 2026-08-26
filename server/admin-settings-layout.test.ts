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
    expect(source).toContain('title: "À propos de moi"');
    expect(source).toContain('key: "biography"');
    expect(source).toContain('title: "Actualité juridique"');
    expect(source).toContain('title: "Articles juridiques vulgarisés"');
    expect(source).toContain('title: "Analyses juridiques"');
    expect(source).toContain('title: "Tips carrières juridiques"');
    expect(source).toContain('title: "Contenu de la page Carrières"');
    expect(source).toContain('group: "editorialPages.actualite"');
    expect(source).toContain('group: "editorialPages.vulgarisation"');
    expect(source).toContain('group: "editorialPages.analyses"');
    expect(source).toContain('group: "editorialPages.carrieres"');
    expect(source).toContain('key: "guidanceItems"');
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

  it("conserve et affiche le contenu public fourni pour À propos de moi", () => {
    const aboutSource = readFileSync(
      resolve(process.cwd(), "client/src/pages/About.tsx"),
      "utf8"
    );
    const settingsSource = readFileSync(
      resolve(process.cwd(), "shared/siteSettings.ts"),
      "utf8"
    );
    expect(settingsSource).toContain("biography:");
    expect(settingsSource).toContain(
      "Passionnée par la transmission du savoir"
    );
    expect(aboutSource).toContain("about.biography");
    expect(aboutSource).toContain("Portrait de Corinne Thio");
    expect(aboutSource).toContain("Corinne Thio · Juriste & blogueuse");
    expect(aboutSource).toContain("about.ctaTitle");
    expect(aboutSource).toContain("about.ctaLabel");
    const sectionsSource = readFileSync(
      resolve(process.cwd(), "client/src/pages/EditorialSections.tsx"),
      "utf8"
    );
    const careersSource = readFileSync(
      resolve(process.cwd(), "client/src/pages/LegalCareers.tsx"),
      "utf8"
    );
    expect(sectionsSource).toContain(
      "settings.pageContent.editorialPages[section]"
    );
    expect(careersSource).toContain("careersPage");
  });
});
