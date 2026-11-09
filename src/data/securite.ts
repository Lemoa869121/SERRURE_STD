/**
 * Solutions de sécurité RC3 / RC4 (anti-effraction).
 *
 * Source : « Listing quincaillerie solutions sécurités Forster CR3 CR4 » (V5),
 * avec les corrections validées le 09/11/2026 :
 *  1. ISEO classique : hauteur / largeur inversées dans la fiche → corrigées (H 3240).
 *  2. ISEO classique : fixation de serrure 987039, quantité 1.
 *  3. ISEO classique : serrure FFR315 et gâche centrale FFR316 réversibles.
 *  4. EFF : la gâche du 4e point 850 mm (907095) est bien une gâche 850 mm.
 *  5. Gâche du 4e point : 907095 si 4e point 906486 (850 mm), sinon FFR279
 *     (appliqué au 4e point 350 mm de la Fuego Light).
 *  6. Fuego Light : profilé pré-usiné 953202 / 953203 / 953204 / 953205 selon la porte.
 *  7. RC4 : pièces « à fabriquer » affichées sans référence.
 * Libellé : tout est en RC (le listing écrit « CR »).
 */

export const A_FABRIQUER = 'À fabriquer';

export interface LigneNomenclature {
  designation: string;
  ref: string;
  qte: string;
}

export interface GroupeNomenclature {
  titre: string;
  lignes: LigneNomenclature[];
}

export interface Dimension {
  hauteur: number;
  largeur: number;
}

export interface SolutionSecurite {
  id: string;
  titre: string;
  type: string;
  protection: 'RC3' | 'RC4';
  serie: string;
  gamme: string;
  description: string[];
  /** Valeurs couvertes pour les filtres existants. */
  din: string[];
  electrique: string[];
  principal: GroupeNomenclature[];
  secondaire: GroupeNomenclature[];
  options: GroupeNomenclature[];
  dimensions: {
    base: 'vantaux' | 'passage libre';
    unVantail: Dimension;
    deuxVantaux: Dimension;
  };
  vitrage: string[];
  notes: string[];
}

const l = (designation: string, ref: string, qte: string | number): LigneNomenclature => ({
  designation,
  ref,
  qte: String(qte),
});

/* ------------------------------------------------------------------ */
/* Blocs communs                                                       */
/* ------------------------------------------------------------------ */

const pivotsUnico = (paumelles: number): LigneNomenclature[] => [
  l('Paumelles', '907662', paumelles),
  l('Pions anti-dégondage', '987712', 1),
  l('Fixation pions anti-dégondage', '987072', 2),
];

const manoeuvreEtRosaces = (carre: string, manoeuvreExt: string = '1'): LigneNomenclature[] => [
  l('Manœuvre intérieure', '-', 1),
  l(manoeuvreExt === '1' ? 'Manœuvre extérieure' : 'Manœuvre extérieure **', '-', manoeuvreExt),
  l(carre, '-', 1),
  l('Rosace face attaque', '917031', 1),
  l('Rosace intérieure', '907353', 1),
];

/** Vantail secondaire des ISEO RC3 (classique, Easy, eMotion). */
const secondaireIseoRC3: GroupeNomenclature[] = [
  {
    titre: 'Crémone et tringles',
    lignes: [
      l('Gâche haute', '987025', 1),
      l('Guide de tringle', '987021', 1),
      l('Renfort de tringle', '987022', 1),
      l('Tringle haute', '987004', 1),
      l('Crémone', '987454', 1),
      l('Tringle basse', '987005', 1),
      l('Renfort de tringle', '987022', 1),
      l('Guide de tringle', '987021', 1),
      l('Gâche basse', '987025', 1),
      l('Fixation', '987081', 8),
    ],
  },
  { titre: 'Rotation', lignes: pivotsUnico(2) },
];

