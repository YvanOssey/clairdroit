# Recherche sauvegardes Railway — 26 août 2026

## Sources officielles

- MySQL Railway : https://docs.railway.com/databases/mysql
- Sauvegardes de volumes Railway : https://docs.railway.com/volumes/backups
- Cloudflare R2 S3 API : https://developers.cloudflare.com/r2/api/s3/api/

## Faits vérifiés

La documentation Railway recommande les sauvegardes régulières pour les environnements de production et renvoie vers la fonctionnalité native de sauvegarde des volumes.

Les sauvegardes Railway couvrent le contenu des volumes, y compris les bases de données Railway. Elles peuvent être créées manuellement ou planifiées. Les fréquences disponibles sont quotidienne, hebdomadaire et mensuelle. La rétention documentée est de 6 jours pour le quotidien, 1 mois pour l’hebdomadaire et 3 mois pour le mensuel.

La restauration se fait depuis l’onglet Backups du service attaché. Railway prépare un changement à examiner, puis le déploiement doit être confirmé. Une restauration peut supprimer les sauvegardes plus récentes que le point restauré. Les sauvegardes sont incrémentales et facturées selon le stockage additionnel ; les sauvegardes manuelles ont une limite de 50 % de la capacité du volume. Les sauvegardes ne peuvent être restaurées que dans le même projet et le même environnement, et l’effacement du volume efface ses sauvegardes.

## Décision proposée

Pour ClairDroit, commencer par les sauvegardes natives Railway : elles nécessitent moins de maintenance et conviennent au stade actuel. Activer au minimum une fréquence quotidienne et une fréquence mensuelle sur le volume MySQL. Une copie SQL indépendante vers Cloudflare R2 pourra être ajoutée plus tard si une séparation complète de Railway ou une rétention personnalisée devient nécessaire.
