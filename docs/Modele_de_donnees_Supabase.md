# Document 3

# Modèle de données Supabase

# Application SENCAILLE Finance

## 1. Objectif du document

Ce document définit le modèle de données de l’application **SENCAILLE Finance**.

Il décrit :

* les tables nécessaires dans Supabase ;
* les champs de chaque table ;
* les relations entre les tables ;
* les types de données recommandés ;
* les contraintes métier ;
* les calculs financiers ;
* les règles de sécurité à prévoir ;
* les vues ou requêtes utiles pour les rapports.

Ce document servira de base pour :

* la création de la base Supabase ;
* le script SQL de création des tables ;
* le développement avec Gemini ;
* la mise en place des règles de sécurité ;
* la génération des rapports financiers.

## 2. Principe général du modèle de données

L’application doit gérer les éléments suivants :

1. les utilisateurs ;
2. les rôles ;
3. les catégories d’opérations ;
4. les comptes financiers ;
5. les recettes ;
6. les dépenses ;
7. les paiements ;
8. les crédits clients ;
9. les dettes fournisseurs ;
10. les justificatifs ;
11. les paramètres généraux ;
12. les journaux de modification.

Le modèle doit rester simple, mais suffisamment robuste pour garantir :

* la fiabilité des soldes ;
* la traçabilité des opérations ;
* la séparation entre recettes, dépenses et paiements ;
* la gestion des droits utilisateurs ;
* la production de rapports fiables.

## 3. Convention de nommage recommandée

Pour la base de données, il est recommandé d’utiliser des noms de tables et de champs en anglais technique, même si l’interface de l’application reste entièrement en français.

Pourquoi ?

* Gemini code plus proprement avec des noms anglais standards ;
* Supabase/PostgreSQL utilisent souvent des conventions anglaises ;
* le code devient plus lisible ;
* les noms restent courts et cohérents.

Exemples :

| Interface française  | Nom recommandé en base |
| -------------------- | ---------------------- |
| Utilisateurs         | profiles               |
| Catégories           | categories             |
| Opérations           | operations             |
| Paiements            | payments               |
| Comptes financiers   | accounts               |
| Clients/Fournisseurs | parties                |
| Paramètres           | settings               |
| Journal d’audit      | audit_logs             |

## 4. Liste des tables principales

Les tables recommandées pour la V1 sont :

1. `profiles`
2. `accounts`
3. `categories`
4. `parties`
5. `operations`
6. `payments`
7. `attachments`
8. `settings`
9. `audit_logs`

Ces 9 tables suffisent pour une V1 propre et évolutive.

## 5. Table `profiles`

### 5.1 Rôle de la table

La table `profiles` contient les informations complémentaires des utilisateurs connectés à l’application.

Supabase Auth gère déjà l’authentification.
La table `profiles` sert à stocker les données métier de l’utilisateur :

* nom ;
* téléphone ;
* rôle ;
* statut ;
* date de création.

### 5.2 Champs recommandés

| Champ      | Type      | Description                                         |
| ---------- | --------- | --------------------------------------------------- |
| id         | uuid      | Identifiant de l’utilisateur, lié à `auth.users.id` |
| full_name  | text      | Nom complet de l’utilisateur                        |
| phone      | text      | Numéro de téléphone                                 |
| role       | text      | Rôle : `admin` ou `user`                            |
| status     | text      | Statut : `active` ou `disabled`                     |
| created_at | timestamp | Date de création                                    |
| updated_at | timestamp | Date de modification                                |

### 5.3 Règles

* Chaque utilisateur authentifié doit avoir un profil.
* Un utilisateur désactivé ne doit pas pouvoir utiliser l’application.
* Le rôle `admin` donne accès à toutes les données.
* Le rôle `user` donne accès aux actions limitées.

### 5.4 Valeurs possibles

Pour `role` :

* `admin`
* `user`

Pour `status` :

* `active`
* `disabled`

## 6. Table `accounts`

### 6.1 Rôle de la table

La table `accounts` représente les comptes financiers de SENCAILLE.

Pour la V1, il y aura deux comptes :

1. WAVE SENCAILLE
2. Caisse espèces

Même si la V1 ne gère que deux comptes, créer une table `accounts` est plus propre que de mettre les soldes uniquement dans les paramètres.

Cela permettra plus tard d’ajouter :

* Orange Money ;
* compte bancaire ;
* autre caisse ;
* compte mobile money secondaire.

