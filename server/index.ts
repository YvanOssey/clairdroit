// Point d’entrée de compatibilité pour les anciennes commandes locales.
// Le serveur complet et canonique se trouve dans server/_core/index.ts :
// il monte tRPC, le stockage, l’authentification et le fallback HTML dans le bon ordre.
import "./_core/index";
