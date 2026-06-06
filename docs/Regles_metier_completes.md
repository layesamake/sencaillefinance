# Document 4

# Règles métier complètes

# Application SENCAILLE Finance

## 1. Objectif du document

Ce document définit les règles métier de l’application **SENCAILLE Finance**.

Les règles métier indiquent précisément comment l’application doit se comporter dans chaque situation :

* création d’une recette ;
* création d’une dépense ;
* vente à crédit ;
* achat à crédit ;
* paiement partiel ;
* paiement complémentaire ;
* calcul des soldes ;
* gestion des catégories ;
* gestion des utilisateurs ;
* modification ;
* suppression ;
* filtrage ;
* rapports mensuels ;
* sécurité ;
* traçabilité.

Ce document doit être respecté pendant le développement.
Il est destiné à guider Gemini lors du codage de l’application.

## 2. Principe général de l’application

SENCAILLE Finance est une application web mobile-first, 100 % en ligne, multi-utilisateurs, destinée à suivre les recettes, dépenses, crédits clients, dettes fournisseurs, paiements WAVE, paiements en espèces et rapports mensuels de SENCAILLE.

L’application doit être simple, mais fiable.

Le principe fondamental est le suivant :

**L’application doit toujours distinguer l’activité économique et la trésorerie réellement disponible.**

Une vente à crédit est une activité économique, mais ce n’est pas encore de l’argent disponible.
Un achat à crédit est une dépense engagée, mais ce n’est pas encore une sortie réelle d’argent.
Seuls les paiements effectivement reçus ou effectués modifient les soldes WAVE ou caisse.

## 3. Règle centrale de trésorerie

L’application doit respecter la règle suivante :

**Un solde ne change que lorsqu’un paiement réel est enregistré.**

Cela signifie :

* une recette payée augmente un solde ;
* une dépense payée diminue un solde ;
* une vente à crédit ne change pas encore les soldes ;
* un achat à crédit ne change pas encore les soldes ;
* un paiement reçu d’un client augmente un solde ;
* un paiement effectué à un fournisseur diminue un solde.

## 4. Règles sur les types d’opérations

L’application doit gérer deux types principaux d’opérations :

1. Recette
2. Dépense

## 4.1 Recette

Une recette correspond à une vente ou à une entrée d’argent liée à l’activité de SENCAILLE.

Exemples :

* vente œufs de caille ;
* vente œufs fécondés ;
* vente cailleteaux ;
* vente cailles reproductrices ;
* vente chair de caille ;
* vente poussins ;
* vente cages ;
* vente accessoires ;
* autres recettes.

## 4.2 Dépense

Une dépense correspond à un achat ou à une sortie d’argent liée à l’activité de SENCAILLE.

Exemples :

* achat aliment volaille ;
* achat vitamines ;
* achat médicaments ;
* achat caille préponte ;
* achat reproducteurs ;
* achat emballages ;
* transport ;
* main-d’œuvre ;
* réparation matériel ;
* communication ;
* eau ;
* électricité ;
* achat matériel ;
* autres dépenses.

## 4.3 Règle de séparation

Une opération doit toujours être soit une recette, soit une dépense.

Une opération ne peut pas être à la fois une recette et une dépense.

## 5. Règles sur les catégories

## 5.1 Catégorie obligatoire

Toute opération doit être associée à une catégorie.

Une opération sans catégorie ne doit pas être enregistrée.

## 5.2 Catégorie liée au type d’opération

Chaque catégorie doit être liée à un seul type d’opération :

* recette ;
* dépense.

Une catégorie de recette ne peut être utilisée que pour une recette.
Une catégorie de dépense ne peut être utilisée que pour une dépense.

## 5.3 Affichage dynamique des catégories

Lorsque l’utilisateur choisit le type d’opération, l’application doit afficher uniquement les catégories correspondant à ce type.

Si le type choisi est **Recette**, l’application affiche uniquement les catégories de recettes.

Si le type choisi est **Dépense**, l’application affiche uniquement les catégories de dépenses.

## 5.4 Création d’une catégorie pendant la saisie

Lorsqu’une catégorie n’existe pas encore, l’application doit permettre sa création directement depuis le formulaire de saisie.

La nouvelle catégorie doit être automatiquement liée au type d’opération en cours.

Exemple :

* type sélectionné : Dépense ;
* catégorie créée : Achat désinfectant ;
* résultat : Achat désinfectant devient une catégorie de dépense.

## 5.5 Protection contre les doublons

Avant de créer une nouvelle catégorie, l’application doit vérifier s’il existe déjà une catégorie identique ou très proche.

Exemples de doublons à éviter :

* Achat vitamine / Achat vitamines ;
* Vente œuf caille / Vente œufs de caille ;
* Transport / Frais transport.

Si une catégorie proche existe, l’application doit proposer de l’utiliser.

## 5.6 Désactivation des catégories

Une catégorie déjà utilisée dans une opération ne doit pas être supprimée définitivement.

Elle peut être désactivée.

