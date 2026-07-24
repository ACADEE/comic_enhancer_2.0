# Comic Enhancer v2.0

<div align="center">

![Comic Enhancer v2.0](https://firebasestorage.googleapis.com/v0/b/contentgenai-2b3d1.firebasestorage.app/o/img%20hp%2Fhomeup.png?alt=media&token=e81c9191-33a3-4107-8f8f-e719c0e7b1fb)

### Traitez des dizaines d’images par lot grâce à l’intelligence artificielle

Amélioration de bandes dessinées, colorisation, restauration, suppression d’arrière-plan et upscale haute définition dans une seule interface.

[Installer le projet](#installation) · [Obtenir une clé Kie.ai](https://kie.ai?ref=3b936d7970ee7afd4833f087a6c6b2bb) · [Voir les fonctionnalités](#fonctionnalités)

</div>

---

## Présentation

**Comic Enhancer v2.0** est une application de traitement d’images par lot propulsée par l’intelligence artificielle.

Importez plusieurs images, personnalisez votre instruction, lancez le traitement automatique et récupérez l’ensemble des résultats dans une archive ZIP.

L’application a initialement été conçue pour améliorer la lisibilité des textes sur les planches de bandes dessinées, mais son prompt personnalisable permet de couvrir de nombreux usages :

- amélioration de planches de BD et de comics ;
- colorisation de mangas et de croquis ;
- restauration de photographies anciennes ;
- suppression ou remplacement d’arrière-plans ;
- amélioration de photos de produits ;
- upscale haute définition ;
- transformation cohérente d’une série complète d’images.

---

## Démonstration

![Démonstration Comic Enhancer](https://firebasestorage.googleapis.com/v0/b/contentgenai-2b3d1.firebasestorage.app/o/img%20hp%2Fdemo.png?alt=media&token=49030bb9-c165-4fc8-80cc-7712ef479abc)

---

## Pourquoi utiliser Comic Enhancer ?

Les outils d’intelligence artificielle sont souvent efficaces pour transformer une image, mais deviennent rapidement contraignants lorsqu’il faut en traiter plusieurs dizaines.

Comic Enhancer transforme ce travail répétitif en un pipeline simple :

1. Importez vos images.
2. Définissez votre prompt.
3. Lancez le traitement automatique.
4. Suivez la progression image par image.
5. Effectuez un upscale si nécessaire.
6. Téléchargez l’ensemble des résultats dans un fichier ZIP.

Aucun traitement manuel entre chaque image n’est nécessaire.

---

## Fonctionnalités

### Traitement séquentiel par lot

Importez des dizaines d’images et laissez l’application les traiter automatiquement les unes après les autres.

Le suivi de progression permet d’identifier rapidement :

- les images terminées ;
- les traitements en cours ;
- les éventuels échecs ;
- l’avancement global du batch.

### Prompt personnalisable

Adaptez l’instruction envoyée au modèle d’intelligence artificielle selon votre besoin.

```text
Améliore la lisibilité de tous les textes sans modifier les illustrations,
les personnages, la composition des cases ni le style graphique.
```

```text
Colorise cette planche de manga avec une palette cinématographique cohérente,
des tons naturels et un éclairage doux.
```

```text
Restaure cette photographie ancienne, supprime les rayures et le bruit,
améliore les détails sans modifier les traits du visage.
```

### Amélioration de bandes dessinées

Optimisez les textes difficiles à lire sur des planches sombres, anciennes, compressées ou générées par intelligence artificielle.

### Upscale 2X haute définition

Augmentez la résolution de vos images grâce au modèle neural **Crisp Upscale**.

Cette étape peut être appliquée après la transformation principale afin d’obtenir un fichier plus propre et plus adapté à l’impression ou à la publication.

### Export ZIP par lot

Téléchargez tous les résultats en une seule opération :

- images transformées ;
- versions upscalées ;
- fichiers finalisés du batch.

### Utilisation de votre propre clé API

Comic Enhancer fonctionne avec votre clé API Kie.ai.

Vous conservez ainsi le contrôle sur :

- votre compte ;
- vos crédits ;
- votre consommation ;
- les modèles utilisés ;
- le coût de chaque traitement.

### Notification de fin de traitement

L’application peut envoyer un récapitulatif par e-mail lorsque le batch est terminé, comprenant notamment :

- le nombre d’images traitées avec succès ;
- le nombre total d’images ;
- les éventuels échecs ;
- les crédits Kie.ai consommés ;
- le coût estimé du traitement.

---

## Cas d’usage

| Cas d’usage | Résultat attendu |
|---|---|
| Bandes dessinées | Amélioration de la lisibilité des textes |
| Mangas | Colorisation cohérente de planches en noir et blanc |
| Photographies anciennes | Réduction des rayures, du bruit et des dégradations |
| E-commerce | Suppression ou uniformisation des arrière-plans |
| Création visuelle | Application d’un même style à une série d’images |
| Impression | Upscale et amélioration de la résolution |
| Archives | Restauration de lots de documents visuels |

---

## Technologies

Comic Enhancer repose notamment sur :

- **Next.js**
- **React**
- **TypeScript**
- **Tailwind CSS**
- **Kie.ai API**
- **GPT Image**
- **Recraft Crisp Upscale**
- **Export ZIP côté client**
- **Google Cloud**

---

## Prérequis

Avant de commencer, vérifiez que votre environnement dispose de :

- Node.js 18 ou supérieur ;
- npm, pnpm ou yarn ;
- Git ;
- une clé API Kie.ai valide.

```bash
node --version
```

---

## Installation

### 1. Cloner le dépôt

```bash
git clone https://github.com/ACADEE/comic_enhancer_2.0.git
cd comic_enhancer_2.0
```

### 2. Installer les dépendances

Avec npm :

```bash
npm install
```

Avec pnpm :

```bash
pnpm install
```

Avec yarn :

```bash
yarn install
```

### 3. Configurer les variables d’environnement

Créez un fichier `.env.local` à la racine du projet :

```bash
cp .env.example .env.local
```

Ajoutez ensuite votre configuration :

```env
KIE_API_KEY=votre_cle_api_kie
```

Consultez le fichier `.env.example` du dépôt pour connaître les variables réellement utilisées par l’application.

### 4. Lancer le serveur de développement

```bash
npm run dev
```

Ouvrez ensuite :

```text
http://localhost:3000
```

### 5. Générer une version de production

```bash
npm run build
npm run start
```

---

## Configuration de la clé API Kie.ai

Comic Enhancer utilise l’API Kie.ai pour exécuter les traitements d’image.

**[Créer une clé API Kie.ai](https://kie.ai?ref=3b936d7970ee7afd4833f087a6c6b2bb)**

La clé peut être configurée de deux manières.

### Depuis le fichier d’environnement

```env
KIE_API_KEY=votre_cle_api
```

Cette méthode est adaptée à une instance privée ou à un déploiement contrôlé.

### Depuis l’interface

L’utilisateur peut renseigner sa propre clé depuis le bouton **Clé API** présent dans l’application.

Cette méthode est adaptée à une application publique fonctionnant selon le principe **Bring Your Own API Key**.

> Ne publiez jamais une clé API privée dans un dépôt GitHub, dans le code source front-end ou dans un fichier `.env` versionné.

---

## Exemple de fichier `.env.example`

```env
# Kie.ai
KIE_API_KEY=

# URL publique de l’application
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Webhook de notification
MAKE_WEBHOOK_URL=

# Configuration optionnelle
NEXT_PUBLIC_APP_NAME=Comic Enhancer
```

Les secrets serveur ne doivent pas utiliser le préfixe `NEXT_PUBLIC_`.

---

## Utilisation

### Traitement d’un lot

1. Ouvrez Comic Enhancer.
2. Renseignez votre clé API Kie.ai.
3. Importez vos images.
4. Sélectionnez ou personnalisez le prompt.
5. Choisissez la résolution souhaitée.
6. Lancez le traitement.
7. Gardez l’onglet ouvert jusqu’à la fin.
8. Téléchargez les résultats.

### Upscale

1. Sélectionnez les fichiers à agrandir.
2. Lancez l’upscale 2X.
3. Attendez la fin du traitement.
4. Téléchargez les versions haute définition.

### Export ZIP

Utilisez le bouton d’export pour télécharger en une seule fois toutes les images terminées.

---

## Coût des traitements

Comic Enhancer ne nécessite pas nécessairement d’abonnement propre.

Les traitements sont consommés directement sur le compte Kie.ai associé à la clé API utilisée.

Le coût dépend notamment :

- du modèle sélectionné ;
- de la résolution ;
- du nombre d’images ;
- du type de transformation ;
- de l’utilisation éventuelle d’un upscale.

Les tarifs peuvent évoluer. Vérifiez toujours les prix affichés directement par Kie.ai avant un traitement important.

---

## Sécurité

Quelques règles doivent être respectées lors du déploiement :

- ne jamais exposer une clé API serveur dans le navigateur ;
- ne jamais versionner les fichiers `.env` ;
- exécuter les appels sensibles depuis des routes API serveur ;
- limiter la taille et le nombre des fichiers importés ;
- valider les formats MIME côté client et côté serveur ;
- protéger les webhooks contre les appels non autorisés ;
- mettre en place une gestion des erreurs et des délais d’attente ;
- prévoir une clé d’idempotence pour éviter les doubles notifications ;
- ne pas conserver les images plus longtemps que nécessaire.

Ajoutez au minimum les fichiers suivants dans `.gitignore` :

```gitignore
.env
.env.local
.env.production
.next
node_modules
```

---

## Confidentialité

Les images importées peuvent contenir des données personnelles ou confidentielles.

Avant d’utiliser Comic Enhancer avec des fichiers sensibles, vérifiez :

- les conditions de Kie.ai ;
- les conditions des modèles sélectionnés ;
- les durées de conservation ;
- la localisation des traitements ;
- les règles relatives à l’entraînement des modèles ;
- les obligations applicables au titre du RGPD.

N’importez pas de documents d’identité, de données de santé, de données bancaires, d’images intimes ou de fichiers confidentiels sans garanties contractuelles et techniques adaptées.

---

## Scripts disponibles

```bash
npm run dev
```

Lance le serveur de développement.

```bash
npm run build
```

Génère la version optimisée de production.

```bash
npm run start
```

Lance la version de production.

```bash
npm run lint
```

Analyse le code et détecte les problèmes de qualité.

---

## Déploiement

Le projet peut être déployé sur différentes infrastructures compatibles avec Next.js :

- Google Cloud Run ;
- Firebase App Hosting ;
- Vercel ;
- Netlify ;
- serveur Node.js ;
- conteneur Docker.

Avant le déploiement, configurez les variables d’environnement dans l’interface sécurisée de votre hébergeur.

---

## Contribution

Les contributions sont les bienvenues.

```bash
git checkout -b feature/nom-de-la-fonctionnalite
git commit -m "feat: ajout de la fonctionnalité"
git push origin feature/nom-de-la-fonctionnalite
```

Ouvrez ensuite une Pull Request détaillée.

---

## Licence

Copyright © 2026 ACADEE.

Tous droits réservés. Toute reproduction, modification, redistribution ou exploitation commerciale du code est interdite sans autorisation écrite préalable d’ACADEE.

---

## Crédits

**Comic Enhancer v2.0**

Imaginé et développé par **ACADEE**.

Traitements d’intelligence artificielle propulsés par **Kie.ai** et les modèles disponibles sur sa plateforme.

---

<div align="center">

### Transformez un traitement répétitif en pipeline automatisé

[Consulter le dépôt GitHub](https://github.com/ACADEE/comic_enhancer_2.0) · [Créer une clé API Kie.ai](https://kie.ai?ref=3b936d7970ee7afd4833f087a6c6b2bb)

</div>
