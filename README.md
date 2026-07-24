# Comic Enhancer v2.0

Outil idéal pour tous ceux qui veulent traiter des images par lot grâce à l'IA. Améliorez instantanément la lisibilité des textes sur vos planches de bande dessinée !

## Fonctionnalités 🚀
- **Traitement Séquentiel par lot** : Uploadez des dizaines d'images, lancez le mode auto, et laissez l'IA traiter chaque image sans intervention.
- **Prompt Personnalisable** : Ajustez le prompt envoyé à l'IA pour obtenir le résultat stylistique désiré.
- **Upscale 2X Haute Def** : Passez vos planches à la résolution supérieure grâce au modèle neural spécialisé (Crisp Upscale).
- **Export ZIP par lot** : Téléchargez toutes les images modifiées d'un coup (basse def ou upscalées).

## Installation 🛠️

1. Clonez ce dépôt.
2. Installez les dépendances :
   ```bash
   npm install
   ```
3. Créez un fichier `.env` à la racine en vous basant sur `.env.example` et ajoutez votre clé API Kie.ai.
4. Lancez le serveur de développement :
   ```bash
   npm run dev
   ```

## Clé API Kie.ai 🔑

Cette application utilise l'API de Kie.ai pour le traitement des images.
Obtenez votre clé API ici : [Créer sa clé d'API sur Kie.ai](https://kie.ai?ref=3b936d7970ee7afd4833f087a6c6b2bb)
Vous pouvez configurer cette clé dans le fichier `.env` (`KIE_API_KEY`) ou la renseigner directement depuis l'interface utilisateur de l'application via le bouton "Clé API".
