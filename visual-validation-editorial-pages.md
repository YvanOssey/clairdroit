# Validation visuelle des pages éditoriales

Les routes `/actualite-juridique`, `/articles-juridiques`, `/analyses-juridiques` et `/a-propos` ont été capturées sur desktop après le build final. Le header affiche ClairDroit et les cinq entrées de navigation, avec l’entrée active soulignée.

La route historique `/articles` est redirigée vers `/articles-juridiques` afin d’éviter une page d’index incohérente avec la nouvelle navigation. La route `/rubriques/:category` est conservée pour les liens de catégories internes.

La page À propos affiche le titre « À propos de moi », la biographie à gauche et le portrait fourni à droite. Les contrôles desktop et mobile précédents ont également confirmé que le portrait reste contenu et que les sections restent lisibles sur petit écran.

Le type-check, les 21 tests Vitest et le build de production passent après ces changements. Le warning pnpm sur la clé `pnpm` reste non bloquant.
