# Audit initial de ClairDroit — Sécurité, performance et interface

## Synthèse

L’application est dans un état fonctionnel et le build de production réussit. Les protections principales sont présentes : authentification administrateur par email et mot de passe haché, liste blanche des deux comptes administrateurs, procédures tRPC réservées aux administrateurs, validation Zod des entrées, échappement du contenu envoyé dans les emails et contrôle du format et de la taille des images.

Deux sujets méritent cependant une amélioration avant une finalisation stricte : **la protection contre les abus des formulaires publics** et **la réduction du bundle commun**. Le code splitting des pages a été appliqué pendant cet audit ; la protection anti-abus reste à planifier et ne doit pas être ajoutée sans choisir une stratégie compatible avec l’hébergement Autoscale.

## Résultats de sécurité

| Domaine | État constaté | Priorité |
|---|---|---:|
| Authentification admin | Deux emails autorisés ; mots de passe hachés avec scrypt ; session persistante par cookie HTTP-only | Bon |
| Autorisations | Les listes, réglages, uploads et opérations d’articles utilisent une procédure admin | Bon |
| Validation des entrées | Les formulaires, réglages, articles et uploads sont validés par Zod | Bon |
| Injection dans les emails | Les valeurs intégrées au HTML sont échappées par `emailText` | Bon |
| Uploads | Formats limités et taille vérifiée à 6 Mo côté procédure | Bon |
| Formulaires publics | Contact et newsletter enregistrent les données, mais aucune limitation anti-abus dédiée n’est visible | À renforcer |
| Sessions | Cookie HTTP-only et durée longue ; `SameSite=None` est conservé pour compatibilité HTTPS | À revalider en production |
| Secrets | Les secrets sont lus depuis l’environnement serveur et ne sont pas codés dans l’interface | Bon |

### Recommandations de sécurité

La prochaine mesure utile est d’ajouter une protection anti-abus aux mutations publiques `contact.submit` et `newsletter.subscribe`. Elle peut prendre la forme d’un mécanisme de limitation par IP ou par fenêtre temporelle, complété par un champ honeypot ou un service CAPTCHA si le spam apparaît réellement. Cette protection doit être conçue avec prudence pour ne pas bloquer les lecteurs légitimes et pour rester compatible avec le mode Autoscale.

Il faut également vérifier, au moment de l’hébergement définitif, que le proxy HTTPS transmet correctement `x-forwarded-proto` et que les cookies de session sont marqués `Secure`. Les secrets de production doivent rester dans les variables d’environnement de la plateforme et ne jamais être ajoutés au dépôt ou à un fichier `.env` partagé.

## Résultats de performance

Le build a réussi avec les mesures suivantes :

| Élément | Taille brute | Taille gzip |
|---|---:|---:|
| JavaScript principal | 971 Ko | 249 Ko |
| CSS principal | 133 Ko | 21 Ko |
| HTML initial | 369 Ko | 106 Ko |
| Bundle serveur | 68 Ko | Non mesuré |

Le principal point d’attention est le bundle JavaScript principal, supérieur au seuil de 500 Ko signalé par Vite. La cause la plus probable est que toutes les pages publiques et administratives sont importées immédiatement dans `App.tsx`, avec l’ensemble des composants d’interface et de l’éditeur admin.

### Recommandations de performance

Le code splitting a été appliqué dans `client/src/App.tsx` avec des imports dynamiques pour les pages publiques secondaires, les pages éditoriales, les pages légales et l’administration. Le build produit désormais des fichiers séparés pour `Home`, `ArticlePage`, `AdminArticleEditor`, `AdminSiteSettings` et les autres routes. Le bundle commun est passé d’environ 971 Ko à environ 678 Ko, et les pages administratives ne sont plus incluses intégralement dans le chargement initial.

La seconde priorité est de vérifier les images de couverture. Les images doivent rester dans le stockage prévu, être servies avec des dimensions adaptées et utiliser `loading="lazy"` lorsqu’elles ne sont pas visibles au premier écran. L’image principale d’un article peut rester prioritaire, tandis que les vignettes et images situées plus bas peuvent être différées.

Le layout partagé charge actuellement la liste complète des articles publiés pour alimenter la recherche globale. Cette stratégie convient à un petit volume éditorial, mais il faudra prévoir une recherche serveur ou une pagination lorsque le nombre d’articles augmentera sensiblement.

## Optimisations d’interface recommandées

| Optimisation | Bénéfice utilisateur | Priorité |
|---|---|---:|
| Code splitting des routes admin | Chargement public plus rapide | Haute |
| Table des matières réellement cliquable | Navigation plus simple dans les longs articles | Haute |
| Articles liés dans « À lire ensuite » | Meilleure découverte du contenu | Haute |
| États de chargement plus explicites | Moins d’incertitude pendant les requêtes | Moyenne |
| Messages de succès et d’erreur plus contextualisés | Meilleure compréhension des formulaires | Moyenne |
| Vérification mobile systématique dans l’aperçu admin | Réduction des erreurs de mise en page | Moyenne |
| Filtre ou pagination dans la liste admin | Administration plus confortable avec davantage d’articles | Moyenne |
| Prévisualisation SEO avec compteur de caractères | Saisie plus fiable du titre et de la description | Moyenne |
| Navigation clavier et focus visibles dans la recherche | Accessibilité renforcée | Moyenne |

## Points observés sur les articles

La page d’article possède désormais une table des matières cliquable. Chaque intertitre reçoit un identifiant stable et un décalage de défilement adapté à l’en-tête fixe. La zone « À lire ensuite » est également alimentée par deux articles publiés de la même section, en excluant l’article actuellement consulté. L’image principale est prioritaire et les images liées sont chargées paresseusement.

## Décision proposée

Aucune modification de contenu éditorial n’est nécessaire pour le moment. Les améliorations de performance et de lecture à fort impact ont été appliquées et vérifiées par le typage, les tests et le build de production. La prochaine amélioration technique à envisager est une protection anti-abus légère des formulaires publics. Les optimisations de pagination et de recherche serveur pourront attendre l’augmentation du volume d’articles.

> Conclusion : ClairDroit peut continuer à être utilisé dans son état actuel. Les points restants sont des renforcements de robustesse et non des blocages immédiats. Avant une mise en ligne définitive, il faudra surtout vérifier les cookies HTTPS, les secrets de production et la réception des notifications email.
