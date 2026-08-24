# Authentification administrateur persistante

Le compte administrateur fonctionne comme un compte classique. Le secret `ADMIN_PASSWORD_YVAN` sert uniquement à initialiser le compte lorsqu’il n’existe pas encore de mot de passe haché pour `yvanossey6@gmail.com`. Après cette première initialisation, le serveur vérifie le mot de passe saisi contre le hachage conservé dans la table `users`.

Ainsi, les connexions suivantes ne dépendent plus de la variable `ADMIN_PASSWORD_YVAN`. Cette variable reste toutefois utile pour initialiser un compte vierge ou réinitialiser explicitement un compte.

## Première initialisation en local

Dans la fenêtre CMD du projet, définir la base et le secret :

```bat
set "DATABASE_URL=mysql://root@127.0.0.1:3307/blog_juridique"
set "ADMIN_PASSWORD_YVAN=VOTRE_MOT_DE_PASSE"
set NODE_ENV=development&& pnpm exec tsx watch server/_core/index.ts
```

Se connecter une première fois avec `yvanossey6@gmail.com` et la valeur choisie. Le serveur crée ensuite un hachage dans `users.passwordHash`.

## Connexions suivantes

Après l’initialisation, ouvrir la page de connexion et saisir simplement l’adresse email et le même mot de passe. Il n’est pas nécessaire de relancer une commande `set` avant chaque connexion, tant que le compte et la base de données persistent.

## Préparation de la production

Dans les secrets de l’hébergement, conserver `ADMIN_PASSWORD_YVAN` uniquement pour l’initialisation du compte de production. La base de production doit être persistante et distincte de la base XAMPP locale. Après la première connexion sur le site déployé, les connexions suivantes utilisent le hachage en base.

Ne jamais écrire le mot de passe en clair dans `server/routers.ts`, `server/_core/env.ts`, un fichier versionné ou un message partagé. Ne jamais communiquer la valeur de `ADMIN_PASSWORD_YVAN` dans le chat.

## Réinitialisation locale volontaire

Si un ancien hachage empêche la première connexion avec le nouveau mot de passe, arrêter le serveur puis exécuter dans phpMyAdmin, sur la base locale uniquement :

```sql
UPDATE users
SET passwordHash = NULL
WHERE email = 'yvanossey6@gmail.com';
```

Redémarrer ensuite avec le nouveau secret et se connecter une fois. Cette opération ne supprime ni le compte ni les articles, mais elle doit être réservée à une réinitialisation volontaire.
