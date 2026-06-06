# Document 8

# Plan de tests fonctionnels avant mise en production

# Application SENCAILLE Finance

## 1. Objectif du document

Ce document définit le plan de tests fonctionnels de l’application **SENCAILLE Finance** avant sa mise en production.

Il permet de vérifier que l’application fonctionne correctement pour :

* la connexion des utilisateurs ;
* la gestion des rôles ;
* la saisie des recettes ;
* la saisie des dépenses ;
* les paiements WAVE ;
* les paiements en espèces ;
* les ventes à crédit ;
* les achats à crédit ;
* les paiements partiels ;
* les soldes WAVE et caisse ;
* les catégories liées aux types d’opérations ;
* la création rapide de catégories ;
* l’historique ;
* les filtres ;
* les rapports mensuels ;
* les droits utilisateurs ;
* les suppressions logiques ;
* la sécurité Supabase ;
* le déploiement sur Vercel.

L’objectif est simple :

**Avant d’utiliser l’application avec les vraies données de SENCAILLE, il faut s’assurer que les calculs, les droits et les rapports sont exacts.**

## 2. Principe général des tests

Les tests doivent être faits avant toute utilisation réelle de l’application.

Ils doivent être réalisés dans un environnement de test avec de fausses données.

Il ne faut pas commencer directement avec les vraies opérations de SENCAILLE.

Les tests doivent répondre à trois questions :

1. Est-ce que l’application enregistre correctement les opérations ?
2. Est-ce que les soldes sont justes ?
3. Est-ce que chaque utilisateur voit et modifie uniquement ce qu’il a le droit de gérer ?

## 3. Environnements à tester

## 3.1 Environnement local

L’application doit être testée localement pendant le développement.

Objectifs :

* vérifier les écrans ;
* vérifier les formulaires ;
* vérifier la connexion Supabase ;
* vérifier les calculs ;
* corriger rapidement les erreurs.

## 3.2 Environnement Vercel Preview

Après connexion du dépôt GitHub à Vercel, chaque version intermédiaire peut être testée via une URL de prévisualisation.

Objectifs :

* vérifier que l’application fonctionne en ligne ;
* vérifier que les variables d’environnement sont bien configurées ;
* tester sur téléphone réel ;
* tester sur navigateur mobile.

## 3.3 Environnement production

C’est l’environnement final.

Il ne doit être utilisé qu’après validation des tests.

Objectifs :

* utiliser l’application avec les vraies données ;
* éviter les erreurs de calcul ;
* sécuriser les opérations financières.

## 4. Données de test recommandées

Avant les tests, créer des données fictives.

## 4.1 Utilisateurs de test

Créer au minimum trois utilisateurs :

### Utilisateur 1 : Administrateur

Nom : Bacary Admin
Rôle : Administrateur
Statut : Actif

### Utilisateur 2 : Utilisateur simple

Nom : Amadou Agent
Rôle : Utilisateur simple
Statut : Actif

### Utilisateur 3 : Utilisateur simple

Nom : Fatou Agent
Rôle : Utilisateur simple
Statut : Actif

### Utilisateur 4 : Utilisateur désactivé

Nom : Test Désactivé
Rôle : Utilisateur simple
Statut : Désactivé

## 4.2 Comptes financiers de test

Créer ou vérifier les deux comptes suivants :

1. WAVE SENCAILLE
2. Caisse SENCAILLE

Soldes initiaux recommandés pour les tests :

* WAVE SENCAILLE : 100 000 FCFA
* Caisse SENCAILLE : 50 000 FCFA

Solde total initial attendu :

* 150 000 FCFA

## 4.3 Catégories de recettes de test

Vérifier la présence des catégories suivantes :

* Vente œufs de caille
* Vente cailleteaux
* Vente cailles reproductrices
* Vente cages
* Autres recettes

## 4.4 Catégories de dépenses de test

Vérifier la présence des catégories suivantes :

* Achat aliment volaille
* Achat vitamines
* Transport
* Main-d’œuvre
* Autres dépenses

## 4.5 Clients de test

Créer les clients suivants :

* Moussa Diop
* Nafi Ndiaye
* Alioune Fall

## 4.6 Fournisseurs de test

Créer les fournisseurs suivants :

* Boutique Aliment Thiès
* Pharmacie vétérinaire
* Transporteur Thiès

## 5. Tests de connexion

## Test 1 — Connexion administrateur

### Objectif

Vérifier que l’administrateur peut se connecter.

### Étapes

1. Ouvrir l’application.
2. Saisir les identifiants de l’administrateur.
3. Cliquer sur **Se connecter**.

### Résultat attendu

* L’administrateur accède au tableau de bord.
* Il voit les menus d’administration.
* Il peut accéder aux utilisateurs, catégories, paramètres et rapports.

### Statut

À valider.

## Test 2 — Connexion utilisateur simple

### Objectif

Vérifier qu’un utilisateur simple peut se connecter.

### Étapes

1. Ouvrir l’application.
2. Saisir les identifiants d’Amadou Agent.
3. Cliquer sur **Se connecter**.

### Résultat attendu

* L’utilisateur simple accède à l’application.
* Il ne voit pas les menus réservés à l’administrateur.
* Il peut saisir une opération.

