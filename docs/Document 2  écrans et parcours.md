# Document 2

# Liste détaillée des écrans et parcours utilisateurs

# Application SENCAILLE Finance

## 1. Objectif du document

Ce document décrit les écrans principaux, la navigation mobile-first et les parcours utilisateurs de l’application **SENCAILLE Finance**.

Il sert de base pour :

* la conception de la maquette avec Google Stitch ;
* la création du design system ;
* la structuration des composants ;
* la préparation du développement avec Gemini ;
* la vérification de la cohérence fonctionnelle avant le codage.

L’application doit rester simple, claire, rapide et adaptée en priorité au smartphone.

## 2. Rappel du positionnement de l’application

**SENCAILLE Finance** est une application web mobile-first, 100 % en ligne, destinée à gérer :

* les recettes ;
* les dépenses ;
* les paiements WAVE ;
* les paiements en espèces ;
* les ventes à crédit ;
* les achats à crédit ;
* les paiements partiels ;
* les catégories d’opérations ;
* les utilisateurs ;
* les rapports mensuels.

L’application est multi-utilisateurs. Chaque utilisateur possède son propre compte. L’application enregistre automatiquement l’auteur de chaque opération.

## 3. Principes généraux de navigation

L’application doit être pensée pour une utilisation quotidienne sur smartphone.

### 3.1 Navigation principale

La navigation principale doit être placée en bas de l’écran.

Elle doit contenir 5 entrées principales :

1. **Accueil**
2. **Saisir**
3. **Historique**
4. **Crédits**
5. **Rapports**

### 3.2 Menu secondaire

Un menu secondaire, accessible depuis l’icône profil ou un bouton “Plus”, doit contenir :

* Catégories
* Utilisateurs
* Paramètres
* Déconnexion

### 3.3 Bouton principal

Le bouton **Saisir** doit être très visible, car c’est l’action la plus fréquente de l’application.

Il doit permettre d’accéder rapidement à :

* nouvelle recette ;
* nouvelle dépense.

Dans la V1, on peut utiliser un seul formulaire appelé **Nouvelle opération**, avec un choix initial entre recette et dépense.

## 4. Liste globale des écrans de la V1

La V1 de SENCAILLE Finance doit contenir les écrans suivants :

1. Écran de connexion
2. Tableau de bord
3. Nouvelle opération
4. Création rapide de catégorie
5. Historique des opérations
6. Détail d’une opération
7. Modification d’une opération
8. Clients débiteurs
9. Fournisseurs à payer
10. Enregistrer un paiement
11. Rapports mensuels
12. Gestion des catégories
13. Gestion des utilisateurs
14. Paramètres généraux
15. Profil / Déconnexion

Pour garder la maquette Google Stitch simple, certains écrans peuvent être regroupés.

Exemple :

* Clients débiteurs et fournisseurs à payer peuvent être regroupés dans un écran **Crédits** avec deux onglets.
* Gestion des utilisateurs et paramètres peuvent être regroupés dans un écran **Plus** ou **Administration**.
* Création rapide de catégorie peut être modélisée comme une fenêtre modale dans l’écran Nouvelle opération.

## 5. Écran 1 — Connexion

### 5.1 Objectif

Permettre à chaque utilisateur d’accéder à son espace personnel.

### 5.2 Éléments à afficher

L’écran doit contenir :

* logo ou nom **SENCAILLE Finance** ;
* texte court : “Gestion des recettes et dépenses” ;
* champ email ou identifiant ;
* champ mot de passe ;
* bouton **Se connecter** ;
* lien éventuel “Mot de passe oublié” ;
* message d’erreur en cas d’identifiants incorrects.

### 5.3 Comportement attendu

Après connexion :

* l’administrateur est redirigé vers le tableau de bord global ;
* l’utilisateur simple est redirigé vers le tableau de bord ou son espace de saisie selon les droits définis.

### 5.4 Règles

* Un utilisateur désactivé ne doit pas pouvoir se connecter.
* L’application doit reconnaître le rôle de l’utilisateur connecté.
* L’application doit charger automatiquement son profil.

## 6. Écran 2 — Tableau de bord

### 6.1 Objectif

Afficher rapidement la situation financière de SENCAILLE.

L’écran doit répondre immédiatement à ces questions :

