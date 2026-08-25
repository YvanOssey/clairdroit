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
- [x] Faire confirmer sous Windows que le clic sur « Se déconnecter » réaffiche bien la page de connexion après téléchargement de la correction.

## Personnalisation des pages éditoriales

- [x] Ajouter les contenus persistants des pages À propos, À la une, Décryptages, Rubriques et Nous écrire.
- [x] Ajouter les champs admin et l’aperçu avant enregistrement pour ces pages.
- [x] Relier les contenus enregistrés aux pages publiques et aux métadonnées pertinentes.
- [x] Tester la sauvegarde, le rendu public et le responsive, puis créer un checkpoint.

## Complément de validation des pages éditoriales

- [x] Synchroniser les titres et descriptions SEO pertinents avec les contenus éditoriaux de chaque page.
- [x] Valider le parcours de sauvegarde tRPC, le rechargement logique des réglages et le rendu public des nouveaux contenus.
- [x] Créer un checkpoint après ces validations complémentaires.

## Contenu éditorial de lancement

- [x] Définir une identité éditoriale de lancement cohérente et modifiable depuis Identité du site.
- [x] Préparer des contenus complets pour À propos, À la une, Décryptages, Rubriques et Nous écrire.
- [x] Ajouter des articles juridiques de lancement structurés par rubrique, sans faux témoignages ni données personnelles inventées.
- [x] Valider l’affichage public, l’administration et fournir les consignes de modification à l’utilisateur.

## Vérification finale du contenu de lancement

- [x] Couvrir la vérification locale des réglages et articles de lancement par le parcours de test fourni à l’utilisateur.
- [x] Fournir le parcours de confirmation locale d’une modification admin sur la page publique.

## Correctif du bouton Dernière lecture

- [x] Remplacer le lien d’ancrage intercepté par un défilement explicite vers la section À la une.
- [x] Vérifier le clic sur desktop et mobile, puis valider le build.
- [x] Valider l’implémentation de l’ancrage « Dernière lecture » par vérification visuelle et fournir le test de clic local desktop/mobile.
- [x] Exécuter `pnpm build` après le correctif du bouton et revalider ce suivi.

## Formulaires Contact et Newsletter réels

- [x] Ajouter les tables `contactMessages` et `newsletterSubscribers`.
- [x] Ajouter les procédures publiques de soumission et les procédures admin de consultation.
- [x] Ajouter l’envoi sécurisé de notifications email à l’adresse administrateur configurée.
- [x] Brancher les formulaires publics avec états de chargement, succès et erreur.
- [x] Ajouter les tests, la documentation des secrets et valider le build.

## Livraison manuelle Contact, Newsletter et Resend

- [x] Fournir les fichiers complets modifiés pour la copie Windows.
- [x] Fournir le script SQL local et la notice de configuration Resend.
- [x] Enregistrer un checkpoint correspondant à cette intégration.

## Authentification persistante — demande utilisateur

- [x] Rendre la création et la connexion du compte administrateur persistantes après la première initialisation, en local comme en production.
- [x] Vérifier que les sessions administrateur restent valides et que la déconnexion fonctionne.
- [x] Ajouter les tests de connexion persistante et documenter la configuration locale et production.

## Correctif scanner — pollution de prototype

- [x] Remplacer la map dynamique des mots de passe administrateurs par une structure explicitement sûre et limitée aux emails autorisés.
- [x] Ajouter un test de régression contre les clés non autorisées et relancer les tests d’authentification.

## Diagnostic connexion locale

- [x] Vérifier l’état du compte `yvanossey6@gmail.com` dans la base locale sans révéler de secret.
- [x] Réinitialiser proprement le hachage local si l’ancien mot de passe est encore enregistré.
- [x] Valider la connexion réelle après redémarrage du serveur.

## Correctif session locale JWT

- [x] Définir un `JWT_SECRET` local non vide dans la fenêtre Windows avant le démarrage.
- [x] Valider la création du cookie de session et la connexion admin après redémarrage.

## Publication hors Manus

- [x] Évaluer les dépendances Manus du projet avant une publication chez un fournisseur tiers.
- [x] Choisir une architecture indépendante pour le serveur Node, MySQL, les secrets, Resend et le stockage d’images.
- [x] Préparer le build et la configuration du fournisseur choisi.
- [x] Différer le test sur une URL publique indépendante : l’hébergement hors Manus est volontairement reporté.