### Statut

À valider.

## Test 3 — Connexion utilisateur désactivé

### Objectif

Vérifier qu’un utilisateur désactivé ne peut pas utiliser l’application.

### Étapes

1. Se connecter avec l’utilisateur désactivé.
2. Observer le comportement de l’application.

### Résultat attendu

* L’accès est refusé.
* Un message clair s’affiche : **Votre compte est désactivé. Veuillez contacter l’administrateur.**

### Statut

À valider.

## Test 4 — Mauvais mot de passe

### Objectif

Vérifier la gestion des erreurs de connexion.

### Étapes

1. Saisir un email valide.
2. Saisir un mauvais mot de passe.
3. Cliquer sur **Se connecter**.

### Résultat attendu

* L’application refuse la connexion.
* Un message d’erreur clair s’affiche.

### Statut

À valider.

## 6. Tests des rôles et permissions

## Test 5 — L’administrateur voit toutes les opérations

### Objectif

Vérifier que l’administrateur peut voir toutes les opérations.

### Étapes

1. Se connecter comme administrateur.
2. Ouvrir l’historique.
3. Vérifier les opérations créées par différents utilisateurs.

### Résultat attendu

* L’administrateur voit toutes les opérations.
* Il peut filtrer par utilisateur.
* Il peut voir les opérations d’Amadou et Fatou.

### Statut

À valider.

## Test 6 — L’utilisateur simple voit uniquement ses propres opérations

### Objectif

Vérifier la limitation des droits utilisateur.

### Étapes

1. Se connecter comme Amadou.
2. Saisir une opération.
3. Se connecter comme Fatou.
4. Saisir une autre opération.
5. Revenir sur le compte Amadou.
6. Ouvrir l’historique.

### Résultat attendu

* Amadou voit ses propres opérations.
* Amadou ne peut pas modifier les opérations de Fatou.
* Si les règles V1 sont strictes, Amadou ne voit pas les opérations de Fatou.

### Statut

À valider.

## Test 7 — Utilisateur simple ne voit pas les menus admin

### Objectif

Vérifier l’interface selon le rôle.

### Étapes

1. Se connecter comme utilisateur simple.
2. Ouvrir le menu secondaire.
3. Vérifier les entrées affichées.

### Résultat attendu

L’utilisateur simple ne voit pas :

* gestion des utilisateurs ;
* paramètres sensibles ;
* journaux d’audit ;
* actions administrateur.

### Statut

À valider.

## Test 8 — Utilisateur simple ne peut pas modifier une opération d’un autre utilisateur

### Objectif

Vérifier la sécurité fonctionnelle et Supabase RLS.

### Étapes

1. Créer une opération avec Fatou.
2. Se connecter comme Amadou.
3. Tenter d’accéder ou de modifier l’opération de Fatou.

### Résultat attendu

* Le bouton Modifier n’apparaît pas.
* Si une tentative directe est faite, Supabase refuse l’action.

### Statut

À valider.

## 7. Tests des catégories

## Test 9 — Affichage des catégories de recettes

### Objectif

Vérifier que les catégories dépendent du type d’opération.

### Étapes

1. Aller dans **Nouvelle opération**.
2. Choisir **Recette**.
3. Ouvrir le champ catégorie.

### Résultat attendu

L’application affiche uniquement les catégories de recettes :

* Vente œufs de caille
* Vente cailleteaux
* Vente cages
* Autres recettes

Elle ne doit pas afficher :

* Achat aliment volaille
* Transport
* Achat vitamines

### Statut

À valider.

## Test 10 — Affichage des catégories de dépenses

### Objectif

Vérifier que les catégories de dépenses sont correctement filtrées.

### Étapes

1. Aller dans **Nouvelle opération**.
2. Choisir **Dépense**.
3. Ouvrir le champ catégorie.

### Résultat attendu

L’application affiche uniquement les catégories de dépenses :

* Achat aliment volaille
* Achat vitamines
* Transport
* Main-d’œuvre

Elle ne doit pas afficher :

* Vente œufs de caille
* Vente cailleteaux
* Vente cages

### Statut

À valider.

## Test 11 — Création rapide d’une catégorie de recette

### Objectif

Vérifier qu’une nouvelle catégorie créée pendant une recette est bien liée au type recette.

### Étapes

1. Aller dans **Nouvelle opération**.
2. Choisir **Recette**.
3. Cliquer sur **+ Créer une nouvelle catégorie**.
4. Saisir : **Vente fumier**.
5. Valider.

### Résultat attendu

* La catégorie est créée.
* Elle apparaît dans les catégories de recettes.
* Elle n’apparaît pas dans les catégories de dépenses.

### Statut

À valider.

## Test 12 — Création rapide d’une catégorie de dépense

### Objectif

Vérifier qu’une nouvelle catégorie créée pendant une dépense est bien liée au type dépense.

### Étapes

1. Aller dans **Nouvelle opération**.
2. Choisir **Dépense**.
3. Créer une catégorie : **Achat désinfectant**.
4. Valider.

### Résultat attendu

