import React from 'react';

export const PolitiqueConfidentialite = ({ onBack }: { onBack: () => void }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-800">
        <button 
          onClick={onBack}
          className="mb-8 text-cyan-500 hover:text-cyan-400 font-medium transition-colors inline-flex items-center gap-2"
        >
          ← Retour
        </button>
        
        <div className="prose prose-invert max-w-none">
          <h1 className="text-3xl font-bold text-white mb-2">Politique de confidentialité</h1>
          <p className="text-slate-400 mb-8">Comic Enhancer – ACADEE<br/>Version du 24 juillet 2026</p>

          <h2 className="text-xl font-semibold text-white mt-8 mb-4">1. Objet de la présente politique</h2>
          <p>La présente politique de confidentialité explique comment ACADEE collecte, utilise, transmet, conserve et protège les données personnelles traitées dans le cadre du site et de l'application Comic Enhancer, ci-après désignés le « Service ».</p>
          <p>Comic Enhancer permet notamment de traiter des images par lot au moyen de modèles d'intelligence artificielle accessibles par l'intermédiaire de services tiers.</p>
          <p>La présente politique concerne :</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>les visiteurs du site ;</li>
            <li>les utilisateurs de l'application ;</li>
            <li>les personnes qui contactent ACADEE ;</li>
            <li>les personnes identifiables apparaissant dans les images importées ;</li>
            <li>les utilisateurs des services techniques connectés à Comic Enhancer.</li>
          </ul>

          <h2 className="text-xl font-semibold text-white mt-8 mb-4">2. Responsable du traitement</h2>
          <p>Le responsable des traitements de données personnelles réalisés pour l'exploitation de Comic Enhancer est :</p>
          <p><strong>ACADEE</strong>, société par actions simplifiée<br/>Siège social : 24 Villa Rothier, 10000 Troyes, France<br/>SIRET : 879 200 707 00021<br/>TVA intracommunautaire : FR55 879200707</p>
          <p>Contact relatif à la protection des données : contact@acadee.fr</p>

          <h2 className="text-xl font-semibold text-white mt-8 mb-4">3. Rôles respectifs d'ACADEE, de l'utilisateur et de Kie.ai</h2>
          <h3 className="text-lg font-medium text-white mt-4 mb-2">3.1 ACADEE</h3>
          <p>ACADEE agit en qualité de responsable du traitement pour les données nécessaires :</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>au fonctionnement de Comic Enhancer ;</li>
            <li>à la sécurité de l'application ;</li>
            <li>à l'assistance des utilisateurs ;</li>
            <li>à la gestion des demandes ;</li>
            <li>à la prévention des abus ;</li>
            <li>à la mesure technique du fonctionnement du Service ;</li>
            <li>au respect de ses obligations légales.</li>
          </ul>
          
          <h3 className="text-lg font-medium text-white mt-4 mb-2">3.2 Utilisateur professionnel</h3>
          <p>Lorsqu'un utilisateur professionnel importe dans Comic Enhancer des images contenant les données personnelles de ses clients, salariés, modèles, auteurs, fournisseurs ou autres tiers, cet utilisateur demeure en principe responsable du traitement de ces données.</p>

          <h3 className="text-lg font-medium text-white mt-4 mb-2">3.3 Kie.ai</h3>
          <p>L'utilisateur crée directement son compte et sa clé API auprès de <strong>Kie.ai</strong>, service exploité par NEXUSAI SERVICES LLC selon la documentation publiée par ce fournisseur.</p>
          
          <h2 className="text-xl font-semibold text-white mt-8 mb-4">4. Données susceptibles d'être traitées</h2>
          <p>Comic Enhancer peut traiter les données suivantes : adresse IP, date et heure de connexion, identifiants techniques de session, type d'appareil, etc.</p>
          <p>La clé API Kie.ai peut être conservée uniquement dans la mémoire locale du navigateur, conservée dans le stockage local du navigateur, transmise temporairement au serveur pour exécuter une requête, ou stockée de manière chiffrée dans un environnement sécurisé.</p>

          <h2 className="text-xl font-semibold text-white mt-8 mb-4">5. Données dont l'importation est déconseillée ou interdite</h2>
          <p>Comic Enhancer n'est pas conçu pour traiter des données présentant un risque élevé pour les droits et libertés des personnes (données de santé, biométriques, etc.).</p>

          <h2 className="text-xl font-semibold text-white mt-8 mb-4">6. Finalités et bases légales</h2>
          <p>Les finalités incluent la fourniture du service, la gestion de la clé API, la sécurité et prévention des abus, l'assistance et gestion des demandes, etc.</p>

          <h2 className="text-xl font-semibold text-white mt-8 mb-4">7. Fonctionnement du traitement d'images</h2>
          <p>Selon l'architecture technique retenue, le traitement peut comporter l'envoi temporaire des images vers l'infrastructure de Comic Enhancer puis à Kie.ai pour le traitement.</p>
          
          <h2 className="text-xl font-semibold text-white mt-8 mb-4">8. Destinataires des données</h2>
          <p>Dans la limite de leurs attributions et du besoin d'en connaître, les données peuvent être accessibles aux personnes habilitées au sein d'ACADEE, aux prestataires d'hébergement et fournisseurs d'API.</p>

          <h2 className="text-xl font-semibold text-white mt-8 mb-4">9. Principaux prestataires</h2>
          <p>Google Cloud et Kie.ai.</p>
          
          <h2 className="text-xl font-semibold text-white mt-8 mb-4">10. Transferts hors de l'Espace économique européen</h2>
          <p>Certains prestataires ou fournisseurs de modèles peuvent être établis ou exploiter des infrastructures en dehors de l'Espace économique européen, notamment aux États-Unis.</p>
          
          <h2 className="text-xl font-semibold text-white mt-8 mb-4">11. Durées de conservation</h2>
          <p>ACADEE conserve les données uniquement pendant la durée nécessaire aux finalités poursuivies.</p>
          
          <h2 className="text-xl font-semibold text-white mt-8 mb-4">12. Sécurité</h2>
          <p>ACADEE met en œuvre des mesures techniques et organisationnelles adaptées aux risques.</p>
          
          <h2 className="text-xl font-semibold text-white mt-8 mb-4">13. Violation de données</h2>
          <p>En cas de violation de données personnelles susceptible d'engendrer un risque, ACADEE prendra les mesures nécessaires.</p>
          
          <h2 className="text-xl font-semibold text-white mt-8 mb-4">14. Droits des personnes</h2>
          <p>Sous réserve des conditions prévues par la réglementation, toute personne concernée peut exercer ses droits d'accès, de rectification, d'effacement, etc.</p>
          
          <h2 className="text-xl font-semibold text-white mt-8 mb-4">15. Modalités d'exercice des droits</h2>
          <p>Les demandes peuvent être adressées à contact@acadee.fr.</p>
          
          <h2 className="text-xl font-semibold text-white mt-8 mb-4">16. Réclamation auprès de la CNIL</h2>
          <p>Toute personne estimant que ses droits ne sont pas respectés peut adresser une réclamation à la CNIL.</p>
          
          <h2 className="text-xl font-semibold text-white mt-8 mb-4">17. Cookies et stockage local</h2>
          <p>Comic Enhancer peut utiliser des cookies ou technologies similaires pour assurer le fonctionnement technique.</p>
          
          <h2 className="text-xl font-semibold text-white mt-8 mb-4">18. Mineurs</h2>
          <p>Comic Enhancer est destiné principalement aux professionnels. Le Service n'est pas spécifiquement destiné aux enfants.</p>
          
          <h2 className="text-xl font-semibold text-white mt-8 mb-4">19. Images représentant des tiers</h2>
          <p>La personne qui importe une photographie représentant un tiers garantit qu'elle dispose d'une base juridique et de l'autorisation permettant de le faire.</p>
          
          <h2 className="text-xl font-semibold text-white mt-8 mb-4">20. Utilisation des données pour l'entraînement des modèles</h2>
          <p>ACADEE n'utilise pas les images, prompts ou résultats des utilisateurs pour entraîner ses propres modèles d'intelligence artificielle.</p>
          
          <h2 className="text-xl font-semibold text-white mt-8 mb-4">21. Liens externes</h2>
          <p>Comic Enhancer peut contenir des liens vers Kie.ai, Google Cloud ou d'autres services.</p>
          
          <h2 className="text-xl font-semibold text-white mt-8 mb-4">22. Modification de la politique</h2>
          <p>ACADEE peut modifier la présente politique afin de tenir compte d'évolutions légales ou réglementaires.</p>
          
          <h2 className="text-xl font-semibold text-white mt-8 mb-4">23. Contact</h2>
          <p>ACADEE – Protection des données<br/>24 Villa Rothier, 10000 Troyes, France<br/>Adresse électronique : contact@acadee.fr</p>
        </div>
      </div>
    </div>
  );
};