/** Vantail secondaire des ISEO RC4 (Easy, eMotion). */
const secondaireIseoRC4: GroupeNomenclature[] = [
  {
    titre: 'Crémone et tringles',
    lignes: [
      l('Crémone', '987454', 1),
      l('Kit de tringle', '987702', 1),
      l('Gâche haute', A_FABRIQUER, ''),
      l('Point haut', A_FABRIQUER, ''),
      l('Point bas', A_FABRIQUER, ''),
      l('Gâche basse', A_FABRIQUER, ''),
      l('Fixation', '987081', 2),
    ],
  },
  {
    titre: 'Rotation',
    lignes: [l('Paumelles', '907662', 4), l('Pions anti-dégondage', A_FABRIQUER, 3)],
  },
];

/** Serrures ISEO motorisées / automatiques : 4 variantes DIN × Exit. */
const serruresIseo = (d: string, g: string, exitD: string, exitG: string): LigneNomenclature[] => [
  l('Serrure DIN D', d, 1),
  l('Serrure DIN G', g, 1),
  l('Serrure Exit DIN D', exitD, 1),
  l('Serrure Exit DIN G', exitG, 1),
];

const gachesIseoDin: LigneNomenclature[] = [
  l('Gâche centrale DIN D', 'FFR307', 1),
  l('Gâche centrale DIN G', 'FFR306', 1),
  l('Gâche haute et basse', 'FFR294', 2),
  l('Fixation serrure', '987039', 1),
];

const principalIseoRC3 = (serrures: LigneNomenclature[], nom: string): GroupeNomenclature[] => [
  { titre: 'Serrure (1 au choix)', lignes: serrures },
  { titre: 'Gâches et fixation', lignes: gachesIseoDin },
  { titre: 'Rotation', lignes: pivotsUnico(2) },
  { titre: 'Manœuvre', lignes: manoeuvreEtRosaces(`Carré 8 mm (9 mm pour ${nom} Exit)`) },
];

const principalIseoRC4 = (serrures: LigneNomenclature[], nom: string): GroupeNomenclature[] => [
  { titre: 'Serrure (1 au choix)', lignes: serrures },
  { titre: 'Gâches et fixation', lignes: gachesIseoDin },
  {
    titre: 'Rotation',
    lignes: [l('Paumelles', '907662', 4), l('Pions anti-dégondage', A_FABRIQUER, 3)],
  },
  { titre: 'Manœuvre', lignes: manoeuvreEtRosaces(`Carré 8 mm pour ${nom}, 9 mm pour ${nom} Exit`) },
  {
    titre: 'Ouverture extérieure',
    lignes: [
      l('Plat acier pour ouverture extérieure', 'FFR102FND', 1),
      l('Bande TESA', 'FFR103FND', 1),
    ],
  },
];

const descEasy = [
  'Pêne demi-tour',
  'Verrouillage automatique à la fermeture de la porte',
  '3 fonctions d’utilisation (sélecteur sur la têtière avec un loquet à mettre en position 0-1-2) :',
  '0 – standard, soit verrouillage automatique',
  '1 – light, avec uniquement utilisation du pêne demi-tour',
  '2 – free, tout pêne rentré',
  'Existe en fonction sortie libre → Exit',
];

const descEmotion = [
  'Verrouillage automatique à la fermeture de la porte',
  'Contrôle d’accès en entrée et sortie',
  'Déverrouillage à la clé et possibilité de sur-verrouillage à la clé pour désactiver le contrôle d’accès',
  'Existe en fonction sortie libre → Exit ; dans ce cas, pas de possibilité de sur-verrouillage',
];

const descEff = ['319 : serrure classique', '519 : serrure motorisée', '819 : serrure béquille contrôlée'];

const notesEff = [
  '* Référence en fonction du DIN D / G ET de l’ouverture INT / EXT',
  '** Pas de manœuvre extérieure dans le cas des serrures NE',
];
const noteLimitateurVitrage =
  '*** Quantité en fonction du type de manœuvre : 1 pour une béquille / 2 pour un pushbar';