* La catégorie est créée.
* Elle apparaît dans les catégories de dépenses.
* Elle n’apparaît pas dans les catégories de recettes.

### Statut

À valider.

## Test 13 — Refus d’une catégorie incompatible

### Objectif

Vérifier qu’une opération ne peut pas utiliser une catégorie incompatible.

### Étapes

1. Tenter d’enregistrer une recette avec la catégorie **Achat aliment volaille**.
2. Tenter d’enregistrer une dépense avec la catégorie **Vente œufs de caille**.

### Résultat attendu

L’application refuse l’enregistrement avec un message clair :

**Cette catégorie ne correspond pas au type d’opération choisi.**

### Statut

À valider.

## 8. Tests des recettes

## Test 14 — Recette payée totalement par WAVE

### Objectif

Vérifier l’impact d’une recette WAVE sur le solde WAVE.

### Situation initiale

Solde WAVE : 100 000 FCFA
Solde caisse : 50 000 FCFA

### Opération à saisir

* Type : Recette
* Catégorie : Vente œufs de caille
* Montant total : 20 000 FCFA
* Mode : Payé totalement
* Moyen : WAVE

### Résultat attendu

Solde WAVE attendu :

100 000 + 20 000 = 120 000 FCFA

Solde caisse attendu :

50 000 FCFA

Statut paiement :

Payé

Reste à payer :

0 FCFA

### Statut

À valider.

## Test 15 — Recette payée totalement en espèces

### Objectif

Vérifier l’impact d’une recette espèces sur la caisse.

### Situation initiale

Solde WAVE : 120 000 FCFA
Solde caisse : 50 000 FCFA

### Opération à saisir

* Type : Recette
* Catégorie : Vente cailleteaux
* Montant total : 15 000 FCFA
* Mode : Payé totalement
* Moyen : Espèces

### Résultat attendu

Solde WAVE attendu :

120 000 FCFA

Solde caisse attendu :

50 000 + 15 000 = 65 000 FCFA

Statut paiement :

Payé

Reste à payer :

0 FCFA

### Statut

À valider.

## Test 16 — Vente à crédit

### Objectif

Vérifier qu’une vente à crédit ne modifie pas les soldes.

### Situation initiale

Solde WAVE : 120 000 FCFA
Solde caisse : 65 000 FCFA

### Opération à saisir

* Type : Recette
* Catégorie : Vente cailleteaux
* Client : Moussa Diop
* Montant total : 30 000 FCFA
* Mode : À crédit

### Résultat attendu

Solde WAVE :

120 000 FCFA

Solde caisse :

65 000 FCFA

Créance client :

30 000 FCFA

Statut paiement :

Non payé

Reste à payer :

30 000 FCFA

Moussa Diop apparaît dans **Clients débiteurs**.

### Statut

À valider.

## Test 17 — Vente avec paiement partiel par WAVE

### Objectif

Vérifier la gestion d’une vente partiellement payée.

### Situation initiale

Solde WAVE : 120 000 FCFA
Solde caisse : 65 000 FCFA

### Opération à saisir

* Type : Recette
* Catégorie : Vente cailles reproductrices
* Client : Nafi Ndiaye
* Montant total : 50 000 FCFA
* Mode : Paiement partiel
* Montant payé : 20 000 FCFA
* Moyen : WAVE

### Résultat attendu

Solde WAVE :

120 000 + 20 000 = 140 000 FCFA

Solde caisse :

65 000 FCFA

Créance client restante :

30 000 FCFA

Statut paiement :

Partiellement payé

Nafi Ndiaye apparaît dans **Clients débiteurs**.

### Statut

À valider.

## 9. Tests des dépenses

## Test 18 — Dépense payée totalement par WAVE

### Objectif

Vérifier l’impact d’une dépense WAVE sur le solde WAVE.

### Situation initiale

Solde WAVE : 140 000 FCFA
Solde caisse : 65 000 FCFA

### Opération à saisir

* Type : Dépense
* Catégorie : Achat aliment volaille
* Montant total : 40 000 FCFA
* Mode : Payé totalement
* Moyen : WAVE

### Résultat attendu

Solde WAVE :

140 000 - 40 000 = 100 000 FCFA

Solde caisse :

65 000 FCFA

Statut paiement :

Payé

Reste à payer :

0 FCFA

### Statut

À valider.

## Test 19 — Dépense payée totalement en espèces

### Objectif

Vérifier l’impact d’une dépense espèces sur la caisse.

### Situation initiale

Solde WAVE : 100 000 FCFA
Solde caisse : 65 000 FCFA

### Opération à saisir

* Type : Dépense
* Catégorie : Transport
* Montant total : 5 000 FCFA
* Mode : Payé totalement
* Moyen : Espèces

### Résultat attendu

Solde WAVE :

100 000 FCFA

Solde caisse :

65 000 - 5 000 = 60 000 FCFA

Statut paiement :

Payé

Reste à payer :

0 FCFA

### Statut

À valider.

## Test 20 — Achat à crédit

### Objectif

Vérifier qu’un achat à crédit ne diminue pas les soldes.

### Situation initiale

Solde WAVE : 100 000 FCFA
Solde caisse : 60 000 FCFA

### Opération à saisir

