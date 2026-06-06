# Cahier des charges fonctionnel

# Application web mobile-first de gestion des recettes et dépenses

# SENCAILLE Finance

## 1. Présentation générale du projet

**SENCAILLE Finance** est une application web mobile-first destinée à la gestion quotidienne des recettes, dépenses, crédits clients, dettes fournisseurs et rapports financiers simples de la ferme SENCAILLE.

L’application doit permettre aux utilisateurs autorisés de saisir les opérations financières de la ferme depuis un téléphone, une tablette ou un ordinateur, avec une interface simple, rapide et intuitive.

L’application sera développée comme une solution **100 % en ligne**. Les données seront stockées dans une base de données cloud Supabase. Le projet sera versionné sur GitHub et hébergé sur Vercel.

## 2. Objectif principal de l’application

L’objectif principal de l’application est de permettre à SENCAILLE de suivre clairement :

* les recettes encaissées ;
* les dépenses effectuées ;
* les ventes à crédit ;
* les achats à crédit ;
* les paiements partiels ;
* le solde WAVE ;
* le solde de la caisse espèces ;
* les opérations saisies par chaque utilisateur ;
* les rapports mensuels par type, catégorie et utilisateur.

L’application doit répondre à une question simple :

**Combien SENCAILLE a encaissé, combien SENCAILLE a dépensé, qui a saisi l’opération, dans quelle catégorie, par quel moyen de paiement, et quelle est la situation financière du mois ?**

## 3. Nature de l’application

L’application sera :

* une application web ;
* mobile-first ;
* responsive ;
* multi-utilisateurs ;
* 100 % en ligne ;
* connectée à Supabase ;
* hébergée sur Vercel ;
* conçue d’abord avec Google Stitch ;
* codée progressivement avec Gemini ;
* versionnée sur GitHub.

L’application ne sera pas une application de comptabilité complète. Elle sera une application simple de gestion financière opérationnelle adaptée aux besoins quotidiens de SENCAILLE.

## 4. Nom de l’application

Nom recommandé :

**SENCAILLE Finance**

Autres noms possibles :

* SENCAILLE Trésorerie
* SENCAILLE Cash
* SENCAILLE Gestion
* SENCAILLE Recettes & Dépenses

Le nom recommandé reste **SENCAILLE Finance**, car il est clair, professionnel et suffisamment large pour couvrir les recettes, les dépenses, les crédits, les dettes et les rapports.

## 5. Public cible de l’application

L’application sera utilisée par les personnes impliquées dans la gestion financière quotidienne de SENCAILLE.

Les utilisateurs principaux sont :

* l’administrateur ;
* les agents ou collaborateurs autorisés à saisir des opérations ;
* éventuellement, à terme, des responsables chargés de suivre les rapports.

Pour la V1, deux rôles suffisent :

1. Administrateur
2. Utilisateur simple

## 6. Périmètre fonctionnel de la V1

La première version de l’application doit couvrir uniquement les fonctions essentielles.

### Fonctions incluses dans la V1

La V1 doit permettre de :

* connecter plusieurs utilisateurs ;
* gérer les rôles ;
* saisir une recette ;
* saisir une dépense ;
* saisir une vente à crédit ;
* saisir un achat à crédit ;
* saisir un paiement partiel ;
* classer les opérations par catégories ;
* créer une nouvelle catégorie pendant la saisie ;
* lier chaque catégorie à un type d’opération ;
* identifier automatiquement l’auteur de chaque opération ;
* filtrer les opérations par type et catégorie ;
* filtrer les opérations par période ;
* filtrer les opérations par utilisateur ;
* suivre le solde WAVE ;
* suivre le solde caisse espèces ;
* suivre les clients débiteurs ;
* suivre les fournisseurs à payer ;
* générer des rapports mensuels simples.

### Fonctions exclues de la V1

La V1 ne doit pas gérer :

* la comptabilité professionnelle complète ;
* la fiscalité ;
* les stocks ;
* les animaux ;
* les incubations ;
* les commandes clients complexes ;
* les factures avancées ;
* les reçus PDF ;
* le mode hors ligne ;
* la synchronisation locale/cloud ;
* la gestion multi-fermes ;
* les permissions très avancées ;
* les statistiques complexes.

Ces fonctions pourront être envisagées dans une V2, mais elles doivent être exclues de la V1 pour garder l’application simple, rapide et fiable.

## 7. Principe général de fonctionnement

L’application repose sur une logique simple :

