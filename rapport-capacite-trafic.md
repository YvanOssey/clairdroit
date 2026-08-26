# Capacité et trafic simultané — ClairDroit

## Conclusion opérationnelle

ClairDroit est une application Node stateless côté serveur : les sessions sont signées dans des cookies, les données sont stockées dans MySQL et les images sont servies depuis Cloudflare R2. Cette architecture permet d’ajouter des réplicas sans dépendre d’un état conservé en mémoire.

Elle est adaptée à un trafic éditorial normal et à plusieurs visiteurs simultanés. Il n’est pas honnête de promettre un nombre fixe de visiteurs sans connaître le plan Railway, le volume de requêtes, la taille des articles, la fréquence des formulaires et la capacité effective de MySQL.

## Optimisations appliquées

Le client utilise désormais un cache React Query partagé avec 30 secondes de fraîcheur, 10 minutes de conservation, une seule nouvelle tentative pour les requêtes et aucune répétition automatique au changement d’onglet. Les mutations ne sont pas rejouées automatiquement afin d’éviter les doublons sur les formulaires ou l’administration.

Les listes publiques continuent de filtrer les articles publiés et les images sont chargées depuis R2. Les opérations admin restent protégées et la corbeille empêche une suppression immédiate accidentelle.

## Limites et montée en charge Railway

Railway prend en charge la montée verticale jusqu’aux limites CPU et mémoire du plan. La montée horizontale se fait en ajoutant des réplicas ; le trafic est alors distribué entre les instances. Railway ne fournit pas de sticky sessions, ce qui ne pose pas de problème pour ClairDroit puisque l’état de session est dans un cookie signé. La documentation Railway indique un maximum de 50 réplicas au total avec la commande de mise à l’échelle [1] [2].

Le premier point à surveiller est MySQL : nombre de connexions, temps des requêtes et taille des listes retournées. Le second est le coût et la limite du plan Railway. R2 réduit la charge du serveur applicatif pour les téléchargements d’images, mais ne remplace pas une politique de cache navigateur ou CDN.

## Seuils pratiques de surveillance

| Signal | Action recommandée |
|---|---|
| Temps de réponse public régulièrement supérieur à 1 seconde | Examiner les requêtes et les métriques avant d’ajouter des réplicas. |
| Erreurs HTTP 5xx ou erreurs de connexion MySQL | Réduire les appels répétés, vérifier le pool et augmenter les ressources si nécessaire. |
| CPU ou mémoire durablement élevés | Augmenter les ressources verticales, puis envisager plusieurs réplicas. |
| Trafic concentré dans plusieurs régions | Ajouter des réplicas dans les régions utiles après observation des métriques. |
| Dépenses Railway en hausse | Fixer un budget et vérifier les métriques avant toute nouvelle montée en charge. |

## Procédure recommandée

Commencer avec l’Autoscale actuel et observer les métriques réelles. Si le trafic augmente, augmenter d’abord les ressources du service Node, puis ajouter un second replica lorsque le service et MySQL ont été observés sous charge. Ne pas multiplier les réplicas tant que le goulot d’étranglement est la base de données.

Un test de charge doit rester progressif et autorisé : par exemple 10 requêtes simultanées sur la page d’accueil et l’index, puis 25, en surveillant les réponses et les métriques. Il ne faut pas tester avec des suppressions, des inscriptions massives ou des soumissions répétées de formulaires.

## Références

[1]: https://docs.railway.com/deployments/scaling "Railway — Scaling"
[2]: https://docs.railway.com/cli/scale "Railway CLI — scale"