* Type : Dépense
* Catégorie : Achat vitamines
* Fournisseur : Pharmacie vétérinaire
* Montant total : 25 000 FCFA
* Mode : À crédit

### Résultat attendu

Solde WAVE :

100 000 FCFA

Solde caisse :

60 000 FCFA

Dette fournisseur :

25 000 FCFA

Statut paiement :

Non payé

Fournisseur visible dans **Fournisseurs à payer**.

### Statut

À valider.

## Test 21 — Achat avec paiement partiel en espèces

### Objectif

Vérifier une dépense partiellement payée.

### Situation initiale

Solde WAVE : 100 000 FCFA
Solde caisse : 60 000 FCFA

### Opération à saisir

* Type : Dépense
* Catégorie : Achat aliment volaille
* Fournisseur : Boutique Aliment Thiès
* Montant total : 80 000 FCFA
* Mode : Paiement partiel
* Montant payé : 30 000 FCFA
* Moyen : Espèces

### Résultat attendu

Solde WAVE :

100 000 FCFA

Solde caisse :

60 000 - 30 000 = 30 000 FCFA

Dette fournisseur restante :

50 000 FCFA

Statut paiement :

Partiellement payé

Fournisseur visible dans **Fournisseurs à payer**.

### Statut

À valider.

## 10. Tests des paiements complémentaires

## Test 22 — Paiement client par WAVE

### Objectif

Vérifier qu’un paiement client augmente WAVE et réduit la créance.

### Situation initiale

Moussa Diop doit 30 000 FCFA.
Solde WAVE : 100 000 FCFA.

### Paiement à saisir

* Client : Moussa Diop
* Montant du paiement : 10 000 FCFA
* Moyen : WAVE

### Résultat attendu

Solde WAVE :

100 000 + 10 000 = 110 000 FCFA

Reste à payer de Moussa :

30 000 - 10 000 = 20 000 FCFA

Statut :

Partiellement payé

### Statut

À valider.

## Test 23 — Paiement client en espèces

### Objectif

Vérifier qu’un paiement client en espèces augmente la caisse.

### Situation initiale

Nafi Ndiaye doit 30 000 FCFA.
Solde caisse : 30 000 FCFA.

### Paiement à saisir

* Client : Nafi Ndiaye
* Montant : 30 000 FCFA
* Moyen : Espèces

### Résultat attendu

Solde caisse :

30 000 + 30 000 = 60 000 FCFA

Reste à payer Nafi :

0 FCFA

Statut :

Payé

Nafi ne doit plus apparaître dans les clients débiteurs.

### Statut

À valider.

## Test 24 — Paiement fournisseur par WAVE

### Objectif

Vérifier qu’un paiement fournisseur diminue WAVE et réduit la dette.

### Situation initiale

Pharmacie vétérinaire doit recevoir 25 000 FCFA.
Solde WAVE : 110 000 FCFA.

### Paiement à saisir

* Fournisseur : Pharmacie vétérinaire
* Montant : 10 000 FCFA
* Moyen : WAVE

### Résultat attendu

Solde WAVE :

110 000 - 10 000 = 100 000 FCFA

Reste à payer :

25 000 - 10 000 = 15 000 FCFA

Statut :

Partiellement payé

### Statut

À valider.

## Test 25 — Paiement fournisseur en espèces

### Objectif

Vérifier qu’un paiement fournisseur en espèces diminue la caisse.

### Situation initiale

Boutique Aliment Thiès doit recevoir 50 000 FCFA.
Solde caisse : 60 000 FCFA.

### Paiement à saisir

* Fournisseur : Boutique Aliment Thiès
* Montant : 50 000 FCFA
* Moyen : Espèces

### Résultat attendu

Solde caisse :

60 000 - 50 000 = 10 000 FCFA

Reste à payer :

0 FCFA

Statut :

Payé

Boutique Aliment Thiès ne doit plus apparaître dans les fournisseurs à payer.

### Statut

À valider.

## Test 26 — Paiement supérieur au reste à payer

### Objectif

Vérifier que l’application refuse un paiement trop élevé.

### Situation initiale

Un client doit 20 000 FCFA.

### Action

Tenter d’enregistrer un paiement de 25 000 FCFA.

### Résultat attendu

L’application refuse.

Message attendu :

**Le paiement ne peut pas dépasser le reste à payer.**

Le solde ne change pas.

### Statut

À valider.

## 11. Tests des soldes

## Test 27 — Vérification du solde WAVE

### Objectif

Vérifier le calcul global du solde WAVE après plusieurs opérations.

### Données prises en compte

Solde initial WAVE : 100 000 FCFA

Mouvements WAVE :

* Recette WAVE : +20 000
* Vente partielle WAVE : +20 000
* Dépense WAVE : -40 000
* Paiement client WAVE : +10 000
* Paiement fournisseur WAVE : -10 000

### Calcul attendu

100 000 + 20 000 + 20 000 - 40 000 + 10 000 - 10 000 = 100 000 FCFA

### Résultat attendu

Le tableau de bord doit afficher :

Solde WAVE : 100 000 FCFA

### Statut

À valider.

## Test 28 — Vérification du solde caisse

### Objectif

