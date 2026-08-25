# Notes de génération du domaine Railway

Le 25 août 2026, le service Railway `clairdroit` est hébergé dans le projet `focused-energy`, environnement `production`, région EU West. Le service est actif avec une réplique et son dépôt source est `YvanOssey/clairdroit`, branche `main`.

La section Railway `Settings > Networking > Public Networking` affichait `Generate Domain`, `Custom Domain` et `TCP Proxy`. La génération du domaine a été lancée pour le service `clairdroit` ; l’interface affichait ensuite `Generating...`. Le service était alors `Online` avant cette opération.

Sources officielles consultées pour la procédure :
- https://docs.railway.com/guides/express
- https://docs.railway.com/databases/mysql
- https://docs.railway.com/variables
- https://help.manus.im/en/articles/11711203-how-can-i-connect-the-website-created-by-manus-to-my-custom-domain

Le domaine public a été généré avec succès : https://clairdroit-production.up.railway.app

Le 25 août 2026, l’ouverture HTTPS de cette URL a répondu avec le titre `Le sujet qui mérite un vrai détour. — ClairDroit`. Le service Railway affichait `Online`. Le test confirme le chargement de la page d’accueil ; la base MySQL, les variables secrètes et le stockage S3 restent à configurer avant de tester l’administration et les formulaires en production.