### 6.2 Champs recommandés

| Champ           | Type      | Description                         |
| --------------- | --------- | ----------------------------------- |
| id              | uuid      | Identifiant du compte               |
| name            | text      | Nom du compte                       |
| account_type    | text      | Type : `wave`, `cash`, `bank`, etc. |
| opening_balance | numeric   | Solde initial du compte             |
| opening_date    | date      | Date de démarrage du suivi          |
| status          | text      | `active` ou `inactive`              |
| created_at      | timestamp | Date de création                    |
| updated_at      | timestamp | Date de modification                |

### 6.3 Données initiales recommandées

| name             | account_type |
| ---------------- | ------------ |
| WAVE SENCAILLE   | wave         |
| Caisse SENCAILLE | cash         |

### 6.4 Règles

* Une opération payée par WAVE doit être liée au compte WAVE.
* Une opération payée en espèces doit être liée au compte caisse.
* Les soldes ne doivent pas être modifiés manuellement après démarrage, sauf par l’administrateur.
* Les comptes inactifs ne doivent plus apparaître dans les nouvelles saisies.

## 7. Table `categories`

### 7.1 Rôle de la table

La table `categories` contient les catégories de recettes et de dépenses.

Chaque catégorie est obligatoirement liée à un type d’opération.

### 7.2 Champs recommandés

| Champ          | Type      | Description                         |
| -------------- | --------- | ----------------------------------- |
| id             | uuid      | Identifiant de la catégorie         |
| name           | text      | Nom de la catégorie                 |
| operation_type | text      | `income` ou `expense`               |
| status         | text      | `active` ou `inactive`              |
| created_by     | uuid      | Utilisateur ayant créé la catégorie |
| created_at     | timestamp | Date de création                    |
| updated_at     | timestamp | Date de modification                |

### 7.3 Valeurs possibles

Pour `operation_type` :

* `income` = recette
* `expense` = dépense

Pour `status` :

* `active`
* `inactive`

### 7.4 Règles

* Une catégorie appartient à un seul type d’opération.
* Une catégorie de type `income` ne peut être utilisée que pour une recette.
* Une catégorie de type `expense` ne peut être utilisée que pour une dépense.
* Une catégorie créée pendant une saisie prend automatiquement le type de l’opération en cours.
* Une catégorie déjà utilisée ne doit pas être supprimée définitivement.
* Elle peut être désactivée.

### 7.5 Catégories initiales recommandées

#### Catégories de recettes

| name                         | operation_type |
| ---------------------------- | -------------- |
| Vente œufs de caille         | income         |
| Vente œufs fécondés          | income         |
| Vente cailleteaux            | income         |
| Vente cailles reproductrices | income         |
| Vente chair de caille        | income         |
| Vente poussins               | income         |
| Vente poulets                | income         |
| Vente cages                  | income         |
| Vente accessoires            | income         |
| Autres recettes              | income         |

#### Catégories de dépenses

| name                      | operation_type |
| ------------------------- | -------------- |
| Achat aliment volaille    | expense        |
| Achat vitamines           | expense        |
| Achat médicaments         | expense        |
| Achat caille préponte     | expense        |
| Achat reproducteurs       | expense        |
| Achat emballages          | expense        |
| Transport                 | expense        |
| Main-d’œuvre              | expense        |
| Réparation matériel       | expense        |
| Communication / publicité | expense        |
| Eau / électricité         | expense        |
| Achat matériel            | expense        |
| Autres dépenses           | expense        |

## 8. Table `parties`

### 8.1 Rôle de la table

La table `parties` contient les tiers liés aux opérations :

* clients ;
* fournisseurs.

Elle évite d’écrire les noms de clients et fournisseurs directement dans chaque opération sans contrôle.

Cela permet de suivre plus proprement :

* les clients débiteurs ;
* les fournisseurs à payer ;
* l’historique d’un client ;
* l’historique d’un fournisseur.

### 8.2 Champs recommandés

| Champ      | Type      | Description                      |
| ---------- | --------- | -------------------------------- |
| id         | uuid      | Identifiant du tiers             |
| name       | text      | Nom du client ou fournisseur     |
| party_type | text      | `customer`, `supplier` ou `both` |
| phone      | text      | Téléphone facultatif             |
| notes      | text      | Notes facultatives               |
| status     | text      | `active` ou `inactive`           |
| created_by | uuid      | Utilisateur ayant créé le tiers  |
| created_at | timestamp | Date de création                 |
| updated_at | timestamp | Date de modification             |