/** Partie commune du vantail principal des EFF Unico (hors serrure). */
const principalEffUnico = (serrures: LigneNomenclature[]): GroupeNomenclature[] => [
  { titre: 'Serrure (1 au choix)', lignes: serrures },
  {
    titre: 'Fixation et gâches',
    lignes: [
      l('Fixation serrure *', '987094 / 987095', 1),
      l('Vis de fixation serrure', '957326', 1),
      l('Kit de gâche', 'FFR211', 1),
      l('Fixation gâche centrale *', '987098 / 987099', 1),
      l('Fixation gâche haute / basse', '987089', 2),
    ],
  },
  { titre: 'Rotation', lignes: pivotsUnico(2) },
  { titre: 'Manœuvre', lignes: manoeuvreEtRosaces('Carré 9 mm', '1/0') },
  {
    titre: 'Renforts et limitateurs',
    lignes: [
      l('Limitateur de feuillure', '987087', 3),
      l('Limitateur de feuillure', '977002', 8),
      l('Limitateur de feuillure vitrage ***', '917060', '1/2'),
      l('Renfort coffre de serrure', '987088', 3),
    ],
  },
];

const quatriemePointUnico = (
  longueur: string,
  refPoint: string,
  codePoint: string,
  refGache: string,
): GroupeNomenclature => ({
  titre: `Option 4e point ${longueur} (selon dimensions)`,
  lignes: [
    l(`4e point ${longueur}${codePoint ? ` (${codePoint})` : ''}`, refPoint, 1),
    l(`Gâche 4e point ${longueur}`, refGache, 1),
    l('Fixation gâche', '987089', 1),
    l('Fixation 4e point *', '987096 / 987097', 1),
    l('Vis de fixation 4e point', '957327', 1),
  ],
});

const optionsEffUnico: GroupeNomenclature[] = [
  quatriemePointUnico('350 mm', 'FFR278', '906484', 'FFR279'),
  quatriemePointUnico('550 mm', 'FFR216', '906485', 'FFR218'),
  quatriemePointUnico('850 mm', '906486', '', '907095'),
];

/* ------------------------------------------------------------------ */
/* Les 8 fiches                                                        */
/* ------------------------------------------------------------------ */