* Combien avons-nous dans WAVE ?
* Combien avons-nous en caisse ?
* Combien avons-nous encaissé ce mois-ci ?
* Combien avons-nous dépensé ce mois-ci ?
* Combien les clients nous doivent-ils ?
* Combien devons-nous aux fournisseurs ?

### 6.2 Éléments à afficher

L’écran doit afficher des cartes statistiques.

### 6.3 Cartes principales

Carte 1 : **Solde WAVE**

* Montant actuel du compte WAVE
* Exemple : 325 000 FCFA

Carte 2 : **Solde caisse**

* Montant actuel disponible en espèces
* Exemple : 75 000 FCFA

Carte 3 : **Solde total disponible**

* WAVE + caisse
* Exemple : 400 000 FCFA

Carte 4 : **Résultat du mois**

* Recettes encaissées - dépenses payées
* Exemple : +125 000 FCFA

### 6.4 Section “Ce mois-ci”

Afficher :

* recettes encaissées ;
* dépenses payées ;
* ventes à crédit ;
* achats à crédit ;
* résultat de trésorerie.

### 6.5 Section “Crédits à surveiller”

Afficher :

* total clients débiteurs ;
* total fournisseurs à payer ;
* balance nette des crédits.

### 6.6 Section “Dernières opérations”

Afficher les 5 dernières opérations :

* type ;
* catégorie ;
* montant ;
* date ;
* auteur ;
* statut de paiement.

### 6.7 Actions rapides

Afficher des boutons :

* **Nouvelle opération**
* **Voir l’historique**
* **Voir les crédits**
* **Rapport du mois**

## 7. Écran 3 — Nouvelle opération

### 7.1 Objectif

Permettre la saisie rapide d’une recette ou d’une dépense.

C’est l’écran central de l’application.

### 7.2 Structure du formulaire

Le formulaire doit être simple, vertical et adapté au mobile.

Champs à afficher :

1. Type d’opération
2. Catégorie
3. Montant total
4. Mode de règlement
5. Moyen de paiement
6. Montant payé
7. Client ou fournisseur
8. Date de l’opération
9. Description
10. Justificatif facultatif
11. Bouton Enregistrer

### 7.3 Champ “Type d’opération”

Choix possibles :

* Recette
* Dépense

Le choix du type détermine les catégories disponibles.

### 7.4 Champ “Catégorie”

La liste des catégories dépend du type choisi.

Si le type est **Recette**, afficher uniquement les catégories de recettes.

Si le type est **Dépense**, afficher uniquement les catégories de dépenses.

Ajouter une option :

**+ Créer une nouvelle catégorie**

### 7.5 Champ “Montant total”

Saisie numérique en FCFA.

Règles :

* obligatoire ;
* supérieur à zéro ;
* sans valeur négative.

### 7.6 Champ “Mode de règlement”

Choix possibles :

* Payé totalement
* À crédit
* Paiement partiel

### 7.7 Champ “Moyen de paiement”

À afficher seulement si une somme est payée.

Choix possibles :

* WAVE
* Espèces

### 7.8 Champ “Montant payé”

Comportement selon le mode de règlement :

Si **Payé totalement** :

* montant payé = montant total ;
* champ éventuellement verrouillé ;
* reste à payer = 0.

Si **À crédit** :

* montant payé = 0 ;
* reste à payer = montant total ;
* moyen de paiement non obligatoire.

Si **Paiement partiel** :

* montant payé obligatoire ;
* montant payé inférieur au montant total ;
* reste à payer calculé automatiquement.

### 7.9 Champ “Client ou fournisseur”

Si le type est **Recette** et que l’opération est à crédit ou partiellement payée :

* afficher le champ **Client**.

Si le type est **Dépense** et que l’opération est à crédit ou partiellement payée :

* afficher le champ **Fournisseur**.

### 7.10 Date de l’opération

Par défaut : date du jour.

L’utilisateur peut modifier la date si nécessaire.

### 7.11 Description

Champ texte facultatif mais recommandé.

Exemples :

* Vente de 5 plateaux d’œufs de caille
* Achat de 2 sacs d’aliment
* Paiement transport Thiès
* Avance sur achat vitamines

### 7.12 Justificatif

Facultatif dans la V1.

