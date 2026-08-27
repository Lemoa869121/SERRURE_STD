import { useMemo, useState } from 'react';
import { Lock, KeyRound, ShieldCheck, Flame, Layers, Zap, DoorOpen, RotateCcw, Search, X, ChevronRight } from 'lucide-react';
import { lockData, filterFields, getUniqueValues, type LockEntry } from '@/data/locks';

type Filters = Partial<Record<keyof LockEntry, string[]>>;

const fieldIcons: Record<string, typeof Lock> = {
  type: Layers,
  protection: ShieldCheck,
  serie: KeyRound,
  nombreDePoint: Lock,
  din: RotateCcw,
  electrique: Zap,
  antiPanique: DoorOpen,
};

const protectionBadgeColor = (protection: string): string => {
  if (protection.toLowerCase().includes('feu')) return 'text-orange-400 border-orange-400/30 bg-orange-400/10';
  if (protection.toLowerCase().includes('rc3')) return 'text-accent-400 border-accent-400/30 bg-accent-400/10';
  if (protection.toLowerCase().includes('rc4')) return 'text-red-400 border-red-400/30 bg-red-400/10';
  if (protection.toLowerCase().includes('standard')) return 'text-steel-300 border-steel-300/30 bg-steel-300/10';
  return 'text-steel-300 border-steel-300/30 bg-steel-300/10';
};

