# Sauvegardes MySQL Railway de ClairDroit

## Recommandation

ClairDroit utilise les sauvegardes natives du volume MySQL Railway. Cette solution ne dépend pas du navigateur ni d’un processus Node actif dans l’application. Railway permet de planifier des sauvegardes quotidiennes, hebdomadaires et mensuelles ; les rétentions documentées sont respectivement de 6 jours, 1 mois et 3 mois.

Les sauvegardes sont incrémentales et peuvent générer un coût selon le volume de données supplémentaire conservé. Elles protègent le volume MySQL, mais ne remplacent pas une copie indépendante vers R2. L’effacement du volume efface aussi ses sauvegardes.

## Activation

1. Ouvrir le projet Railway **ClairDroit**.
2. Ouvrir le service **MySQL**.
3. Ouvrir l’onglet **Backups** du volume attaché.
4. Activer au minimum **Daily** et **Monthly**.
5. Vérifier que les prochaines échéances et les rétentions sont affichées.
6. Créer une sauvegarde manuelle après une étape importante, par exemple avant une migration de schéma.

Pour limiter les coûts au début, l’option minimale est **Weekly + Monthly**. Pour un blog avec des inscriptions et des formulaires actifs, **Daily + Monthly** offre une protection plus régulière.

## Restauration

Dans l’onglet **Backups**, sélectionner une date antérieure à l’incident, cliquer sur **Restore**, examiner le changement proposé, puis confirmer le déploiement seulement après vérification. La restauration se fait dans le même projet et le même environnement. Elle peut supprimer les sauvegardes plus récentes que le point restauré ; il faut donc choisir la date avec soin.

## Vérification périodique

Une fois par mois, vérifier qu’une nouvelle sauvegarde existe et noter sa date. Une restauration de test complète peut être planifiée séparément dans un environnement de staging lorsque le projet aura besoin d’une procédure de reprise plus avancée.

## Références

- [Documentation Railway MySQL](https://docs.railway.com/databases/mysql)
- [Documentation Railway Backups](https://docs.railway.com/volumes/backups)