Peut contenir :

* capture WAVE ;
* photo reçu ;
* facture ;
* note manuscrite.

### 7.13 Auteur de l’opération

L’auteur ne doit pas être saisi manuellement.

Il est automatiquement défini à partir de l’utilisateur connecté.

### 7.14 Boutons

* **Enregistrer l’opération**
* **Annuler**

### 7.15 Messages de confirmation

Après enregistrement :

* afficher un message de succès ;
* proposer de saisir une nouvelle opération ;
* proposer de voir le détail de l’opération.

## 8. Écran 4 — Création rapide de catégorie

### 8.1 Objectif

Permettre à l’utilisateur de créer une catégorie sans quitter le formulaire de saisie.

### 8.2 Format recommandé

Cet écran peut être une fenêtre modale ou un panneau coulissant.

### 8.3 Champs

* Nom de la catégorie
* Type d’opération lié automatiquement
* Bouton Créer
* Bouton Annuler

### 8.4 Règles

Le type d’opération ne doit pas être choisi manuellement dans cette fenêtre.

Il doit être hérité du formulaire en cours.

Exemple :

* l’utilisateur est en train de saisir une dépense ;
* il crée “Achat désinfectant” ;
* la catégorie est automatiquement créée comme catégorie de dépense.

### 8.5 Vérification des doublons

Avant création, l’application doit vérifier s’il existe déjà une catégorie similaire.

Si une catégorie proche existe, afficher un message :

“Une catégorie proche existe déjà : Achat vitamines. Voulez-vous l’utiliser ?”

Boutons :

* Utiliser la catégorie existante
* Créer quand même

## 9. Écran 5 — Historique des opérations

### 9.1 Objectif

Permettre de consulter les opérations enregistrées.

### 9.2 Présentation mobile

Les opérations doivent être affichées sous forme de cartes.

Chaque carte doit afficher :

* type d’opération ;
* catégorie ;
* montant total ;
* montant payé ;
* reste à payer ;
* moyen de paiement ;
* statut de paiement ;
* date ;
* auteur ;
* description courte.

### 9.3 Exemple de carte opération

Recette
Vente œufs de caille
Montant : 20 000 FCFA
Payé : 20 000 FCFA
Moyen : WAVE
Date : 12 juin 2026
Auteur : Bacary
Statut : Payé

### 9.4 Filtres disponibles

L’écran historique doit permettre de filtrer par :

* période ;
* type d’opération ;
* catégorie ;
* auteur ;
* moyen de paiement ;
* statut de paiement.

### 9.5 Filtre période

Options :

* Aujourd’hui
* Cette semaine
* Ce mois
* Mois précédent
* Période personnalisée

### 9.6 Filtre type

Options :

* Tous
* Recette
* Dépense

### 9.7 Filtre catégorie

La liste des catégories dépend du type sélectionné.

Si type = Recette :

* afficher uniquement les catégories de recettes.

Si type = Dépense :

* afficher uniquement les catégories de dépenses.

Si type = Tous :

* afficher les catégories groupées par type.

### 9.8 Filtre auteur

L’administrateur peut filtrer par tous les utilisateurs.

Un utilisateur simple ne doit voir que les filtres autorisés.

### 9.9 Filtre moyen de paiement

Options :

* Tous
* WAVE
* Espèces

### 9.10 Filtre statut de paiement

Options :

* Tous
* Payé
* Non payé
* Partiellement payé

### 9.11 Résumé des résultats filtrés

Lorsque des filtres sont appliqués, l’application doit afficher :

* nombre d’opérations ;
* total payé ;
* total à crédit ;
* total restant à payer ;
* total global.

## 10. Écran 6 — Détail d’une opération

### 10.1 Objectif

Afficher toutes les informations d’une opération.

### 10.2 Informations à afficher

* Type d’opération
* Catégorie
* Montant total
* Montant payé
* Reste à payer
* Mode de règlement
* Moyen de paiement
* Client ou fournisseur
* Date de l’opération
* Description
* Auteur de la saisie
* Date de création
* Dernière modification
* Statut de l’opération
* Justificatif, si disponible

### 10.3 Actions possibles

Pour l’administrateur :

* Modifier
* Supprimer
* Voir l’historique des modifications

Pour l’utilisateur simple :