Une catégorie désactivée :

* ne doit plus apparaître dans les nouvelles saisies ;
* doit rester visible dans les anciennes opérations ;
* doit rester disponible dans les rapports historiques.

## 6. Règles sur les moyens de paiement

L’application doit gérer deux moyens de paiement :

1. WAVE
2. Espèces

## 6.1 Paiement par WAVE

Lorsqu’une recette est payée par WAVE, le solde WAVE augmente.

Lorsqu’une dépense est payée par WAVE, le solde WAVE diminue.

## 6.2 Paiement en espèces

Lorsqu’une recette est payée en espèces, le solde caisse augmente.

Lorsqu’une dépense est payée en espèces, le solde caisse diminue.

## 6.3 Moyen de paiement obligatoire

Le moyen de paiement est obligatoire lorsqu’un montant est réellement payé.

Donc le moyen de paiement est obligatoire dans les cas suivants :

* opération payée totalement ;
* opération partiellement payée ;
* paiement complémentaire d’un client ;
* paiement complémentaire à un fournisseur.

Le moyen de paiement n’est pas obligatoire si l’opération est entièrement à crédit, car aucun paiement n’a encore été effectué.

## 7. Règles sur les modes de règlement

L’application doit gérer trois modes de règlement :

1. Payé totalement
2. À crédit
3. Paiement partiel

## 7.1 Opération payée totalement

Une opération payée totalement signifie que la totalité du montant a été réglée au moment de la saisie.

Règles :

* montant payé = montant total ;
* reste à payer = 0 ;
* moyen de paiement obligatoire ;
* client ou fournisseur non obligatoire ;
* statut de paiement = payé.

Effet sur les soldes :

* recette payée totalement : augmente WAVE ou caisse ;
* dépense payée totalement : diminue WAVE ou caisse.

## 7.2 Opération à crédit

Une opération à crédit signifie qu’aucun paiement n’a été effectué au moment de la saisie.

Règles :

* montant payé = 0 ;
* reste à payer = montant total ;
* moyen de paiement non obligatoire ;
* client obligatoire pour une recette ;
* fournisseur obligatoire pour une dépense ;
* statut de paiement = non payé.

Effet sur les soldes :

* vente à crédit : aucun impact immédiat sur WAVE ou caisse ;
* achat à crédit : aucun impact immédiat sur WAVE ou caisse.

Effet sur les crédits :

* vente à crédit : crée une créance client ;
* achat à crédit : crée une dette fournisseur.

## 7.3 Paiement partiel

Une opération partiellement payée signifie qu’une partie seulement du montant total a été réglée au moment de la saisie.

Règles :

* montant payé > 0 ;
* montant payé < montant total ;
* reste à payer = montant total - montant payé ;
* moyen de paiement obligatoire ;
* client obligatoire pour une recette ;
* fournisseur obligatoire pour une dépense ;
* statut de paiement = partiellement payé.

Effet sur les soldes :

* recette partiellement payée : augmente WAVE ou caisse du montant payé ;
* dépense partiellement payée : diminue WAVE ou caisse du montant payé.

Effet sur les crédits :

* recette partiellement payée : crée une créance client pour le reste ;
* dépense partiellement payée : crée une dette fournisseur pour le reste.

## 8. Règles sur les montants

## 8.1 Montant total

Le montant total est obligatoire.

Il doit être strictement supérieur à zéro.

Il ne peut pas être négatif.

## 8.2 Montant payé

Le montant payé doit respecter les règles suivantes :

* il ne peut pas être négatif ;
* il ne peut pas être supérieur au montant total ;
* il est égal au montant total si l’opération est payée totalement ;
* il est égal à zéro si l’opération est à crédit ;
* il est supérieur à zéro et inférieur au montant total si l’opération est partiellement payée.

## 8.3 Reste à payer

Le reste à payer doit être calculé automatiquement.

Formule :

Reste à payer = montant total - montant total payé

Le reste à payer ne doit jamais être négatif.

## 8.4 Arrondis

Les montants doivent être saisis et affichés en FCFA.

Pour la V1, les montants peuvent être gérés sans décimales.

## 9. Règles sur les clients et fournisseurs

## 9.1 Client obligatoire pour les crédits de recettes

Lorsqu’une recette est à crédit ou partiellement payée, le client est obligatoire.

Exemples :

* vente d’œufs à crédit ;
* vente de cailleteaux avec avance ;
* vente de cages avec reste à payer.

## 9.2 Fournisseur obligatoire pour les crédits de dépenses

Lorsqu’une dépense est à crédit ou partiellement payée, le fournisseur est obligatoire.

Exemples :

* achat aliment à crédit ;
* achat vitamines avec avance ;
* réparation matériel à payer plus tard.

## 9.3 Client ou fournisseur non obligatoire pour les opérations totalement payées

Pour une opération payée totalement, le client ou fournisseur peut être facultatif.

L’application peut permettre de le renseigner, mais ne doit pas l’exiger.

## 9.4 Création rapide de client ou fournisseur