### 8.3 Valeurs possibles

Pour `party_type` :

* `customer` = client
* `supplier` = fournisseur
* `both` = client et fournisseur

Pour `status` :

* `active`
* `inactive`

### 8.4 Règles

* Une recette à crédit doit être liée à un client.
* Une dépense à crédit doit être liée à un fournisseur.
* Un paiement partiel doit aussi être lié à un client ou fournisseur.
* Un tiers déjà utilisé ne doit pas être supprimé définitivement.
* Il peut être désactivé.

## 9. Table `operations`

### 9.1 Rôle de la table

La table `operations` est la table centrale de l’application.

Elle contient toutes les recettes et dépenses enregistrées.

Une opération peut être :

* payée totalement ;
* à crédit ;
* partiellement payée.

### 9.2 Champs recommandés

| Champ               | Type      | Description                                  |
| ------------------- | --------- | -------------------------------------------- |
| id                  | uuid      | Identifiant de l’opération                   |
| operation_type      | text      | `income` ou `expense`                        |
| category_id         | uuid      | Catégorie de l’opération                     |
| party_id            | uuid      | Client ou fournisseur, si nécessaire         |
| total_amount        | numeric   | Montant total de l’opération                 |
| initial_paid_amount | numeric   | Montant payé au moment de la saisie          |
| settlement_mode     | text      | `paid`, `credit`, `partial`                  |
| initial_account_id  | uuid      | Compte utilisé au moment du paiement initial |
| operation_date      | date      | Date réelle de l’opération                   |
| description         | text      | Description ou observation                   |
| status              | text      | `active` ou `deleted`                        |
| created_by          | uuid      | Auteur de la saisie                          |
| created_at          | timestamp | Date de création                             |
| updated_at          | timestamp | Date de modification                         |
| deleted_by          | uuid      | Auteur de la suppression logique             |
| deleted_at          | timestamp | Date de suppression logique                  |

### 9.3 Pourquoi `initial_paid_amount` ?

Il faut distinguer :

* le montant total de l’opération ;
* le montant payé au moment de la création ;
* les paiements complémentaires enregistrés plus tard.

Exemple :

Vente de 50 000 FCFA.
Le client paie 20 000 FCFA aujourd’hui.
Il reste 30 000 FCFA.

Dans `operations` :

* `total_amount` = 50 000
* `initial_paid_amount` = 20 000
* `settlement_mode` = partial

Puis, si le client paie plus tard 10 000 FCFA, ce paiement ira dans la table `payments`.

### 9.4 Valeurs possibles

Pour `operation_type` :

* `income`
* `expense`

Pour `settlement_mode` :

* `paid`
* `credit`
* `partial`

Pour `status` :

* `active`
* `deleted`

### 9.5 Règles

* `total_amount` doit être supérieur à 0.
* `initial_paid_amount` ne peut pas être négatif.
* `initial_paid_amount` ne peut pas être supérieur à `total_amount`.
* Si `settlement_mode = paid`, alors `initial_paid_amount = total_amount`.
* Si `settlement_mode = credit`, alors `initial_paid_amount = 0`.
* Si `settlement_mode = partial`, alors `initial_paid_amount > 0` et `initial_paid_amount < total_amount`.
* Si `initial_paid_amount > 0`, alors `initial_account_id` est obligatoire.
* Si l’opération est à crédit ou partiellement payée, `party_id` est obligatoire.
* La catégorie choisie doit appartenir au même type que l’opération.
* L’auteur de la saisie doit être automatiquement enregistré dans `created_by`.
* Une opération supprimée doit passer à `status = deleted`, sans suppression physique.

## 10. Table `payments`

### 10.1 Rôle de la table

La table `payments` enregistre les paiements complémentaires liés aux opérations à crédit ou partiellement payées.

Elle sert à suivre :

* les paiements reçus des clients ;
* les paiements effectués aux fournisseurs ;
* les paiements partiels successifs.

### 10.2 Champs recommandés

