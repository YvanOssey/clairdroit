# Authentification locale temporaire

Cette option remplace la redirection OAuth Manus uniquement pendant le développement local. Elle est activée par `LOCAL_AUTH_ENABLED=true` et `VITE_LOCAL_AUTH_ENABLED=true`, mais le serveur la désactive toujours lorsque `NODE_ENV=production`.

## Activation

Copiez `.env.local.example` sous le nom `.env.local`, puis choisissez vos valeurs :

```env
VITE_LOCAL_AUTH_ENABLED=true
LOCAL_AUTH_ENABLED=true
LOCAL_ADMIN_EMAIL=admin@example.local
LOCAL_ADMIN_PASSWORD=changez-ce-mot-de-passe-local
JWT_SECRET=une-longue-valeur-secrete-locale
```

Le mot de passe doit rester local et ne doit jamais être ajouté à Git. Le fichier `.gitignore` exclut `.env.local`.

Sous Windows, relancez le serveur depuis le dossier du projet :

```cmd
set NODE_ENV=development&& pnpm exec tsx watch server/_core/index.ts
```

Ouvrez ensuite `http://localhost:3000/admin`. Utilisez l’email et le mot de passe configurés dans `.env.local`. La session est stockée dans le cookie de session existant et les mêmes protections `adminProcedure` continuent de s’appliquer.

## Limites

Cette solution est uniquement destinée aux tests locaux. Elle ne remplace pas l’authentification Manus pour le projet publié. Ne publiez jamais `LOCAL_ADMIN_PASSWORD`, ne partagez pas `.env.local` et désactivez les deux variables `LOCAL_*` avant un déploiement. Pour la production, utilisez l’authentification OAuth Manus ou un fournisseur d’identité dédié.