1. L’utilisateur se connecte.
2. Il saisit une recette ou une dépense.
3. Il choisit une catégorie liée au type d’opération.
4. Il indique le montant total.
5. Il précise si l’opération est payée, à crédit ou partiellement payée.
6. Il choisit le moyen de paiement si une somme a été payée.
7. L’application calcule automatiquement le montant payé, le reste à payer et l’impact sur les soldes.
8. L’application enregistre automatiquement l’auteur de la saisie.
9. L’administrateur peut consulter toutes les opérations et les rapports.
10. Les utilisateurs simples ne peuvent modifier ou supprimer que leurs propres opérations.

## 8. Types d’opérations

L’application doit distinguer deux grands types d’opérations financières :

### 8.1 Recette

Une recette correspond à une entrée d’argent ou à une vente réalisée par SENCAILLE.

Exemples :

* vente œufs de caille ;
* vente œufs fécondés ;
* vente cailleteaux ;
* vente cailles reproductrices ;
* vente chair de caille ;
* vente poussins ;
* vente poulets ;
* vente cages ;
* vente accessoires ;
* autres recettes.

### 8.2 Dépense

Une dépense correspond à une sortie d’argent ou à un achat effectué par SENCAILLE.

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

## 9. Catégories d’opérations

Les catégories permettent de classer les opérations.

Chaque catégorie doit obligatoirement être liée à un type d’opération.

Une catégorie de recette ne doit jamais être utilisée pour une dépense.
Une catégorie de dépense ne doit jamais être utilisée pour une recette.

### 9.1 Catégories de recettes par défaut

Les catégories de recettes proposées au départ sont :

* Vente œufs de caille
* Vente œufs fécondés
* Vente cailleteaux
* Vente cailles reproductrices
* Vente chair de caille
* Vente poussins
* Vente poulets
* Vente cages
* Vente accessoires
* Autres recettes

### 9.2 Catégories de dépenses par défaut

Les catégories de dépenses proposées au départ sont :

* Achat aliment volaille
* Achat vitamines
* Achat médicaments
* Achat caille préponte
* Achat reproducteurs
* Achat emballages
* Transport
* Main-d’œuvre
* Réparation matériel
* Communication / publicité
* Eau / électricité
* Achat matériel
* Autres dépenses

### 9.3 Création d’une nouvelle catégorie pendant la saisie

Lors de la saisie d’une opération, si la catégorie souhaitée n’existe pas, l’application doit permettre à l’utilisateur de créer une nouvelle catégorie directement depuis le formulaire.

La nouvelle catégorie doit être automatiquement liée au type d’opération sélectionné.

Exemple :

* Type choisi : Dépense
* Nouvelle catégorie créée : Achat désinfectant
* Résultat : la catégorie devient automatiquement une catégorie de dépense.

Autre exemple :

* Type choisi : Recette
* Nouvelle catégorie créée : Vente fumier
* Résultat : la catégorie devient automatiquement une catégorie de recette.

L’application doit éviter les doublons évidents. Par exemple, si la catégorie “Achat vitamines” existe déjà, l’application doit éviter la création d’une catégorie presque identique comme “Achat vitamine”.

## 10. Moyens de paiement

L’application doit gérer deux moyens de paiement principaux :

1. WAVE
2. Espèces

### 10.1 Paiement par WAVE

Une recette payée par WAVE augmente le solde WAVE.
Une dépense payée par WAVE diminue le solde WAVE.

### 10.2 Paiement en espèces

Une recette payée en espèces augmente le solde caisse.
Une dépense payée en espèces diminue le solde caisse.

## 11. Modes de règlement

Chaque opération doit avoir un mode de règlement.

Les modes de règlement sont :

1. Payé totalement
2. À crédit
3. Paiement partiel

### 11.1 Opération payée totalement

Une opération payée totalement signifie que la totalité du montant a été réglée au moment de la saisie.

Exemple de recette payée :

* Type : Recette
* Catégorie : Vente œufs de caille
* Montant total : 20 000 FCFA
* Mode de règlement : Payé totalement
* Moyen de paiement : WAVE
* Effet : le solde WAVE augmente de 20 000 FCFA.

Exemple de dépense payée :

* Type : Dépense
* Catégorie : Achat aliment volaille
* Montant total : 50 000 FCFA
* Mode de règlement : Payé totalement
* Moyen de paiement : Espèces
* Effet : le solde caisse diminue de 50 000 FCFA.

### 11.2 Opération à crédit

