# Recherche hébergement indépendant — ClairDroit

Date de consultation : 25 août 2026.

## Besoins du projet

ClairDroit utilise un serveur Node.js/Express/tRPC, une base relationnelle compatible MySQL/MariaDB, des secrets d’environnement, Resend pour les notifications et un stockage externe pour les images. La migration doit préserver les articles, les réglages, les utilisateurs administrateurs, les abonnés et les messages.

## Railway

Sources officielles : [tarification Railway](https://railway.com/pricing), [plans Railway](https://docs.railway.com/pricing/plans) et [MySQL Railway](https://docs.railway.com/databases/mysql).

Railway facture la consommation CPU, mémoire et disque à la seconde. Les plans affichés sont Free à 0 $/mois avec 1 $ de crédit d’usage mensuel, Hobby à 5 $/mois avec 5 $ de crédit d’usage, Pro à 20 $/mois avec 20 $ de crédit d’usage, puis Enterprise sur devis. Le plan Hobby convient aux projets personnels, mais il reste payant à 5 $/mois, même si la consommation reste sous le crédit inclus.

Railway propose un modèle MySQL déployable à partir de l’image officielle MySQL. Les variables de connexion internes comprennent notamment `MYSQL_URL`, `MYSQLHOST`, `MYSQLPORT`, `MYSQLUSER`, `MYSQLPASSWORD` et `MYSQLDATABASE`. La documentation indique que la base est privée par défaut et recommande d’automatiser les sauvegardes et la supervision.

## Render

Sources officielles : [Web Services Render](https://render.com/docs/web-services), [domaines personnalisés Render](https://render.com/docs/custom-domains), [plans d’espace de travail Render](https://render.com/docs/new-workspace-plans) et [Postgres Render](https://render.com/docs/postgresql-creating-connecting).

Render héberge les applications Node.js/Express via un Web Service, avec déploiement depuis GitHub, variables d’environnement, secrets, domaine `onrender.com` et domaines personnalisés. Le service doit écouter sur `0.0.0.0` et utiliser la variable `PORT`. La documentation indique un type Free à 512 Mo de RAM et 0,1 CPU, ainsi qu’un type Starter à 512 Mo et 0,5 CPU. Render propose TLS géré et renouvelé automatiquement pour les domaines personnalisés.

Render documente officiellement Postgres comme base de données gérée. Le projet actuel utilisant MySQL/MariaDB, une migration de moteur serait nécessaire ou il faudrait utiliser un MySQL externe ; cela ajoute une étape et une source de risque. Le plan Hobby de l’espace de travail est indiqué comme gratuit, avec des limites de bande passante et 2 domaines inclus selon la documentation consultée.

## Conclusion provisoire

Pour le projet actuel, Railway est techniquement plus direct car il propose un service MySQL documenté et s’accorde avec la chaîne MySQL/MariaDB existante. Render est intéressant pour le serveur Node.js et le domaine personnalisé, mais la base Render documentée est Postgres, donc une migration de schéma et de données serait à prévoir. Aucune publication ni migration ne doit être lancée avant sauvegarde complète et choix explicite de l’utilisateur.
