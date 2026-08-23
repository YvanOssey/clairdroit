# Authentification administrateur

L’administration utilise désormais une connexion réelle par email et mot de passe. Deux adresses sont autorisées : `yvanossey6@gmail.com` et `thiocorinne@gmail.com`.

Les deux mots de passe sont fournis par les secrets `ADMIN_PASSWORD_YVAN` et `ADMIN_PASSWORD_THIO`. Ils ne sont jamais écrits dans le code. Lors de la première connexion, le mot de passe est transformé en hash scrypt avant d’être enregistré dans la base. Les connexions suivantes vérifient uniquement ce hash.

La session est signée avec `JWT_SECRET` et stockée dans le cookie de session sécurisé. Les procédures d’articles continuent d’utiliser `adminProcedure`, donc un utilisateur non administrateur ne peut pas créer, modifier, publier ou archiver un article.

Ouvrez `/admin`, saisissez l’un des deux emails et son mot de passe, puis cliquez sur **Se connecter**. Le système conserve l’utilisateur connecté jusqu’à sa déconnexion ou l’expiration de la session.

Les secrets doivent être configurés dans l’environnement du projet, jamais dans un fichier versionné ou dans le code source. Pour la production, configurez les deux secrets `ADMIN_PASSWORD_YVAN` et `ADMIN_PASSWORD_THIO`.