Si le client ou fournisseur n’existe pas encore, l’application peut permettre sa création rapide pendant la saisie.

La création rapide doit demander au minimum :

* nom ;
* type : client ou fournisseur ;
* téléphone facultatif.

## 10. Règles sur les paiements complémentaires

## 10.1 Paiement complémentaire lié à une opération

Un paiement complémentaire doit toujours être lié à une opération existante.

Il ne faut pas créer une nouvelle recette lorsqu’un client paie une dette.
Il ne faut pas créer une nouvelle dépense lorsqu’on paie une dette fournisseur.

Le paiement doit être rattaché à l’opération d’origine.

## 10.2 Paiement reçu d’un client

Lorsqu’un client paie tout ou partie de sa dette :

* créer un paiement lié à l’opération de vente ;
* augmenter le solde WAVE ou caisse selon le moyen choisi ;
* diminuer le reste à payer ;
* mettre à jour le statut de paiement.

## 10.3 Paiement fait à un fournisseur

Lorsqu’un fournisseur est payé totalement ou partiellement :

* créer un paiement lié à l’opération d’achat ;
* diminuer le solde WAVE ou caisse selon le moyen choisi ;
* diminuer le reste à payer ;
* mettre à jour le statut de paiement.

## 10.4 Montant du paiement complémentaire

Le montant d’un paiement complémentaire doit être :

* supérieur à zéro ;
* inférieur ou égal au reste à payer.

L’application doit refuser un paiement supérieur au reste à payer.

## 10.5 Statut après paiement

Après chaque paiement, l’application doit recalculer le statut.

Si le reste à payer devient zéro :

* statut = payé.

Si le reste à payer reste supérieur à zéro :

* statut = partiellement payé.

## 11. Règles sur les statuts de paiement

L’application doit utiliser trois statuts de paiement :

1. Non payé
2. Partiellement payé
3. Payé

## 11.1 Non payé

Une opération est non payée lorsque le total payé est égal à zéro.

## 11.2 Partiellement payé

Une opération est partiellement payée lorsque :

* total payé > 0 ;
* total payé < montant total.

## 11.3 Payé

Une opération est payée lorsque :

* total payé = montant total ;
* reste à payer = 0.

## 11.4 Statut calculé automatiquement

Le statut de paiement doit être calculé automatiquement.

L’utilisateur ne doit pas choisir manuellement le statut final.

## 12. Règles sur les comptes financiers

L’application doit gérer au minimum deux comptes financiers :

1. WAVE SENCAILLE
2. Caisse SENCAILLE

## 12.1 Compte WAVE

Le compte WAVE reçoit les recettes payées par WAVE.

Il est diminué par les dépenses payées par WAVE.

## 12.2 Compte caisse

Le compte caisse reçoit les recettes payées en espèces.

Il est diminué par les dépenses payées en espèces.

## 12.3 Solde initial

Chaque compte doit avoir un solde initial.

Le solde initial doit être défini au démarrage de l’utilisation réelle de l’application.

Après le démarrage, toute modification du solde initial doit être réservée à l’administrateur et tracée.

## 12.4 Calcul du solde WAVE

Le solde WAVE doit être calculé à partir :

* du solde initial WAVE ;
* des recettes payées initialement par WAVE ;
* des paiements clients reçus par WAVE ;
* des dépenses payées initialement par WAVE ;
* des paiements fournisseurs effectués par WAVE.

Formule :

Solde WAVE = solde initial WAVE + recettes WAVE + paiements clients WAVE - dépenses WAVE - paiements fournisseurs WAVE

## 12.5 Calcul du solde caisse

Le solde caisse doit être calculé à partir :

* du solde initial caisse ;
* des recettes payées initialement en espèces ;
* des paiements clients reçus en espèces ;
* des dépenses payées initialement en espèces ;
* des paiements fournisseurs effectués en espèces.

Formule :

Solde caisse = solde initial caisse + recettes espèces + paiements clients espèces - dépenses espèces - paiements fournisseurs espèces

## 12.6 Solde total disponible

Le solde total disponible se calcule ainsi :

Solde total disponible = solde WAVE + solde caisse

## 13. Règles sur les mouvements internes WAVE / caisse

Même si la V1 reste simple, il faut prévoir une règle importante.

Lorsqu’un montant est déplacé de WAVE vers la caisse, ou de la caisse vers WAVE, ce mouvement ne doit pas être considéré comme une recette ou une dépense.

Exemples :

* retrait de WAVE pour alimenter la caisse ;
* dépôt d’espèces vers WAVE ;
* transfert interne entre les deux comptes.

Ces mouvements sont des mouvements internes.

Ils ne doivent pas apparaître dans les rapports de recettes et dépenses.

Pour la V1, deux options existent :

Option A : ne pas gérer les mouvements internes dans l’application.
Dans ce cas, les soldes doivent être ajustés uniquement par l’administrateur.

Option B : ajouter un petit module “Transfert interne”.
Dans ce cas, le transfert diminue un compte et augmente l’autre sans modifier le résultat.