Vérifier le calcul global de la caisse après plusieurs opérations.

### Données prises en compte

Solde initial caisse : 50 000 FCFA

Mouvements espèces :

* Recette espèces : +15 000
* Dépense espèces : -5 000
* Achat partiel espèces : -30 000
* Paiement client espèces : +30 000
* Paiement fournisseur espèces : -50 000

### Calcul attendu

50 000 + 15 000 - 5 000 - 30 000 + 30 000 - 50 000 = 10 000 FCFA

### Résultat attendu

Le tableau de bord doit afficher :

Solde caisse : 10 000 FCFA

### Statut

À valider.

## Test 29 — Vérification du solde total disponible

### Objectif

Vérifier le solde total disponible.

### Situation attendue

Solde WAVE : 100 000 FCFA
Solde caisse : 10 000 FCFA

### Calcul attendu

100 000 + 10 000 = 110 000 FCFA

### Résultat attendu

Solde total disponible : 110 000 FCFA

### Statut

À valider.

## 12. Tests des crédits

## Test 30 — Total clients débiteurs

### Objectif

Vérifier le total des créances clients.

### Situation

Moussa doit encore 20 000 FCFA.
Nafi a payé totalement sa dette.

### Résultat attendu

Clients débiteurs :

* Moussa Diop : 20 000 FCFA

Total clients débiteurs :

20 000 FCFA

### Statut

À valider.

## Test 31 — Total fournisseurs à payer

### Objectif

Vérifier le total des dettes fournisseurs.

### Situation

Pharmacie vétérinaire reste à payer : 15 000 FCFA.
Boutique Aliment Thiès est totalement payée.

### Résultat attendu

Fournisseurs à payer :

* Pharmacie vétérinaire : 15 000 FCFA

Total fournisseurs à payer :

15 000 FCFA

### Statut

À valider.

## Test 32 — Balance nette des crédits

### Objectif

Vérifier le calcul de la balance nette.

### Situation

Créances clients : 20 000 FCFA
Dettes fournisseurs : 15 000 FCFA

### Calcul attendu

20 000 - 15 000 = 5 000 FCFA

### Résultat attendu

Balance nette des crédits :

+5 000 FCFA

### Statut

À valider.

## 13. Tests de l’historique et des filtres

## Test 33 — Filtre par type recette

### Objectif

Vérifier que le filtre recette fonctionne.

### Étapes

1. Ouvrir **Historique**.
2. Filtrer par type : Recette.

### Résultat attendu

L’application affiche uniquement les recettes.

Aucune dépense ne doit apparaître.

### Statut

À valider.

## Test 34 — Filtre par type dépense

### Objectif

Vérifier que le filtre dépense fonctionne.

### Étapes

1. Ouvrir **Historique**.
2. Filtrer par type : Dépense.

### Résultat attendu

L’application affiche uniquement les dépenses.

Aucune recette ne doit apparaître.

### Statut

À valider.

## Test 35 — Filtre par catégorie

### Objectif

Vérifier le filtre par catégorie.

### Étapes

1. Ouvrir **Historique**.
2. Choisir type : Dépense.
3. Choisir catégorie : Achat aliment volaille.

### Résultat attendu

L’application affiche uniquement les dépenses de la catégorie **Achat aliment volaille**.

### Statut

À valider.

## Test 36 — Filtre par moyen de paiement

### Objectif

Vérifier le filtre WAVE / Espèces.

### Étapes

1. Ouvrir **Historique**.
2. Choisir moyen : WAVE.

### Résultat attendu

L’application affiche uniquement les opérations ou paiements liés à WAVE.

### Statut

À valider.

## Test 37 — Filtre par statut de paiement

### Objectif

Vérifier le filtre par statut.

### Étapes

1. Ouvrir **Historique**.
2. Choisir statut : Partiellement payé.

### Résultat attendu

L’application affiche uniquement les opérations partiellement payées.

### Statut

À valider.

## Test 38 — Résumé des résultats filtrés

### Objectif

Vérifier les totaux après filtrage.

### Étapes

1. Filtrer par type : Dépense.
2. Filtrer par catégorie : Achat aliment volaille.

### Résultat attendu

L’application affiche :

* nombre d’opérations ;
* total global ;
* total payé ;
* reste à payer.

Les chiffres doivent correspondre aux opérations affichées.

### Statut

À valider.

## 14. Tests des rapports mensuels

## Test 39 — Rapport de trésorerie du mois

### Objectif

Vérifier que le rapport de trésorerie ne prend en compte que les paiements réels.

### Données attendues

Le rapport doit inclure :

* recettes réellement encaissées ;
* dépenses réellement payées.

Il ne doit pas inclure comme encaissée une vente à crédit non payée.

Il ne doit pas inclure comme payée une dépense à crédit non réglée.

### Résultat attendu

Le rapport de trésorerie affiche uniquement les mouvements réels WAVE et espèces.

### Statut

À valider.

## Test 40 — Rapport d’activité du mois

### Objectif

Vérifier que le rapport d’activité prend en compte les ventes et achats enregistrés, même à crédit.

### Résultat attendu

Le rapport d’activité affiche :