export const solutionsSecurite: SolutionSecurite[] = [
  {
    id: 'unico-rc3-iseo-classique',
    titre: 'UNICO RC3 ISEO classique',
    type: 'Serrure',
    protection: 'RC3',
    serie: 'Unico',
    gamme: 'ISEO classique',
    description: ['Pêne demi-tour', 'Verrouillage manuel à clé 1 tour', 'Possibilité d’intégrer un rouleau'],
    din: ['Réversible'],
    electrique: ['non'],
    principal: [
      {
        titre: 'Serrure, gâches et fixation',
        lignes: [
          l('Serrure (réversible)', 'FFR315', 1),
          l('Gâche centrale (réversible)', 'FFR316', 1),
          l('Gâche haute et basse', 'FFR294', 2),
          l('Fixation serrure', '987039', 1),
        ],
      },
      { titre: 'Rotation', lignes: pivotsUnico(2) },
      { titre: 'Manœuvre', lignes: manoeuvreEtRosaces('Carré 8 mm') },
    ],
    secondaire: secondaireIseoRC3,
    options: [{ titre: 'Option rouleau', lignes: [l('Rouleau', 'FFR321', 1)] }],
    dimensions: {
      base: 'vantaux',
      unVantail: { hauteur: 3240, largeur: 1374 },
      deuxVantaux: { hauteur: 3240, largeur: 2748 },
    },
    vitrage: ['P5A'],
    notes: [],
  },
  {
    id: 'unico-rc3-iseo-easy',
    titre: 'UNICO RC3 ISEO Easy / Easy Exit',
    type: 'Serrure',
    protection: 'RC3',
    serie: 'Unico',
    gamme: 'ISEO Easy / Easy Exit',
    description: descEasy,
    din: ['D', 'G'],
    electrique: ['non'],
    principal: principalIseoRC3(serruresIseo('FFR297', 'FFR298', 'FFR299', 'FFR300'), 'Easy'),
    secondaire: secondaireIseoRC3,
    options: [],
    dimensions: {
      base: 'vantaux',
      unVantail: { hauteur: 3240, largeur: 1374 },
      deuxVantaux: { hauteur: 3240, largeur: 2748 },
    },
    vitrage: ['P5A', 'En anti-panique : CS21 de chez Riou Glass'],
    notes: [],
  },
  {
    id: 'unico-rc3-iseo-emotion',
    titre: 'UNICO RC3 ISEO eMotion / eMotion Exit',
    type: 'Serrure',
    protection: 'RC3',
    serie: 'Unico',
    gamme: 'ISEO eMotion / eMotion Exit',
    description: descEmotion,
    din: ['D', 'G'],
    electrique: ['oui'],
    principal: principalIseoRC3(serruresIseo('FFR254', 'FFR255', 'FFR256', 'FFR257'), 'eMotion'),
    secondaire: secondaireIseoRC3,
    options: [],
    dimensions: {
      base: 'vantaux',
      unVantail: { hauteur: 3240, largeur: 1374 },
      deuxVantaux: { hauteur: 3240, largeur: 2748 },
    },
    vitrage: ['P5A', 'En anti-panique : CS21 de chez Riou Glass'],
    notes: [],
  },
  {
    id: 'unico-rc3-eff',
    titre: 'UNICO RC3 EFF 319 / 519 / 819',
    type: 'Serrure',
    protection: 'RC3',
    serie: 'Unico',
    gamme: 'EFF 319 / 519 / 819',
    description: descEff,
    din: ['D', 'G'],
    electrique: ['non', 'oui'],
    principal: principalEffUnico([
      l('Serrure 319 NE', 'FFR213', 1),
      l('Serrure 819', 'FFR227', 1),
      l('Serrure 519', 'FFR210', 1),
      l('Serrure 319 NB', 'FFR311', 1),
    ]),
    secondaire: [
      {
        titre: 'Crémone et tringles',
        lignes: [
          l('Gâche haute', '957072', 1),
          l('Guide de tringle', '987010', 1),
          l('Douille de raccordement', '987029', 1),
          l('Guide de tringle', '907015', 1),
          l('Tringle haute', '987000', 1),
          l('Crémone', '987454', 1),
          l('Tringle basse', '987007', 1),
          l('Guide de tringle', '987024', 1),
          l('Gâche basse', '987052', 1),
          l('Fixation', '987081', 1),
          l('Fixation', '986080', 8),
        ],
      },
      { titre: 'Rotation', lignes: pivotsUnico(2) },
      {
        titre: 'Renforts et limitateurs',
        lignes: [
          l('Renfort', '987034', 1),
          l('Renfort coffre de serrure', '987088', 1),
          l('Limitateur de feuillure', '977002', 6),
          l('Limitateur de feuillure vitrage', '917060', 1),
        ],
      },
    ],
    options: optionsEffUnico,
    dimensions: {
      base: 'passage libre',
      unVantail: { hauteur: 3000, largeur: 1415 },
      deuxVantaux: { hauteur: 3000, largeur: 2830 },
    },
    vitrage: ['P8B'],
    notes: [...notesEff, noteLimitateurVitrage],
  },
  {
    id: 'unico-rc3-eff-full-panique',
    titre: 'UNICO RC3 EFF 319 / 519 / 819 full panique',
    type: 'Serrure',
    protection: 'RC3',
    serie: 'Unico',
    gamme: 'EFF 319 / 519 / 819 full panique',
    description: descEff,
    din: ['D', 'G'],
    electrique: ['non', 'oui'],
    principal: principalEffUnico([
      l('Serrure 319 NE', 'FFR214', 1),
      l('Serrure 319 NB', 'FFR269', 1),
      l('Serrure 519', 'FFR264', 1),
      l('Serrure 819', 'FFR215', 1),
    ]),
    secondaire: [
      {
        titre: 'Crémone anti-panique et tringles',
        lignes: [
          l('Douille au sol', '906463', 1),
          l('Guide de tringle bas', '987024', 1),
          l('Tringle haute', 'FFR221', 1),
          l('Gâche haute', 'FFR222', 1),
          l('Crémone AP', 'FFR219', 1),
          l('Tringle basse', 'FFR223', 1),
          l('Point haut', 'FFR220', 1),
          l('Kit de fixation', '906360', 1),
          l('Pièce de fixation', '987081', 5),
        ],
      },
      { titre: 'Rotation', lignes: pivotsUnico(2) },
      {
        titre: 'Manœuvre',
        lignes: [l('Manœuvre intérieure', '-', 1), l('Carré 9 mm', '-', 1)],
      },
      {
        titre: 'Renforts et limitateurs',
        lignes: [
          l('Renfort', '987034', 1),
          l('Renfort coffre de serrure', '987088', 1),
          l('Limitateur de feuillure', '977002', 6),
          l('Limitateur de feuillure vitrage ***', '917060', '1/2'),
          l('Renfort', '987086', 1),
        ],
      },
    ],
    options: optionsEffUnico,
    dimensions: {
      base: 'passage libre',
      unVantail: { hauteur: 3000, largeur: 1415 },
      deuxVantaux: { hauteur: 3000, largeur: 2830 },
    },
    vitrage: ['P8B'],
    notes: [...notesEff, noteLimitateurVitrage],
  },
  {
    id: 'unico-rc4-iseo-easy',
    titre: 'UNICO RC4 ISEO Easy / Easy Exit',
    type: 'Serrure',
    protection: 'RC4',
    serie: 'Unico',
    gamme: 'ISEO Easy / Easy Exit',
    description: descEasy,
    din: ['D', 'G'],
    electrique: ['non'],
    principal: principalIseoRC4(serruresIseo('FFR297', 'FFR298', 'FFR299', 'FFR300'), 'Easy'),
    secondaire: secondaireIseoRC4,
    options: [],
    dimensions: {
      base: 'vantaux',
      unVantail: { hauteur: 3240, largeur: 1440 },
      deuxVantaux: { hauteur: 3240, largeur: 2880 },
    },
    vitrage: ['P6B', 'En anti-panique : CS21 de chez Riou Glass'],
    notes: ['Attention : ouverture intérieure problématique à l’ouverture, à étudier au cas par cas'],
  },
  {
    id: 'unico-rc4-iseo-emotion',
    titre: 'UNICO RC4 ISEO eMotion / eMotion Exit',
    type: 'Serrure',
    protection: 'RC4',
    serie: 'Unico',
    gamme: 'ISEO eMotion / eMotion Exit',
    description: descEmotion,
    din: ['D', 'G'],
    electrique: ['oui'],
    principal: principalIseoRC4(serruresIseo('FFR254', 'FFR255', 'FFR256', 'FFR257'), 'eMotion'),
    secondaire: secondaireIseoRC4,
    options: [],
    dimensions: {
      base: 'vantaux',
      unVantail: { hauteur: 3240, largeur: 1440 },
      deuxVantaux: { hauteur: 3240, largeur: 2880 },
    },
    vitrage: ['P6B', 'En anti-panique : CS21 de chez Riou Glass'],
    notes: ['Attention : ouverture intérieure problématique à l’ouverture, à étudier au cas par cas'],
  },
  {
    id: 'fuego-light-rc3-eff',
    titre: 'FUEGO LIGHT RC3 EFF 319 / 519 / 819',
    type: 'Serrure',
    protection: 'RC3',
    serie: 'Fuego Light',
    gamme: 'EFF 319 / 519 / 819',
    description: descEff,
    din: ['D', 'G'],
    electrique: ['non', 'oui'],
    principal: [
      {
        titre: 'Serrure (1 au choix)',
        lignes: [
          l('Serrure 319 NE', 'FFR213', 1),
          l('Serrure 819', 'FFR227', 1),
          l('Serrure 519', 'FFR210', 1),
          l('Serrure 319 NB', 'FFR311', 1),
        ],
      },
      {
        titre: 'Fixation et gâches',
        lignes: [
          l('Profilé pré-usiné * (selon la porte)', '953202 / 953203 / 953204 / 953205', 1),
          l('Vis de fixation serrure', '957324', 1),
          l('Kit de gâche', 'FFR211', 1),
          l('Fixation gâche centrale', '957050', 1),
          l('Fixation gâche haute / basse', '957051', 2),
          l('Renfort coffre de serrure', '956020', 1),
        ],
      },
      {
        titre: 'Rotation',
        lignes: [l('Paumelles', '907662', 2), l('Pions anti-dégondage', '957067', 1)],
      },
      { titre: 'Manœuvre', lignes: manoeuvreEtRosaces('Carré 9 mm', '1/0') },
      {
        titre: 'Renforts et limitateurs',
        lignes: [
          l('Limitateur de feuillure', '957064', 3),
          l('Renfort coffre de serrure', '956020', 3),
        ],
      },
    ],
    secondaire: [
      {
        titre: 'Crémone et tringles',
        lignes: [
          l('Gâche haute', '957062', 1),
          l('Point haut', '987002', 1),
          l('Support de point haut', '957069', 1),
          l('Guide de tringle', '907015', 1),
          l('Tringle haute', '987004', 1),
          l('Crémone', '987456', 1),
          l('Tringle basse', '987007', 1),
          l('Guide de tringle', '957065', 1),
          l('Gâche basse', '907054', 1),
          l('Fixation', '947026', 2),
        ],
      },
      {
        titre: 'Rotation',
        lignes: [l('Paumelles', '907662', 2), l('Pions anti-dégondage', '957067', 1)],
      },
      {
        titre: 'Renforts et limitateurs',
        lignes: [
          l('Renfort', '947026', 2),
          l('Insert Promat', '956310', 1),
          l('Limitateur de feuillure', '957064', 3),
        ],
      },
    ],
    options: [
      {
        titre: 'Option 4e point 350 mm (selon dimensions)',
        lignes: [
          l('4e point 350 mm (906484)', 'FFR278', 1),
          l('Gâche 4e point 350 mm', 'FFR279', 1),
          l('Fixation gâche haute / basse', '957051', 2),
          l('Renfort coffre de serrure', '956020', 1),
          l('Vis de fixation 4e point', '957325', 1),
        ],
      },
    ],
    dimensions: {
      base: 'passage libre',
      unVantail: { hauteur: 2500, largeur: 1415 },
      deuxVantaux: { hauteur: 2500, largeur: 2830 },
    },
    vitrage: ['P8B'],
    notes: [
      '* Référence en fonction du DIN D / G ET de l’ouverture INT / EXT : profilé 953202, 953203, 953204 ou 953205 à choisir selon la porte',
      '** Pas de manœuvre extérieure dans le cas des serrures NE',
    ],
  },
];

/** Toutes les références d'une fiche, pour la recherche texte. */
export function texteRecherche(s: SolutionSecurite): string {
  const lignes = [...s.principal, ...s.secondaire, ...s.options].flatMap((g) => g.lignes);
  return [
    s.titre,
    s.type,
    s.protection,
    s.serie,
    s.gamme,
    ...s.description,
    ...lignes.map((x) => `${x.designation} ${x.ref}`),
    ...s.vitrage,
    ...s.notes,
  ]
    .join(' ')
    .toLowerCase();
}
