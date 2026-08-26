## Sources consultées — 26 août 2026

- Railway Scaling : https://docs.railway.com/deployments/scaling
- Railway CLI scale : https://docs.railway.com/cli/scale

Railway permet la montée en charge verticale dans les limites CPU/mémoire du plan et la montée en charge horizontale par réplicas. Dans une même région, le trafic public est distribué aléatoirement entre les réplicas ; entre plusieurs régions, Railway route vers la région la plus proche puis distribue les requêtes. Railway ne prend pas en charge les sticky sessions. La commande officielle `railway scale` accepte des affectations par région et documente un maximum de 50 réplicas au total.

Implication pour ClairDroit : l’application est principalement stateless côté serveur, les sessions sont dans des cookies signés et les données sont dans MySQL ; elle est donc compatible avec plusieurs réplicas. Le principal goulot d’étranglement à surveiller est MySQL, suivi du temps des requêtes publiques et du cache. Les images servies par R2 ne consomment pas le CPU du serveur applicatif pour chaque téléchargement.
## Test de charge léger — 26 août 2026

Test non destructif effectué sur l’URL publique Railway avec 10 requêtes simultanées par page, sur 3 pages, soit 30 requêtes au total. Résultats : accueil 10/10 réponses HTTP 200, moyenne 7,308 s, maximum 11,210 s ; Actualité juridique 10/10 HTTP 200, moyenne 6,131 s, maximum 7,246 s ; Contact 10/10 HTTP 200, moyenne 8,420 s, maximum 9,924 s.

Interprétation : aucune erreur HTTP n’est apparue, mais les temps mesurés sont élevés. Le test a été lancé avant le déploiement de l’optimisation React Query et mesure aussi le démarrage à froid, les appels API côté navigateur et la distance réseau. Il ne constitue pas une capacité maximale. Avant une campagne plus importante, examiner les métriques Railway, le temps des appels `/api/trpc` et la région du service.
## Test post-déploiement — 26 août 2026

Après publication de l’optimisation du cache, un test léger identique a été réalisé avec 10 requêtes simultanées par page sur l’accueil, Actualité juridique et Contact. Résultats : accueil 10/10 HTTP 200, moyenne 6,752 s, maximum 8,711 s ; Actualité juridique 10/10 HTTP 200, moyenne 8,118 s, maximum 13,235 s ; Contact 10/10 HTTP 200, moyenne 8,103 s, maximum 10,400 s.

Les 30 requêtes ont toutes répondu HTTP 200. Les temps restent élevés et semblent inclure le démarrage à froid, la distance réseau et le chargement de l’application ; ils ne permettent pas d’annoncer une capacité maximale. Pour un trafic élevé, consulter les métriques Railway avant d’augmenter les réplicas, puis dimensionner MySQL et le service Node ensemble.
## Observabilité Railway — 26 août 2026

Sources officielles : https://docs.railway.com/observability et https://docs.railway.com/deployments/healthchecks.

Le tableau Observability Railway propose des widgets CPU, mémoire, réseau, disque, logs et consommation du projet. Des monitors avec alertes email, in-app ou webhook peuvent être ajoutés aux widgets, mais la documentation indique que les monitors nécessitent le plan Pro. Les healthchecks servent à valider un nouveau déploiement avant bascule vers celui-ci ; Railway précise qu’ils ne surveillent pas continuellement le service après son activation. Un endpoint `/health` peut donc améliorer les déploiements, mais ne remplace pas un monitoring continu.
