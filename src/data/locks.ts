export interface LockEntry {
  type: string;
  protection: string;
  serie: string;
  nombreDePoint: string;
  din: string;
  electrique: string;
  antiPanique: string;
  designation: string;
  coffre: string;
  refsComplementaires: string;
  specificite: string;
}

const csvText = `Type;Protection;Série;Nombre de point;Din;Electrique;Fonction anti panique de l'ouvrant principal;Désignation;Coffre;Réfs complétentaires;Spécificité
Serrure;Feu;Presto;1;Réversible;oui;-;serrure 1 point CP, contrôle G/D W;907502;907574;-
Serrure;Feu;Presto;1;Réversible;oui;E;serrure 1p CP 1 vantail G/D E;907522;907574;Carré AP 907373
Serrure;Feu;Presto;1;Réversible;non;-;serrure 1 point CP, contrôle G/D W;907502;907570;-
Serrure;Feu;Presto;1;Réversible;non;E;serrure 1p CP 1 vantail G/D E;907522;907570;Carré AP 907373
Serrure;Feu;Presto;1;Réversible;non;B;serrure 1p CP 1 vantail G/D B;907520;907570;Carré AP 907373
Serrure;Feu;Presto;2;Réversible;oui;-;serrure 1 point CP, contrôle G/D L;907510;907574 + 907044 + 907591 + 907585 + 907576;-
Serrure;Feu;Presto;2;Réversible;oui;E;serrure 1 point CP, contrôle G/D E;907512;907574 + 907044 + 907591 + 907585 + 907576;Carré AP 907373
Serrure;Feu;Presto;2;Réversible;non;-;serrure 1 point CP, contrôle G/D L;907510;907577 + 907581 + 907591 + 907044 + 907570;-
Serrure;Feu;Presto;2;Réversible;non;E;serrure 1 point CP, contrôle G/D E;907512;907577 + 907581 + 907591 + 907044 + 907570;Carré AP 907373
Serrure;Feu;Presto;2;Réversible;non;B;serrure 1 point CP, contrôle G/D B;907516;907577 + 907581 + 907591 + 907044 + 907570;Carré AP 907373
Serrure;Standard;Presto;1;Réversible;non;-;Serrure 1 point Pdt et 1/2 tour TP de 22mm;FFR042FND (F19.3969.41);FFR046FND (F19.3973.41);-
Serrure;Standard;Presto;1;Réversible;non;-;Serrure 1 point Pdt et Rouleau TP de 22mm;FFR043FND (F19.3970.41);FFR046FND (F19.3973.41) + FFR044FND (F19.3971.41);-
Serrure;Standard;Presto;3;Réversible;non;-;Serrure 3 pts PDT 1/2T L45 variaxe;FFR047FND (F19.3974.41);FFR046FND (F19.3973.41) + FFR049FND (F19.3976.41) + FFR050FND (F19.3977.41);FFR019FND Kit n°1
Serrure;Feu;Fuego;1;Réversible;non;-;serrure 1 point CP, contrôle G/D W;907502;907571;-
Serrure;Feu;Fuego;1;Réversible;non;E;serrure 1p CP 1 vantail G/D E;907522;907571;Carré 907319
Serrure;Feu;Fuego;1;Réversible;non;B;serrure 1p CP 1 vantail G/D B;907520;907571;Carré 907319
Serrure;Feu;Fuego;1;Réversible;oui;-;serrure 1 point CP, contrôle G/D W;907502;907573;-
Serrure;Feu;Fuego;1;Réversible;oui;E;serrure 1p CP 1 vantail G/D E;907522;907573;Carré 907319
Serrure;Feu;Fuego;2;Réversible;non;-;serrure 1 point CP, contrôle G/D L;907510;957063 + 907580 + 907591 + 907044 + 907571;-
Serrure;Feu;Fuego;2;Réversible;non;E;serrure 1 point CP, contrôle G/D E;907512;957063 + 907580 + 907591 + 907044 + 907571;Carré 907319
Serrure;Feu;Fuego;2;Réversible;non;B;serrure 1 point CP, contrôle G/D B;907516;957063 + 907580 + 907591 + 907044 + 907571;Carré 907319
Serrure;Feu;Fuego;2;Réversible;oui;-;serrure 1 point CP, contrôle G/D L;907510;907573 + 907044 + 907591 + 907584 + 907575;-
Serrure;Feu;Fuego;2;Réversible;oui;E;serrure 1 point CP, contrôle G/D E;907512;907573 + 907044 + 907591 + 907584 + 907575;Carré 907319
Serrure;Standard;Unico;1;Réversible;non;-;serrure 1 point à mortaiser CP G/D W;987408;987009;-
Serrure;Standard;Unico;1;Réversible;non;-;serrure 1 point à rouleau CP G/D 35;987404;987008;-
Serrure;Standard;Unico;1;Réversible;non;-;Serrure 1 point corps de 30;987499;987009;-
Serrure;Standard;Unico;3;Réversible;non;-;Serrure 3 points pêne 1/2 tour tétière filante;FFR018FND (F19.3968.41);-;FFR019FND Kit n°1
Serrure;Standard;Unico;3;Réversible;non;-;Serrure à rouleau Stremler 3 points pour unico;FFR017FND (F19.3967.41);-;-
Serrure;Feu;Unico;3;G;non;-;serrure 3p verrouill. auto CP;986460;987026 + 987028;Hauteur 2220
Serrure;Feu;Unico;3;D;non;-;serrure 3p verrouill. auto CP;986460;987026 + 987027;Hauteur 2220
Serrure;Feu;Unico;3;G;non;E;serrure 3p verrouill. auto CP;986466;987026 + 987028;Hauteur 2220
Serrure;Feu;Unico;3;D;non;E;serrure 3p verrouill. auto CP;986466;987026 + 987027;Hauteur 2220
Serrure;Feu;Unico;3;D;non;B;serrure 3p verrouill. auto CP;986472;987026 + 987027;Hauteur 2220
Serrure;Feu;Unico;3;G;non;B;serrure 3p verrouill. auto CP;986473;987026 + 987028;Hauteur 2220
Serrure;Feu;Unico;3;G;non;-;serrure 3p verrouill. auto CP;986462;987026 + 987028;Hauteur 2420
Serrure;Feu;Unico;3;D;non;-;serrure 3p verrouill. auto CP;986462;987026 + 987027;Hauteur 2420
Serrure;Feu;Unico;3;G;non;E;serrure 3p verrouill. auto CP;986468;987026 + 987028;Hauteur 2420
Serrure;Feu;Unico;3;D;non;E;serrure 3p verrouill. auto CP;986468;987026 + 987027;Hauteur 2420
Serrure;Feu;Unico;3;D;non;B;serrure 3p verrouill. auto CP;986474;987026 + 987027;Hauteur 2420
Serrure;Feu;Unico;3;G;non;B;serrure 3p verrouill. auto CP;986475;987026 + 987028;Hauteur 2420
Serrure;Feu;Unico;3;G;non;-;serrure 3p verrouill. auto CP;986464;987026 + 987028;Hauteur 2720
Serrure;Feu;Unico;3;D;non;-;serrure 3p verrouill. auto CP;986464;987026 + 987027;Hauteur 2720
Serrure;Feu;Unico;3;G;non;E;serrure 3p verrouill. auto CP;986470;987026 + 987028;Hauteur 2720
Serrure;Feu;Unico;3;D;non;E;serrure 3p verrouill. auto CP;986470;987026 + 987027;Hauteur 2720
Serrure;Feu;Unico;3;D;non;B;serrure 3p verrouill. auto CP;986476;987026 + 987028;Hauteur 2720
Serrure;Feu;Unico;3;G;non;B;serrure 3p verrouill. auto CP;986477;987026 + 987027;Hauteur 2720
Serrure;RC3;Unico;5;G;non;-;serrure 5 points CP RC3 G/D;986452;987709;Rosace RC 917031 + Hauteur 2172
Serrure;RC3;Unico;5;G;non;-;serrure 5 points CP RC3 G/D;986454;987709;Rosace RC 917031 + Hauteur 2421
Serrure;RC3;Unico;5;G;non;-;serrure 5 points CP RC3 G/D;986456;987709;Rosace RC 917031 + Hauteur 2700
Serrure;RC3;Unico;5;D;non;-;serrure 5 points CP RC3 G/D;986452;987710;Rosace RC 917031 + Hauteur 2172
Serrure;RC3;Unico;5;D;non;-;serrure 5 points CP RC3 G/D;986454;987710;Rosace RC 917031 + Hauteur 2421
Serrure;RC3;Unico;5;D;non;-;serrure 5 points CP RC3 G/D;986456;987710;Rosace RC 917031 + Hauteur 2700
Serrure;RC4;Unico;5;G;non;-;serrure 5 points CP RC3 G/D;986452;987709;Rosace RC 917031 + Hauteur 2172
Serrure;RC4;Unico;5;G;non;-;serrure 5 points CP RC3 G/D;986454;987709;Rosace RC 917031 + Hauteur 2421
Serrure;RC4;Unico;5;G;non;-;serrure 5 points CP RC3 G/D;986456;987709;Rosace RC 917031 + Hauteur 3300
Serrure;RC4;Unico;5;D;non;-;serrure 5 points CP RC3 G/D;986452;987710;Rosace RC 917031 + Hauteur 2172
Serrure;RC4;Unico;5;D;non;-;serrure 5 points CP RC3 G/D;986454;987710;Rosace RC 917031 + Hauteur 2421
Serrure;RC4;Unico;5;D;non;-;serrure 5 points CP RC3 G/D;986456;987710;Rosace RC 917031 + Hauteur 3300
Crémone;Standard;Unico;2;Réversible;non;-;crémone à levier manuelle;987454;987702 + 987072(x3) + 987010 + 987011 + 987071(x2) + 987051;-
Crémone;Standard;Unico;2;Réversible;non;-;crémone auto 35mm;987456;987703;-
Crémone;;Unico;2;Réversible;non;-;Crémone à levier avec verrouillage;987456;987006 + 987002 + 987004 + 987005 + 987011 + 987072 + 987010 + 987051;-
Crémone;Standard;Presto;2;Réversible;non;-;Crémone 2 points à levier;FFR.045F.ND.A (F19.3972.41);FFR049FND (F19.3976.41) + FFR050FND (F19.3977.41);-
Crémone;Standard/feu e60 vv;Presto;2;Réversible;non;-;Crémone 2 points à cylindre;FFR.048F.ND.A (F19.3975.41);FFR049FND (F19.3976.41) + FFR050FND (F19.3977.41);-
Crémone;Feu;Presto;1;Réversible;non;-;Crémone à levier;907438;917028 + 917276 + 907056 + 907030;-
Crémone;Feu;Presto;2;Réversible;non;-;Crémone à levier;907438;917028 + 917276 + 907056 + 907030 + 907030 + 917054 + 907053 + 907054;-
Crémone;Feu;Fuego;1;Réversible;non;-;Crémone à levier;907438;957062 + 947214 + 907056 + 907030;-
Crémone;Feu;Fuego;2;Réversible;non;-;Crémone à levier;907438;957062 + 947214 + 907056 + 907030 + 907030 +957065 + 907053 + 907054;-
Crémone;RC3;Unico;2;Réversible;non;-;Crémone à levier;987454;987711+987080;-
Crémone;Standard;Unico;2;Réversible;non;-;Crémone 2 points à levier (corps de 30);917421;987702 + 987011(x2) + 987051 + 987071(x2) + 987072(x3);987011 = 23,79€`;

