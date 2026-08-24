# Publication indépendante de ClairDroit

## État actuel

ClairDroit est une application full-stack React, Vite, Express, tRPC, Drizzle et MySQL. L’authentification email/mot de passe et les notifications Resend sont portables. En revanche, le téléversement du logo et des images d’articles utilise encore le stockage Manus et les URLs `/manus-storage/...`. Une publication totalement indépendante doit donc remplacer ce stockage avant la mise en production.

## Architecture recommandée

- Application Node/Express : Railway ou un autre hébergeur Node compatible.
- Base de données : MySQL managé, avec `DATABASE_URL` fourni au serveur.
- Emails : Resend avec `RESEND_API_KEY`, `EMAIL_FROM` et `CONTACT_NOTIFICATION_EMAIL`.
- Images : Cloudinary, Amazon S3 ou stockage compatible S3.
- Code : dépôt GitHub privé, sans fichiers `.env` ni secrets.

## Commandes de build

```text
Build Command : pnpm install --frozen-lockfile && pnpm build
Start Command : pnpm start
```

Le serveur doit utiliser la variable `PORT` fournie par l’hébergeur et ne doit pas imposer le port local `3000` en production.

## Variables de production

```text
DATABASE_URL=URL_MYSQL_DE_PRODUCTION
JWT_SECRET=SECRET_LONG_ALEATOIRE
ADMIN_PASSWORD_YVAN=MOT_DE_PASSE_ADMIN
ADMIN_PASSWORD_THIO=MOT_DE_PASSE_SECOND_ADMIN
RESEND_API_KEY=CLE_RESEND
EMAIL_FROM=ClairDroit <adresse-verifiee@votre-domaine.fr>
CONTACT_NOTIFICATION_EMAIL=adresse-de-reception@example.com
```

Les données de XAMPP ne sont pas transférées automatiquement vers la base de production. Les migrations doivent être appliquées à la base de production, puis les articles et réglages doivent être importés ou recréés.

## Blocage avant publication

La migration du stockage d’images n’est pas encore réalisée. Tant que cette étape n’est pas terminée, la publication indépendante peut fonctionner pour les pages, les articles existants, l’authentification et Resend, mais le téléversement de nouveaux logos ou médias peut échouer. Aucun déploiement indépendant ne doit être considéré comme terminé avant le remplacement de `storagePut` et la vérification des URLs d’images.
