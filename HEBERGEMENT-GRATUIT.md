# ClairDroit — remise en ligne gratuite

La période d’essai Railway a expiré : le domaine `clairdroit-production.up.railway.app` ne pointe plus vers aucune
application. Ce guide remet ClairDroit en ligne **sans abonnement**, avec :

| Brique | Service | Ce qui change |
|---|---|---|
| Application (React + Express + tRPC) | **Render**, offre gratuite | Nouveau : `render.yaml` à la racine du dépôt |
| Base MySQL | **TiDB Cloud Serverless** (compatible MySQL) | Nouvelle base, mêmes tables |
| Images | Cloudflare R2 | Rien : mêmes variables qu’avant |
| E-mails | Resend | Rien : mêmes variables qu’avant |

> Les offres gratuites évoluent : vérifier leurs conditions au moment de l’inscription.
> Ne jamais coller une clé, un mot de passe ou une `DATABASE_URL` dans GitHub, une conversation ou une capture.

## À savoir sur l’offre gratuite de Render

L’application **se met en veille** après une période sans visite. La visite suivante la réveille : la première page
peut alors mettre **30 secondes à une minute** à s’afficher, puis tout redevient normal.

---

## Étape 0 — Récupérer les données de Railway (si elles existent encore)

Les articles, réglages, messages et abonnés sont dans la base MySQL de Railway, **pas sur GitHub**.

1. Se connecter sur railway.app et ouvrir le projet `focused-energy`.
2. Si le service **MySQL** est encore là : onglet *Data* ou *Connect*, noter l’URL de connexion **publique**.
3. Exporter la base (sur un ordinateur où `mysqldump` est installé) :

   ```bash
   mysqldump --single-transaction --no-tablespaces -h HOTE -P PORT -u UTILISATEUR -p NOM_BASE > clairdroit-sauvegarde.sql
   ```

4. Garder ce fichier en lieu sûr, **hors du dépôt**.

Si Railway ne donne plus accès à la base, les tables seront recréées vides (étape 1) et il faudra republier les
articles depuis l’administration. Les images restent disponibles sur R2.

## Étape 1 — Créer la base TiDB Serverless

1. Créer un compte sur tidbcloud.com, puis un cluster **Serverless**, région **Frankfurt** (proche de Render Frankfurt).
2. Créer une base nommée `clairdroit`.
3. Dans *Connect*, choisir le pilote **mysql2 / Node.js** et générer un mot de passe. L’adresse a cette forme :

   ```text
   mysql://UTILISATEUR:MOTDEPASSE@HOTE:4000/clairdroit?ssl={"rejectUnauthorized":true}
   ```

   Le paramètre `ssl` est obligatoire chez TiDB ; le code n’a pas besoin de changer, `mysql2` le lit dans l’adresse.
4. Créer les tables : ouvrir l’éditeur SQL de TiDB, coller le contenu de `drizzle/railway-init.sql`, exécuter.
   Le script ne crée que les tables manquantes et ne contient aucune donnée.
5. Si une sauvegarde existe (étape 0), l’importer ensuite :

   ```bash
   mysql -h HOTE -P 4000 -u UTILISATEUR -p --ssl-mode=VERIFY_IDENTITY clairdroit < clairdroit-sauvegarde.sql
   ```

## Étape 2 — Déployer sur Render

1. Créer un compte sur render.com en se connectant avec GitHub.
2. *New* → *Blueprint* → choisir le dépôt `YvanOssey/clairdroit`. Render lit `render.yaml`.
3. Renseigner les valeurs demandées (celles marquées `sync: false`) :

   | Variable | Valeur |
   |---|---|
   | `DATABASE_URL` | l’adresse TiDB de l’étape 1 |
   | `ADMIN_PASSWORD_YVAN`, `ADMIN_PASSWORD_THIO` | les mots de passe administrateur |
   | `RESEND_API_KEY`, `EMAIL_FROM`, `CONTACT_NOTIFICATION_EMAIL` | comme sur Railway |
   | `S3_ENDPOINT`, `S3_BUCKET`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `S3_PUBLIC_URL` | Cloudflare R2, comme sur Railway |

   `JWT_SECRET` est généré automatiquement par Render : les administratrices devront simplement se reconnecter une fois.
4. Lancer le déploiement. Render installe, compile (`pnpm build`), démarre (`pnpm start`) et vérifie `/healthz`.

## Étape 3 — Vérifier

- `https://<nom>.onrender.com/healthz` répond `ok`.
- La page d’accueil s’affiche, avec le logo et les images.
- Connexion à l’administration, création d’un brouillon, publication d’un article.
- Formulaires Contact et Newsletter : l’e-mail de notification arrive.

## Étape 4 — Après la remise en ligne

- Mettre la nouvelle adresse dans le portfolio (projet ClairDroit : statut « En ligne », bouton « Voir le site »).
- Prévenir Corinne de la nouvelle adresse, et que la première page peut être lente après une période calme.

---

### Modifications de code faites pour Render

- `server/_core/index.ts` : en production, le serveur écoute **exactement** le port fourni par l’hébergeur
  (avant, il cherchait un autre port si celui-ci était occupé, ce qui empêchait Render de router le trafic) ;
  ajout d’un point de santé `GET /healthz` qui répond sans interroger la base.
- `render.yaml` : description du service (build, démarrage, santé, variables sans aucun secret).

Vérifié : `pnpm check` passe, `pnpm build` passe, le serveur compilé répond sur `/healthz` et `/`.
Sur `pnpm test`, 49 tests passent ; les 2 échecs restants (`auth.local`, `site-settings.save`) existaient déjà avant
ces modifications et demandent une vraie base de données pour s’exécuter.