| Champ        | Type      | Description                     |
| ------------ | --------- | ------------------------------- |
| id           | uuid      | Identifiant du paiement         |
| operation_id | uuid      | Opération concernée             |
| account_id   | uuid      | Compte utilisé : WAVE ou caisse |
| amount       | numeric   | Montant du paiement             |
| payment_date | date      | Date du paiement                |
| description  | text      | Description facultative         |
| status       | text      | `active` ou `deleted`           |
| created_by   | uuid      | Auteur du paiement              |
| created_at   | timestamp | Date de création                |
| updated_at   | timestamp | Date de modification            |
| deleted_by   | uuid      | Auteur de suppression logique   |
| deleted_at   | timestamp | Date de suppression logique     |

### 10.3 Règles

* Le montant du paiement doit être supérieur à 0.
* Un paiement doit être lié à une opération existante.
* Le total des paiements ne doit pas dépasser le reste à payer.
* Un paiement reçu sur une recette augmente le compte choisi.
* Un paiement effectué sur une dépense diminue le compte choisi.
* Un paiement supprimé doit être marqué `deleted`, pas supprimé physiquement.

## 11. Table `attachments`

### 11.1 Rôle de la table

La table `attachments` permet d’associer des justificatifs aux opérations ou aux paiements.

Exemples :

* capture WAVE ;
* photo de reçu ;
* facture fournisseur ;
* note manuscrite.

### 11.2 Champs recommandés

| Champ        | Type      | Description                               |
| ------------ | --------- | ----------------------------------------- |
| id           | uuid      | Identifiant du justificatif               |
| related_type | text      | `operation` ou `payment`                  |
| related_id   | uuid      | Identifiant de l’opération ou du paiement |
| file_url     | text      | URL du fichier dans Supabase Storage      |
| file_name    | text      | Nom du fichier                            |
| file_type    | text      | Type MIME du fichier                      |
| uploaded_by  | uuid      | Utilisateur ayant ajouté le fichier       |
| created_at   | timestamp | Date d’ajout                              |

### 11.3 Règles

* Un justificatif est facultatif dans la V1.
* Un justificatif doit être lié soit à une opération, soit à un paiement.
* Les fichiers doivent être stockés dans Supabase Storage.
* L’accès aux fichiers doit respecter les droits utilisateurs.

## 12. Table `settings`

### 12.1 Rôle de la table

La table `settings` contient les paramètres généraux de l’application.

### 12.2 Champs recommandés

| Champ                         | Type      | Description                                                     |
| ----------------------------- | --------- | --------------------------------------------------------------- |
| id                            | uuid      | Identifiant                                                     |
| app_name                      | text      | Nom de l’application                                            |
| farm_name                     | text      | Nom de la ferme                                                 |
| currency                      | text      | Devise utilisée                                                 |
| allow_users_create_categories | boolean   | Autoriser ou non la création de catégories par les utilisateurs |
| created_at                    | timestamp | Date de création                                                |
| updated_at                    | timestamp | Date de modification                                            |

### 12.3 Valeurs recommandées

| Champ                         | Valeur            |
| ----------------------------- | ----------------- |
| app_name                      | SENCAILLE Finance |
| farm_name                     | SENCAILLE         |
| currency                      | FCFA              |
| allow_users_create_categories | true              |

### 12.4 Remarque importante

Les soldes initiaux sont mieux placés dans la table `accounts`, car ils appartiennent aux comptes financiers.

La table `settings` doit rester réservée aux paramètres globaux.

## 13. Table `audit_logs`

### 13.1 Rôle de la table

La table `audit_logs` permet de conserver l’historique des actions sensibles.

Elle est très importante pour une application financière.

Elle permet de savoir :

* qui a modifié une opération ;
* qui a supprimé une opération ;
* quelles données ont changé ;
* quand la modification a eu lieu.

### 13.2 Champs recommandés

| Champ        | Type      | Description                              |
| ------------ | --------- | ---------------------------------------- |
| id           | uuid      | Identifiant du journal                   |
| table_name   | text      | Nom de la table concernée                |
| record_id    | uuid      | Identifiant de l’enregistrement concerné |
| action       | text      | `create`, `update`, `delete`, `restore`  |
| old_data     | jsonb     | Anciennes données                        |
| new_data     | jsonb     | Nouvelles données                        |
| performed_by | uuid      | Utilisateur ayant effectué l’action      |
| created_at   | timestamp | Date de l’action                         |

### 13.3 Règles

* Les modifications importantes doivent être enregistrées.
* Les suppressions doivent être tracées.
* L’administrateur doit pouvoir consulter l’historique.
* Les utilisateurs simples ne doivent pas pouvoir modifier cette table.