Une opération à crédit signifie qu’aucun paiement n’a encore été effectué.

Dans le cas d’une recette à crédit, l’application crée une créance client.

Exemple :

* Type : Recette
* Catégorie : Vente cailleteaux
* Client : Moussa Diop
* Montant total : 30 000 FCFA
* Montant payé : 0 FCFA
* Reste à payer : 30 000 FCFA
* Effet immédiat sur WAVE ou caisse : aucun.

Dans le cas d’une dépense à crédit, l’application crée une dette fournisseur.

Exemple :

* Type : Dépense
* Catégorie : Achat aliment volaille
* Fournisseur : Boutique Aliment Thiès
* Montant total : 80 000 FCFA
* Montant payé : 0 FCFA
* Reste à payer : 80 000 FCFA
* Effet immédiat sur WAVE ou caisse : aucun.

### 11.3 Paiement partiel

Une opération partiellement payée signifie qu’une partie du montant a été réglée, mais qu’il reste encore une somme à recevoir ou à payer.

Exemple de vente partiellement payée :

* Type : Recette
* Catégorie : Vente cailles reproductrices
* Client : Fatou Ndiaye
* Montant total : 40 000 FCFA
* Montant payé : 15 000 FCFA
* Moyen de paiement : WAVE
* Reste à payer : 25 000 FCFA
* Effet : le solde WAVE augmente de 15 000 FCFA.

Exemple d’achat partiellement payé :

* Type : Dépense
* Catégorie : Achat vitamines
* Fournisseur : Pharmacie vétérinaire
* Montant total : 25 000 FCFA
* Montant payé : 10 000 FCFA
* Moyen de paiement : Espèces
* Reste à payer : 15 000 FCFA
* Effet : le solde caisse diminue de 10 000 FCFA.

## 12. Gestion des crédits clients

Une vente à crédit ou partiellement payée crée une créance client.

Le module crédits doit permettre de voir les clients qui doivent de l’argent à SENCAILLE.

Chaque créance client doit afficher :

* nom du client ;
* catégorie de vente ;
* montant total ;
* montant déjà payé ;
* reste à payer ;
* date de l’opération ;
* auteur de la saisie ;
* statut du paiement.

Les statuts possibles sont :

* non payé ;
* partiellement payé ;
* payé.

L’utilisateur autorisé doit pouvoir enregistrer un paiement reçu d’un client.

Lorsqu’un paiement client est enregistré :

* le montant payé augmente ;
* le reste à payer diminue ;
* le solde WAVE ou caisse augmente selon le moyen de paiement ;
* le statut est mis à jour automatiquement.

## 13. Gestion des dettes fournisseurs

Un achat à crédit ou partiellement payé crée une dette fournisseur.

Le module crédits doit aussi permettre de voir les fournisseurs que SENCAILLE doit payer.

Chaque dette fournisseur doit afficher :

* nom du fournisseur ;
* catégorie de dépense ;
* montant total ;
* montant déjà payé ;
* reste à payer ;
* date de l’opération ;
* auteur de la saisie ;
* statut du paiement.

L’utilisateur autorisé doit pouvoir enregistrer un paiement effectué à un fournisseur.

Lorsqu’un paiement fournisseur est enregistré :

* le montant payé augmente ;
* le reste à payer diminue ;
* le solde WAVE ou caisse diminue selon le moyen de paiement ;
* le statut est mis à jour automatiquement.

## 14. Gestion des utilisateurs

L’application doit être multi-utilisateurs.

Chaque utilisateur doit avoir son propre compte.

### 14.1 Informations utilisateur

Chaque utilisateur doit avoir au minimum :

* nom complet ;
* téléphone ;
* email ou identifiant ;
* rôle ;
* statut ;
* date de création.

### 14.2 Rôles utilisateurs

Deux rôles sont prévus pour la V1 :

1. Administrateur
2. Utilisateur simple

### 14.3 Administrateur

L’administrateur a tous les droits.

Il peut :

* créer des utilisateurs ;
* modifier les utilisateurs ;
* désactiver des utilisateurs ;
* voir toutes les opérations ;
* créer des opérations ;
* modifier toutes les opérations ;
* supprimer toutes les opérations ;
* gérer toutes les catégories ;
* consulter tous les rapports ;
* modifier les paramètres ;
* consulter les soldes ;
* corriger les erreurs.

### 14.4 Utilisateur simple

L’utilisateur simple peut :

