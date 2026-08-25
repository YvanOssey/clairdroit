# Plan de migration indépendante de ClairDroit

## Objectif

Déployer ClairDroit sur une infrastructure indépendante de Manus afin d’obtenir une adresse professionnelle sans `manus.space`, de supprimer la mention « Made with Manus » et de conserver une solution de retour vers la version Manus pendant toute la transition.

> Principe de sécurité : aucune suppression de la version Manus, aucune modification irréversible de la base actuelle et aucun changement de domaine avant validation de la copie indépendante.

## 1. Inventaire technique actuel

ClairDroit est une application full-stack en React 19, Vite, TypeScript, Express, tRPC 11, Drizzle ORM et MySQL/MariaDB. Le serveur gère l’authentification admin par email et mot de passe, les articles, les réglages du site, les formulaires Contact et Newsletter ainsi que les notifications Resend.

| Fonction | État actuel | Portabilité |
|---|---|---|
| Interface React/Vite | Build de production fonctionnel | Portable |
| API Express/tRPC | Serveur Node.js compilé dans `dist` | Portable |
| Base MySQL/MariaDB | Schéma Drizzle et migrations présents | Portable |
| Authentification admin | Sessions JWT et mots de passe hachés | Portable après nettoyage du reliquat OAuth |
| Emails | Resend avec variables d’environnement | Portable |
| Images et logo | Stockage Manus via Forge et chemins `/manus-storage/...` | À remplacer |
| OAuth Manus | Présent dans le SDK et le contexte serveur | À supprimer ou rendre facultatif |
| Journalisation Manus | Plugin Vite et journaux locaux de développement | À désactiver en production indépendante |
| Notifications intégrées Manus | Code présent dans l’infrastructure | Non nécessaire pour ClairDroit |

## 2. Ce qui doit être remplacé

Le point principal est le stockage. `server/storage.ts` demande actuellement `BUILT_IN_FORGE_API_URL` et `BUILT_IN_FORGE_API_KEY`, puis expose les fichiers avec des chemins `/manus-storage/...`. Dans une infrastructure indépendante, les couvertures, le logo et le portrait devront être déplacés vers un stockage S3 compatible, par exemple Cloudflare R2, Amazon S3 ou un service équivalent. Les URLs enregistrées en base devront ensuite pointer vers le nouveau stockage.

Le deuxième point est l’authentification de contexte. La connexion admin actuelle est déjà basée sur email, mot de passe haché et JWT, mais `server/_core/context.ts` passe encore par `sdk.authenticateRequest`, qui contient la logique OAuth Manus. Il faudra créer un contexte indépendant qui vérifie directement le cookie JWT local et conserve les procédures `adminProcedure`.

Le troisième point concerne l’infrastructure de développement. `vite-plugin-manus-runtime`, les routes de stockage Manus, les appels Forge et les journaux de debug Manus ne seront pas nécessaires dans la version indépendante. Ils pourront être retirés ou isolés dans une configuration de développement, sans toucher aux fonctionnalités éditoriales.

## 3. Cible proposée

Pour une première migration raisonnable, la cible est un hébergeur Node.js géré, une base MySQL managée et un stockage S3 compatible. Cette architecture évite de gérer immédiatement un serveur Linux, les mises à jour de sécurité, les sauvegardes système et les certificats HTTPS à la main.

| Composant | Cible de départ |
|---|---|
| Application | Service Node.js sur Railway ou plateforme équivalente |
| Base de données | MySQL managée sur la même plateforme ou service externe |
| Stockage | Cloudflare R2, Amazon S3 ou stockage S3 compatible |
| Email | Resend |
| Domaine | Domaine acheté séparément, par exemple un nom en `.ci`, sous réserve de disponibilité |
| HTTPS | Certificat automatique de la plateforme ou du proxy de domaine |
| Sauvegarde | Export MySQL avant migration, puis sauvegardes périodiques de la base et des fichiers |

Les coûts et limites exacts devront être vérifiés sur les comptes choisis avant toute souscription. Manus reste une alternative intégrée, avec une connexion officielle aux domaines personnalisés pour les offres éligibles [1] [2].

## 4. Étapes réversibles

### Étape 1 — Décisions de base

Choisir l’hébergeur Node.js, le service MySQL, le stockage d’images et le nom de domaine. Cette étape ne modifie encore ni le code de production Manus ni les données actuelles.

### Étape 2 — Sauvegardes

Exporter la base actuelle, conserver une copie du dossier local et lister les fichiers image actuellement utilisés. Les mots de passe et les clés API ne doivent pas être placés dans l’archive ni dans Git.

### Étape 3 — Adaptation du code

Remplacer le stockage Manus par le stockage S3 choisi, rendre l’authentification indépendante du SDK OAuth Manus et retirer les routes ou plugins de debug spécifiques à Manus. Le code doit continuer à passer `pnpm check`, `pnpm test` et `pnpm build`.

### Étape 4 — Environnement de test

Créer une base indépendante vide, configurer les secrets de test, appliquer les migrations, déployer une copie privée et vérifier la connexion admin, la création d’un brouillon, la publication, l’upload d’une image, la recherche, les formulaires et les notifications Resend.

### Étape 5 — Import des données

Importer les réglages, les articles et les références d’images. L’import doit être vérifié avant toute ouverture publique. Il faudra également contrôler les URLs canoniques, le sitemap, les robots et les pages légales.

### Étape 6 — Domaine et bascule

Acheter ou connecter le domaine seulement après validation de la copie indépendante. Conserver la version Manus active comme secours, puis rediriger progressivement les visiteurs vers le nouveau domaine lorsque les tests sont concluants.

## 5. Première décision attendue

La migration ne doit pas commencer par l’achat d’un domaine ou par la suppression de Manus. La première décision est de confirmer la cible technique : **Railway + MySQL + stockage S3 compatible + Resend**, ou une autre combinaison choisie par l’utilisateur.

### Références

[1]: https://help.manus.im/en/articles/11711203-how-can-i-connect-the-website-created-by-manus-to-my-custom-domain "Manus — connecter un site à un domaine personnalisé"
[2]: https://manus.im/docs/website-builder/custom-domains "Manus — domaines personnalisés"
