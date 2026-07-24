import React from 'react';

export const MentionsLegales = ({ onBack }: { onBack: () => void }) => {
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
          <h1 className="text-3xl font-bold text-white mb-2">Mentions légales</h1>
          <p className="text-slate-400 mb-8">Dernière mise à jour : 24 juillet 2026</p>

          <h2 className="text-xl font-semibold text-white mt-8 mb-4">1. Éditeur du service</h2>
          <p>Le site et l'application <strong>Comic Enhancer</strong>, accessibles à l'adresse https://comic-enhancer.ai.studio/ sont édités par :</p>
          <p><strong>ACADEE</strong>, société par actions simplifiée — SAS — au capital social de 5000 euros, dont le siège social est situé :</p>
          <p>24 Villa Rothier<br/>10000 Troyes<br/>France</p>
          <p>Immatriculée au Registre du commerce et des sociétés de Troyes.</p>
          <p>SIRET : 879 200 707 00021<br/>Numéro de TVA intracommunautaire : FR55 879200707<br/>Code APE : 8559A</p>
          <p>Adresse électronique : contact@acadee.fr</p>

          <h2 className="text-xl font-semibold text-white mt-8 mb-4">2. Directeur de la publication</h2>
          <p>Le directeur de la publication est :</p>
          <p><strong>Samuel Dumas</strong>, en qualité de représentant légal d'ACADEE.</p>
          <p>Contact : contact@acadee.fr</p>

          <h2 className="text-xl font-semibold text-white mt-8 mb-4">3. Hébergement</h2>
          <p>L'application Comic Enhancer et les ressources techniques associées sont hébergées à l'aide des services Google Cloud.</p>
          <p>L'entité contractante de Google Cloud applicable aux clients établis en France est :</p>
          <p><strong>Google Cloud France SARL</strong><br/>8 rue de Londres<br/>75009 Paris<br/>France</p>
          <p>Le stockage ou le traitement technique de certaines données peut être réalisé dans les infrastructures et régions cloud activées par ACADEE, conformément à la configuration du service, aux contrats conclus avec Google Cloud et à la réglementation applicable.</p>

          <h2 className="text-xl font-semibold text-white mt-8 mb-4">4. Objet du service</h2>
          <p>Comic Enhancer est une application de traitement d'images par lot assisté par intelligence artificielle.</p>
          <p>Elle permet notamment :</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>d'améliorer la qualité ou la lisibilité d'images et de planches de bande dessinée ;</li>
            <li>de coloriser des illustrations ;</li>
            <li>de supprimer ou de modifier l'arrière-plan d'images ;</li>
            <li>de restaurer des photographies ;</li>
            <li>d'augmenter la résolution d'images ;</li>
            <li>d'appliquer une instruction personnalisée à plusieurs fichiers ;</li>
            <li>d'exporter les résultats obtenus individuellement ou sous forme d'archive.</li>
          </ul>
          <p>Les fonctionnalités de transformation et de génération reposent en partie sur des services techniques fournis par des prestataires tiers.</p>

          <h2 className="text-xl font-semibold text-white mt-8 mb-4">5. Utilisation de Kie.ai</h2>
          <p>Comic Enhancer permet à l'utilisateur de connecter une clé API personnelle fournie par la plateforme <strong>Kie.ai</strong>.</p>
          <p>ACADEE et Kie.ai sont des entités juridiquement et commercialement distinctes. Sauf indication contraire expresse :</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>ACADEE n'est ni l'éditeur, ni le mandataire, ni le revendeur de Kie.ai ;</li>
            <li>Kie.ai n'est ni l'éditeur, ni le mandataire, ni le représentant d'ACADEE ;</li>
            <li>la création du compte Kie.ai est réalisée directement par l'utilisateur ;</li>
            <li>la clé API est délivrée par Kie.ai ;</li>
            <li>les crédits et consommations d'API sont facturés ou décomptés directement selon les conditions tarifaires de Kie.ai ;</li>
            <li>l'utilisation des services de Kie.ai est soumise aux propres conditions contractuelles et politiques de Kie.ai.</li>
          </ul>
          <p>Les noms, marques, logos, tarifs et services de tiers mentionnés dans l'application demeurent la propriété de leurs titulaires respectifs.</p>
          <p>Les tarifs affichés à titre informatif peuvent évoluer indépendamment de la volonté d'ACADEE. L'utilisateur doit vérifier les tarifs, limitations et conditions applicables directement auprès du prestataire concerné avant toute utilisation payante.</p>

          <h2 className="text-xl font-semibold text-white mt-8 mb-4">6. Propriété intellectuelle</h2>
          <p>L'application Comic Enhancer, son interface, sa structure, son identité visuelle, ses éléments graphiques, ses textes, sa documentation, ses fonctionnalités, son code source non librement publié, ses bases de données et, plus généralement, l'ensemble de ses contenus sont protégés par les dispositions applicables en matière de propriété intellectuelle.</p>
          <p>Sauf mention contraire, ces éléments sont la propriété exclusive d'ACADEE ou sont utilisés avec l'autorisation de leurs titulaires.</p>
          <p>Toute reproduction, représentation, extraction, adaptation, traduction, modification, diffusion, commercialisation ou exploitation, totale ou partielle, de ces éléments sans autorisation écrite préalable d'ACADEE est interdite, sauf dans les cas expressément autorisés par la loi.</p>
          <p>L'accès à Comic Enhancer ne confère à l'utilisateur aucun droit de propriété sur l'application, son fonctionnement, ses modèles d'interface ou ses composants techniques.</p>

          <h2 className="text-xl font-semibold text-white mt-8 mb-4">7. Contenus importés par les utilisateurs</h2>
          <p>L'utilisateur demeure responsable des images, documents, instructions et autres contenus qu'il importe ou traite au moyen de Comic Enhancer.</p>
          <p>Il lui appartient de vérifier qu'il dispose de tous les droits, autorisations et bases juridiques nécessaires pour :</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>importer les fichiers ;</li>
            <li>les transmettre aux prestataires techniques utilisés ;</li>
            <li>les modifier ou les faire modifier par un système d'intelligence artificielle ;</li>
            <li>exploiter, reproduire ou diffuser les résultats obtenus ;</li>
            <li>traiter les éventuelles données personnelles contenues dans les fichiers.</li>
          </ul>
          <p>L'utilisateur s'interdit notamment d'importer ou de traiter un contenu :</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>portant atteinte aux droits d'auteur, droits voisins ou droits des marques ;</li>
            <li>portant atteinte au droit à l'image ou à la vie privée ;</li>
            <li>contenant des données personnelles obtenues ou utilisées illicitement ;</li>
            <li>illicite, frauduleux, diffamatoire ou manifestement préjudiciable ;</li>
            <li>destiné à usurper l'identité d'une personne ou à induire volontairement le public en erreur ;</li>
            <li>dont le traitement serait interdit par la législation applicable ou par les conditions des prestataires techniques.</li>
          </ul>
          <p>ACADEE ne revendique aucun droit de propriété sur les fichiers originaux appartenant aux utilisateurs.</p>

          <h2 className="text-xl font-semibold text-white mt-8 mb-4">8. Résultats générés par intelligence artificielle</h2>
          <p>Les résultats obtenus à l'aide de Comic Enhancer sont produits automatiquement à partir des contenus, paramètres et instructions fournis par l'utilisateur, ainsi que des modèles proposés par des prestataires tiers.</p>
          <p>En raison du fonctionnement probabiliste des systèmes d'intelligence artificielle :</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>un résultat peut être imparfait, incomplet ou différent du résultat attendu ;</li>
            <li>certains textes, visages, détails, couleurs ou éléments graphiques peuvent être altérés ;</li>
            <li>la cohérence entre plusieurs images ne peut être garantie ;</li>
            <li>le résultat peut nécessiter une vérification ou une retouche humaine ;</li>
            <li>une transformation peut introduire des éléments non présents dans l'image originale.</li>
          </ul>
          <p>L'utilisateur doit examiner chaque résultat avant sa publication, son impression, sa commercialisation ou son utilisation professionnelle.</p>
          <p>Comic Enhancer ne garantit pas qu'un résultat généré soit original, juridiquement protégeable, libre de droits de tiers ou adapté à un usage déterminé.</p>

          <h2 className="text-xl font-semibold text-white mt-8 mb-4">9. Responsabilité</h2>
          <p>ACADEE met en œuvre des moyens raisonnables pour assurer le fonctionnement, la sécurité et l'accessibilité de Comic Enhancer.</p>
          <p>Toutefois, ACADEE ne garantit pas :</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>un accès permanent ou ininterrompu au service ;</li>
            <li>l'absence de dysfonctionnement, d'erreur ou d'interruption ;</li>
            <li>la disponibilité permanente des API ou modèles tiers ;</li>
            <li>le maintien d'un modèle, d'une fonctionnalité ou d'un tarif déterminé ;</li>
            <li>la réussite de chaque traitement ;</li>
            <li>l'absence de perte de qualité ou de modification inattendue ;</li>
            <li>la conservation permanente des fichiers et résultats.</li>
          </ul>
          <p>Le service peut être temporairement interrompu, notamment pour maintenance, mise à jour, correction, sécurisation ou en raison d'une défaillance d'un prestataire tiers.</p>
          <p>ACADEE ne saurait être tenue responsable d'un dommage résultant directement ou indirectement :</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>d'une mauvaise utilisation du service ;</li>
            <li>du contenu importé par l'utilisateur ;</li>
            <li>d'un prompt ou paramétrage inadapté ;</li>
            <li>de l'exploitation d'un résultat sans vérification préalable ;</li>
            <li>d'une violation des droits d'un tiers par l'utilisateur ;</li>
            <li>d'une indisponibilité de Kie.ai, Google Cloud ou d'un autre prestataire ;</li>
            <li>de la suspension, révocation, divulgation ou mauvaise utilisation d'une clé API ;</li>
            <li>d'une modification des tarifs ou conditions d'un prestataire tiers ;</li>
            <li>de la perte d'un fichier lorsque l'utilisateur n'en a pas conservé une copie.</li>
          </ul>
          <p>L'utilisateur doit conserver une copie locale de ses fichiers originaux et des résultats qu'il souhaite préserver.</p>

          <h2 className="text-xl font-semibold text-white mt-8 mb-4">10. Sécurité des clés API</h2>
          <p>La clé API utilisée dans Comic Enhancer est personnelle et confidentielle.</p>
          <p>L'utilisateur est responsable :</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>de sa création ;</li>
            <li>de sa conservation ;</li>
            <li>de sa confidentialité ;</li>
            <li>des restrictions et plafonds configurés auprès du fournisseur ;</li>
            <li>des requêtes et dépenses associées à son compte ;</li>
            <li>de sa révocation en cas de perte, de divulgation ou de suspicion d'utilisation frauduleuse.</li>
          </ul>
          <p>L'utilisateur ne doit pas communiquer sa clé API à un tiers ni l'insérer dans un environnement public ou non sécurisé.</p>
          <p>En cas de compromission présumée, il doit immédiatement révoquer ou renouveler la clé depuis le tableau de bord du fournisseur concerné.</p>

          <h2 className="text-xl font-semibold text-white mt-8 mb-4">11. Données personnelles</h2>
          <p>Les traitements de données personnelles mis en œuvre dans le cadre de Comic Enhancer sont décrits dans la Politique de confidentialité accessible depuis l'application.</p>

          <h2 className="text-xl font-semibold text-white mt-8 mb-4">12. Cookies et traceurs</h2>
          <p>L'application peut utiliser des traceurs strictement nécessaires à son fonctionnement, à sa sécurité, à la gestion de la session ou à la mémorisation des préférences techniques.</p>

          <h2 className="text-xl font-semibold text-white mt-8 mb-4">13. Liens vers des services tiers</h2>
          <p>Comic Enhancer peut contenir des liens vers des sites, interfaces ou services exploités par des tiers, notamment Kie.ai ou les fournisseurs des modèles utilisés.</p>
          <p>ACADEE n'exerce aucun contrôle sur le contenu, la sécurité, la disponibilité ou les pratiques de ces services externes.</p>

          <h2 className="text-xl font-semibold text-white mt-8 mb-4">14. Signalement d'un contenu ou d'un usage illicite</h2>
          <p>Tout signalement concernant un contenu ou un usage manifestement illicite de Comic Enhancer peut être adressé à :</p>
          <p>ACADEE<br/>24 Villa Rothier<br/>10000 Troyes<br/>France</p>
          <p>Adresse électronique : contact@acadee.fr</p>

          <h2 className="text-xl font-semibold text-white mt-8 mb-4">15. Droit applicable</h2>
          <p>Les présentes mentions légales sont soumises au droit français.</p>
          <p>Sous réserve des règles impératives applicables, tout différend relatif à l'accès au site ou à l'application relève des juridictions compétentes conformément aux règles de procédure applicables.</p>
        </div>
      </div>
    </div>
  );
};