Recommandation fonctionnelle :

Même si l’écran n’est pas prioritaire, le modèle doit prévoir la possibilité d’ajouter plus tard les transferts internes sans casser la structure.

## 14. Règles sur les créances clients

## 14.1 Définition

Une créance client est une somme que SENCAILLE doit recevoir d’un client.

Elle apparaît lorsqu’une recette n’est pas totalement payée.

## 14.2 Créance créée automatiquement

Une créance client doit être créée automatiquement lorsqu’une recette est :

* à crédit ;
* partiellement payée.

## 14.3 Montant de la créance

Le montant de la créance correspond au reste à payer.

Formule :

Créance client = montant total de la vente - total payé par le client

## 14.4 Mise à jour de la créance

À chaque paiement client, la créance diminue.

Lorsque le reste à payer devient zéro, la créance est considérée comme réglée.

## 14.5 Affichage des clients débiteurs

Le module crédits doit afficher uniquement les recettes dont le reste à payer est supérieur à zéro.

## 15. Règles sur les dettes fournisseurs

## 15.1 Définition

Une dette fournisseur est une somme que SENCAILLE doit payer à un fournisseur.

Elle apparaît lorsqu’une dépense n’est pas totalement payée.

## 15.2 Dette créée automatiquement

Une dette fournisseur doit être créée automatiquement lorsqu’une dépense est :

* à crédit ;
* partiellement payée.

## 15.3 Montant de la dette

Le montant de la dette correspond au reste à payer.

Formule :

Dette fournisseur = montant total de l’achat - total payé au fournisseur

## 15.4 Mise à jour de la dette

À chaque paiement fournisseur, la dette diminue.

Lorsque le reste à payer devient zéro, la dette est considérée comme réglée.

## 15.5 Affichage des fournisseurs à payer

Le module crédits doit afficher uniquement les dépenses dont le reste à payer est supérieur à zéro.

## 16. Règles sur les utilisateurs

## 16.1 Utilisateur obligatoire

Toute opération doit avoir un auteur.

L’auteur est automatiquement l’utilisateur connecté.

L’utilisateur ne doit pas pouvoir choisir manuellement l’auteur d’une opération.

## 16.2 Rôles

L’application doit gérer deux rôles :

1. Administrateur
2. Utilisateur simple

## 16.3 Administrateur

L’administrateur peut :

* créer des utilisateurs ;
* modifier des utilisateurs ;
* désactiver des utilisateurs ;
* voir toutes les opérations ;
* modifier toutes les opérations ;
* supprimer toutes les opérations ;
* gérer toutes les catégories ;
* consulter tous les rapports ;
* modifier les paramètres ;
* voir les journaux d’audit.

## 16.4 Utilisateur simple

L’utilisateur simple peut :

* créer une opération ;
* voir ses propres opérations ;
* modifier ses propres opérations ;
* supprimer ses propres opérations ;
* enregistrer un paiement sur une opération qu’il est autorisé à gérer ;
* créer une catégorie pendant la saisie si cette option est activée.

## 16.5 Limites de l’utilisateur simple

L’utilisateur simple ne peut pas :

* modifier les opérations des autres ;
* supprimer les opérations des autres ;
* modifier les utilisateurs ;
* désactiver un utilisateur ;
* modifier les paramètres généraux ;
* accéder aux journaux d’audit ;
* changer son propre rôle ;
* contourner les droits par l’interface ou par la base.

## 16.6 Utilisateur désactivé

Un utilisateur désactivé ne doit plus pouvoir accéder à l’application.

Ses anciennes opérations doivent rester visibles dans les historiques et rapports.

## 17. Règles sur la modification des opérations

## 17.1 Modification autorisée

L’administrateur peut modifier toutes les opérations.

Un utilisateur simple peut modifier uniquement les opérations qu’il a lui-même créées.

## 17.2 Modification interdite

Un utilisateur simple ne peut pas modifier une opération créée par un autre utilisateur.

## 17.3 Traçabilité des modifications

Toute modification importante doit être enregistrée dans l’historique.

L’application doit conserver :

* ancienne valeur ;
* nouvelle valeur ;
* auteur de la modification ;
* date de modification.

## 17.4 Recalcul après modification

Si une modification concerne :

* le montant total ;
* le montant payé ;
* le moyen de paiement ;
* le mode de règlement ;
* le type d’opération ;
* la catégorie ;

alors l’application doit recalculer :

* les soldes ;
* le reste à payer ;
* le statut de paiement ;
* les rapports.

## 17.5 Modification d’une opération déjà partiellement réglée

Si une opération possède déjà des paiements complémentaires, sa modification doit être contrôlée.

Règles recommandées :

* le montant total ne peut pas devenir inférieur au total déjà payé ;
* le changement de type d’opération doit être interdit ou réservé à l’administrateur ;
* le changement de catégorie doit rester dans le même type d’opération ;
* toute modification doit être tracée.

## 18. Règles sur la suppression des opérations