## Mise à jour éditoriale ClairDroit

- [x] Remplacer le nom du site par `ClairDroit`.
- [x] Remplacer la signature courte par `Le droit clair pour tous !`.
- [x] Remplacer la signature de la page À la une par `ClairDroit · Le droit clair pour tous`.
- [x] Remplacer le titre d’accueil par `Bienvenue à toi lecteur !`.
- [x] Remplacer la description d’accueil par le texte fourni par l’utilisateur.

## Nouvelle identité éditoriale et page À propos

- [x] Remplacer la description du footer par le texte éditorial fourni.
- [x] Remplacer les libellés de navigation par les intitulés demandés.
- [x] Remplacer le titre et la description de la newsletter.
- [x] Recentrer la page À propos sur « À propos de moi » avec un texte personnel et une photo à côté.
- [x] Supprimer la citation et la section « Notre méthode » de la page À propos.
- [x] Obtenir ou intégrer une photo personnelle fournie par l’utilisateur.

## Correctif erreur tRPC — page À propos

- [x] Identifier pourquoi la requête tRPC reçoit `index.html` au lieu du JSON.
- [x] Corriger la route ou la configuration du client/proxy tRPC.
- [x] Vérifier la page `/a-propos` et ajouter une validation de régression.

## Renforcement du correctif tRPC

- [x] Reproduire et tracer la réponse HTML éventuelle sur `/api/trpc`.
- [x] Vérifier explicitement le fallback Vite et le chemin API tRPC.
- [x] Ajouter une validation reproductible confirmant que `site.settings` renvoie du JSON.

## Pages de navigation distinctes et biographie finale

- [x] Créer une page Accueil dédiée au contenu fourni.
- [x] Créer une page Actualité juridique avec son propre contenu.
- [x] Créer une page Articles juridiques vulgarisés avec son propre contenu.
- [x] Créer une page Analyses juridiques avec son propre contenu.
- [x] Créer une page Tips carrières juridiques avec son propre contenu.
- [x] Créer une page À propos de moi avec la biographie fournie et le portrait.
- [x] Supprimer les anciens blocs de contenu réutilisés entre les pages de navigation.

## Corrections de cohérence des pages

- [x] Refondez explicitement `client/src/pages/Home.tsx` pour en faire une page d’accueil dédiée au contenu fourni.
- [x] Décider et appliquer le remplacement ou maintien des anciennes routes `/articles` et `/rubriques/:category` afin d’éviter des pages publiques incohérentes avec les nouvelles navigations.
- [x] Ajouter une validation de régression sur les nouveaux chemins publics après ces corrections.

## Publication éditoriale exclusive

- [x] Ajouter un type de publication persistant limité à quatre valeurs : actualité, vulgarisation, analyses ou carrières.
- [x] Ajouter le champ Page de publication dans l’éditeur admin et dans les validations serveur.
- [x] Filtrer exclusivement les quatre pages éditoriales selon le type choisi.
- [x] Préserver les articles existants avec une migration de compatibilité.
- [x] Tester la création, la publication, la lecture et la séparation des quatre sélections.

## Renforcement de la publication exclusive

- [x] Ajouter un test d’intégration vérifiant que `editorialSection` est persisté lors du create/update et renvoyé par les procédures publiques et admin.
- [x] Ajouter une validation bout en bout des quatre sections avec une publication par section et vérifier l’absence de mélange.
- [x] Vérifier et documenter les liens de lecture et de retour vers la bonne section éditoriale.

## Renforcement des preuves éditoriales

- [x] Ajouter un test d’intégration isolé couvrant create/update puis published, bySlug, adminList et adminById avec `editorialSection`.
- [x] Ajouter une vérification de séparation des quatre sections avec un article attribué à chaque section, sans utiliser de données de production.
- [x] Ajouter une preuve documentée des liens de lecture et de retour depuis chaque section éditoriale.

## Suppression du bloc Rubriques

- [x] Supprimer le bloc public « Rubrique — Le droit en pratique » et ses catégories.
- [x] Retirer le formulaire admin correspondant dans « Identité du site ».
- [x] Remplacer ce bloc admin par les quatre pages éditoriales de navigation.
- [x] Vérifier les routes, le rendu public, l’administration et le build.

## Complément de suppression Rubriques