* Modifier, si l’opération lui appartient
* Supprimer, si l’opération lui appartient

Si l’opération appartient à un autre utilisateur, les boutons Modifier et Supprimer ne doivent pas apparaître.

## 11. Écran 7 — Modification d’une opération

### 11.1 Objectif

Permettre la correction d’une opération existante.

### 11.2 Règles d’accès

L’administrateur peut modifier toutes les opérations.

Un utilisateur simple peut modifier uniquement ses propres opérations.

### 11.3 Champs modifiables

Selon les règles retenues, on peut autoriser la modification de :

* catégorie ;
* montant total ;
* mode de règlement ;
* moyen de paiement ;
* montant payé ;
* client ou fournisseur ;
* date ;
* description ;
* justificatif.

### 11.4 Traçabilité

Toute modification doit être tracée.

L’application doit conserver :

* ancienne valeur ;
* nouvelle valeur ;
* auteur de la modification ;
* date de modification.

### 11.5 Message de confirmation

Avant sauvegarde, afficher :

“Voulez-vous vraiment modifier cette opération ? Cette modification sera enregistrée dans l’historique.”

## 12. Écran 8 — Crédits

### 12.1 Objectif

Permettre le suivi des clients débiteurs et des fournisseurs à payer.

### 12.2 Structure recommandée

L’écran **Crédits** doit contenir deux onglets :

1. Clients débiteurs
2. Fournisseurs à payer

## 13. Onglet Clients débiteurs

### 13.1 Objectif

Afficher toutes les ventes à crédit ou partiellement payées.

### 13.2 Informations à afficher

Chaque carte client doit afficher :

* nom du client ;
* catégorie de vente ;
* montant total ;
* montant déjà payé ;
* reste à payer ;
* date ;
* auteur ;
* statut.

### 13.3 Actions

* Voir le détail
* Enregistrer un paiement
* Filtrer par client
* Filtrer par statut

### 13.4 Résumé en haut d’écran

Afficher :

* nombre de clients débiteurs ;
* montant total à recevoir ;
* montant déjà reçu ;
* montant restant à recevoir.

## 14. Onglet Fournisseurs à payer

### 14.1 Objectif

Afficher tous les achats à crédit ou partiellement payés.

### 14.2 Informations à afficher

Chaque carte fournisseur doit afficher :

* nom du fournisseur ;
* catégorie de dépense ;
* montant total ;
* montant déjà payé ;
* reste à payer ;
* date ;
* auteur ;
* statut.

### 14.3 Actions

* Voir le détail
* Enregistrer un paiement
* Filtrer par fournisseur
* Filtrer par statut

### 14.4 Résumé en haut d’écran

Afficher :

* nombre de fournisseurs à payer ;
* montant total dû ;
* montant déjà payé ;
* montant restant à payer.

## 15. Écran 9 — Enregistrer un paiement

### 15.1 Objectif

Permettre d’enregistrer un paiement lié à une opération à crédit ou partiellement payée.

### 15.2 Deux cas possibles

Cas 1 : paiement reçu d’un client
Cas 2 : paiement effectué à un fournisseur

### 15.3 Champs

* Opération concernée
* Montant restant
* Montant du paiement
* Moyen de paiement : WAVE ou Espèces
* Date du paiement
* Description facultative
* Auteur automatique

### 15.4 Règles

Le montant du paiement ne peut pas être supérieur au reste à payer.

Si le paiement règle totalement le reste à payer :

* statut de l’opération = Payé.

Si le paiement ne règle qu’une partie :

* statut de l’opération = Partiellement payé.

### 15.5 Impact sur les soldes

Paiement reçu d’un client :

* augmente WAVE si moyen = WAVE ;
* augmente caisse si moyen = Espèces.

Paiement effectué à un fournisseur :

* diminue WAVE si moyen = WAVE ;
* diminue caisse si moyen = Espèces.

## 16. Écran 10 — Rapports mensuels

### 16.1 Objectif

Afficher les rapports financiers d’un mois donné.

### 16.2 Sélecteur de période

L’utilisateur doit pouvoir choisir :

* mois en cours ;
* mois précédent ;
* mois personnalisé ;
* année.

### 16.3 Sections du rapport

Le rapport mensuel doit contenir :

