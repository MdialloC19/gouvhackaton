# Code de Conduite pour le Repository

## Introduction

Bienvenue dans notre projet ! Ce document établit les conventions de codage, les bonnes pratiques, et les règles à suivre pour contribuer au repository. L'objectif est de maintenir un code de qualité, clair et facile à maintenir. Veuillez lire attentivement ce document avant de contribuer.

## 1. Structure et Organisation du Code

-   Respectez la structure des dossiers définie dans le projet NestJS et spécifier dans la dernière version du document nommer convention qui vous a été envoyé.

-Utilisez toujours le CLI de NestJS (`nest g <type_de_fichier> <chemin/vers/le_fichier`>) pour générer des fichiers, garantissant ainsi un respect des conventions de nommage et des normes du framework.
Exemple : `nest g controller /users/controllers/users`

## 2. Nommage des Fichiers

-   Utilisez le format `kebab-case` pour tous les noms de fichiers (par exemple, `user.controller.ts`, `auth.service.ts`).
-   Les fichiers doivent être suffixés par leur fonction (par exemple, `user.controller.ts`, `create-user.dto.ts`).

## 3. Conventions de Nommage

-   Variables et fonctions : utilisez le `camelCase` (par exemple, `getUserById`).
-   Classes et décorateurs : utilisez le `PascalCase` (par exemple, `UserService`, `AuthGuard`).
-   Évitez les noms génériques. Utilisez des noms descriptifs et spécifiques.

## 4. Structure des Fonctions

-   Gardez les fonctions petites et ciblées sur une seule tâche.
-   Appliquez le principe DRY (Don't Repeat Yourself) en découpant les fonctions si nécessaire.
-   Utilisez l'injection de dépendances pour les services et les repositories.

## 5. Types de Retour

-   Définissez toujours explicitement le type de retour des fonctions.
-   Utilisez des DTOs (Data Transfer Objects) là où cela est applicable.

## 6. Syntaxe et Style

-   Utilisez une indentation de 4 espaces.
-   Terminez toujours les déclarations avec des points-virgules.
-   Utilisez des guillemets simples pour les chaînes de caractères (`'exemple'`), sauf si vous utilisez des template literals.
-   Ouvrez les accolades sur la même ligne (`if (condition) {`).
-   Groupez les imports par bibliothèques externes d'abord, puis par modules internes.

## 7. Gestion des Erreurs et Journalisation

-   Utilisez les filtres d'exceptions intégrés de NestJS pour la gestion des erreurs.
-   Créez des exceptions personnalisées pour les erreurs spécifiques au domaine.
-   Utilisez le logger de NestJS pour une journalisation cohérente dans toute l'application. Veillez à ne pas consigner d'informations sensibles.

## 8. Tests

-   Écrivez des tests unitaires pour tous les services et contrôleurs.
-   Nommez les fichiers de tests avec le suffixe `*.spec.ts`.
-   Utilisez `jest` pour simuler les dépendances.
-   Visez une couverture de test de 100%.

## 9. Contrôle de Version et Messages de Commit

-   Utilisez les préfixes `feature/`, `bugfix/`, `hotfix/` pour nommer vos branches (par exemple, `feature/add-user-auth`).
-   Les messages de commit doivent suivre le format : `<type>(<scope>): <sujet>`.
    -   Types : `feat` (nouvelle fonctionnalité), `fix` (correction de bug), `docs` (documentation), `refactor` (changement de code sans ajout de fonctionnalité ni correction de bug).
    -   Exemple : `feat(user): ajout de l'authentification JWT`.
-   Revoyez et fusionnez le code via des pull requests. Assurez-vous qu'au moins un membre de l'équipe révise avant de fusionner.

## 10. Évolution des Conventions

-   Revoyez et mettez à jour ces conventions périodiquement en fonction de l'évolution du projet.
-   Encouragez les discussions d'équipe pour affiner et adapter ces lignes directrices.

## Conclusion

Merci de respecter ces règles pour assurer la qualité et la maintenabilité du code. Si vous avez des questions ou des suggestions, n'hésitez pas à les partager avec l'équipe. Votre contribution est précieuse !
