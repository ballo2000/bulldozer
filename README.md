# Ivoire Machines

Vitrine de vente et de location de bulldozers pour une entreprise en Côte d’Ivoire. Le frontend utilise React et Vite ; le backend utilise Express, MongoDB et Mongoose.

## Organisation

- `frontend/` : interface React et fichiers Vite.
- `frontend/src/pages/` : pages d’accueil, catalogue, services et contact.
- `frontend/src/shared/` : en-tête, pied de page, cartes machines et parcours de commande réutilisables.
- `backend/` : API Express, modèles Mongoose et script de peuplement.
- `shared/` : données de démonstration partagées entre le frontend et le backend.

## Pages du site

- `/` : accueil et sélection de machines.
- `/machines` : catalogue BTP filtrable par type, vente/location et recherche.
- `/services` : location, vente, livraison et assistance.
- `/contact` : coordonnées et formulaire qui prépare un message WhatsApp.

Les coordonnées de contact et les machines sont des exemples à remplacer par les informations réelles de l’entreprise. Le formulaire de contact ouvre WhatsApp avec le message prérempli ; l’utilisateur doit encore l’envoyer.

## Démarrage

Prérequis : Node.js 20+ et MongoDB local ou MongoDB Atlas.

```powershell
Copy-Item .env.example .env
npm install
npm run seed
npm run dev
```

Ouvrez ensuite http://localhost:5173. Vite sert l’interface React et relaie les appels `/api` vers l’API Express sur le port 4000.

Pour générer les fichiers de production, exécutez `npm run build`, puis `npm start`. Express servira alors le site compilé ainsi que l’API sur le port 4000.

Sans MongoDB configuré, le catalogue de démonstration reste consultable, mais l’enregistrement des commandes est désactivé. Les machines de démonstration et leurs prix sont dans `shared/products.js`.

## Paiement mobile

Le checkout est intégré à CinetPay en mode Mobile Money. Le client fournit son prénom, son nom, son téléphone, sa ville et son e-mail, puis est redirigé vers la page sécurisée CinetPay où il choisit Orange Money ou MTN MoMo parmi les moyens activés pour le compte marchand. L’application ne collecte ni PIN ni code de validation. Après le retour client ou une notification serveur, le backend vérifie le montant, la devise et l’identifiant auprès de l’API CinetPay avant de confirmer la commande.

Pour l’activer, créez et faites valider un compte marchand CinetPay avec Orange Money et MTN MoMo activés en Côte d’Ivoire, puis renseignez dans `.env` :

```dotenv
APP_PUBLIC_URL=https://votre-domaine.ci
CINETPAY_API_KEY=votre_cle_api
CINETPAY_SITE_ID=votre_identifiant_site
```

Conservez les clés côté serveur uniquement. L’URL publique doit être accessible par CinetPay pour la notification `/api/payments/cinetpay/notify`. Pour les essais locaux, utilisez les identifiants sandbox CinetPay et un tunnel HTTPS public vers l’application. Sans MongoDB et sans compte CinetPay correctement configuré, aucune commande payante ne peut être créée.

Avant la mise en production, remplacez les machines, tarifs, coordonnées et nom de démonstration par les informations vérifiées de l’entreprise. Configurez HTTPS, les clés CinetPay de production, les règles de sécurité MongoDB et testez les notifications de paiement depuis un compte sandbox.