## 18.1 Suppression logique obligatoire

Les opérations ne doivent jamais être supprimées définitivement.

Lorsqu’une opération est supprimée, elle doit être marquée comme supprimée.

## 18.2 Données à conserver

Une opération supprimée doit conserver :

* son identifiant ;
* son type ;
* sa catégorie ;
* son montant ;
* son auteur initial ;
* sa date de création ;
* l’auteur de la suppression ;
* la date de suppression ;
* son historique.

## 18.3 Effet sur les rapports

Les opérations supprimées ne doivent pas apparaître dans les rapports normaux.

Elles peuvent apparaître uniquement dans un historique administrateur.

## 18.4 Effet sur les soldes

Une opération supprimée ne doit plus impacter les soldes.

Les soldes doivent être recalculés en excluant les opérations supprimées.

## 18.5 Suppression des paiements

Les paiements doivent aussi être supprimés logiquement.

Un paiement supprimé ne doit plus impacter les soldes ni le reste à payer.

## 19. Règles sur l’historique

L’historique doit afficher les opérations autorisées selon le rôle.

## 19.1 Historique administrateur

L’administrateur peut voir :

* toutes les opérations actives ;
* les opérations supprimées, dans un espace spécial ;
* toutes les opérations par utilisateur ;
* toutes les modifications ;
* tous les paiements.

## 19.2 Historique utilisateur simple

L’utilisateur simple peut voir :

* ses propres opérations ;
* ses propres paiements ;
* éventuellement les opérations globales si l’administrateur l’autorise.

Pour la V1, la règle la plus sûre est :

**l’utilisateur simple voit uniquement ses propres opérations.**

## 20. Règles sur les filtres

L’application doit permettre de filtrer les opérations.

## 20.1 Filtres obligatoires

Les filtres obligatoires sont :

* période ;
* type d’opération ;
* catégorie ;
* auteur ;
* moyen de paiement ;
* statut de paiement.

## 20.2 Filtre par période

Options recommandées :

* aujourd’hui ;
* cette semaine ;
* ce mois ;
* mois précédent ;
* période personnalisée.

## 20.3 Filtre par type

Options :

* toutes les opérations ;
* recettes ;
* dépenses.

## 20.4 Filtre par catégorie

Le filtre catégorie dépend du type sélectionné.

Si le type sélectionné est recette, afficher uniquement les catégories de recettes.

Si le type sélectionné est dépense, afficher uniquement les catégories de dépenses.

Si aucun type n’est sélectionné, afficher les catégories regroupées par type.

## 20.5 Résumé des résultats filtrés

Lorsque l’utilisateur applique des filtres, l’application doit afficher :

* nombre d’opérations ;
* total global ;
* total payé ;
* total restant à payer ;
* total par moyen de paiement si possible.

## 21. Règles sur les rapports

Les rapports doivent distinguer trois notions :

1. activité ;
2. trésorerie ;
3. crédit.

## 21.1 Rapport d’activité

Le rapport d’activité montre les opérations enregistrées, qu’elles soient payées ou non.

Il permet de savoir :

* total des ventes ;
* total des achats ;
* nombre d’opérations ;
* répartition par catégorie.

## 21.2 Rapport de trésorerie

Le rapport de trésorerie montre uniquement l’argent réellement encaissé ou payé.

Il permet de savoir :

* recettes réellement encaissées ;
* dépenses réellement payées ;
* résultat de trésorerie ;
* solde WAVE ;
* solde caisse ;
* solde total disponible.

## 21.3 Rapport des crédits

Le rapport des crédits montre :

* clients débiteurs ;
* fournisseurs à payer ;
* montants déjà payés ;
* montants restants ;
* balance nette des crédits.

## 21.4 Rapport mensuel

Le rapport mensuel doit afficher :

* recettes encaissées du mois ;
* dépenses payées du mois ;
* résultat de trésorerie du mois ;
* ventes à crédit du mois ;
* achats à crédit du mois ;
* créances clients restantes ;
* dettes fournisseurs restantes ;
* recettes par catégorie ;
* dépenses par catégorie ;
* opérations par utilisateur.

## 21.5 Exclusion des données supprimées

Les opérations et paiements supprimés ne doivent pas être inclus dans les rapports normaux.

## 22. Règles sur le tableau de bord

Le tableau de bord doit afficher les données essentielles.

## 22.1 Données à afficher

Le tableau de bord doit afficher :

* solde WAVE ;
* solde caisse ;
* solde total disponible ;
* recettes encaissées du mois ;
* dépenses payées du mois ;
* résultat du mois ;
* clients débiteurs ;
* fournisseurs à payer ;
* dernières opérations.

## 22.2 Données calculées

Les chiffres du tableau de bord doivent être calculés à partir des opérations actives et des paiements actifs.

Ils ne doivent pas être saisis manuellement.

## 22.3 Données selon le rôle

L’administrateur voit les chiffres globaux.

L’utilisateur simple peut voir :

* soit uniquement ses propres chiffres ;
* soit les chiffres globaux si l’administrateur l’autorise.