## 14. Relations entre les tables

### 14.1 Relation `profiles` → `operations`

Un utilisateur peut créer plusieurs opérations.

Relation :

* `profiles.id` → `operations.created_by`

Type :

* un-à-plusieurs

### 14.2 Relation `profiles` → `categories`

Un utilisateur peut créer plusieurs catégories.

Relation :

* `profiles.id` → `categories.created_by`

Type :

* un-à-plusieurs

### 14.3 Relation `profiles` → `payments`

Un utilisateur peut enregistrer plusieurs paiements.

Relation :

* `profiles.id` → `payments.created_by`

Type :

* un-à-plusieurs

### 14.4 Relation `categories` → `operations`

Une catégorie peut être utilisée dans plusieurs opérations.

Relation :

* `categories.id` → `operations.category_id`

Type :

* un-à-plusieurs

### 14.5 Relation `parties` → `operations`

Un client ou fournisseur peut être lié à plusieurs opérations.

Relation :

* `parties.id` → `operations.party_id`

Type :

* un-à-plusieurs

### 14.6 Relation `accounts` → `operations`

Un compte peut être utilisé dans plusieurs opérations initialement payées.

Relation :

* `accounts.id` → `operations.initial_account_id`

Type :

* un-à-plusieurs

### 14.7 Relation `operations` → `payments`

Une opération peut avoir plusieurs paiements complémentaires.

Relation :

* `operations.id` → `payments.operation_id`

Type :

* un-à-plusieurs

### 14.8 Relation `accounts` → `payments`

Un compte peut être utilisé pour plusieurs paiements.

Relation :

* `accounts.id` → `payments.account_id`

Type :

* un-à-plusieurs

### 14.9 Relation `operations` / `payments` → `attachments`

Une opération ou un paiement peut avoir plusieurs justificatifs.

Relation polymorphe simple :

* `attachments.related_type`
* `attachments.related_id`

## 15. Schéma relationnel simplifié

```text
auth.users
   │
   │ 1 - 1
   ▼
profiles
   │
   ├── 1 - N → operations
   ├── 1 - N → payments
   ├── 1 - N → categories
   └── 1 - N → parties

categories
   │
   └── 1 - N → operations

parties
   │
   └── 1 - N → operations

accounts
   │
   ├── 1 - N → operations
   └── 1 - N → payments

operations
   │
   ├── 1 - N → payments
   └── 1 - N → attachments

payments
   │
   └── 1 - N → attachments
```

## 16. Calculs financiers essentiels

## 16.1 Montant total payé d’une opération

Montant total payé = paiement initial + paiements complémentaires actifs

Formule :

```text
total_paid = operations.initial_paid_amount + SUM(payments.amount WHERE payments.status = 'active')
```

## 16.2 Reste à payer d’une opération

```text
remaining_amount = operations.total_amount - total_paid
```

Si `remaining_amount = 0`, l’opération est payée.

Si `remaining_amount = total_amount`, l’opération est non payée.

Si `remaining_amount > 0` et `remaining_amount < total_amount`, l’opération est partiellement payée.

## 16.3 Statut réel du paiement

Le statut peut être calculé automatiquement :

```text
if total_paid = 0:
    payment_status = 'unpaid'

if total_paid > 0 and total_paid < total_amount:
    payment_status = 'partial'

if total_paid = total_amount:
    payment_status = 'paid'
```

Il est recommandé de calculer ce statut dans une vue plutôt que de le saisir manuellement.

## 16.4 Impact d’une recette sur les soldes

Une recette augmente le compte utilisé.

Si recette payée initialement par WAVE :

```text
Solde WAVE augmente de initial_paid_amount
```

Si paiement complémentaire reçu par WAVE :

```text
Solde WAVE augmente de payments.amount
```

## 16.5 Impact d’une dépense sur les soldes

Une dépense diminue le compte utilisé.

Si dépense payée initialement par WAVE :

```text
Solde WAVE diminue de initial_paid_amount
```

Si paiement complémentaire effectué par WAVE :

```text
Solde WAVE diminue de payments.amount
```

## 16.6 Calcul du solde d’un compte

Pour chaque compte :

```text
Solde = solde initial
      + recettes payées sur ce compte
      - dépenses payées depuis ce compte
      + paiements clients reçus sur ce compte
      - paiements fournisseurs effectués depuis ce compte
```

