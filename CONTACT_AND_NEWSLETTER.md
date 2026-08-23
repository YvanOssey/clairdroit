# Formulaires Contact et Newsletter

Les formulaires publics sont reliés à la base de données et aux notifications email Resend.

## Variables requises

Le serveur doit recevoir les variables suivantes :

- `RESEND_API_KEY` : clé API privée Resend autorisée à envoyer des emails.
- `EMAIL_FROM` : adresse expéditrice autorisée dans Resend.
- `CONTACT_NOTIFICATION_EMAIL` : adresse qui reçoit les messages Contact et les nouvelles inscriptions.
- `DATABASE_URL` : connexion MySQL/TiDB utilisée pour les tables du blog.

Ces valeurs doivent être configurées dans l’environnement du serveur, jamais dans le code source. En production, `EMAIL_FROM` doit correspondre à une adresse ou un domaine vérifié dans Resend.

## Fonctionnement

Un envoi depuis `Nous écrire` est validé côté serveur, enregistré dans `contactMessages`, puis transmis à l’adresse administrateur. Une inscription newsletter est normalisée, enregistrée ou réactivée dans `newsletterSubscribers`, puis transmise à la même adresse. Une adresse déjà inscrite n’est pas dupliquée.

La boîte **Administration → Messages reçus** permet de consulter les messages, de les marquer comme lus et de les archiver. Elle affiche également la liste des abonnés actifs.

## Migration

Après récupération du projet, synchroniser le schéma avec :

```bash
pnpm drizzle-kit generate
pnpm drizzle-kit migrate
```

La migration `drizzle/0007_tough_leader.sql` crée les deux tables. Sur une copie locale dont l’historique Drizzle est incomplet, appliquez les deux instructions `CREATE TABLE` de cette migration une seule fois dans phpMyAdmin, puis ne relancez pas une migration complète qui recréerait les tables.

## Test

Envoyer un message de test depuis `/contact`, puis une inscription avec une adresse email de test depuis le pied de page. Vérifier l’email reçu, puis ouvrir `/admin/inbox` pour contrôler les enregistrements. Si la base est alimentée mais qu’aucun email n’arrive, vérifier l’adresse `EMAIL_FROM`, le domaine validé dans Resend et le statut de la clé API.