Pour la V1, la règle recommandée est :

**l’administrateur voit tout ; l’utilisateur simple voit ses propres opérations.**

## 23. Règles sur les justificatifs

## 23.1 Justificatif facultatif

Le justificatif est facultatif dans la V1.

L’utilisateur peut joindre :

* une capture WAVE ;
* une photo de reçu ;
* une facture ;
* une note manuscrite.

## 23.2 Justificatif lié à une opération ou un paiement

Un justificatif doit être lié :

* soit à une opération ;
* soit à un paiement.

## 23.3 Accès aux justificatifs

L’administrateur peut voir tous les justificatifs.

L’utilisateur simple peut voir les justificatifs liés à ses propres opérations ou paiements.

## 24. Règles de sécurité

## 24.1 Sécurité dans l’interface

L’interface doit masquer les boutons non autorisés.

Exemple :

* un utilisateur simple ne voit pas le bouton Modifier sur une opération créée par quelqu’un d’autre ;
* un utilisateur simple ne voit pas le menu Utilisateurs ;
* un utilisateur simple ne voit pas les paramètres sensibles.

## 24.2 Sécurité dans Supabase

Les règles doivent aussi être appliquées dans Supabase avec Row Level Security.

Il ne faut jamais se contenter de masquer les boutons dans l’interface.

## 24.3 Données sensibles

Les clés Supabase ne doivent jamais être écrites directement dans le code.

Elles doivent être placées dans les variables d’environnement.

## 24.4 Accès administrateur

Seul l’administrateur peut :

* gérer les utilisateurs ;
* modifier les paramètres ;
* consulter les journaux d’audit ;
* restaurer ou contrôler les données supprimées.

## 25. Règles de validation des formulaires

## 25.1 Champs obligatoires pour toute opération

Les champs obligatoires sont :

* type d’opération ;
* catégorie ;
* montant total ;
* mode de règlement ;
* date d’opération.

## 25.2 Champs obligatoires si paiement réel

Si un montant est payé, le moyen de paiement est obligatoire.

## 25.3 Champs obligatoires si crédit

Si une recette est à crédit, le client est obligatoire.

Si une dépense est à crédit, le fournisseur est obligatoire.

## 25.4 Champs obligatoires si paiement partiel

Si l’opération est partiellement payée :

* montant payé obligatoire ;
* moyen de paiement obligatoire ;
* client obligatoire pour une recette ;
* fournisseur obligatoire pour une dépense.

## 25.5 Messages d’erreur

Les messages d’erreur doivent être clairs et en français.

Exemples :

* “Le montant total est obligatoire.”
* “Le montant payé ne peut pas dépasser le montant total.”
* “Veuillez choisir un moyen de paiement.”
* “Veuillez indiquer le client pour cette vente à crédit.”
* “Cette catégorie ne correspond pas au type d’opération choisi.”

## 26. Règles sur les dates

## 26.1 Date d’opération

Chaque opération doit avoir une date d’opération.

Par défaut, l’application propose la date du jour.

L’utilisateur peut modifier la date si l’opération concerne un autre jour.

## 26.2 Date de création

La date de création est générée automatiquement par l’application.

Elle ne doit pas être modifiable par l’utilisateur simple.

## 26.3 Date de paiement

Chaque paiement complémentaire doit avoir une date de paiement.

Par défaut, l’application propose la date du jour.

## 26.4 Rapports mensuels

Les rapports mensuels doivent se baser sur :

* la date d’opération pour l’activité ;
* la date de paiement pour la trésorerie.

C’est très important.

Exemple :

Une vente à crédit faite en mai mais payée en juin :

* apparaît dans l’activité de mai ;
* apparaît dans la trésorerie de juin.

## 27. Règles sur la cohérence activité / trésorerie

L’application doit distinguer :

* la date de la vente ou de l’achat ;
* la date du paiement réel.

Cette distinction permet de produire des rapports justes.

## 27.1 Exemple de vente à crédit

Vente le 20 mai : 50 000 FCFA.
Paiement reçu le 5 juin : 50 000 FCFA.

Dans les rapports :

* activité de mai : vente de 50 000 FCFA ;
* trésorerie de juin : encaissement de 50 000 FCFA.

## 27.2 Exemple d’achat à crédit

Achat le 10 mai : 80 000 FCFA.
Paiement effectué le 3 juin : 80 000 FCFA.

Dans les rapports :

* activité de mai : achat de 80 000 FCFA ;
* trésorerie de juin : paiement de 80 000 FCFA.

## 28. Règles sur la traçabilité

L’application doit garder la trace des actions importantes.

Actions à tracer :

* création d’une opération ;
* modification d’une opération ;
* suppression logique d’une opération ;
* création d’un paiement ;
* modification d’un paiement ;
* suppression logique d’un paiement ;
* modification d’un solde initial ;
* modification d’une catégorie ;
* désactivation d’un utilisateur.

Chaque trace doit contenir :

