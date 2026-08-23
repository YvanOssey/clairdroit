# Extension administration éditoriale

## À faire

- [x] Ajouter le backend, la base de données et la gestion des utilisateurs.
- [x] Définir le modèle des articles : titre, slug, résumé, contenu, rubrique, auteur, image, statut, dates de publication et de mise à jour.
- [x] Créer les opérations sécurisées de création, lecture, modification, publication et archivage.
- [x] Construire la page de connexion et le panneau d’administration privé.
- [x] Ajouter l’éditeur d’article avec sauvegarde en brouillon et publication explicite.
- [x] Relier la page publique et la recherche aux articles administrés.
- [x] Vérifier les permissions, les états d’erreur, la validation et le responsive.
- [x] Effectuer le build, le test visuel et créer le checkpoint livrable.

## Compléments de validation

- [x] Brancher la recherche globale du site sur les articles publiés venant de l’administration et vérifier le parcours de recherche.
- [x] Tester et corriger l’administration en mobile et vérifier explicitement les états d’erreur des requêtes et mutations critiques.
- [x] Créer un checkpoint livrable après les validations finales de l’interface d’administration.

## Preuves complémentaires

- [x] Extraire la logique de recherche globale dans une fonction testable et couvrir les résultats d’articles publiés.
- [x] Afficher explicitement les erreurs de chargement dans les écrans d’administration et dans l’éditeur.
- [x] Refaire le checkpoint après ces validations complémentaires.

## Nouvelle extension éditeur

- [x] Ajouter méta-titre et méta-description au modèle des articles et à la migration.
- [x] Ajouter l’upload sécurisé d’images vers le stockage du projet et l’insertion d’URL dans le contenu.
- [x] Ajouter un mode aperçu fidèle dans l’éditeur sans publication.
- [x] Afficher les métadonnées SEO et les images dans le rendu public.
- [x] Ajouter les tests, vérifier le responsive et créer un nouveau checkpoint.

## Correctifs finaux

- [x] Afficher réellement les images Markdown insérées dans le contenu des articles administrés sur la page publique.
- [x] Vérifier l’éditeur enrichi en mobile après l’ajout de l’aperçu, de l’upload et du SEO.
- [x] Créer le checkpoint livrable final après ces validations.

## Authentification locale temporaire

- [x] Ajouter un mode de connexion local activable uniquement en développement.
- [x] Ajouter les variables locales d’identification sans les versionner.
- [x] Créer la session locale et l’endpoint de connexion/déconnexion.
- [x] Relier la session locale au contrôle administrateur sans modifier l’authentification Manus en production.
- [x] Ajouter les tests de refus, de connexion et de protection de route.
- [x] Documenter l’activation locale et vérifier le build.

## Compléments de sécurité locale

- [x] Vérifier que `.env.local` est explicitement ignoré par Git.
- [x] Ajouter un test de connexion locale réussie avec création du cookie et accès admin.
- [x] Documenter clairement l’activation, l’usage strictement local et la désactivation en production.

## Authentification production par email

- [x] Remplacer le mode local temporaire par une authentification de production.
- [x] Permettre deux comptes administrateur : yvanossey6@gmail.com et thiocorinne@gmail.com.
- [x] Ajouter le stockage de mots de passe hachés et la gestion des sessions.
- [x] Ajouter la connexion, la déconnexion et la protection des routes admin.
- [x] Demander les deux mots de passe via la configuration sécurisée, sans les écrire dans le code.
- [x] Tester les succès, les refus et le build avant le checkpoint.

## Nettoyage de l’ancien mode local

- [x] Supprimer les variables et branches `LOCAL_*` devenues obsolètes.
- [x] Mettre à jour les exemples et la documentation pour ne conserver que l’authentification email de production.

## Dernier contrôle documentaire

- [x] Retirer les derniers noms de variables de l’ancien mode local dans ADMIN_AUTH.md.
- [x] Vérifier par recherche textuelle qu’aucune référence à l’ancien mode ne subsiste hors des dépendances et du build.

## Correctif copie Windows

- [ ] Recréer `server/auth/password.ts` dans la copie locale si le téléchargement ne l’a pas inclus.
- [ ] Relancer le serveur Windows et tester la connexion des deux comptes admin.

## Second correctif copie Windows

- [ ] Recréer `client/src/_core/hooks/useAuth.ts` dans la copie locale si le téléchargement ne l’a pas inclus.
- [ ] Relancer Vite et vérifier l’affichage du formulaire admin local.

## Correctif permission admin local

- [ ] Renouveler la session locale après connexion avec un compte admin.
- [ ] Vérifier que les deux comptes email portent bien le rôle admin dans le contexte serveur.
- [ ] Vérifier que la liste d’articles se charge après correction.

## Contenu réel et stockage

- [x] Supprimer les articles mockés du rendu public et n’afficher que les articles publiés en base.
- [x] Conserver un état vide clair lorsque la base ne contient aucun article publié.
- [x] Corriger la configuration du stockage d’images pour l’environnement local et vérifier les variables requises.
- [x] Tester la création, la publication, la lecture publique et l’upload d’image.

## Validation bout en bout à effectuer

- [ ] Effectuer un test de bout en bout : créer un article admin, le publier, vérifier son apparition sur l’accueil, l’index, la rubrique et la page article.
- [ ] Tester explicitement le téléversement d’une image avec la configuration locale corrigée et vérifier son affichage dans l’article public.
- [ ] Capturer ou consigner une preuve ciblée du parcours publication, lecture publique et upload après les derniers correctifs.
