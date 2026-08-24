# Validation des sections éditoriales

## Contrat de publication

Chaque article porte le champ `editorialSection`, limité à quatre valeurs : `actualite`, `vulgarisation`, `analyses` ou `carrieres`. Le champ est transmis par les procédures `articles.create` et `articles.update`, puis renvoyé par `articles.published`, `articles.bySlug`, `articles.adminList` et `articles.adminById`.

## Routes publiques

| Destination | Route publique |
|---|---|
| Actualités juridiques | `/actualite-juridique` |
| Articles juridiques vulgarisés | `/articles-juridiques` |
| Analyses juridiques | `/analyses-juridiques` |
| Tips carrières juridiques | `/carrieres-juridiques` |

Le filtre pur vérifie qu’un article attribué à une destination n’est pas retourné par les trois autres destinations. Les tests d’intégration vérifient également la conservation de `editorialSection` entre création, modification, listes administratives, lecture publique et lecture par slug.

## Lecture et retour

La page article calcule la destination depuis `editorialSection` et affiche un lien de retour vers la page éditoriale correspondante. Les anciennes URLs d’articles individuels restent conservées, tandis que l’ancienne route `/articles` redirige vers `/articles-juridiques`.

## Validation exécutée

Les commandes suivantes passent sans erreur :

```text
pnpm check
pnpm exec vitest run server/articles.editorial-section.test.ts client/src/lib/content.test.ts
pnpm build
```

Résultat : 7 tests ciblés passent et le build de production est généré. Les articles existants migrés avec la valeur par défaut `actualite` apparaissent dans la page Actualités juridiques jusqu’à ce qu’une autre destination soit choisie dans l’éditeur admin.

## Renforcement de la validation

Le test d’intégration `server/articles.editorial-section.test.ts` couvre désormais les procédures `create`, `update`, `published`, `bySlug`, `adminList` et `adminById`. Le test `client/src/lib/content.test.ts` vérifie quatre articles attribués respectivement à `actualite`, `vulgarisation`, `analyses` et `carrieres`, ainsi que quatre routes publiques distinctes.

La fonction `getEditorialSectionPath` est utilisée par `ArticlePage.tsx`, ce qui garantit que le lien « Retour à la sélection » repose sur le même mapping que les pages éditoriales. La validation ciblée a produit 8 tests réussis et le build de production est passé.