* action réalisée ;
* table concernée ;
* ancien contenu ;
* nouveau contenu ;
* utilisateur responsable ;
* date et heure.

## 29. Règles sur les erreurs et corrections

## 29.1 Correction par utilisateur simple

Un utilisateur simple peut corriger ses propres opérations.

## 29.2 Correction par administrateur

L’administrateur peut corriger toutes les opérations.

## 29.3 Correction d’une opération ancienne

La modification d’une opération ancienne doit rester possible, mais elle doit être tracée.

Si la modification change les rapports d’un mois déjà consulté, les rapports doivent être recalculés automatiquement.

## 29.4 Annulation plutôt que suppression

Pour les opérations sensibles, il est préférable d’utiliser la suppression logique plutôt qu’une suppression définitive.

## 30. Règles sur les rapports par utilisateur

Le rapport par utilisateur doit permettre de savoir :

* qui a saisi combien d’opérations ;
* qui a saisi quelles recettes ;
* qui a saisi quelles dépenses ;
* qui a modifié des données ;
* qui a supprimé des données.

L’objectif n’est pas de surveiller abusivement, mais d’assurer la traçabilité financière.

## 31. Règles sur l’affichage mobile

L’application doit être agréable sur téléphone.

## 31.1 Formulaires

Les formulaires doivent être verticaux.

Les champs doivent être grands et lisibles.

Les boutons doivent être faciles à toucher.

## 31.2 Listes

Les opérations doivent être affichées sous forme de cartes.

Une carte doit montrer les informations essentielles, pas tout le détail.

## 31.3 Détail

Le détail complet doit être accessible en cliquant sur une carte.

## 31.4 Filtres

Les filtres doivent être dans un panneau ou une fenêtre dédiée pour ne pas surcharger l’écran.

## 32. Règles sur la performance

L’application doit rester rapide.

## 32.1 Chargement initial

Au chargement, l’application doit afficher rapidement :

* le tableau de bord ;
* les dernières opérations ;
* les indicateurs essentiels.

## 32.2 Pagination ou chargement progressif

L’historique ne doit pas charger toutes les opérations d’un coup si la base devient volumineuse.

Il faut prévoir :

* pagination ;
* chargement progressif ;
* filtres.

## 32.3 Rapports

Les rapports doivent être calculés proprement, idéalement avec des requêtes optimisées ou des vues Supabase.

## 33. Règles sur les paramètres

L’administrateur peut gérer les paramètres suivants :

* nom de l’application ;
* nom de la ferme ;
* devise ;
* solde initial WAVE ;
* solde initial caisse ;
* autorisation de création de catégories par les utilisateurs.

## 33.1 Devise

La devise par défaut est :

FCFA

## 33.2 Modification des paramètres sensibles

Les paramètres sensibles ne doivent être modifiables que par l’administrateur.

Exemples :

* solde initial WAVE ;
* solde initial caisse ;
* rôles utilisateurs ;
* activation ou désactivation d’un utilisateur.

## 34. Règles sur les données initiales

Au démarrage, l’application doit disposer de :

* un administrateur ;
* deux comptes financiers ;
* des catégories de recettes ;
* des catégories de dépenses ;
* des paramètres généraux.

## 34.1 Comptes initiaux

Comptes à créer :

* WAVE SENCAILLE ;
* Caisse SENCAILLE.

## 34.2 Catégories initiales

L’application doit contenir les catégories de recettes et dépenses validées dans le cahier des charges.

## 35. Règles sur les opérations supprimées

## 35.1 Invisibilité dans l’usage normal

Les opérations supprimées ne doivent pas apparaître :

* dans le tableau de bord ;
* dans les rapports normaux ;
* dans les soldes ;
* dans les listes ordinaires.

## 35.2 Visibilité administrateur

Les opérations supprimées peuvent être visibles uniquement par l’administrateur dans un espace historique ou audit.

## 35.3 Restauration éventuelle

La restauration d’une opération supprimée peut être prévue plus tard.

Pour la V1, elle peut être réservée à l’administrateur ou reportée en V2.

## 36. Règles de cohérence Supabase

La base Supabase doit empêcher les incohérences.

## 36.1 Contraintes à appliquer

La base doit empêcher :

* montant total inférieur ou égal à zéro ;
* montant payé supérieur au montant total ;
* paiement complémentaire supérieur au reste à payer ;
* catégorie incompatible avec le type d’opération ;
* modification d’une opération par un utilisateur non autorisé ;
* suppression physique d’une opération financière.

## 36.2 Sécurité Row Level Security

Supabase doit appliquer des règles de sécurité pour chaque table importante :

* profiles ;
* operations ;
* payments ;
* categories ;
* parties ;
* accounts ;
* settings ;
* audit_logs.

## 37. Règles sur le développement avec Gemini

Gemini doit respecter ces principes :