En base :

```text
account_balance =
accounts.opening_balance
+ SUM(initial_paid_amount des recettes liées au compte)
- SUM(initial_paid_amount des dépenses liées au compte)
+ SUM(payments.amount liés aux recettes)
- SUM(payments.amount liés aux dépenses)
```

## 16.7 Solde total disponible

```text
Solde total disponible = Solde WAVE + Solde caisse
```

## 16.8 Créances clients

Les créances clients correspondent aux recettes non totalement payées.

```text
Créances clients = SUM(remaining_amount des operations WHERE operation_type = 'income')
```

## 16.9 Dettes fournisseurs

Les dettes fournisseurs correspondent aux dépenses non totalement payées.

```text
Dettes fournisseurs = SUM(remaining_amount des operations WHERE operation_type = 'expense')
```

## 16.10 Balance nette des crédits

```text
Balance nette crédits = Créances clients - Dettes fournisseurs
```

## 17. Vues recommandées dans Supabase

Pour simplifier le développement, il est recommandé de créer des vues SQL.

### 17.1 Vue `operation_payment_summary`

Rôle :

* calculer le total payé ;
* calculer le reste à payer ;
* calculer le statut de paiement.

Champs calculés :

* operation_id
* total_amount
* initial_paid_amount
* additional_paid_amount
* total_paid
* remaining_amount
* computed_payment_status

### 17.2 Vue `account_balances`

Rôle :

* calculer le solde actuel de chaque compte.

Champs calculés :

* account_id
* account_name
* account_type
* opening_balance
* income_total
* expense_total
* current_balance

### 17.3 Vue `monthly_report`

Rôle :

* générer les chiffres du mois.

Champs possibles :

* month
* income_collected
* expense_paid
* treasury_result
* customer_receivables
* supplier_debts

### 17.4 Vue `category_report`

Rôle :

* totaliser les opérations par catégorie.

Champs possibles :

* category_id
* category_name
* operation_type
* operation_count
* total_amount
* total_paid
* total_remaining

### 17.5 Vue `user_activity_report`

Rôle :

* suivre les saisies par utilisateur.

Champs possibles :

* user_id
* full_name
* operation_count
* payment_count
* total_income_created
* total_expense_created

## 18. Contraintes métier à imposer dans la base

Les contraintes ne doivent pas être uniquement dans l’interface.
Elles doivent aussi être appliquées dans Supabase.

### 18.1 Contraintes sur les montants

* `total_amount > 0`
* `initial_paid_amount >= 0`
* `initial_paid_amount <= total_amount`
* `payments.amount > 0`

### 18.2 Contraintes sur les modes de règlement

* Si `settlement_mode = paid`, `initial_paid_amount = total_amount`
* Si `settlement_mode = credit`, `initial_paid_amount = 0`
* Si `settlement_mode = partial`, `initial_paid_amount > 0 AND initial_paid_amount < total_amount`

### 18.3 Contraintes sur les comptes

* Si `initial_paid_amount > 0`, `initial_account_id` est obligatoire.
* Si `initial_paid_amount = 0`, `initial_account_id` peut être vide.

### 18.4 Contraintes sur les tiers

* Si opération à crédit ou partielle, `party_id` est obligatoire.
* Si `operation_type = income`, le tiers doit être un client ou `both`.
* Si `operation_type = expense`, le tiers doit être un fournisseur ou `both`.

### 18.5 Contraintes sur les catégories

* `operations.operation_type` doit correspondre à `categories.operation_type`.

Cette règle peut être appliquée par trigger SQL si nécessaire.

## 19. Index recommandés

Pour améliorer la vitesse des filtres et rapports, il faut prévoir des index.

### 19.1 Index sur `operations`

Index recommandés :

* `operation_type`
* `category_id`
* `operation_date`
* `created_by`
* `status`
* `party_id`
* `initial_account_id`

### 19.2 Index sur `payments`

Index recommandés :

* `operation_id`
* `account_id`
* `payment_date`
* `created_by`
* `status`

### 19.3 Index sur `categories`

Index recommandés :

* `operation_type`
* `status`

### 19.4 Index sur `parties`

Index recommandés :

* `party_type`
* `status`
* `name`

## 20. Règles de sécurité Supabase RLS

La sécurité doit être activée avec Row Level Security.

### 20.1 Principe général

