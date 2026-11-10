import { useMemo, useState } from 'react';
import { Lock, KeyRound, ShieldCheck, Layers, Zap, DoorOpen, RotateCcw, Search, ChevronRight } from 'lucide-react';
import { lockData, filterFields, getUniqueValues, type LockEntry } from '@/data/locks';
import { solutionsSecurite, texteRecherche, type SolutionSecurite } from '@/data/securite';
import { CarteSecurite, FicheSecuriteModal } from '@/components/FicheSecurite';

type Filters = Partial<Record<keyof LockEntry, string[]>>;

/** Valeurs d'une solution RC3/RC4 pour un filtre ([] = non renseigné). */
const valeursSolution = (s: SolutionSecurite, field: keyof LockEntry): string[] => {
  switch (field) {
    case 'type':
      return [s.type];
    case 'protection':
      return [s.protection];
    case 'serie':
      return [s.serie];
    case 'din':
      return s.din;
    case 'electrique':
      return s.electrique;
    default:
      return [];
  }
};

/** Valeurs proposées dans un filtre : serrures/crémones + solutions RC3/RC4. */
const valeursFiltre = (field: keyof LockEntry): string[] => {
  const set = new Set(getUniqueValues(field));
  solutionsSecurite.forEach((s) => valeursSolution(s, field).forEach((v) => set.add(v)));
  return Array.from(set).sort((a, b) => {
    const numA = parseInt(a, 10);
    const numB = parseInt(b, 10);
    if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
    return a.localeCompare(b);
  });
};

const totalProduits = lockData.length + solutionsSecurite.length;

const fieldIcons: Record<string, typeof Lock> = {
  type: Layers,
  protection: ShieldCheck,
  serie: KeyRound,
  nombreDePoint: Lock,
  din: RotateCcw,
  electrique: Zap,
  antiPanique: DoorOpen,
};

/** Pastilles de protection – charte Forster. */
const protectionBadgeColor = (protection: string): string => {
  const p = protection.toLowerCase();
  if (p.includes('rc3') || p.includes('rc4')) return 'border-fo-blue bg-fo-blue text-white';
  if (p.includes('feu')) return 'border-orange-200 bg-orange-50 text-orange-800';
  return 'border-fo-grey bg-fo-grey/50 text-fo-ink';
};

const logoBlanc = `${import.meta.env.BASE_URL}logo-forster-blanc.svg`;
const logoBleu = `${import.meta.env.BASE_URL}logo-forster.svg`;