* créer une opération ;
* voir ses propres opérations ;
* modifier ses propres opérations ;
* supprimer ses propres opérations ;
* créer une catégorie pendant une saisie, si l’administrateur l’autorise ;
* consulter éventuellement son propre historique de saisie.

Il ne peut pas :

* modifier les opérations des autres ;
* supprimer les opérations des autres ;
* créer ou désactiver des utilisateurs ;
* modifier les paramètres généraux ;
* supprimer définitivement les données ;
* contourner les règles de sécurité.

## 15. Gestion des droits et sécurité fonctionnelle

Les droits doivent être appliqués à deux niveaux :

1. dans l’interface ;
2. dans la base de données Supabase.

L’interface doit masquer les actions non autorisées.
Mais la base de données doit aussi empêcher les actions interdites.

Règles essentielles :

* un utilisateur simple ne peut modifier que les opérations qu’il a créées ;
* un utilisateur simple ne peut supprimer que les opérations qu’il a créées ;
* l’administrateur peut voir et gérer toutes les opérations ;
* les opérations doivent garder l’identifiant de leur auteur ;
* chaque modification importante doit être traçable ;
* les suppressions doivent être logiques, pas définitives.

## 16. Suppression logique des opérations

Dans une application financière, il ne faut pas supprimer définitivement une opération.

Lorsqu’un utilisateur supprime une opération, celle-ci doit être marquée comme supprimée.

L’opération doit garder :

* son ancien contenu ;
* son auteur initial ;
* la date de création ;
* l’auteur de la suppression ;
* la date de suppression ;
* éventuellement un motif.

Les opérations supprimées ne doivent plus apparaître dans les rapports normaux, mais doivent rester consultables par l’administrateur.

## 17. Tableau de bord

Le tableau de bord est l’écran d’accueil de l’application.

Il doit présenter rapidement la situation financière de SENCAILLE.

### 17.1 Indicateurs principaux

Le tableau de bord doit afficher :

* solde WAVE ;
* solde caisse ;
* solde total disponible ;
* recettes encaissées du mois ;
* dépenses payées du mois ;
* résultat de trésorerie du mois ;
* montant total dû par les clients ;
* montant total dû aux fournisseurs ;
* dernières opérations.

### 17.2 Calcul du solde WAVE

Le solde WAVE se calcule ainsi :

Solde WAVE = solde initial WAVE + recettes payées par WAVE - dépenses payées par WAVE + paiements clients reçus par WAVE - paiements fournisseurs effectués par WAVE

### 17.3 Calcul du solde caisse

Le solde caisse se calcule ainsi :

Solde caisse = solde initial caisse + recettes payées en espèces - dépenses payées en espèces + paiements clients reçus en espèces - paiements fournisseurs effectués en espèces

### 17.4 Calcul du solde total disponible

Solde total disponible = solde WAVE + solde caisse

### 17.5 Calcul du résultat de trésorerie mensuel

Résultat de trésorerie mensuel = recettes réellement encaissées du mois - dépenses réellement payées du mois

Les ventes à crédit non encore payées ne doivent pas être considérées comme de l’argent disponible.

Les achats à crédit non encore payés ne doivent pas diminuer immédiatement le solde disponible.

## 18. Historique des opérations

L’écran historique doit afficher les opérations sous forme de cartes lisibles sur mobile.

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

### 18.1 Filtres nécessaires

L’historique doit permettre de filtrer les opérations par :

* période ;
* type d’opération ;
* catégorie ;
* auteur ;
* moyen de paiement ;
* statut de paiement.

### 18.2 Filtre par type et catégorie

Le filtre par catégorie doit dépendre du type sélectionné.

Si l’utilisateur choisit “Recette”, l’application doit afficher uniquement les catégories de recettes.

Si l’utilisateur choisit “Dépense”, l’application doit afficher uniquement les catégories de dépenses.

### 18.3 Résumé des résultats filtrés

Lorsqu’un filtre est appliqué, l’application doit afficher :

* nombre d’opérations trouvées ;
* total payé ;
* total à crédit ;
* total global ;
* total restant à payer, si applicable.

## 19. Rapports mensuels

L’application doit générer des rapports mensuels simples.

### 19.1 Rapport de trésorerie

Le rapport de trésorerie doit afficher :

* solde initial WAVE ;
* solde initial caisse ;
* recettes encaissées par WAVE ;
* recettes encaissées en espèces ;
* dépenses payées par WAVE ;
* dépenses payées en espèces ;
* solde final WAVE ;
* solde final caisse ;
* résultat de trésorerie du mois.