- [x] Ajouter dans l’identité du site un bloc explicite « Pages éditoriales » avec les quatre liens de navigation.
- [x] Nettoyer ou justifier les références restantes à `rubrics`, `/rubriques` et aux anciennes catégories hors éditeur d’articles.

## Nettoyage final des anciennes catégories

- [x] Remplacer le filtrage public par anciennes catégories par un filtrage selon les quatre pages éditoriales.
- [x] Documenter et neutraliser l’ancien bloc de données `rubrics` sans supprimer les colonnes historiques de la base.

## Suppression du champ Rubrique dans l’éditeur

- [x] Supprimer le bloc « Références » et le champ « Rubrique » de l’éditeur d’article.
- [x] Conserver et clarifier uniquement le choix de la page éditoriale parmi les quatre destinations.
- [x] Vérifier le typage, les tests, le rendu admin et le build.

## Téléchargement local de l’image de couverture

- [x] Ajouter un bouton de sélection d’image locale dans l’éditeur d’article.
- [x] Téléverser la couverture via la procédure de stockage existante et remplir automatiquement le champ enregistré.
- [x] Ajouter les états de chargement, erreur, validation de format/taille et aperçu de couverture.
- [x] Vérifier le typage, les tests, le rendu admin et le build.

## Correctif logo après publication

- [x] Vérifier la source du logo dans l’aperçu publié actuel : le logo ClairDroit est visible.
- [x] Conserver la référence et le téléversement du logo actuellement fonctionnels dans l’aperçu admin et public.
- [x] Vérifier le rendu de l’aperçu public et le build de production avant le checkpoint.

## Changement d’adresse admin

- [x] Remplacer l’adresse administrateur secondaire par `corinnethio52@gmail.com` dans la liste blanche et la configuration.
- [x] Préserver le mot de passe existant et migrer le compte persistant sans créer de doublon non autorisé.
- [x] Tester la nouvelle adresse, refuser l’ancienne et valider le build avant checkpoint.

## Correctif formulaires HTML au lieu de JSON

- [x] Reproduire et identifier la route qui renvoie `index.html` pour Newsletter et Contact.
- [x] Corriger le routage API afin que les mutations tRPC renvoient toujours du JSON.
- [x] Ajouter les tests de régression des deux mutations et valider le rendu publié.

## Correctif boîte Messages reçus

- [x] Identifier la requête exacte de la boîte admin qui reçoit encore `index.html`.
- [x] Corriger le client ou le montage de cette requête sans perturber l’enregistrement des formulaires.
- [x] Ajouter un test de régression pour le chargement des messages et valider le parcours complet.

## Notifications email Resend non reçues

- [x] Vérifier la configuration Resend effective et les journaux d’envoi en production.
- [x] Corriger l’expéditeur ou le destinataire afin que les notifications soient effectivement distribuées.
- [x] Tester un envoi contrôlé et les notifications Contact/Newsletter avant checkpoint.

## Emails brandés ClairDroit

- [x] Remplacer les anciennes mentions « Droit de regard » par « ClairDroit » dans les notifications.
- [x] Afficher « ClairDroit » comme nom d’expéditeur avec l’adresse Resend autorisée.
- [x] Ajouter le logo du site et une mise en page HTML responsive aux emails Contact et Newsletter.
- [x] Tester le rendu, l’envoi contrôlé, la version texte et le build avant checkpoint.

## Pages de conformité du site

- [x] Ajouter les pages publiques Mentions légales et Politique de confidentialité avec un contenu de travail clairement signalé à vérifier.
- [x] Ajouter leurs routes, liens dans le footer et métadonnées dédiées.
- [x] Vérifier le rendu desktop/mobile et demander les informations personnelles nécessaires pour finaliser les textes.

## Correctif accessibilité pages de conformité

- [x] Éviter l’imbrication de balises `main` dans les pages Mentions légales et Politique de confidentialité.
- [x] Revalider le typage et le build après correction.

## Coordonnées réelles de Nous écrire

- [x] Remplacer l’ancienne adresse email et l’ancienne localisation par les coordonnées confirmées.
- [x] Persister les nouvelles valeurs dans les réglages du site et les valeurs par défaut.
- [x] Vérifier la page publique, le lien mailto et le build avant checkpoint.

## Édition admin des pages de conformité

- [x] Ajouter les contenus persistants des pages Mentions légales et Politique de confidentialité.
- [x] Ajouter leurs champs éditables et un aperçu direct dans Identité du site.
- [x] Brancher les pages publiques sur les contenus sauvegardés et tester le build.

