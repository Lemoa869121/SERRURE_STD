import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { ShieldCheck, X, Ruler, Layers, Info, ChevronRight, Zap, RotateCcw } from 'lucide-react';
import {
  A_FABRIQUER,
  type GroupeNomenclature,
  type SolutionSecurite,
} from '@/data/securite';

const badgeProtection = 'border-fo-blue bg-fo-blue text-white';

const nbLignes = (groupes: GroupeNomenclature[]) =>
  groupes.reduce((acc, g) => acc + g.lignes.length, 0);

/* ------------------------------------------------------------------ */
/* Carte dans la liste des résultats                                   */
/* ------------------------------------------------------------------ */

export function CarteSecurite({
  solution,
  onOpen,
}: {
  solution: SolutionSecurite;
  onOpen: () => void;
}) {
  const s = solution;
  const serrures = s.principal[0]?.lignes ?? [];
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group flex h-full flex-col rounded-xl border border-fo-grey bg-white p-4 text-left transition-all duration-300 hover:border-fo-blue2/50 hover:shadow-md hover:shadow-fo-blue/5"
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-fo-blue2" strokeWidth={1.75} />
          <span className="text-sm text-fo-ink/70">{s.serie}</span>
        </div>
        <span
          className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${badgeProtection}`}
        >
          {s.protection}
        </span>
      </div>

      <p className="mb-1 text-sm font-medium leading-snug text-fo-ink">{s.gamme}</p>
      <p className="mb-3 text-xs leading-snug text-fo-ink/65">{s.description.slice(0, 2).join(' · ')}</p>

      <div className="mb-3 grid grid-cols-2 gap-2 text-xs">
        <Mini label="Din" value={s.din.join(' / ')} />
        <Mini label="Élec." value={s.electrique.join(' / ')} />
        <Mini
          label={`Dim. max 1 vtl (${s.dimensions.base === 'vantaux' ? 'vantail' : 'passage'})`}
          value={`${s.dimensions.unVantail.hauteur} × ${s.dimensions.unVantail.largeur}`}
        />
        <Mini label="Vitrage" value={s.vitrage[0] ?? '—'} />
      </div>

      <div className="mb-3 space-y-1 border-t border-fo-grey pt-3 text-xs">
        {serrures.map((x, i) => (
          <div key={i} className="flex justify-between gap-2">
            <span className="text-fo-ink/80">{x.designation}</span>
            <span className="font-mono text-fo-blue2">{x.ref}</span>
          </div>
        ))}
      </div>

      <div className="mt-auto flex items-center justify-between text-xs">
        <span className="text-fo-ink/55">
          {nbLignes([...s.principal, ...s.secondaire, ...s.options])} lignes de nomenclature
        </span>
        <span className="flex items-center gap-1 font-medium text-fo-blue2 group-hover:underline">
          Voir la fiche <ChevronRight className="h-3 w-3" />
        </span>
      </div>
    </button>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-fo-grey/45 px-2 py-1.5">
      <div className="text-[10px] uppercase tracking-wider text-fo-ink/55">{label}</div>
      <div className="text-xs font-medium text-fo-ink">{value || '—'}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Fiche détaillée (fenêtre)                                           */
/* ------------------------------------------------------------------ */

export function FicheSecuriteModal({
  solution,
  onClose,
}: {
  solution: SolutionSecurite;
  onClose: () => void;
}) {
  const s = solution;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-fo-ink/60 p-2 backdrop-blur-sm sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={s.titre}
    >
      <div
        className="relative my-4 w-full max-w-6xl rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* En-tête */}
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 rounded-t-2xl bg-fo-blue px-5 py-4">
          <div>
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <span
                className="rounded-full border border-white bg-white px-2 py-0.5 text-[10px] font-medium text-fo-blue"
              >
                {s.protection}
              </span>
              <span className="rounded-full border border-white/30 px-2 py-0.5 text-[10px] text-fo-grey">
                {s.serie}
              </span>
              <span className="flex items-center gap-1 rounded-full border border-white/30 px-2 py-0.5 text-[10px] text-fo-grey">
                <RotateCcw className="h-2.5 w-2.5" /> Din {s.din.join(' / ')}
              </span>
              <span className="flex items-center gap-1 rounded-full border border-white/30 px-2 py-0.5 text-[10px] text-fo-grey">
                <Zap className="h-2.5 w-2.5" /> Électrique {s.electrique.join(' / ')}
              </span>
            </div>
            <h2 className="text-xl font-semibold text-white sm:text-2xl">{s.titre}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-fo-grey transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Fermer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6 px-5 py-5">
          {/* Description */}
          <ul className="space-y-1 text-sm text-fo-ink/80">
            {s.description.map((d, i) => (
              <li key={i}>{d}</li>
            ))}
          </ul>

          {/* Nomenclature */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <Colonne titre="Vantail principal" groupes={s.principal} />
            <Colonne titre="Vantail secondaire" groupes={s.secondaire} />
          </div>

          {s.options.length > 0 && (
            <div>
              <TitreSection icon={<Layers className="h-4 w-4" />}>Options</TitreSection>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {s.options.map((g, i) => (
                  <Groupe key={i} groupe={g} />
                ))}
              </div>
            </div>
          )}

          {/* Dimensions, vitrage, notes */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <div>
              <TitreSection icon={<Ruler className="h-4 w-4" />}>
                Dim. max ({s.dimensions.base})
              </TitreSection>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[10px] uppercase tracking-wider text-fo-ink/50">
                    <th className="py-1 font-medium" />
                    <th className="py-1 font-medium">1 vantail</th>
                    <th className="py-1 font-medium">2 vantaux</th>
                  </tr>
                </thead>
                <tbody className="text-fo-ink">
                  <tr className="border-t border-fo-grey">
                    <td className="py-1.5 text-fo-ink/70">Hauteur</td>
                    <td className="py-1.5 font-mono text-fo-blue2">{s.dimensions.unVantail.hauteur}</td>
                    <td className="py-1.5 font-mono text-fo-blue2">{s.dimensions.deuxVantaux.hauteur}</td>
                  </tr>
                  <tr className="border-t border-fo-grey">
                    <td className="py-1.5 text-fo-ink/70">Largeur</td>
                    <td className="py-1.5 font-mono text-fo-blue2">{s.dimensions.unVantail.largeur}</td>
                    <td className="py-1.5 font-mono text-fo-blue2">{s.dimensions.deuxVantaux.largeur}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div>
              <TitreSection icon={<ShieldCheck className="h-4 w-4" />}>Vitrage</TitreSection>
              <ul className="space-y-1 text-sm text-fo-ink">
                {s.vitrage.map((v, i) => (
                  <li key={i}>{v}</li>
                ))}
              </ul>
            </div>
            <div>
              <TitreSection icon={<Info className="h-4 w-4" />}>Info complémentaire</TitreSection>
              {s.notes.length === 0 ? (
                <p className="text-sm text-fo-ink/50">—</p>
              ) : (
                <ul className="space-y-1 text-sm text-fo-ink/80">
                  {s.notes.map((n, i) => (
                    <li key={i}>{n}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TitreSection({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <h3 className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-fo-blue">
      {icon}
      {children}
    </h3>
  );
}

function Colonne({ titre, groupes }: { titre: string; groupes: GroupeNomenclature[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-fo-grey bg-white">
      <div className="bg-fo-blue px-4 py-2 text-sm font-medium text-white">{titre}</div>
      <div className="space-y-4 p-4">
        {groupes.map((g, i) => (
          <Groupe key={i} groupe={g} />
        ))}
      </div>
    </div>
  );
}

function Groupe({ groupe }: { groupe: GroupeNomenclature }) {
  return (
    <div>
      <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-fo-blue2">{groupe.titre}</div>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-[10px] uppercase tracking-wider text-fo-ink/45">
            <th className="py-1 font-medium">Désignation</th>
            <th className="py-1 font-medium">Réf.</th>
            <th className="py-1 text-right font-medium">Qté</th>
          </tr>
        </thead>
        <tbody>
          {groupe.lignes.map((x, i) => (
            <tr key={i} className="border-t border-fo-grey align-top">
              <td className="py-1.5 pr-2 text-fo-ink">{x.designation}</td>
              <td
                className={`py-1.5 pr-2 font-mono text-xs ${
                  x.ref === A_FABRIQUER ? 'italic text-orange-700' : 'text-fo-blue2'
                }`}
              >
                {x.ref}
              </td>
              <td className="py-1.5 text-right font-mono text-xs text-fo-ink/80">{x.qte || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