function parseCSV(text: string): LockEntry[] {
  const lines = text.trim().split('\n');
  const headers = lines[0].split(';').map((h) => h.trim());
  const entries: LockEntry[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(';');
    const entry: Record<string, string> = {};
    headers.forEach((header, idx) => {
      entry[header] = (values[idx] ?? '').trim();
    });
    entries.push({
      type: entry['Type'] ?? '',
      protection: entry['Protection'] ?? '',
      serie: entry['Série'] ?? '',
      nombreDePoint: entry['Nombre de point'] ?? '',
      din: entry['Din'] ?? '',
      electrique: entry['Electrique'] ?? '',
      antiPanique: entry["Fonction anti panique de l'ouvrant principal"] ?? '',
      designation: entry['Désignation'] ?? '',
      coffre: entry['Coffre'] ?? '',
      refsComplementaires: entry['Réfs complétentaires'] ?? '',
      specificite: entry['Spécificité'] ?? '',
    });
  }
  return entries;
}

export const lockData: LockEntry[] = parseCSV(csvText);

export const filterFields: {
  key: keyof LockEntry;
  label: string;
}[] = [
  { key: 'type', label: 'Type' },
  { key: 'protection', label: 'Protection' },
  { key: 'serie', label: 'Série' },
  { key: 'nombreDePoint', label: 'Nombre de points' },
  { key: 'din', label: 'Din' },
  { key: 'electrique', label: 'Électrique' },
  { key: 'antiPanique', label: 'Anti-panique' },
];

export function getUniqueValues(field: keyof LockEntry): string[] {
  const values = new Set<string>();
  lockData.forEach((entry) => {
    const v = entry[field];
    if (v && v !== '-') values.add(v);
  });
  return Array.from(values).sort((a, b) => {
    const numA = parseInt(a, 10);
    const numB = parseInt(b, 10);
    if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
    return a.localeCompare(b);
  });
}