* L’administrateur peut tout voir et tout modifier.
* L’utilisateur simple peut créer des données.
* L’utilisateur simple peut voir ses propres données.
* L’utilisateur simple peut modifier ses propres opérations.
* L’utilisateur simple peut supprimer logiquement ses propres opérations.
* L’utilisateur simple ne peut pas modifier les opérations des autres.
* L’utilisateur simple ne peut pas gérer les paramètres sensibles.

## 20.2 Table `profiles`

Règles recommandées :

* chaque utilisateur peut lire son propre profil ;
* l’administrateur peut lire tous les profils ;
* l’administrateur peut modifier les profils ;
* un utilisateur simple ne peut pas changer son rôle.

## 20.3 Table `operations`

Règles recommandées :

* un utilisateur connecté peut créer une opération ;
* un utilisateur simple peut lire ses propres opérations ;
* l’administrateur peut lire toutes les opérations ;
* un utilisateur simple peut modifier ses propres opérations ;
* un utilisateur simple ne peut pas modifier les opérations des autres ;
* l’administrateur peut modifier toutes les opérations.

## 20.4 Table `payments`

Règles recommandées :

* un utilisateur connecté peut créer un paiement ;
* un utilisateur simple peut lire ses propres paiements ;
* l’administrateur peut lire tous les paiements ;
* un utilisateur simple ne peut modifier que ses propres paiements ;
* l’administrateur peut tout modifier.

## 20.5 Table `categories`

Deux options sont possibles.

Option simple :

* tous les utilisateurs connectés peuvent lire les catégories actives ;
* les utilisateurs autorisés peuvent créer des catégories ;
* seul l’administrateur peut modifier ou désactiver les catégories.

Option souple :

* tous les utilisateurs peuvent créer une catégorie pendant la saisie ;
* l’administrateur peut ensuite corriger, désactiver ou fusionner.

Pour SENCAILLE Finance V1, l’option souple est recommandée.

## 20.6 Table `settings`

Règles recommandées :

* tous les utilisateurs connectés peuvent lire certains paramètres ;
* seul l’administrateur peut modifier les paramètres.

## 20.7 Table `audit_logs`

Règles recommandées :

* seul l’administrateur peut lire les journaux d’audit ;
* aucun utilisateur simple ne peut les modifier ;
* l’application ou les triggers peuvent insérer automatiquement les logs.

## 21. Données initiales à créer

Lors de l’installation de l’application, il faut créer :

### 21.1 Comptes financiers

| name             | account_type | opening_balance |
| ---------------- | ------------ | --------------: |
| WAVE SENCAILLE   | wave         |       à définir |
| Caisse SENCAILLE | cash         |       à définir |

### 21.2 Paramètres

| app_name          | farm_name | currency |
| ----------------- | --------- | -------- |
| SENCAILLE Finance | SENCAILLE | FCFA     |

### 21.3 Catégories de recettes

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

### 21.4 Catégories de dépenses

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

### 21.5 Premier administrateur

Le premier administrateur doit être créé manuellement ou via Supabase Auth.

Son profil doit avoir :

* role = `admin`
* status = `active`

## 22. Exemple complet d’enregistrement

### 22.1 Vente payée par WAVE

Exemple :

* vente œufs de caille ;
* montant : 20 000 FCFA ;
* payé totalement ;
* moyen : WAVE.

Dans `operations` :

| Champ               | Valeur               |
| ------------------- | -------------------- |
| operation_type      | income               |
| category_id         | Vente œufs de caille |
| total_amount        | 20000                |
| initial_paid_amount | 20000                |
| settlement_mode     | paid                 |
| initial_account_id  | WAVE SENCAILLE       |
| party_id            | null                 |
| status              | active               |

Effet :

* solde WAVE +20 000 FCFA.

Aucune ligne dans `payments`, car tout est payé dès la saisie.

## 22.2 Vente à crédit

Exemple :

* vente cailleteaux ;
* client : Moussa Diop ;
* montant : 30 000 FCFA ;
* aucun paiement immédiat.

Dans `operations` :

| Champ               | Valeur            |
| ------------------- | ----------------- |
| operation_type      | income            |
| category_id         | Vente cailleteaux |
| total_amount        | 30000             |
| initial_paid_amount | 0                 |
| settlement_mode     | credit            |
| initial_account_id  | null              |
| party_id            | Moussa Diop       |
| status              | active            |

Effet :

