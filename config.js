/* =====================================================================
   L'ATELIER VOLANT — CONFIGURATION
   ---------------------------------------------------------------------
   Tout ce qui est propre au réparateur se règle dans ce fichier :
   coordonnées, envoi WhatsApp, prix, zone, formation, avis et FAQ.
   Modifiez une valeur, enregistrez, rechargez la page : c'est tout.
   ===================================================================== */

window.SITE = {

  /* ---------------- L'entreprise ---------------- */
  entreprise: {
    nom: "L'Atelier Volant",
    nomDebut: "L'Atelier",              // le logo affiche « L'Atelier » puis « Volant » en couleur
    nomFin: "Volant",
    region: "Île-de-France",
    // Pour la démo : numéro WhatsApp d'Elyas, pour recevoir les devis de test. À remplacer par celui du réparateur.
    telephoneAffiche: "07 60 35 46 38",
    telephoneLien: "+33760354638",
    whatsapp: "33760354638",          // numéro WhatsApp du réparateur : indicatif + numéro, sans « + » ni espaces
    delaiReponse: "5 minutes",
    joursOuverts: [1, 2, 3, 4, 5, 6],   // 0 = dimanche … 6 = samedi
    heureFin: 19,                       // après cette heure, le site affiche « Disponible demain »
    prefixeDemande: "AV"
  },

  /* ---------------- Envoi automatique sur WhatsApp ----------------
     Quand le client appuie sur « Voir mon devis », le devis part tout seul sur le WhatsApp
     du réparateur (le client n'a rien à envoyer). Service gratuit utilisé : CallMeBot.
     Activation (2 minutes, une seule fois, depuis le téléphone du réparateur) :
       1. Suivre les instructions WhatsApp sur https://www.callmebot.com/blog/free-api-whatsapp-messages/
       2. CallMeBot répond avec une clé (« apikey ») : la coller ci-dessous.
     Tant que la clé est vide, le client voit à la place un bouton « Envoyer sur WhatsApp ». */
  envoiAuto: {
    callmebotCle: "",
    numero: ""                          // vide = le numéro « whatsapp » ci-dessus
  },

  /* ---------------- D'où viennent les clients ----------------
     Le message WhatsApp indique « Venu de : TikTok », etc.
     Détecté tout seul quand le lien est ouvert depuis l'appli Instagram, TikTok, Snapchat ou Facebook.
     Pour être sûr, mettre dans chaque bio le lien avec ?via=… à la fin, par exemple :
       https://elyasberdouz-stack.github.io/atelier-volant/?via=tiktok */
  sources: {
    tiktok: "TikTok", insta: "Instagram", snap: "Snapchat", facebook: "Facebook",
    google: "Google", whatsapp: "WhatsApp", flyer: "Flyer / carte de visite"
  },

  /* ---------------- Remises plusieurs réparations ---------------- */
  remises: { deuxieme: 20, suivantes: 30 },   // en %, appliquées des plus chères aux moins chères

  /* ---------------- Qualités d'écran ----------------
     Même ordre que les 3 premiers prix de chaque modèle plus bas.
     « {marque} » est remplacé par Apple, Samsung, Xiaomi ou Google. */
  qualitesEcran: [
    { id: "premium",  nom: "Écran premium",       badge: "Populaire",  ton: "accent",
      desc: "Entrée de gamme. Le choix de la majorité.", garantie: 1 },
    { id: "softoled", nom: "Écran Soft OLED",     badge: "Recommandé", ton: "ok",
      desc: "Le meilleur rapport qualité-prix. Le plus proche de l'original.", garantie: 3 },
    { id: "original", nom: "Écran original {marque}",
      desc: "Pièce d'origine. Rendu identique au neuf.", garantie: 6 }
  ],
  differenceEcrans: [
    ["Écran premium", "Une dalle compatible de bonne qualité. Couleurs un peu moins vives et bordure parfois un peu plus épaisse que l'original. Idéal pour un petit budget ou un téléphone qu'on va revendre."],
    ["Écran Soft OLED", "La même technologie que l'écran d'origine : noirs profonds, couleurs fidèles, fluidité conservée. À l'œil nu, presque impossible de voir la différence."],
    ["Écran original", "La pièce du constructeur. Rendu, luminosité et tactile identiques au neuf, et la meilleure garantie."]
  ],

  /* ---------------- Pannes ----------------
     L'écran a 3 prix (un par qualité). Les autres pannes ont un seul prix par modèle, dans cet ordre. */
  pannes: [
    { id: "ecran",       nom: "Écran cassé ou noir",   detail: "Vitre fêlée, tactile HS, affichage mort",  court: "Écran" },
    { id: "batterie",    nom: "Batterie",              detail: "Se décharge vite, s'éteint toute seule",   court: "Batterie",             garantie: 6 },
    { id: "connecteur",  nom: "Charge mal",            detail: "Le câble ne tient pas, charge lente",      court: "Connecteur de charge", garantie: 3 },
    { id: "camera",      nom: "Caméra",                detail: "Photos floues, objectif fêlé",             court: "Caméra",               garantie: 3 },
    { id: "vitre",       nom: "Vitre arrière cassée",  detail: "Le dos du téléphone",                      court: "Vitre arrière",        garantie: 3 },
    { id: "hautparleur", nom: "Son faible ou qui grésille", detail: "Haut-parleur ou écouteur d'appel",   court: "Haut-parleur",         garantie: 3 },
    { id: "micro",       nom: "On ne m'entend pas",    detail: "Micro en appel ou en vocal",               court: "Micro",                garantie: 3 },
    { id: "boutons",     nom: "Bouton bloqué",         detail: "Volume, marche/arrêt, silencieux",         court: "Boutons",              garantie: 3 }
  ],
  diagnostic: {
    id: "diagnostic", nom: "Autre panne / je ne sais pas",
    detail: "Ne s'allume plus, tombé dans l'eau… on trouve sur place",
    court: "Diagnostic", prix: 30, note: "offert si tu fais réparer"
  },

  /* Prix utilisés quand le modèle n'est pas dans la liste (estimation indicative). */
  prixIndicatifs: [60, 90, 180, 60, 60, 70, 60, 45, 45, 45],

  /* ---------------- Marques, modèles et prix ----------------
     Prix en euros, pièce + main-d'œuvre, déplacement offert.
     Ordre des 10 prix :
       écran premium, écran Soft OLED, écran original,
       batterie, connecteur, caméra, vitre arrière, haut-parleur, micro, boutons.
     Mettre null pour une option indisponible (ex. pas de Soft OLED sur un écran LCD). */
  marques: [
    {
      id: "apple", onglet: "iPhone", marque: "Apple",
      astuce: "Réglages → Général → Informations si tu n'es pas sûr.",
      series: [
        { nom: "iPhone 17", modeles: [
          ["iPhone 17 Pro Max",       140, 205, 405, 100, 110, 170, 150,  70,  70,  70],
          ["iPhone 17 Pro",           135, 195, 390, 100, 110, 160, 140,  70,  70,  70],
          ["iPhone Air",              125, 180, 365, 100, 110, 130, 130,  70,  70,  70],
          ["iPhone 17",               110, 160, 320,  90, 100, 130, 120,  65,  65,  65],
          ["iPhone 17e",               95, 140, 275,  85,  90, 105,  95,  60,  60,  60]
        ]},
        { nom: "iPhone 16", modeles: [
          ["iPhone 16 Pro Max",       125, 180, 365,  90, 100, 150, 130,  65,  65,  65],
          ["iPhone 16 Pro",           120, 175, 350,  90, 100, 140, 120,  65,  65,  65],
          ["iPhone 16 Plus",          105, 150, 305,  85,  90, 120, 110,  60,  60,  60],
          ["iPhone 16",                95, 140, 275,  85,  90, 110, 100,  60,  60,  60],
          ["iPhone 16e",               90, 130, 260,  80,  85, 100,  90,  60,  60,  60]
        ]},
        { nom: "iPhone 15", modeles: [
          ["iPhone 15 Pro Max",       105, 150, 305,  80,  90, 130, 110,  60,  60,  60],
          ["iPhone 15 Pro",            95, 140, 275,  80,  90, 120, 100,  60,  60,  60],
          ["iPhone 15 Plus",           90, 130, 260,  75,  85, 100,  90,  55,  55,  55],
          ["iPhone 15",                80, 115, 230,  75,  85,  95,  90,  55,  55,  55]
        ]},
        { nom: "iPhone 14", modeles: [
          ["iPhone 14 Pro Max",        90, 130, 260,  70,  80, 110, 100,  55,  55,  55],
          ["iPhone 14 Pro",            80, 115, 230,  70,  80, 100,  95,  55,  55,  55],
          ["iPhone 14 Plus",           75, 110, 220,  65,  75,  90,  90,  50,  50,  50],
          ["iPhone 14",                70, 100, 205,  65,  75,  85,  85,  50,  50,  50]
        ]},
        { nom: "iPhone 13", modeles: [
          ["iPhone 13 Pro Max",        80, 115, 230,  65,  75, 100,  90,  50,  50,  50],
          ["iPhone 13 Pro",            75, 110, 220,  65,  75,  95,  85,  50,  50,  50],
          ["iPhone 13",                65,  95, 190,  60,  70,  80,  80,  50,  50,  50],
          ["iPhone 13 mini",           65,  95, 190,  60,  70,  75,  75,  50,  50,  50]
        ]},
        { nom: "iPhone 12 et 11", modeles: [
          ["iPhone 12 Pro Max",        70, 100, 205,  60,  70,  90,  80,  45,  45,  45],
          ["iPhone 12 Pro",            60,  85, 175,  55,  65,  80,  70,  45,  45,  45],
          ["iPhone 12",                60,  85, 175,  55,  65,  70,  70,  45,  45,  45],
          ["iPhone 12 mini",           55,  80, 160,  55,  65,  65,  65,  45,  45,  45],
          ["iPhone 11 Pro Max",        60,  85, 175,  55,  65,  75,  70,  45,  45,  45],
          ["iPhone 11 Pro",            55,  80, 160,  55,  65,  70,  65,  45,  45,  45],
          ["iPhone 11",                50,null, 145,  50,  60,  60,  60,  45,  45,  45]
        ]},
        { nom: "Plus anciens", modeles: [
          ["iPhone SE (2022)",         45,null, 130,  45,  55,  50,  50,  40,  40,  40],
          ["iPhone SE (2020)",         40,null, 115,  45,  55,  50,  50,  40,  40,  40],
          ["iPhone XS Max",            50,  75, 145,  50,  55,  60,  60,  40,  40,  40],
          ["iPhone XS",                50,  75, 145,  50,  55,  55,  55,  40,  40,  40],
          ["iPhone XR",                45,null, 130,  45,  55,  55,  55,  40,  40,  40],
          ["iPhone X",                 50,  75, 145,  50,  55,  55,  55,  40,  40,  40]
        ]}
      ]
    },
    {
      id: "samsung", onglet: "Samsung", marque: "Samsung",
      astuce: "Paramètres → À propos du téléphone si tu n'es pas sûr.",
      series: [
        { nom: "Galaxy S25", modeles: [
          ["Galaxy S25 Ultra",        160, 240, 385,  90,  90, 140,  90,  65,  65,  65],
          ["Galaxy S25 Edge",         140, 210, 335,  90,  85, 120,  85,  60,  60,  60],
          ["Galaxy S25+",             130, 195, 310,  85,  85, 120,  80,  60,  60,  60],
          ["Galaxy S25",              120, 180, 290,  80,  80, 110,  75,  60,  60,  60]
        ]},
        { nom: "Galaxy S24", modeles: [
          ["Galaxy S24 Ultra",        145, 220, 350,  85,  85, 130,  85,  60,  60,  60],
          ["Galaxy S24+",             120, 180, 290,  80,  80, 110,  75,  60,  60,  60],
          ["Galaxy S24",              105, 160, 250,  80,  80, 100,  70,  55,  55,  55],
          ["Galaxy S24 FE",            90, 135, 215,  75,  75,  90,  65,  55,  55,  55]
        ]},
        { nom: "Galaxy S23 et avant", modeles: [
          ["Galaxy S23 Ultra",        130, 195, 310,  80,  80, 120,  80,  55,  55,  55],
          ["Galaxy S23+",             105, 160, 250,  75,  75, 100,  70,  55,  55,  55],
          ["Galaxy S23",               95, 145, 230,  75,  75,  90,  65,  55,  55,  55],
          ["Galaxy S23 FE",            85, 130, 205,  70,  70,  85,  60,  50,  50,  50],
          ["Galaxy S22 Ultra",        120, 180, 290,  75,  75, 110,  75,  50,  50,  50],
          ["Galaxy S22",               85, 130, 205,  70,  70,  85,  60,  50,  50,  50],
          ["Galaxy S21 FE",            70, 105, 170,  65,  65,  75,  55,  50,  50,  50]
        ]},
        { nom: "Galaxy Z (pliables)", modeles: [
          ["Galaxy Z Fold6",          315, 475, 755, 110, 100, 150, 100,  70,  70,  70],
          ["Galaxy Z Flip6",          210, 315, 505, 100,  90, 120,  90,  65,  65,  65],
          ["Galaxy Z Flip5",          190, 285, 455,  95,  90, 110,  85,  65,  65,  65]
        ]},
        { nom: "Galaxy A", modeles: [
          ["Galaxy A56",               75, 115, 180,  65,  60,  70,  50,  45,  45,  45],
          ["Galaxy A55",               70, 105, 170,  65,  60,  65,  50,  45,  45,  45],
          ["Galaxy A54",               60,  90, 145,  60,  55,  60,  45,  45,  45,  45],
          ["Galaxy A36",               65, 100, 155,  60,  55,  60,  45,  45,  45,  45],
          ["Galaxy A35",               60,  90, 145,  60,  55,  60,  45,  45,  45,  45],
          ["Galaxy A34",               60,  90, 145,  60,  55,  55,  45,  45,  45,  45],
          ["Galaxy A26",               55,  85, 130,  55,  50,  55,  45,  40,  40,  40],
          ["Galaxy A25",               55,  85, 130,  55,  50,  55,  45,  40,  40,  40],
          ["Galaxy A16",               50,  75, 120,  50,  45,  50,  40,  40,  40,  40],
          ["Galaxy A15",               45,  70, 110,  50,  45,  50,  40,  40,  40,  40]
        ]}
      ]
    },
    {
      id: "xiaomi", onglet: "Xiaomi", marque: "Xiaomi",
      astuce: "Paramètres → À propos du téléphone si tu n'es pas sûr.",
      series: [
        { nom: "Xiaomi", modeles: [
          ["Xiaomi 15 Ultra",         165, 250, 365,  85,  85, 150,  85,  60,  60,  60],
          ["Xiaomi 15",               120, 180, 265,  80,  80, 110,  70,  55,  55,  55],
          ["Xiaomi 15T Pro",          105, 160, 230,  75,  75, 100,  65,  55,  55,  55],
          ["Xiaomi 15T",               90, 135, 200,  75,  75,  90,  60,  55,  55,  55],
          ["Xiaomi 14T Pro",           95, 145, 210,  75,  75,  95,  65,  55,  55,  55],
          ["Xiaomi 14T",               85, 130, 185,  70,  70,  85,  60,  50,  50,  50],
          ["Xiaomi 14",               110, 165, 240,  75,  75, 100,  65,  55,  55,  55],
          ["Xiaomi 13T Pro",           90, 135, 200,  70,  70,  90,  60,  50,  50,  50],
          ["Xiaomi 13T",               80, 120, 175,  70,  70,  85,  55,  50,  50,  50]
        ]},
        { nom: "Redmi", modeles: [
          ["Redmi Note 14 Pro+ 5G",    75, 115, 165,  60,  55,  70,  50,  45,  45,  45],
          ["Redmi Note 14 Pro 5G",     70, 105, 155,  60,  55,  65,  50,  45,  45,  45],
          ["Redmi Note 14",            55,  85, 120,  55,  50,  55,  45,  40,  40,  40],
          ["Redmi Note 13 Pro+ 5G",    75, 115, 165,  60,  55,  65,  50,  45,  45,  45],
          ["Redmi Note 13 Pro 5G",     65, 100, 145,  55,  55,  60,  45,  45,  45,  45],
          ["Redmi Note 13",            55,  85, 120,  55,  50,  55,  40,  40,  40,  40],
          ["Redmi 14C",                40,null,  90,  50,  45,  45,  35,  35,  35,  35],
          ["Redmi 13C",                40,null,  90,  45,  45,  45,  35,  35,  35,  35]
        ]},
        { nom: "POCO", modeles: [
          ["POCO F7 Pro",              90, 135, 200,  70,  65,  90,  60,  50,  50,  50],
          ["POCO F6",                  75, 115, 165,  65,  60,  75,  55,  45,  45,  45],
          ["POCO X7 Pro",              70, 105, 155,  60,  55,  65,  50,  45,  45,  45],
          ["POCO X6 Pro",              65, 100, 145,  60,  55,  65,  50,  45,  45,  45]
        ]}
      ]
    },
    {
      id: "google", onglet: "Pixel", marque: "Google",
      astuce: "Paramètres → À propos du téléphone si tu n'es pas sûr.",
      series: [
        { nom: "Pixel 10", modeles: [
          ["Pixel 10 Pro XL",         170, 245, 410,  95,  95, 150, 110,  65,  65,  65],
          ["Pixel 10 Pro",            155, 225, 370,  95,  95, 140, 100,  65,  65,  65],
          ["Pixel 10",                135, 195, 325,  90,  90, 120,  90,  60,  60,  60]
        ]},
        { nom: "Pixel 9", modeles: [
          ["Pixel 9 Pro XL",          155, 225, 370,  90,  90, 140, 100,  60,  60,  60],
          ["Pixel 9 Pro",             140, 205, 335,  90,  90, 130,  95,  60,  60,  60],
          ["Pixel 9",                 120, 175, 290,  85,  85, 110,  85,  55,  55,  55],
          ["Pixel 9a",                 90, 130, 215,  75,  75,  85,  60,  50,  50,  50]
        ]},
        { nom: "Pixel 8 et avant", modeles: [
          ["Pixel 8 Pro",             125, 180, 300,  85,  85, 120,  90,  55,  55,  55],
          ["Pixel 8",                 105, 150, 250,  80,  80, 100,  80,  55,  55,  55],
          ["Pixel 8a",                 80, 115, 190,  70,  70,  80,  55,  50,  50,  50],
          ["Pixel 7 Pro",             110, 160, 265,  75,  75, 100,  80,  50,  50,  50],
          ["Pixel 7",                  90, 130, 215,  70,  70,  85,  70,  50,  50,  50],
          ["Pixel 7a",                 75, 110, 180,  65,  65,  70,  50,  45,  45,  45],
          ["Pixel 6 Pro",             105, 150, 250,  70,  70,  90,  75,  50,  50,  50],
          ["Pixel 6",                  80, 115, 190,  65,  65,  80,  65,  45,  45,  45],
          ["Pixel 6a",                 65,  95, 155,  60,  60,  65,  45,  45,  45,  45]
        ]}
      ]
    },
    {
      id: "autre", onglet: "Autre", marque: "",
      astuce: "Paramètres → À propos du téléphone si tu n'es pas sûr.",
      sousMarques: ["OnePlus", "Oppo", "Huawei", "Honor", "Motorola", "Nothing", "Realme", "Autre"]
    }
  ],

  /* ---------------- Zone d'intervention ---------------- */
  zone: {
    departements: [
      ["75", "Paris"], ["77", "Seine-et-Marne"], ["78", "Yvelines"], ["91", "Essonne"],
      ["92", "Hauts-de-Seine"], ["93", "Seine-Saint-Denis"], ["94", "Val-de-Marne"], ["95", "Val-d'Oise"]
    ],
    horsZone: "Je ne suis pas en Île-de-France"
  },

  /* ---------------- Formation ---------------- */
  formation: {
    actif: false,                      // true = réaffiche le choix « Apprendre le métier » sur l'accueil
    titre: "Apprendre le métier",
    accroche: "Devenir réparateur et en vivre, même en partant de zéro.",
    intro: "Une formation courte et pratique, sur de vrais téléphones, par un réparateur qui fait ça tous les jours.",
    points: [
      ["Les réparations qui font le métier", "Écrans, batteries, connecteurs, vitres arrière : démontage, remontage et tests, avec le bon outillage."],
      ["Le diagnostic", "Trouver la panne vite et savoir quand une réparation vaut le coup."],
      ["Se lancer à domicile", "Où acheter ses pièces, fixer ses prix, trouver ses premiers clients."],
      ["Un suivi après", "Une question sur une réparation ? Tu nous écris, on t'aide."]
    ],
    infos: [["Format", "Petit groupe, 4 max"], ["Durée", "3 jours"], ["Matériel", "Fourni"], ["Tarif", "Sur demande"]]
  },

  /* ---------------- Avis clients ----------------
     EXEMPLES à remplacer par de vrais avis. Tant que « avisExemples » vaut true,
     le site indique clairement qu'il s'agit d'exemples. */
  avisExemples: true,
  avis: [
    { prenom: "Camille", lieu: "Paris 11e", note: 5, reparation: "Écran Soft OLED · iPhone 14",
      texte: "Écran changé sur la table du salon pendant ma pause déj. Le prix était exactement celui du site." },
    { prenom: "Mehdi", lieu: "Montreuil", note: 5, reparation: "Batterie · Galaxy S22",
      texte: "Message WhatsApp en 3 minutes, réparateur chez moi le soir même. Très pro." },
    { prenom: "Sophie", lieu: "Boulogne", note: 5, reparation: "Connecteur · iPhone 12",
      texte: "Je pensais devoir racheter un téléphone. C'était juste le connecteur, réparé en 40 minutes." },
    { prenom: "Julien", lieu: "Créteil", note: 4, reparation: "Vitre arrière · Pixel 8",
      texte: "Ponctuel et soigneux. Un peu plus long que prévu à cause de la colle, mais le résultat est nickel." }
  ],

  /* ---------------- FAQ ----------------
     Mots remplacés automatiquement : {region}, {delai}, {diagnostic}. */
  faq: [
    { q: "Le prix affiché, c'est le prix final ?",
      r: "Oui. C'est un prix fixe, pièce et main-d'œuvre comprises, déplacement offert en {region}. Si le réparateur découvre une autre panne sur place, il te prévient avant de toucher à quoi que ce soit." },
    { q: "Combien de temps dure une réparation ?",
      r: "La plupart des réparations prennent 30 à 60 minutes, chez toi, sous tes yeux. Une vitre arrière peut demander un peu plus." },
    { q: "Tu viens vraiment chez moi ?",
      r: "Oui : chez toi, au bureau ou où tu veux en {region}. Il faut juste une table et un peu de lumière." },
    { q: "Quel écran choisir ?",
      r: "Le Soft OLED est le meilleur compromis : presque identique à l'original pour bien moins cher. Le premium dépanne pour un petit budget, l'original est là si tu veux exactement la pièce du constructeur." },
    { q: "Quelle garantie ?",
      r: "De 1 à 6 mois selon la pièce choisie. Si un souci vient de la réparation, on revient gratuitement." },
    { q: "Je paie comment ?",
      r: "Après la réparation, une fois que tout marche : carte, espèces ou virement instantané." },
    { q: "Et si je ne sais pas ce qui ne va pas ?",
      r: "Choisis « Autre panne ». Le diagnostic coûte {diagnostic} € et il est offert si tu fais réparer." }
  ]
};