* total des recettes enregistrées ;
* total des dépenses enregistrées ;
* ventes à crédit ;
* achats à crédit.

### Statut

À valider.

## Test 41 — Rapport par catégorie

### Objectif

Vérifier la ventilation par catégorie.

### Étapes

1. Ouvrir **Rapports**.
2. Choisir le mois de test.
3. Observer les recettes par catégorie.
4. Observer les dépenses par catégorie.

### Résultat attendu

Chaque catégorie affiche :

* nombre d’opérations ;
* total global ;
* total payé ;
* reste à payer.

### Statut

À valider.

## Test 42 — Rapport par utilisateur

### Objectif

Vérifier la traçabilité par utilisateur.

### Étapes

1. Créer des opérations avec Amadou.
2. Créer des opérations avec Fatou.
3. Ouvrir le rapport par utilisateur.

### Résultat attendu

Le rapport affiche :

* nombre d’opérations par utilisateur ;
* montants associés ;
* activité de saisie.

### Statut

À valider.

## 15. Tests de modification

## Test 43 — Modification par l’auteur

### Objectif

Vérifier qu’un utilisateur peut modifier sa propre opération.

### Étapes

1. Se connecter comme Amadou.
2. Créer une opération.
3. Ouvrir le détail.
4. Modifier la description ou le montant.
5. Enregistrer.

### Résultat attendu

* La modification est acceptée.
* L’historique d’audit est mis à jour.
* Les soldes sont recalculés si le montant change.

### Statut

À valider.

## Test 44 — Modification par l’administrateur

### Objectif

Vérifier que l’administrateur peut corriger toutes les opérations.

### Étapes

1. Se connecter comme administrateur.
2. Ouvrir une opération créée par Amadou.
3. Modifier l’opération.
4. Enregistrer.

### Résultat attendu

* La modification est acceptée.
* L’action est tracée.
* Les calculs sont mis à jour.

### Statut

À valider.

## Test 45 — Refus de modification non autorisée

### Objectif

Vérifier qu’un utilisateur ne peut pas modifier l’opération d’un autre.

### Étapes

1. Créer une opération avec Fatou.
2. Se connecter avec Amadou.
3. Tenter de modifier l’opération.

### Résultat attendu

* L’action est refusée.
* Le bouton Modifier est absent ou désactivé.
* Supabase refuse toute tentative directe.

### Statut

À valider.

## Test 46 — Modification d’un montant inférieur au total déjà payé

### Objectif

Vérifier la cohérence des paiements.

### Situation

Une opération de 50 000 FCFA a déjà reçu 30 000 FCFA.

### Action

Tenter de modifier le montant total à 20 000 FCFA.

### Résultat attendu

L’application refuse.

Message attendu :

**Le montant total ne peut pas être inférieur au montant déjà payé.**

### Statut

À valider.

## 16. Tests de suppression logique

## Test 47 — Suppression par l’auteur

### Objectif

Vérifier qu’un utilisateur peut supprimer logiquement sa propre opération.

### Étapes

1. Se connecter comme Amadou.
2. Créer une opération.
3. La supprimer.

### Résultat attendu

* L’opération passe en statut supprimé.
* Elle disparaît de l’historique normal.
* Elle ne compte plus dans les rapports.
* Elle reste visible pour l’administrateur dans l’audit.

### Statut

À valider.

## Test 48 — Suppression par l’administrateur

### Objectif

Vérifier que l’administrateur peut supprimer logiquement toute opération.

### Étapes

1. Se connecter comme administrateur.
2. Supprimer une opération créée par un autre utilisateur.

### Résultat attendu

* Suppression logique acceptée.
* Action tracée.
* Soldes recalculés.

### Statut

À valider.

## Test 49 — Refus de suppression non autorisée

### Objectif

Vérifier qu’un utilisateur ne peut pas supprimer l’opération d’un autre.

### Étapes

1. Créer une opération avec Fatou.
2. Se connecter comme Amadou.
3. Tenter de supprimer cette opération.

### Résultat attendu

* Action refusée.
* Bouton Supprimer absent ou désactivé.
* Supabase refuse toute tentative directe.

### Statut

À valider.

## Test 50 — Opération supprimée exclue des soldes

### Objectif

Vérifier qu’une suppression retire l’impact financier.

### Situation

Solde WAVE : 100 000 FCFA.
Créer une recette WAVE de 10 000 FCFA.
Solde WAVE devient 110 000 FCFA.

### Action

Supprimer logiquement cette opération.

### Résultat attendu

Solde WAVE revient à :

100 000 FCFA

### Statut

À valider.

## 17. Tests des justificatifs

## Test 51 — Ajout d’un justificatif à une opération

### Objectif

Vérifier l’ajout d’un justificatif.

### Étapes

1. Créer une opération.
2. Ajouter une image ou capture WAVE.
3. Enregistrer.

### Résultat attendu

* Le justificatif est enregistré.
* Il est lié à l’opération.
* Il est visible dans le détail.

### Statut

À valider.

## Test 52 — Ajout d’un justificatif à un paiement

### Objectif

Vérifier l’ajout d’un justificatif sur un paiement complémentaire.

### Étapes