function App() {
  const [filters, setFilters] = useState<Filters>({});
  const [search, setSearch] = useState('');
  const [ficheOuverte, setFicheOuverte] = useState<SolutionSecurite | null>(null);

  const toggleFilter = (field: keyof LockEntry, value: string) => {
    setFilters((prev) => {
      const current = prev[field] ?? [];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      const updated = { ...prev };
      if (next.length === 0) delete updated[field];
      else updated[field] = next;
      return updated;
    });
  };

  const resetFilters = () => {
    setFilters({});
    setSearch('');
  };

  const filtered = useMemo(() => {
    return lockData.filter((entry) => {
      for (const field of filterFields) {
        const selected = filters[field.key];
        if (selected && selected.length > 0) {
          const entryValue = entry[field.key];
          if (!selected.includes(entryValue)) return false;
        }
      }
      if (search.trim()) {
        const q = search.toLowerCase();
        const haystack = [
          entry.designation,
          entry.coffre,
          entry.refsComplementaires,
          entry.specificite,
          entry.type,
          entry.protection,
          entry.serie,
        ]
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [filters, search]);

  const filteredSolutions = useMemo(() => {
    return solutionsSecurite.filter((s) => {
      for (const field of filterFields) {
        const selected = filters[field.key];
        if (selected && selected.length > 0) {
          const valeurs = valeursSolution(s, field.key);
          if (!valeurs.some((v) => selected.includes(v))) return false;
        }
      }
      if (search.trim() && !texteRecherche(s).includes(search.toLowerCase())) return false;
      return true;
    });
  }, [filters, search]);

  const nbResultats = filtered.length + filteredSolutions.length;

  const activeFilterCount = Object.values(filters).reduce((acc, arr) => acc + (arr?.length ?? 0), 0);

  return (
    <div className="min-h-screen bg-white text-fo-ink">
      {/* En-tête */}
      <header className="sticky top-0 z-40 bg-fo-blue">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img src={logoBlanc} alt="Forster" className="h-6 w-auto sm:h-7" />
              <span className="hidden border-l border-white/30 pl-4 text-sm text-fo-grey sm:inline">
                Configurateur serrures et crémones
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="hidden rounded-full border border-white/30 px-3 py-1 text-fo-grey sm:inline">
                {totalProduits} produits
              </span>
              <span className="rounded-full bg-white px-3 py-1 font-medium text-fo-blue">
                {nbResultats} résultat{nbResultats !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Titre */}
      <section className="border-b border-fo-grey">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-fo-grey/60 px-3 py-1 text-xs text-fo-ink">
              <KeyRound className="h-3 w-3 text-fo-blue2" />
              Configurateur de serrures et crémones
            </div>
            <h1 className="text-3xl font-semibold leading-tight tracking-tight text-fo-ink sm:text-4xl">
              Trouvez la serrure
              <span className="block text-fo-blue">adaptée à votre système</span>
            </h1>
            <p className="mt-4 text-base leading-relaxed text-fo-ink/75">
              Filtrez en temps réel parmi les serrures et crémones Forster Presto, Fuego et Unico,
              et les solutions de sécurité RC3 / RC4. Affinez par type, protection, série, nombre de
              points et plus encore.
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr] xl:grid-cols-[300px_1fr]">
          {/* Filtres */}
          <aside className="lg:sticky lg:top-20 lg:h-[calc(100vh-6rem)] lg:overflow-y-auto">
            <div className="rounded-xl bg-fo-grey p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-sm font-semibold text-fo-ink">
                  <Search className="h-4 w-4 text-fo-blue2" />
                  Filtres
                </h2>
                {activeFilterCount > 0 && (
                  <button
                    onClick={resetFilters}
                    className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-fo-blue2 transition-colors hover:bg-white"
                  >
                    <RotateCcw className="h-3 w-3" />
                    Réinitialiser ({activeFilterCount})
                  </button>
                )}
              </div>

              {/* Recherche */}
              <div className="relative mb-5">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fo-blue2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Rechercher une référence..."
                  className="w-full rounded-lg border border-transparent bg-white py-2 pl-9 pr-3 text-sm text-fo-ink placeholder-fo-ink/45 outline-none transition-colors focus:border-fo-blue2 focus:ring-1 focus:ring-fo-blue2/30"
                />
              </div>

              <div className="space-y-5">
                {filterFields.map((field) => {
                  const values = valeursFiltre(field.key);
                  const selected = filters[field.key] ?? [];
                  const Icon = fieldIcons[field.key] ?? Lock;
                  return (
                    <div key={field.key}>
                      <div className="mb-2 flex items-center gap-2">
                        <Icon className="h-3.5 w-3.5 text-fo-blue2" strokeWidth={1.75} />
                        <span className="text-xs font-medium text-fo-ink">{field.label}</span>
                        {selected.length > 0 && (
                          <span className="ml-auto rounded-full bg-fo-blue2 px-2 py-0.5 text-[10px] font-medium text-white">
                            {selected.length}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {values.map((value) => {
                          const isActive = selected.includes(value);
                          return (
                            <button
                              key={value}
                              onClick={() => toggleFilter(field.key, value)}
                              className={`rounded-md border px-2.5 py-1 text-xs transition-all duration-200 ${
                                isActive
                                  ? 'border-fo-blue2 bg-fo-blue2 font-medium text-white'
                                  : 'border-white bg-white text-fo-ink hover:border-fo-blue2/50'
                              }`}
                            >
                              {value}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* Résultats */}
          <main>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-fo-ink/75">
                <span className="font-semibold text-fo-ink">{nbResultats}</span>
                produit{nbResultats !== 1 ? 's' : ''} trouvé{nbResultats !== 1 ? 's' : ''}
              </div>
            </div>

            {filteredSolutions.length > 0 && (
              <section className="mb-8 overflow-hidden rounded-xl border border-fo-grey">
                <h2 className="flex items-center gap-2 bg-fo-blue px-4 py-2.5 text-sm font-medium text-white">
                  <ShieldCheck className="h-4 w-4" />
                  Solutions de sécurité RC3 / RC4
                  <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-medium">
                    {filteredSolutions.length}
                  </span>
                </h2>
                <div className="grid grid-cols-1 gap-3 p-3 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredSolutions.map((s) => (
                    <CarteSecurite key={s.id} solution={s} onOpen={() => setFicheOuverte(s)} />
                  ))}
                </div>
              </section>
            )}

            {filtered.length > 0 && filteredSolutions.length > 0 && (
              <h2 className="mb-3 flex items-center gap-2 rounded-t-xl bg-fo-blue px-4 py-2.5 text-sm font-medium text-white">
                <Lock className="h-4 w-4" />
                Serrures et crémones
              </h2>
            )}

            {nbResultats === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-fo-grey py-20 text-center">
                <Search className="mb-4 h-10 w-10 text-fo-blue2/50" strokeWidth={1} />
                <h3 className="text-lg font-medium text-fo-ink">Aucun résultat</h3>
                <p className="mt-1 text-sm text-fo-ink/70">
                  Aucun produit ne correspond à ces critères. Essayez de modifier les filtres.
                </p>
                <button
                  onClick={resetFilters}
                  className="mt-4 flex items-center gap-2 rounded-lg bg-fo-blue2 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-fo-blue"
                >
                  <RotateCcw className="h-4 w-4" />
                  Réinitialiser les filtres
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((entry, idx) => (
                  <div
                    key={idx}
                    className="group animate-fade-in-up rounded-xl border border-fo-grey bg-white p-4 transition-all duration-300 hover:border-fo-blue2/50 hover:shadow-md hover:shadow-fo-blue/5"
                    style={{ animationDelay: `${Math.min(idx * 30, 600)}ms` }}
                  >
                    {/* En-tête de carte */}
                    <div className="mb-3 flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {entry.type === 'Serrure' ? (
                          <Lock className="h-4 w-4 text-fo-blue2" strokeWidth={1.75} />
                        ) : (
                          <DoorOpen className="h-4 w-4 text-fo-blue2" strokeWidth={1.75} />
                        )}
                        <span className="text-sm font-medium text-fo-ink">{entry.type}</span>
                      </div>
                      {entry.protection && entry.protection !== '-' && (
                        <span
                          className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${protectionBadgeColor(entry.protection)}`}
                        >
                          {entry.protection}
                        </span>
                      )}
                    </div>

                    {/* Désignation */}
                    <p className="mb-3 text-sm leading-snug text-fo-ink">{entry.designation}</p>

                    {/* Caractéristiques */}
                    <div className="mb-3 grid grid-cols-2 gap-2 text-xs">
                      <Spec label="Série" value={entry.serie} />
                      <Spec label="Points" value={entry.nombreDePoint} />
                      <Spec label="Din" value={entry.din} />
                      <Spec label="Élec." value={entry.electrique} />
                    </div>

                    {/* Anti-panique */}
                    {entry.antiPanique && entry.antiPanique !== '-' && (
                      <div className="mb-3 flex items-center gap-1.5 rounded-md bg-fo-grey/50 px-2 py-1.5 text-xs text-fo-ink/80">
                        <DoorOpen className="h-3 w-3 text-fo-blue2" strokeWidth={1.75} />
                        Anti-panique : <span className="font-medium text-fo-ink">{entry.antiPanique}</span>
                      </div>
                    )}

                    {/* Références */}
                    <div className="space-y-1.5 border-t border-fo-grey pt-3">
                      <RefRow icon={<KeyRound className="h-3 w-3" />} label="Coffre" value={entry.coffre} />
                      {entry.refsComplementaires && entry.refsComplementaires !== '-' && (
                        <RefRow
                          icon={<ChevronRight className="h-3 w-3" />}
                          label="Réfs comp."
                          value={entry.refsComplementaires}
                        />
                      )}
                      {entry.specificite && entry.specificite !== '-' && (
                        <RefRow
                          icon={<Layers className="h-3 w-3" />}
                          label="Spécificité"
                          value={entry.specificite}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {ficheOuverte && (
        <FicheSecuriteModal solution={ficheOuverte} onClose={() => setFicheOuverte(null)} />
      )}

      {/* Pied de page */}
      <footer className="border-t border-fo-grey bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-3">
              <img src={logoBleu} alt="Forster" className="h-5 w-auto" />
              <span className="text-xs text-fo-ink/60">Steel is our nature.</span>
            </div>
            <p className="text-xs text-fo-ink/60">
              Configurateur de serrures et crémones — Forster Systems France
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-fo-grey/45 px-2 py-1.5">
      <div className="text-[10px] uppercase tracking-wider text-fo-ink/55">{label}</div>
      <div className="text-xs font-medium text-fo-ink">{value || '—'}</div>
    </div>
  );
}

function RefRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-1.5 text-xs">
      <span className="mt-0.5 text-fo-blue2">{icon}</span>
      <span className="shrink-0 text-fo-ink/60">{label} :</span>
      <span className="break-all font-medium text-fo-blue2">{value}</span>
    </div>
  );
}

export default App;