## Recherche visible et nettoyage À propos

- [x] Ajouter une recherche d’articles visible, accessible et fonctionnelle sur les articles publiés.
- [x] Supprimer le bloc de présentation mis en évidence sur la page À propos de moi.
- [x] Vérifier les résultats, les quatre sections éditoriales, le responsive et le build.

## Suppression définitive du bloc À propos

- [x] Retirer le texte de présentation et son conteneur décoratif de l’en-tête À propos de moi.
- [x] Vérifier que le titre, la biographie, la photo et le responsive restent corrects.

## Recherche globale et SEO renforcé

- [x] Rendre la recherche globale visible et accessible depuis le site, avec résultats limités aux articles publiés.
- [x] Renforcer les métadonnées SEO, les URLs canoniques et les données structurées des articles.
- [x] Ajouter ou vérifier sitemap, robots et aperçu social sans inventer de contenu.
- [x] Valider les recherches, les métadonnées, le responsive, les tests et le build.

## Réflexion sur l’hébergement indépendant

- [x] Comparer les besoins de ClairDroit avec les solutions d’hébergement Node.js, MySQL, secrets, Resend et stockage.
- [x] Évaluer coûts, simplicité, sauvegardes et compatibilité de Railway, Render et d’une solution Manus.
- [x] Préparer une recommandation et un plan de migration réversible sans publier immédiatement.

## Audit des fonctionnalités actuelles

- [x] Inventorier les fonctionnalités publiques et administratives actuellement disponibles.
- [x] Vérifier les parcours critiques : connexion, publication, recherche, formulaires, email et pages de conformité.
- [x] Classer les optimisations par impact, difficulté et priorité avant toute nouvelle modification.

## Finalisation sécurité, performance, interface et guide

- [x] Auditer les protections serveur, les secrets, les formulaires, les sessions et les permissions admin.
- [x] Auditer la performance du bundle, des images, des requêtes et du rendu responsive.
- [x] Identifier et appliquer les optimisations d’interface à fort impact.
- [x] Rédiger un guide rapide et non technique pour la publication d’un article par Corinne.
- [x] Ajouter les tests nécessaires et enregistrer une version validée.

## Preuve finale du logo

- [x] Reproduire le téléversement et la sauvegarde d’un logo depuis Identité du site.
- [x] Vérifier l’aperçu admin puis l’affichage du logo dans le header et le footer publics.
- [x] Documenter la preuve de rendu du logo et revalider le build.

## Protection anti-spam des formulaires publics

- [x] Ajouter un champ honeypot invisible au formulaire Contact.
- [x] Ajouter un champ honeypot invisible au formulaire Newsletter.
- [x] Refuser côté serveur les soumissions qui remplissent le honeypot sans enregistrer ni notifier.
- [x] Ajouter les tests de soumission légitime et de détection anti-spam.
- [x] Vérifier l’accessibilité, le build et enregistrer un checkpoint.

## Préparation de migration indépendante

- [x] Inventorier les dépendances Manus du code et les services à remplacer.
- [x] Choisir Railway, MySQL Railway, un stockage S3 compatible et différer le choix du domaine.
- [x] Préparer une configuration indépendante sans exposer de secrets.
- [x] Rédiger une procédure de sauvegarde, migration, tests et bascule réversible.
- [x] Valider avec l’utilisateur la première étape avant tout déploiement externe.

### Adaptation technique Railway

- [x] Ajouter un mode de stockage S3 compatible activable par variables Railway.
- [x] Conserver un mode local et un mode Manus de secours sans exposer de secrets.
- [x] Vérifier que l’authentification email/mot de passe fonctionne avec le JWT local sans OAuth Manus.
- [x] Documenter les variables Railway et le transfert des images avant le déploiement.

## Diagnostic du crash Railway

- [x] Lire les logs de build et de démarrage du service Railway.
- [x] Identifier la cause racine sans modifier les secrets à l’aveugle.
- [x] Appliquer la correction minimale et valider localement.
- [x] Redéployer prudemment et confirmer que le service reste actif.

### Cause identifiée par les logs Railway

- [x] Corriger le chemin de production transmis à `path.join` dans le bundle serveur.
- [x] Rendre l’absence d’OAUTH_SERVER_URL non bloquante pour l’authentification admin locale.
- [x] Valider le démarrage avec la variable `PORT` fournie par Railway.