1. Enregistrer un paiement client.
2. Ajouter une capture WAVE.
3. Enregistrer.

### Résultat attendu

* Le justificatif est lié au paiement.
* Il est visible dans le détail.

### Statut

À valider.

## 18. Tests Supabase RLS

## Test 53 — RLS sur les opérations

### Objectif

Vérifier la sécurité Supabase.

### Étapes

1. Utiliser un compte utilisateur simple.
2. Essayer de modifier une opération d’un autre utilisateur depuis le frontend.
3. Si possible, tenter directement une requête non autorisée.

### Résultat attendu

* L’action est refusée.
* Supabase bloque l’opération.
* La sécurité ne dépend pas seulement de l’interface.

### Statut

À valider.

## Test 54 — RLS sur les paramètres

### Objectif

Vérifier qu’un utilisateur simple ne peut pas modifier les paramètres.

### Étapes

1. Se connecter comme utilisateur simple.
2. Tenter d’accéder ou de modifier les paramètres.

### Résultat attendu

* Accès refusé.
* Supabase bloque toute modification.

### Statut

À valider.

## Test 55 — RLS sur les utilisateurs

### Objectif

Vérifier qu’un utilisateur simple ne peut pas modifier les profils.

### Étapes

1. Se connecter comme utilisateur simple.
2. Tenter de changer son rôle ou celui d’un autre utilisateur.

### Résultat attendu

* Action impossible.
* Supabase refuse la modification.

### Statut

À valider.

## 19. Tests d’interface mobile-first

## Test 56 — Affichage sur téléphone

### Objectif

Vérifier l’expérience mobile.

### Étapes

1. Ouvrir l’application sur smartphone.
2. Tester les principaux écrans.
3. Vérifier la lisibilité.

### Résultat attendu

* Les textes sont lisibles.
* Les boutons sont faciles à toucher.
* La navigation basse est visible.
* Le formulaire est confortable.

### Statut

À valider.

## Test 57 — Saisie rapide sur mobile

### Objectif

Vérifier qu’une opération peut être saisie rapidement.

### Étapes

1. Ouvrir l’application sur téléphone.
2. Cliquer sur **Saisir**.
3. Enregistrer une recette simple.

### Résultat attendu

L’opération peut être saisie rapidement sans confusion.

### Statut

À valider.

## Test 58 — Filtres sur mobile

### Objectif

Vérifier que les filtres sont utilisables sur petit écran.

### Étapes

1. Ouvrir Historique.
2. Ouvrir le panneau de filtres.
3. Appliquer plusieurs filtres.

### Résultat attendu

Les filtres sont faciles à utiliser et ne surchargent pas l’écran.

### Statut

À valider.

## 20. Tests de déploiement Vercel

## Test 59 — Déploiement depuis GitHub

### Objectif

Vérifier le déploiement automatique.

### Étapes

1. Pousser le code sur GitHub.
2. Vérifier le build Vercel.
3. Ouvrir l’URL générée.

### Résultat attendu

* Le build réussit.
* L’application s’ouvre correctement.
* Aucune erreur critique n’apparaît.

### Statut

À valider.

## Test 60 — Variables d’environnement

### Objectif

Vérifier la configuration Supabase sur Vercel.

### Étapes

1. Configurer les variables :

   * NEXT_PUBLIC_SUPABASE_URL
   * NEXT_PUBLIC_SUPABASE_ANON_KEY
2. Redéployer.
3. Tester la connexion.

### Résultat attendu

* L’application communique correctement avec Supabase.
* La connexion fonctionne en ligne.

### Statut

À valider.

## Test 61 — Test sur navigateur mobile

### Objectif

Vérifier l’usage réel sur téléphone.

### Étapes

1. Ouvrir l’URL Vercel sur téléphone.
2. Se connecter.
3. Saisir une opération.
4. Vérifier le tableau de bord.

### Résultat attendu

L’application est pleinement utilisable sur téléphone.

### Statut

À valider.

## 21. Tests de cohérence finale

## Test 62 — Scénario complet d’une journée

### Objectif

Simuler une journée réelle de SENCAILLE.

### Opérations à saisir

1. Vente œufs de caille par WAVE : 20 000 FCFA
2. Vente cailleteaux à crédit : 30 000 FCFA
3. Achat aliment par WAVE : 40 000 FCFA
4. Transport en espèces : 5 000 FCFA
5. Paiement client reçu par WAVE : 10 000 FCFA
6. Achat vitamines à crédit : 25 000 FCFA

### Résultat attendu

L’application doit afficher :

* soldes corrects ;
* clients débiteurs corrects ;
* fournisseurs à payer corrects ;
* historique cohérent ;
* rapport mensuel cohérent.

### Statut

À valider.

## Test 63 — Scénario multi-utilisateurs

### Objectif

Vérifier la cohérence avec plusieurs utilisateurs.

### Étapes

1. Amadou saisit une recette.
2. Fatou saisit une dépense.
3. L’administrateur consulte l’historique.
4. L’administrateur filtre par utilisateur.

### Résultat attendu

* Chaque opération garde son auteur.
* L’administrateur voit tout.
* Les utilisateurs simples ne modifient que leurs propres opérations.

### Statut