### 19.2 Rapport par catégorie

Le rapport par catégorie doit afficher :

* recettes par catégorie ;
* dépenses par catégorie ;
* nombre d’opérations par catégorie ;
* total payé par catégorie ;
* montant à crédit par catégorie ;
* reste à payer par catégorie.

### 19.3 Rapport des crédits

Le rapport des crédits doit afficher :

* liste des clients débiteurs ;
* montant dû par chaque client ;
* total des créances clients ;
* liste des fournisseurs à payer ;
* montant dû à chaque fournisseur ;
* total des dettes fournisseurs ;
* balance nette des crédits.

Balance nette des crédits = créances clients - dettes fournisseurs

### 19.4 Rapport par utilisateur

Le rapport par utilisateur doit afficher :

* nombre d’opérations saisies par utilisateur ;
* total des recettes saisies ;
* total des dépenses saisies ;
* total des opérations modifiées ;
* total des opérations supprimées ;
* date de dernière saisie.

## 20. Formulaire de nouvelle opération

Le formulaire de nouvelle opération doit être simple, clair et adapté au mobile.

### 20.1 Champs du formulaire

Le formulaire doit contenir :

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
11. Auteur automatique

### 20.2 Comportement dynamique du formulaire

Le formulaire doit s’adapter aux choix de l’utilisateur.

Si le type choisi est “Recette” :

* afficher les catégories de recettes ;
* afficher le champ client si crédit ou paiement partiel.

Si le type choisi est “Dépense” :

* afficher les catégories de dépenses ;
* afficher le champ fournisseur si crédit ou paiement partiel.

Si le mode choisi est “Payé totalement” :

* le montant payé doit être égal au montant total ;
* le reste à payer doit être égal à zéro ;
* le moyen de paiement doit être obligatoire.

Si le mode choisi est “À crédit” :

* le montant payé doit être égal à zéro ;
* le reste à payer doit être égal au montant total ;
* le client ou fournisseur doit être obligatoire ;
* le moyen de paiement ne doit pas être obligatoire.

Si le mode choisi est “Paiement partiel” :

* le montant payé doit être inférieur au montant total ;
* le reste à payer doit être calculé automatiquement ;
* le moyen de paiement doit être obligatoire ;
* le client ou fournisseur doit être obligatoire.

## 21. Justificatifs

L’application peut prévoir un champ justificatif facultatif.

Exemples de justificatifs :

* capture WAVE ;
* photo d’un reçu ;
* facture fournisseur ;
* note manuscrite.

Pour la V1, le justificatif peut être facultatif afin de ne pas ralentir la saisie quotidienne.

## 22. Paramètres généraux

L’administrateur doit pouvoir configurer :

* nom de la ferme ;
* devise ;
* solde initial WAVE ;
* solde initial caisse ;
* date de début du suivi ;
* catégories par défaut ;
* droits de création de catégories par les utilisateurs.

Paramètres recommandés par défaut :

* Nom de la ferme : SENCAILLE
* Devise : FCFA
* Compte principal : WAVE
* Deuxième compte : Caisse espèces

## 23. Interface mobile-first

L’application doit être pensée d’abord pour smartphone.

### 23.1 Principes d’interface

L’interface doit être :

* simple ;
* claire ;
* rapide ;
* lisible ;
* moderne ;
* adaptée au pouce ;
* utilisable sur petit écran ;
* peu chargée visuellement.

### 23.2 Navigation recommandée

La navigation principale doit être placée en bas de l’écran.

Onglets recommandés :

1. Accueil
2. Saisir
3. Historique
4. Crédits
5. Rapports

Un menu secondaire peut contenir :

* Catégories
* Utilisateurs
* Paramètres
* Déconnexion

### 23.3 Style visuel recommandé

Style recommandé :

* moderne ;
* sombre ou semi-sombre ;
* professionnel ;
* agricole mais sobre ;
* avec des cartes ;
* gros boutons ;
* icônes simples ;
* contrastes lisibles.

Couleurs possibles :

* vert foncé ;
* noir bleuté ;
* blanc cassé ;
* jaune/orange léger pour les alertes ;
* rouge discret pour les dettes ou suppressions.

## 24. Écrans principaux de la V1

La V1 doit contenir les écrans suivants :

1. Écran de connexion
2. Tableau de bord
3. Nouvelle opération
4. Historique des opérations
5. Détail d’une opération
6. Clients débiteurs
7. Fournisseurs à payer
8. Rapports mensuels
9. Gestion des catégories
10. Gestion des utilisateurs
11. Paramètres

