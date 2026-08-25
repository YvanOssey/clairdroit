# ClairDroit — étape Railway

## Situation actuelle

Le dépôt local contient déjà une configuration `railway.json` qui demande à Railway d’utiliser le build Node.js du projet et la commande `pnpm start`. Le dépôt Manus reste la version de secours. Aucun mot de passe, aucune clé Resend et aucune donnée de production ne doivent être ajoutés à GitHub.

## Étape réalisée

Le compte Railway est créé et le compte GitHub est connecté. La prochaine action consiste à rendre le code indépendant du stockage Manus avant le premier déploiement public.

## Ce qui sera créé dans Railway

| Service | Rôle |
|---|---|
| Service Web ClairDroit | Exécute l’application React, Express et tRPC |
| Service MySQL | Stocke les articles, les réglages, les messages et les abonnés |
| Stockage S3 compatible | Conserve le logo, le portrait et les images de couverture |

## Variables qui seront nécessaires plus tard

Les valeurs seront saisies dans l’onglet Variables du service Railway, jamais dans le dépôt GitHub. La variable `DATABASE_URL` sera reliée à la base MySQL Railway. Les autres variables porteront notamment sur `JWT_SECRET`, `ADMIN_PASSWORD_YVAN`, `ADMIN_PASSWORD_THIO`, `RESEND_API_KEY`, `EMAIL_FROM` et `CONTACT_NOTIFICATION_EMAIL`.

Les variables Manus `BUILT_IN_FORGE_API_URL`, `BUILT_IN_FORGE_API_KEY`, `OAUTH_SERVER_URL` et `VITE_OAUTH_PORTAL_URL` ne doivent pas être copiées automatiquement : elles seront remplacées ou supprimées après adaptation du stockage et du contexte d’authentification.

## Ordre de travail obligatoire

Nous ne devons pas cliquer sur Deploy maintenant. Le prochain travail technique est de remplacer le stockage `/manus-storage/...` par un stockage S3 compatible et de vérifier que l’authentification admin fonctionne sans OAuth Manus. Ensuite seulement, nous créerons la base MySQL Railway et nous lancerons un déploiement privé de test.

## Vérifications avant le premier déploiement

Le code devra réussir `pnpm check`, `pnpm test` et `pnpm build`. Le test Railway devra ensuite confirmer la connexion admin, la création d’un brouillon, la publication d’un article, l’affichage du logo et des images, les formulaires Contact et Newsletter, les notifications Resend, le sitemap et les pages légales.

> Ne jamais coller une clé API, un mot de passe ou le contenu d’un fichier `.env` dans une conversation publique, un dépôt GitHub ou une capture d’écran.