À valider.

## Test 64 — Scénario crédit complet

### Objectif

Tester une vente à crédit jusqu’au paiement complet.

### Étapes

1. Créer une vente à crédit de 50 000 FCFA.
2. Enregistrer un premier paiement de 20 000 FCFA.
3. Enregistrer un deuxième paiement de 30 000 FCFA.

### Résultat attendu

* Après création : statut non payé.
* Après premier paiement : statut partiellement payé.
* Après deuxième paiement : statut payé.
* Le client disparaît des débiteurs.
* Les soldes sont correctement mis à jour.

### Statut

À valider.

## Test 65 — Scénario dette fournisseur complet

### Objectif

Tester un achat à crédit jusqu’au paiement complet.

### Étapes

1. Créer un achat à crédit de 80 000 FCFA.
2. Enregistrer un premier paiement de 30 000 FCFA.
3. Enregistrer un deuxième paiement de 50 000 FCFA.

### Résultat attendu

* Après création : statut non payé.
* Après premier paiement : statut partiellement payé.
* Après deuxième paiement : statut payé.
* Le fournisseur disparaît des fournisseurs à payer.
* Les soldes sont correctement mis à jour.

### Statut

À valider.

## 22. Checklist finale avant mise en production

Avant la mise en production, vérifier que :

* l’application se connecte correctement à Supabase ;
* le premier administrateur est bien configuré ;
* les utilisateurs simples ont des droits limités ;
* les catégories sont correctement créées ;
* les catégories sont liées aux types d’opérations ;
* les recettes augmentent les bons comptes ;
* les dépenses diminuent les bons comptes ;
* les crédits ne changent pas les soldes ;
* les paiements complémentaires changent les soldes ;
* les restes à payer sont exacts ;
* les clients débiteurs sont exacts ;
* les fournisseurs à payer sont exacts ;
* les soldes WAVE et caisse sont exacts ;
* les rapports mensuels sont cohérents ;
* les filtres fonctionnent ;
* les suppressions sont logiques ;
* les opérations supprimées sont exclues des rapports ;
* les actions sensibles sont tracées ;
* Supabase RLS est activé ;
* Vercel déploie correctement ;
* l’application est utilisable sur smartphone ;
* les variables d’environnement sont bien configurées ;
* les clés Supabase ne sont pas exposées dans le code ;
* l’interface est entièrement en français.

## 23. Critères de validation de la V1

La V1 peut être validée si les conditions suivantes sont remplies :

1. Un administrateur peut se connecter.
2. Un utilisateur simple peut se connecter.
3. Un utilisateur désactivé ne peut pas utiliser l’application.
4. Une recette WAVE augmente correctement le solde WAVE.
5. Une recette espèces augmente correctement la caisse.
6. Une dépense WAVE diminue correctement le solde WAVE.
7. Une dépense espèces diminue correctement la caisse.
8. Une vente à crédit crée une créance sans modifier les soldes.
9. Un achat à crédit crée une dette sans modifier les soldes.
10. Un paiement client augmente WAVE ou caisse.
11. Un paiement fournisseur diminue WAVE ou caisse.
12. Le paiement ne peut pas dépasser le reste à payer.
13. Le statut de paiement est calculé automatiquement.
14. Les catégories sont liées aux types.
15. L’utilisateur peut créer une catégorie pendant la saisie.
16. L’historique est filtrable.
17. Les rapports mensuels sont cohérents.
18. L’administrateur voit toutes les données.
19. L’utilisateur simple ne modifie que ses propres opérations.
20. L’application fonctionne correctement sur mobile.

## 24. Décision finale de mise en production

La mise en production ne doit être faite que lorsque :

* tous les tests critiques sont validés ;
* les calculs de solde sont corrects ;
* les règles utilisateurs sont correctement appliquées ;
* les rapports sont fiables ;
* l’application est stable sur téléphone ;
* l’administrateur confirme que la V1 correspond au besoin réel de SENCAILLE.

## 25. Tests critiques à ne jamais négliger

Les tests les plus importants sont :

1. calcul du solde WAVE ;
2. calcul du solde caisse ;
3. vente à crédit sans impact immédiat sur les soldes ;
4. achat à crédit sans impact immédiat sur les soldes ;
5. paiement client avec augmentation du bon compte ;
6. paiement fournisseur avec diminution du bon compte ;
7. impossibilité de payer plus que le reste dû ;
8. catégories compatibles avec les types ;
9. utilisateur simple limité à ses propres opérations ;
10. suppression logique exclue des rapports.

Si ces dix tests passent, le cœur financier de l’application est solide.

## 26. Conclusion

Ce plan de tests permet de sécuriser la mise en production de **SENCAILLE Finance**.

Il vérifie les trois dimensions essentielles de l’application :

1. **Exactitude financière**
   Les soldes, paiements, crédits et dettes doivent être justes.

2. **Sécurité des droits**
   Chaque utilisateur doit agir uniquement dans son périmètre autorisé.

3. **Simplicité d’usage**
   L’application doit être claire, rapide et utilisable sur smartphone.

La V1 ne doit être utilisée avec les vraies données de SENCAILLE qu’après validation complète de ces tests.