1. Résumé de trésorerie
2. Recettes par catégorie
3. Dépenses par catégorie
4. Crédits clients
5. Dettes fournisseurs
6. Activité par utilisateur

### 16.4 Résumé de trésorerie

Afficher :

* solde initial WAVE ;
* solde final WAVE ;
* solde initial caisse ;
* solde final caisse ;
* recettes encaissées ;
* dépenses payées ;
* résultat de trésorerie.

### 16.5 Recettes par catégorie

Afficher pour chaque catégorie :

* nom de la catégorie ;
* nombre d’opérations ;
* total encaissé ;
* total à crédit ;
* total global.

### 16.6 Dépenses par catégorie

Afficher pour chaque catégorie :

* nom de la catégorie ;
* nombre d’opérations ;
* total payé ;
* total à crédit ;
* total global.

### 16.7 Crédits clients

Afficher :

* total créances clients ;
* clients ayant encore un reste à payer ;
* montants reçus ;
* montants restants.

### 16.8 Dettes fournisseurs

Afficher :

* total dettes fournisseurs ;
* fournisseurs encore à payer ;
* montants déjà payés ;
* montants restants.

### 16.9 Activité par utilisateur

Afficher :

* utilisateur ;
* nombre d’opérations saisies ;
* total recettes saisies ;
* total dépenses saisies ;
* nombre de modifications ;
* nombre de suppressions.

### 16.10 Export

L’export PDF peut être prévu plus tard.

Dans la V1, on peut afficher seulement un rapport lisible à l’écran.

## 17. Écran 11 — Gestion des catégories

### 17.1 Objectif

Permettre à l’administrateur de gérer les catégories.

### 17.2 Accès

Écran réservé à l’administrateur.

L’utilisateur simple peut créer une catégorie pendant une saisie si cette permission est activée, mais il ne doit pas gérer toutes les catégories.

### 17.3 Informations à afficher

Pour chaque catégorie :

* nom ;
* type lié : recette ou dépense ;
* statut : active ou désactivée ;
* créée par ;
* date de création.

### 17.4 Actions

* Créer une catégorie
* Modifier une catégorie
* Désactiver une catégorie
* Réactiver une catégorie
* Fusionner deux catégories, éventuellement en V2

### 17.5 Règles

Une catégorie déjà utilisée ne doit pas être supprimée définitivement.

Elle peut être désactivée.

Une catégorie désactivée :

* n’apparaît plus dans les nouvelles saisies ;
* reste visible dans l’historique des anciennes opérations.

## 18. Écran 12 — Gestion des utilisateurs

### 18.1 Objectif

Permettre à l’administrateur de gérer les comptes utilisateurs.

### 18.2 Accès

Écran réservé à l’administrateur.

### 18.3 Informations à afficher

Pour chaque utilisateur :

* nom complet ;
* téléphone ;
* email ou identifiant ;
* rôle ;
* statut ;
* date de création.

### 18.4 Actions

* Créer un utilisateur
* Modifier un utilisateur
* Changer le rôle
* Activer un utilisateur
* Désactiver un utilisateur

### 18.5 Règles

Un utilisateur désactivé ne doit plus pouvoir se connecter.

Un utilisateur simple ne doit pas accéder à la gestion des utilisateurs.

## 19. Écran 13 — Paramètres généraux

### 19.1 Objectif

Permettre à l’administrateur de configurer les paramètres de base.

### 19.2 Champs

* Nom de la ferme
* Nom de l’application
* Devise
* Solde initial WAVE
* Solde initial caisse
* Date de début du suivi
* Autoriser les utilisateurs à créer des catégories : oui/non

### 19.3 Règles

Les soldes initiaux doivent être configurés au démarrage.

Après le début réel de l’utilisation, leur modification doit être réservée à l’administrateur et idéalement tracée.

## 20. Écran 14 — Profil / Déconnexion

### 20.1 Objectif

Permettre à l’utilisateur de voir son profil et de se déconnecter.

### 20.2 Informations à afficher

* nom de l’utilisateur ;
* rôle ;
* téléphone ;
* email ou identifiant ;
* statut ;
* bouton déconnexion.

### 20.3 Actions

* Se déconnecter
* Modifier certaines informations personnelles, éventuellement en V2