1. Ne pas inventer de nouveau modèle métier sans validation.
2. Ne pas fusionner ventes à crédit et paiements ultérieurs.
3. Ne pas compter une vente à crédit comme encaissement.
4. Ne pas compter un achat à crédit comme sortie de trésorerie.
5. Toujours lier les catégories aux types d’opérations.
6. Toujours enregistrer l’auteur connecté.
7. Toujours appliquer les droits utilisateurs.
8. Toujours exclure les opérations supprimées des rapports.
9. Toujours calculer les soldes à partir des opérations et paiements actifs.
10. Toujours utiliser Supabase comme source principale des données.

## 38. Cas pratiques de vérification

## 38.1 Cas 1 : recette WAVE payée totalement

Opération :

* recette ;
* vente œufs ;
* 20 000 FCFA ;
* payé totalement ;
* WAVE.

Résultat attendu :

* solde WAVE +20 000 ;
* reste à payer = 0 ;
* statut = payé.

## 38.2 Cas 2 : dépense espèces payée totalement

Opération :

* dépense ;
* transport ;
* 3 000 FCFA ;
* payé totalement ;
* espèces.

Résultat attendu :

* caisse -3 000 ;
* reste à payer = 0 ;
* statut = payé.

## 38.3 Cas 3 : vente à crédit

Opération :

* recette ;
* vente cailleteaux ;
* 30 000 FCFA ;
* crédit ;
* client Moussa.

Résultat attendu :

* WAVE inchangé ;
* caisse inchangée ;
* créance client = 30 000 ;
* statut = non payé.

## 38.4 Cas 4 : paiement client

Paiement :

* Moussa paie 10 000 FCFA par WAVE.

Résultat attendu :

* solde WAVE +10 000 ;
* reste à payer = 20 000 ;
* statut = partiellement payé.

## 38.5 Cas 5 : achat à crédit

Opération :

* dépense ;
* achat aliment ;
* 80 000 FCFA ;
* crédit ;
* fournisseur Boutique Aliment.

Résultat attendu :

* WAVE inchangé ;
* caisse inchangée ;
* dette fournisseur = 80 000 ;
* statut = non payé.

## 38.6 Cas 6 : paiement fournisseur

Paiement :

* paiement fournisseur de 30 000 FCFA en espèces.

Résultat attendu :

* caisse -30 000 ;
* reste à payer = 50 000 ;
* statut = partiellement payé.

## 38.7 Cas 7 : paiement supérieur au reste

Si le reste à payer est 20 000 FCFA et que l’utilisateur tente d’enregistrer 25 000 FCFA :

Résultat attendu :

* l’application refuse ;
* message : “Le paiement ne peut pas dépasser le reste à payer.”

## 38.8 Cas 8 : catégorie incompatible

Si l’utilisateur choisit :

* type : Recette ;
* catégorie : Achat aliment.

Résultat attendu :

* l’application refuse ;
* message : “Cette catégorie ne correspond pas au type d’opération choisi.”

## 38.9 Cas 9 : utilisateur simple tente de modifier l’opération d’un autre

Résultat attendu :

* bouton Modifier invisible ;
* action refusée par Supabase si tentative directe.

## 38.10 Cas 10 : suppression logique

Si une opération est supprimée :

Résultat attendu :

* elle disparaît des rapports normaux ;
* elle ne modifie plus les soldes ;
* elle reste visible dans l’historique administrateur.

## 39. Synthèse des règles prioritaires

Les règles prioritaires de SENCAILLE Finance sont :

1. Toute opération doit avoir un type.
2. Toute opération doit avoir une catégorie compatible avec son type.
3. Toute opération doit avoir un montant total positif.
4. Une opération payée modifie le solde du compte concerné.
5. Une opération à crédit ne modifie pas les soldes.
6. Une vente à crédit crée une créance client.
7. Un achat à crédit crée une dette fournisseur.
8. Un paiement client augmente WAVE ou caisse.
9. Un paiement fournisseur diminue WAVE ou caisse.
10. Le reste à payer est toujours calculé automatiquement.
11. Le statut de paiement est toujours calculé automatiquement.
12. L’auteur est toujours l’utilisateur connecté.
13. L’utilisateur simple ne gère que ses propres opérations.
14. L’administrateur peut tout gérer.
15. Les suppressions sont logiques.
16. Les rapports excluent les données supprimées.
17. La sécurité doit être appliquée dans Supabase, pas seulement dans l’interface.
18. Les rapports doivent distinguer activité, trésorerie et crédit.
19. Les soldes doivent être calculés à partir des paiements réels.
20. Les modifications sensibles doivent être tracées.

## 40. Conclusion

Ces règles métier constituent le socle logique de SENCAILLE Finance.

Elles garantissent que l’application reste :

* simple à utiliser ;
* fiable dans les calculs ;
* claire dans les rapports ;
* sécurisée pour les utilisateurs ;
* cohérente avec la réalité quotidienne de SENCAILLE.

Le développement ne doit pas commencer avant que ces règles soient clairement prises en compte dans :

* le modèle de données Supabase ;
* les écrans ;
* les formulaires ;
* les droits utilisateurs ;
* les rapports ;
* les prompts destinés à Gemini.