Ces écrans suffisent pour une première version complète et exploitable.

## 25. Contraintes techniques validées

Les choix techniques validés sont :

* conception de l’interface avec Google Stitch ;
* codage avec Gemini ;
* dépôt GitHub ;
* base de données Supabase ;
* hébergement Vercel ;
* application 100 % en ligne ;
* interface mobile-first.

Stack recommandée :

* Next.js
* TypeScript
* Tailwind CSS
* Supabase
* Vercel
* GitHub

## 26. Règles métier prioritaires

Les règles métier prioritaires sont les suivantes :

1. Toute opération doit avoir un type.
2. Toute opération doit avoir une catégorie.
3. Toute catégorie doit être liée à un type d’opération.
4. Une recette ne peut utiliser qu’une catégorie de recette.
5. Une dépense ne peut utiliser qu’une catégorie de dépense.
6. Toute opération doit avoir un montant total.
7. Le montant payé ne peut pas être supérieur au montant total.
8. Le reste à payer est calculé automatiquement.
9. Une recette payée augmente le solde du moyen de paiement concerné.
10. Une dépense payée diminue le solde du moyen de paiement concerné.
11. Une vente à crédit crée une créance client.
12. Un achat à crédit crée une dette fournisseur.
13. Un paiement client augmente le solde WAVE ou caisse.
14. Un paiement fournisseur diminue le solde WAVE ou caisse.
15. L’auteur de la saisie est enregistré automatiquement.
16. Un utilisateur simple ne peut modifier que ses propres opérations.
17. Un utilisateur simple ne peut supprimer que ses propres opérations.
18. L’administrateur peut gérer toutes les données.
19. Les suppressions doivent être logiques.
20. Les rapports ne doivent pas inclure les opérations supprimées.
21. Les rapports doivent distinguer l’argent réellement encaissé de l’argent encore à recevoir.
22. Les rapports doivent distinguer l’argent réellement payé de l’argent encore dû.

## 27. Priorités de développement

Le développement doit suivre cet ordre :

1. Authentification
2. Gestion des utilisateurs
3. Gestion des catégories
4. Saisie des opérations
5. Calculs des paiements
6. Historique
7. Filtres
8. Crédits clients
9. Dettes fournisseurs
10. Tableau de bord
11. Rapports mensuels
12. Sécurité Supabase
13. Tests
14. Déploiement Vercel

## 28. Critères de réussite de la V1

La V1 sera considérée comme réussie si :

* un utilisateur peut se connecter ;
* l’administrateur peut créer des utilisateurs ;
* un utilisateur peut saisir une recette ;
* un utilisateur peut saisir une dépense ;
* une catégorie peut être créée pendant la saisie ;
* les catégories sont correctement liées aux types d’opérations ;
* une vente à crédit crée une créance client ;
* un achat à crédit crée une dette fournisseur ;
* un paiement partiel est bien calculé ;
* les soldes WAVE et caisse sont corrects ;
* l’auteur de chaque saisie est visible ;
* un utilisateur simple ne peut pas modifier les opérations des autres ;
* l’administrateur peut tout consulter ;
* les rapports mensuels sont fiables ;
* l’application fonctionne correctement sur smartphone ;
* l’application est déployée sur Vercel.

## 29. Vision future possible

Après la V1, l’application pourra évoluer vers :

* export PDF des rapports ;
* reçus de paiement ;
* suivi des stocks ;
* suivi des ventes par produit ;
* gestion des clients ;
* gestion des fournisseurs ;
* tableau de bord avancé ;
* statistiques annuelles ;
* sauvegardes automatiques ;
* notifications ;
* gestion multi-fermes ;
* version PWA installable ;
* fonctionnement hors ligne.

Ces éléments ne doivent pas être intégrés dans la V1 afin de ne pas compliquer le développement initial.

## 30. Synthèse finale

SENCAILLE Finance doit être une application web mobile-first, simple et efficace, permettant de suivre les recettes, les dépenses, les crédits clients, les dettes fournisseurs, les paiements WAVE, les paiements en espèces, les catégories d’opérations, les utilisateurs et les rapports mensuels.

Le cœur de l’application repose sur quatre principes :

1. simplicité de saisie ;
2. fiabilité des calculs ;
3. traçabilité des auteurs ;
4. clarté des rapports.

La V1 doit rester légère, mais suffisamment solide pour devenir l’outil quotidien de suivi financier de SENCAILLE.