## 21. Parcours utilisateur 1 — Connexion

### Acteur

Administrateur ou utilisateur simple.

### Étapes

1. L’utilisateur ouvre l’application.
2. Il arrive sur l’écran de connexion.
3. Il saisit son email ou identifiant.
4. Il saisit son mot de passe.
5. Il clique sur **Se connecter**.
6. L’application vérifie les identifiants.
7. L’application récupère le profil et le rôle.
8. L’utilisateur est redirigé vers le tableau de bord.

### Résultat attendu

L’utilisateur accède à l’application avec les droits correspondant à son rôle.

## 22. Parcours utilisateur 2 — Saisir une recette payée par WAVE

### Acteur

Administrateur ou utilisateur simple.

### Étapes

1. L’utilisateur clique sur **Saisir**.
2. Il choisit **Recette**.
3. Il sélectionne une catégorie, par exemple **Vente œufs de caille**.
4. Il saisit le montant total.
5. Il choisit **Payé totalement**.
6. Il choisit le moyen de paiement **WAVE**.
7. Il ajoute une description.
8. Il clique sur **Enregistrer l’opération**.

### Résultat attendu

L’opération est enregistrée.
Le solde WAVE augmente du montant saisi.
L’auteur de la saisie est automatiquement enregistré.

## 23. Parcours utilisateur 3 — Saisir une dépense payée en espèces

### Acteur

Administrateur ou utilisateur simple.

### Étapes

1. L’utilisateur clique sur **Saisir**.
2. Il choisit **Dépense**.
3. Il sélectionne une catégorie, par exemple **Transport**.
4. Il saisit le montant total.
5. Il choisit **Payé totalement**.
6. Il choisit le moyen de paiement **Espèces**.
7. Il ajoute une description.
8. Il clique sur **Enregistrer l’opération**.

### Résultat attendu

L’opération est enregistrée.
Le solde caisse diminue du montant saisi.
L’auteur de la saisie est automatiquement enregistré.

## 24. Parcours utilisateur 4 — Saisir une vente à crédit

### Acteur

Administrateur ou utilisateur simple.

### Étapes

1. L’utilisateur clique sur **Saisir**.
2. Il choisit **Recette**.
3. Il sélectionne une catégorie, par exemple **Vente cailleteaux**.
4. Il saisit le montant total.
5. Il choisit **À crédit**.
6. Il renseigne le nom du client.
7. Il ajoute une description.
8. Il enregistre l’opération.

### Résultat attendu

L’opération est enregistrée comme vente à crédit.
Le solde WAVE ne change pas.
Le solde caisse ne change pas.
Le client apparaît dans la liste des clients débiteurs.

## 25. Parcours utilisateur 5 — Saisir un achat à crédit

### Acteur

Administrateur ou utilisateur simple.

### Étapes

1. L’utilisateur clique sur **Saisir**.
2. Il choisit **Dépense**.
3. Il sélectionne une catégorie, par exemple **Achat aliment volaille**.
4. Il saisit le montant total.
5. Il choisit **À crédit**.
6. Il renseigne le nom du fournisseur.
7. Il ajoute une description.
8. Il enregistre l’opération.

### Résultat attendu

L’opération est enregistrée comme achat à crédit.
Le solde WAVE ne change pas.
Le solde caisse ne change pas.
Le fournisseur apparaît dans la liste des fournisseurs à payer.

## 26. Parcours utilisateur 6 — Saisir une opération avec paiement partiel

### Acteur

Administrateur ou utilisateur simple.

### Étapes

1. L’utilisateur clique sur **Saisir**.
2. Il choisit recette ou dépense.
3. Il sélectionne une catégorie.
4. Il saisit le montant total.
5. Il choisit **Paiement partiel**.
6. Il saisit le montant payé.
7. Il choisit WAVE ou Espèces.
8. Il renseigne le client ou le fournisseur.
9. L’application calcule automatiquement le reste à payer.
10. Il enregistre l’opération.

### Résultat attendu

L’opération est enregistrée.
Le solde concerné est modifié uniquement du montant payé.
Le reste à payer est suivi dans le module Crédits.

## 27. Parcours utilisateur 7 — Créer une catégorie pendant la saisie

### Acteur

Administrateur ou utilisateur simple, si autorisé.

