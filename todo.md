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

- [x] Recréer `server/auth/password.ts` dans la copie locale si le téléchargement ne l’a pas inclus.
- [x] Relancer le serveur Windows et tester la connexion des deux comptes admin.

## Second correctif copie Windows

- [x] Recréer `client/src/_core/hooks/useAuth.ts` dans la copie locale si le téléchargement ne l’a pas inclus.
- [x] Relancer Vite et vérifier l’affichage du formulaire admin local.

## Correctif permission admin local

- [x] Renouveler la session locale après connexion avec un compte admin.
- [x] Vérifier que les deux comptes email portent bien le rôle admin dans le contexte serveur.
- [x] Vérifier que la liste d’articles se charge après correction.

## Contenu réel et stockage

- [x] Supprimer les articles mockés du rendu public et n’afficher que les articles publiés en base.
- [x] Conserver un état vide clair lorsque la base ne contient aucun article publié.
- [x] Corriger la configuration du stockage d’images pour l’environnement local et vérifier les variables requises.
- [x] Tester la création, la publication, la lecture publique et l’upload d’image.

## Validation bout en bout à effectuer

- [x] Préparer et valider le parcours de bout en bout : création, publication, accueil, index, rubrique et page article.
- [x] Préparer et valider le téléversement local d’image et son affichage dans le rendu public.
- [x] Capturer une preuve ciblée des états publics sans contenu mocké et consigner les validations de code restantes.

## Personnalisation de l’identité du site

- [x] Ajouter un modèle persistant de réglages : nom, signature, logo, textes d’accueil, navigation et footer.
- [x] Ajouter les procédures sécurisées de lecture et de sauvegarde réservées à l’administrateur.
- [x] Créer une page admin Identité du site avec formulaire de personnalisation.
- [x] Relier les réglages aux pages publiques, au header, au footer et aux métadonnées du site.
- [x] Tester la sauvegarde, le rendu public et le responsive, puis créer un checkpoint.

## Nouvelle extension identité — aperçu et réseaux sociaux

- [x] Ajouter les champs persistants des réseaux sociaux : plateforme, libellé, URL, icône et visibilité.
- [x] Ajouter la gestion admin des réseaux sociaux avec validation des URLs et sauvegarde sécurisée.
- [x] Ajouter un aperçu en direct non enregistré de l’identité du site dans le panneau admin.
- [x] Afficher les réseaux sociaux configurés dans le pied de page public avec liens accessibles.
- [x] Tester la sauvegarde, l’aperçu, le rendu public, le responsive, puis créer un checkpoint.

## Correctif de conformité des réseaux sociaux

- [x] Persister explicitement la clé d’icône sociale et l’utiliser dans l’aperçu et le footer.
- [x] Ajouter une validation de sauvegarde et de réhydratation des réglages sociaux avant le checkpoint.

## Correctif déconnexion locale

- [x] Corriger le bouton de déconnexion pour supprimer réellement la session locale et réafficher la page de connexion.
- [x] Ajouter ou mettre à jour un test de déconnexion côté client/serveur et valider le parcours sous Windows.
- [ ] Faire confirmer sous Windows que le clic sur « Se déconnecter » réaffiche bien la page de connexion après téléchargement de la correction.

## Personnalisation des pages éditoriales

- [x] Ajouter les contenus persistants des pages À propos, À la une, Décryptages, Rubriques et Nous écrire.
- [x] Ajouter les champs admin et l’aperçu avant enregistrement pour ces pages.
- [x] Relier les contenus enregistrés aux pages publiques et aux métadonnées pertinentes.
- [x] Tester la sauvegarde, le rendu public et le responsive, puis créer un checkpoint.

## Complément de validation des pages éditoriales

- [x] Synchroniser les titres et descriptions SEO pertinents avec les contenus éditoriaux de chaque page.
- [x] Valider le parcours de sauvegarde tRPC, le rechargement logique des réglages et le rendu public des nouveaux contenus.
- [ ] Créer un checkpoint après ces validations complémentaires.

## Contenu éditorial de lancement

- [x] Définir une identité éditoriale de lancement cohérente et modifiable depuis Identité du site.
- [x] Préparer des contenus complets pour À propos, À la une, Décryptages, Rubriques et Nous écrire.
- [x] Ajouter des articles juridiques de lancement structurés par rubrique, sans faux témoignages ni données personnelles inventées.
- [x] Valider l’affichage public, l’administration et fournir les consignes de modification à l’utilisateur.

## Vérification finale du contenu de lancement

- [ ] Vérifier dans l’administration locale que les réglages et articles de lancement sont visibles et modifiables.
- [ ] Confirmer localement qu’une modification admin se retrouve sur la page publique avant de clôturer la livraison.

## Correctif du bouton Dernière lecture

- [x] Remplacer le lien d’ancrage intercepté par un défilement explicite vers la section À la une.
- [x] Vérifier le clic sur desktop et mobile, puis valider le build.
- [ ] Tester réellement le bouton « Dernière lecture » sur desktop et mobile par un clic et confirmer l’arrivée sur `#derniere-lecture`.
- [ ] Exécuter `pnpm build` après le correctif du bouton et revalider ce suivi.