function App() {
  const [filters, setFilters] = useState<Filters>({});
  const [search, setSearch] = useState('');

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

  const activeFilterCount = Object.values(filters).reduce((acc, arr) => acc + (arr?.length ?? 0), 0);

  return (
    <div className="min-h-screen steel-texture text-steel-100">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-steel-800/60 bg-steel-950/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-steel-700 to-steel-900 ring-1 ring-steel-600/50">
                <Flame className="h-5 w-5 text-accent-400" strokeWidth={1.5} />
              </div>
              <div>
                <div className="text-sm font-semibold tracking-[0.2em] text-steel-100">FORSTER</div>
                <div className="text-[10px] uppercase tracking-[0.15em] text-steel-400">
                  Steel is our nature
                </div>
              </div>
            </div>
            <div className="hidden items-center gap-2 text-xs text-steel-400 sm:flex">
              <span className="rounded-full border border-steel-700/60 px-3 py-1">
                {lockData.length} produits
              </span>
              <span className="rounded-full border border-accent-500/30 bg-accent-500/10 px-3 py-1 text-accent-400">
                {filtered.length} résultat{filtered.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-steel-800/60">
        <div className="absolute inset-0 steel-shimmer opacity-30" />
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-steel-700/60 bg-steel-900/60 px-3 py-1 text-xs text-steel-300">
              <KeyRound className="h-3 w-3 text-accent-400" />
              Configurateur de serrures & crémones
            </div>
            <h1 className="font-display text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
              Trouvez la serrure
              <span className="block text-accent-400">adaptée à votre système</span>
            </h1>
            <p className="mt-4 text-base leading-relaxed text-steel-300">
              Filtrez en temps réel parmi les serrures et crémones Forster Presto, Fuego et Unico.
              Affinez par type, protection, série, nombre de points et plus encore.
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr] xl:grid-cols-[320px_1fr]">
          {/* Sidebar Filters */}
          <aside className="lg:sticky lg:top-20 lg:h-[calc(100vh-6rem)] lg:overflow-y-auto">
            <div className="rounded-2xl border border-steel-800/60 bg-steel-900/40 p-5">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-steel-200">
                  <Search className="h-4 w-4 text-accent-400" />
                  Filtres
                </h2>
                {activeFilterCount > 0 && (
                  <button
                    onClick={resetFilters}
                    className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-steel-400 transition-colors hover:text-accent-400"
                  >
                    <RotateCcw className="h-3 w-3" />
                    Réinitialiser ({activeFilterCount})
                  </button>
                )}
              </div>

              {/* Search */}
              <div className="relative mb-5">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-steel-500" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Rechercher une référence..."
                  className="w-full rounded-lg border border-steel-700/60 bg-steel-950/60 py-2 pl-9 pr-3 text-sm text-steel-100 placeholder-steel-500 outline-none transition-colors focus:border-accent-500/50 focus:ring-1 focus:ring-accent-500/30"
                />
              </div>

              <div className="space-y-5">
                {filterFields.map((field) => {
                  const values = getUniqueValues(field.key);
                  const selected = filters[field.key] ?? [];
                  const Icon = fieldIcons[field.key] ?? Lock;
                  return (
                    <div key={field.key}>
                      <div className="mb-2 flex items-center gap-2">
                        <Icon className="h-3.5 w-3.5 text-steel-400" strokeWidth={1.5} />
                        <span className="text-xs font-semibold uppercase tracking-wider text-steel-300">
                          {field.label}
                        </span>
                        {selected.length > 0 && (
                          <span className="ml-auto rounded-full bg-accent-500/20 px-2 py-0.5 text-[10px] font-medium text-accent-400">
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
                              className={`rounded-md border px-2.5 py-1 text-xs font-medium transition-all duration-200 ${
                                isActive
                                  ? 'border-accent-500 bg-accent-500/15 text-accent-400 shadow-[0_0_0_1px] shadow-accent-500/20'
                                  : 'border-steel-700/50 bg-steel-800/30 text-steel-300 hover:border-steel-600 hover:bg-steel-800/60 hover:text-steel-100'
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

          {/* Results */}
          <main>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-steel-300">
                <span className="font-semibold text-white">{filtered.length}</span>
                produit{filtered.length !== 1 ? 's' : ''} trouvé{filtered.length !== 1 ? 's' : ''}
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-steel-700/60 bg-steel-900/30 py-20 text-center">
                <Search className="mb-4 h-10 w-10 text-steel-600" strokeWidth={1} />
                <h3 className="text-lg font-medium text-steel-200">Aucun résultat</h3>
                <p className="mt-1 text-sm text-steel-400">
                  Aucun produit ne correspond à ces critères. Essayez de modifier les filtres.
                </p>
                <button
                  onClick={resetFilters}
                  className="mt-4 flex items-center gap-2 rounded-lg border border-accent-500/30 bg-accent-500/10 px-4 py-2 text-sm font-medium text-accent-400 transition-colors hover:bg-accent-500/20"
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
                    className="group animate-fade-in-up rounded-xl border border-steel-800/60 bg-steel-900/40 p-4 transition-all duration-300 hover:border-steel-600/60 hover:bg-steel-800/40 hover:shadow-lg hover:shadow-black/20"
                    style={{ animationDelay: `${Math.min(idx * 30, 600)}ms` }}
                  >
                    {/* Card header */}
                    <div className="mb-3 flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {entry.type === 'Serrure' ? (
                          <Lock className="h-4 w-4 text-accent-400" strokeWidth={1.5} />
                        ) : (
                          <DoorOpen className="h-4 w-4 text-accent-400" strokeWidth={1.5} />
                        )}
                        <span className="text-sm font-semibold text-steel-100">{entry.type}</span>
                      </div>
                      {entry.protection && entry.protection !== '-' && (
                        <span
                          className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${protectionBadgeColor(entry.protection)}`}
                        >
                          {entry.protection}
                        </span>
                      )}
                    </div>

                    {/* Designation */}
                    <p className="mb-3 text-sm leading-snug text-steel-200">
                      {entry.designation}
                    </p>

                    {/* Specs grid */}
                    <div className="mb-3 grid grid-cols-2 gap-2 text-xs">
                      <Spec label="Série" value={entry.serie} />
                      <Spec label="Points" value={entry.nombreDePoint} />
                      <Spec label="Din" value={entry.din} />
                      <Spec label="Élec." value={entry.electrique} />
                    </div>

                    {/* Anti-panique */}
                    {entry.antiPanique && entry.antiPanique !== '-' && (
                      <div className="mb-3 flex items-center gap-1.5 rounded-md border border-steel-700/40 bg-steel-950/40 px-2 py-1.5 text-xs text-steel-300">
                        <DoorOpen className="h-3 w-3 text-accent-400" strokeWidth={1.5} />
                        Anti-panique: <span className="font-medium text-steel-100">{entry.antiPanique}</span>
                      </div>
                    )}

                    {/* References */}
                    <div className="space-y-1.5 border-t border-steel-800/60 pt-3">
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

      {/* Footer */}
      <footer className="border-t border-steel-800/60 bg-steel-950/60">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <Flame className="h-4 w-4 text-accent-400" strokeWidth={1.5} />
              <span className="text-sm font-semibold tracking-[0.2em] text-steel-200">FORSTER</span>
              <span className="text-xs text-steel-500">| Steel is our nature</span>
            </div>
            <p className="text-xs text-steel-500">
              Configurateur de serrures & crémones — Forster Systems France
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-steel-950/40 px-2 py-1.5">
      <div className="text-[10px] uppercase tracking-wider text-steel-500">{label}</div>
      <div className="text-xs font-medium text-steel-200">{value || '—'}</div>
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
      <span className="mt-0.5 text-steel-500">{icon}</span>
      <span className="shrink-0 text-steel-500">{label}:</span>
      <span className="break-all text-steel-300">{value}</span>
    </div>
  );
}

export default App;