### Étapes

1. L’utilisateur commence une nouvelle opération.
2. Il choisit le type : Recette ou Dépense.
3. Il cherche une catégorie.
4. La catégorie n’existe pas.
5. Il clique sur **+ Créer une nouvelle catégorie**.
6. Il saisit le nom de la catégorie.
7. L’application rattache automatiquement la catégorie au type choisi.
8. L’utilisateur valide.
9. La nouvelle catégorie est sélectionnée dans le formulaire.
10. L’utilisateur termine la saisie de l’opération.

### Résultat attendu

La catégorie est créée et immédiatement utilisable.
Elle est liée au bon type d’opération.

## 28. Parcours utilisateur 8 — Filtrer les opérations

### Acteur

Administrateur ou utilisateur simple.

### Étapes

1. L’utilisateur ouvre l’écran **Historique**.
2. Il clique sur **Filtrer**.
3. Il choisit une période.
4. Il choisit un type d’opération.
5. Il choisit une catégorie liée au type choisi.
6. Il applique les filtres.

### Résultat attendu

L’application affiche uniquement les opérations correspondant aux critères.

Elle affiche aussi :

* nombre d’opérations ;
* total payé ;
* total à crédit ;
* total restant à payer ;
* total global.

## 29. Parcours utilisateur 9 — Enregistrer un paiement client

### Acteur

Administrateur ou utilisateur autorisé.

### Étapes

1. L’utilisateur ouvre l’écran **Crédits**.
2. Il va dans l’onglet **Clients débiteurs**.
3. Il sélectionne une vente à crédit.
4. Il clique sur **Enregistrer un paiement**.
5. Il saisit le montant payé.
6. Il choisit WAVE ou Espèces.
7. Il ajoute éventuellement une description.
8. Il valide.

### Résultat attendu

Le montant payé est ajouté à l’opération.
Le reste à payer diminue.
Le solde WAVE ou caisse augmente.
Le statut est mis à jour.

## 30. Parcours utilisateur 10 — Enregistrer un paiement fournisseur

### Acteur

Administrateur ou utilisateur autorisé.

### Étapes

1. L’utilisateur ouvre l’écran **Crédits**.
2. Il va dans l’onglet **Fournisseurs à payer**.
3. Il sélectionne une dette fournisseur.
4. Il clique sur **Enregistrer un paiement**.
5. Il saisit le montant payé.
6. Il choisit WAVE ou Espèces.
7. Il ajoute éventuellement une description.
8. Il valide.

### Résultat attendu

Le montant payé est ajouté à l’opération.
Le reste à payer diminue.
Le solde WAVE ou caisse diminue.
Le statut est mis à jour.

## 31. Parcours utilisateur 11 — Modifier une opération

### Acteur

Administrateur ou utilisateur propriétaire de l’opération.

### Étapes

1. L’utilisateur ouvre l’historique.
2. Il sélectionne une opération.
3. Il clique sur **Modifier**.
4. Il corrige les informations nécessaires.
5. Il valide la modification.
6. L’application enregistre l’ancienne et la nouvelle version.

### Résultat attendu

L’opération est mise à jour.
Les soldes sont recalculés si nécessaire.
La modification est tracée.

## 32. Parcours utilisateur 12 — Supprimer une opération

### Acteur

Administrateur ou utilisateur propriétaire de l’opération.

### Étapes

1. L’utilisateur ouvre le détail d’une opération.
2. Il clique sur **Supprimer**.
3. L’application affiche une confirmation.
4. L’utilisateur confirme.
5. L’opération est marquée comme supprimée.

### Résultat attendu

L’opération disparaît des listes et rapports normaux.
Elle reste conservée dans l’historique administrateur.
Les soldes sont recalculés si nécessaire.

## 33. Parcours administrateur 1 — Créer un utilisateur

### Acteur

Administrateur.

### Étapes

1. L’administrateur ouvre **Utilisateurs**.
2. Il clique sur **Nouvel utilisateur**.
3. Il renseigne le nom.
4. Il renseigne le téléphone.
5. Il renseigne l’email ou identifiant.
6. Il choisit le rôle.
7. Il active le compte.
8. Il enregistre.

### Résultat attendu

Le nouvel utilisateur peut accéder à l’application avec les droits définis.