* aucun impact immédiat sur WAVE ou caisse ;
* créance client de 30 000 FCFA.

## 22.3 Paiement reçu plus tard

Moussa paie ensuite 10 000 FCFA par WAVE.

Dans `payments` :

| Champ        | Valeur                      |
| ------------ | --------------------------- |
| operation_id | opération vente cailleteaux |
| account_id   | WAVE SENCAILLE              |
| amount       | 10000                       |
| payment_date | date du paiement            |
| status       | active                      |

Effet :

* solde WAVE +10 000 FCFA ;
* reste à payer : 20 000 FCFA ;
* statut : partiellement payé.

## 22.4 Achat à crédit

Exemple :

* achat aliment volaille ;
* fournisseur : Boutique Aliment Thiès ;
* montant : 80 000 FCFA ;
* aucun paiement immédiat.

Dans `operations` :

| Champ               | Valeur                 |
| ------------------- | ---------------------- |
| operation_type      | expense                |
| category_id         | Achat aliment volaille |
| total_amount        | 80000                  |
| initial_paid_amount | 0                      |
| settlement_mode     | credit                 |
| initial_account_id  | null                   |
| party_id            | Boutique Aliment Thiès |
| status              | active                 |

Effet :

* aucune baisse immédiate de WAVE ou caisse ;
* dette fournisseur de 80 000 FCFA.

## 22.5 Paiement fournisseur plus tard

SENCAILLE paie 30 000 FCFA en espèces.

Dans `payments` :

| Champ        | Valeur                  |
| ------------ | ----------------------- |
| operation_id | opération achat aliment |
| account_id   | Caisse SENCAILLE        |
| amount       | 30000                   |
| payment_date | date du paiement        |
| status       | active                  |

Effet :

* caisse -30 000 FCFA ;
* reste à payer : 50 000 FCFA ;
* statut : partiellement payé.

## 23. Modèle simplifié des calculs pour Gemini

Gemini doit respecter cette logique :

```text
Une opération a toujours un montant total.

Une opération peut avoir un paiement initial.

Une opération peut recevoir plusieurs paiements complémentaires.

Le total payé d’une opération =
paiement initial + somme des paiements complémentaires actifs.

Le reste à payer =
montant total - total payé.

Si l’opération est une recette :
les paiements augmentent le compte utilisé.

Si l’opération est une dépense :
les paiements diminuent le compte utilisé.
```

Cette logique évite de créer une nouvelle recette à chaque paiement reçu sur une vente à crédit.
Elle évite aussi de créer une nouvelle dépense à chaque paiement fournisseur.

Le paiement est lié à l’opération d’origine.

## 24. Points à ne pas faire

Pour éviter les erreurs, il ne faut pas :

1. stocker seulement un champ `client_name` sans table `parties`, sauf pour un prototype très rapide ;
2. supprimer physiquement les opérations ;
3. laisser l’utilisateur choisir une catégorie incompatible avec le type ;
4. compter une vente à crédit comme une recette encaissée ;
5. compter un achat à crédit comme une dépense payée ;
6. recalculer les soldes manuellement dans plusieurs endroits ;
7. permettre à un utilisateur simple de modifier les opérations des autres ;
8. laisser les règles de sécurité uniquement dans le frontend ;
9. écrire les clés Supabase directement dans le code ;
10. créer des catégories sans type d’opération.

## 25. Synthèse finale du modèle de données

Le modèle de données recommandé pour SENCAILLE Finance repose sur 9 tables :

1. `profiles` pour les utilisateurs ;
2. `accounts` pour WAVE et caisse ;
3. `categories` pour les catégories liées aux types ;
4. `parties` pour les clients et fournisseurs ;
5. `operations` pour les recettes et dépenses ;
6. `payments` pour les paiements liés aux crédits ;
7. `attachments` pour les justificatifs ;
8. `settings` pour les paramètres globaux ;
9. `audit_logs` pour la traçabilité.

Le cœur du modèle est :

```text
operations + payments + accounts
```

C’est ce trio qui garantit les soldes.

La logique principale est :

```text
Recette payée = entrée d’argent
Dépense payée = sortie d’argent
Crédit = aucun impact immédiat sur les soldes
Paiement ultérieur = impact réel sur WAVE ou caisse
```

Ce modèle est simple, solide, compatible Supabase, et suffisamment évolutif pour accompagner les futures versions de SENCAILLE Finance.
