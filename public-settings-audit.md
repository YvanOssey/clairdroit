# Audit de correspondance — pages publiques et Identité du site

L’audit compare les routes publiques actuellement actives avec les champs exposés dans la page d’administration **Identité du site**. Une information est considérée comme synchronisée lorsqu’une modification sauvegardée dans l’administration est consommée par la page publique correspondante.

| Page ou zone publique | Source actuelle du contenu | Présence dans Identité du site | Conclusion |
|---|---|---|---|
| En-tête, logo et navigation | Réglages généraux et navigation | Oui | Synchronisé |
| Accueil `/` | Réglages Accueil et À la une, plus articles publiés | Oui | Synchronisé |
| À propos de moi `/a-propos` | Réglages À propos, biographie, appel final et portrait R2 séparé | Oui | Synchronisé |
| Nous écrire `/contact` | Réglages Contact et formulaires serveur | Oui | Synchronisé |
| Mentions légales | Réglages Mentions légales et email Contact | Oui | Synchronisé |
| Politique de confidentialité | Réglages Politique de confidentialité et email Contact | Oui | Synchronisé |
| Actualité juridique | Libellé de navigation dans l’administration, textes de présentation codés dans la page, articles filtrés par publication | Partiel | Le libellé est éditable ; le texte de présentation ne l’est pas |
| Articles juridiques vulgarisés | Libellé de navigation dans l’administration, textes de présentation codés dans la page, articles filtrés par publication | Partiel | Le libellé est éditable ; le texte de présentation ne l’est pas |
| Analyses juridiques | Libellé de navigation dans l’administration, textes de présentation codés dans la page, articles filtrés par publication | Partiel | Le libellé est éditable ; le texte de présentation ne l’est pas |
| Tips carrières juridiques | Libellé de navigation dans l’administration, contenu de la page codé dans la page | Partiel | Le libellé est éditable ; le contenu éditorial ne l’est pas |
| Footer et newsletter | Réglages Footer, Newsletter et réseaux sociaux | Oui | Synchronisé |
| Ancienne route `/articles` | Redirection vers `/articles-juridiques` | Non applicable | L’ancien groupe Décryptages n’est plus nécessaire |

## Conclusion

Les informations sont correctement synchronisées pour l’identité générale, l’accueil, À propos de moi, Nous écrire, les pages légales, le footer et la newsletter. Les quatre pages éditoriales disposent actuellement de réglages pour leurs **libellés de navigation** et reçoivent leurs articles selon la rubrique de publication, mais leurs textes de présentation restent écrits directement dans les composants publics. La page Carrières juridiques est également entièrement codée dans son composant, à l’exception de son libellé de navigation.

Il ne s’agit pas d’une erreur d’affichage : ce sont des contenus publics qui n’ont pas encore été transformés en champs administrables. Les anciens réglages Décryptages et Rubriques sont conservés dans le modèle partagé uniquement pour compatibilité, mais ne sont plus présentés dans Identité du site lorsqu’ils ne correspondent pas à une page active.