## 34. Parcours administrateur 2 — Gérer les catégories

### Acteur

Administrateur.

### Étapes

1. L’administrateur ouvre **Catégories**.
2. Il consulte les catégories existantes.
3. Il crée, modifie ou désactive une catégorie.
4. Il vérifie le type lié : Recette ou Dépense.
5. Il enregistre.

### Résultat attendu

Les catégories sont disponibles selon leur type dans le formulaire de saisie.

## 35. Parcours administrateur 3 — Consulter un rapport mensuel

### Acteur

Administrateur.

### Étapes

1. L’administrateur ouvre **Rapports**.
2. Il choisit le mois.
3. Il consulte le résumé financier.
4. Il consulte les recettes par catégorie.
5. Il consulte les dépenses par catégorie.
6. Il consulte les crédits clients.
7. Il consulte les dettes fournisseurs.
8. Il consulte l’activité par utilisateur.

### Résultat attendu

L’administrateur obtient une vision claire de la situation financière mensuelle.

## 36. Règles d’affichage selon le rôle

### 36.1 Administrateur

L’administrateur voit :

* toutes les opérations ;
* tous les utilisateurs ;
* toutes les catégories ;
* tous les rapports ;
* tous les crédits ;
* tous les fournisseurs à payer ;
* tous les soldes ;
* toutes les actions de modification et suppression.

### 36.2 Utilisateur simple

L’utilisateur simple voit :

* ses propres opérations ;
* les opérations qu’il est autorisé à consulter, si cette option est activée ;
* les crédits qu’il a saisis, si cette restriction est appliquée ;
* ses propres actions.

Il ne voit pas :

* la gestion complète des utilisateurs ;
* les paramètres sensibles ;
* les actions de modification sur les opérations des autres.

## 37. Éléments visuels recommandés

### 37.1 Style général

L’application doit avoir un style :

* mobile-first ;
* moderne ;
* sobre ;
* sombre ou semi-sombre ;
* lisible ;
* professionnel ;
* adapté à une activité agricole.

### 37.2 Couleurs recommandées

* Noir bleuté pour le fond principal ;
* Vert foncé pour l’identité agricole ;
* Vert clair pour les recettes ;
* Orange ou jaune pour les alertes ;
* Rouge discret pour les dépenses ou dettes ;
* Blanc cassé pour le texte principal.

### 37.3 Composants recommandés

* cartes statistiques ;
* boutons larges ;
* formulaires verticaux ;
* onglets ;
* badges de statut ;
* filtres en panneau coulissant ;
* listes en cartes ;
* icônes simples.

## 38. Badges de statut recommandés

### 38.1 Statut paiement

* Payé
* Non payé
* Partiellement payé

### 38.2 Type d’opération

* Recette
* Dépense

### 38.3 Moyen de paiement

* WAVE
* Espèces

### 38.4 Statut utilisateur

* Actif
* Désactivé

## 39. Priorité des écrans pour Google Stitch

Pour éviter une maquette trop lourde, Google Stitch doit d’abord créer les écrans prioritaires suivants :

1. Connexion
2. Tableau de bord
3. Nouvelle opération
4. Historique avec filtres
5. Crédits avec deux onglets
6. Rapports mensuels
7. Catégories
8. Utilisateurs / Paramètres

Les autres écrans peuvent être suggérés comme variantes ou états secondaires :

* détail opération ;
* modification opération ;
* création rapide de catégorie ;
* enregistrer paiement.

## 40. Synthèse finale

La V1 de SENCAILLE Finance doit être organisée autour de 5 actions principales :

1. Voir la situation financière
2. Saisir une opération
3. Consulter l’historique
4. Suivre les crédits
5. Lire les rapports

Les écrans doivent rester simples et hiérarchisés.

Le parcours le plus important est :

Connexion → Accueil → Saisir → Enregistrer → Historique → Rapport

Le deuxième parcours stratégique est :

Saisir une opération à crédit → Crédits → Enregistrer un paiement → Mise à jour du solde

Le troisième parcours stratégique est :

Historique → Filtrer → Consulter le total → Corriger si nécessaire

Cette structure garantit une application simple, intuitive et suffisamment solide pour la gestion quotidienne des recettes et dépenses de SENCAILLE.
