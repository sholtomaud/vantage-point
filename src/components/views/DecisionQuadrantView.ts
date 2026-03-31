import { BobaElement } from '../BobaElement';
import { store, Alternative } from '../../store/DecisionStore';

export class DecisionQuadrantView extends BobaElement {
  constructor() {
    super();
    store.addEventListener('change', () => this.update());
  }

  protected render(): string {
    const project = store.getProject();
    const alternatives = project.alternatives;

    return `
      <div class="flex h-full w-full bg-surface animate-fade-in flex-col overflow-hidden">
        <!-- Header -->
        <div class="px-4 py-3 lg:px-8 lg:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-container-low border-b border-outline-variant/5">
          <div class="flex items-center gap-4 lg:gap-6">
            <div class="w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl bg-surface-container flex items-center justify-center">
              <span class="material-symbols-outlined text-secondary text-xl lg:text-2xl">grid_view</span>
            </div>
            <div>
              <h2 class="font-display text-xl lg:text-2xl font-medium tracking-tight text-on-surface">Decision Quadrant</h2>
              <p class="label-sm text-on-surface-variant mt-1 uppercase tracking-widest text-[9px] lg:text-[10px]">Strategic Mapping</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <button class="px-4 py-2 rounded-lg btn-primary text-[10px] label-sm font-bold">
              SAVE
            </button>
          </div>
        </div>

        <!-- Quadrant Grid -->
        <div class="flex-1 p-4 lg:p-8 overflow-auto flex items-center justify-center">
          <div class="w-full max-w-4xl aspect-square bg-surface-container-lowest rounded-2xl lg:rounded-3xl p-6 lg:p-12 relative shadow-2xl border border-outline-variant/5">
            <!-- Labels -->
            <div class="absolute top-2 lg:top-4 left-1/2 -translate-x-1/2 label-sm text-on-surface-variant/40 tracking-[0.2em] lg:tracking-[0.3em] text-[8px] lg:text-[10px] uppercase">High Merit</div>
            <div class="absolute bottom-2 lg:bottom-4 left-1/2 -translate-x-1/2 label-sm text-on-surface-variant/40 tracking-[0.2em] lg:tracking-[0.3em] text-[8px] lg:text-[10px] uppercase">Low Merit</div>
            <div class="absolute left-2 lg:left-4 top-1/2 -translate-y-1/2 -rotate-90 label-sm text-on-surface-variant/40 tracking-[0.2em] lg:tracking-[0.3em] text-[8px] lg:text-[10px] uppercase whitespace-nowrap">Low Viability</div>
            <div class="absolute right-2 lg:right-4 top-1/2 -translate-y-1/2 rotate-90 label-sm text-on-surface-variant/40 tracking-[0.2em] lg:tracking-[0.3em] text-[8px] lg:text-[10px] uppercase whitespace-nowrap">High Viability</div>

            <!-- Axes -->
            <div class="absolute top-1/2 left-6 lg:left-8 right-6 lg:right-8 h-[1px] bg-outline-variant/10"></div>
            <div class="absolute left-1/2 top-6 lg:top-8 bottom-6 lg:bottom-8 w-[1px] bg-outline-variant/10"></div>

            <!-- Quadrant Names -->
            <div class="absolute top-8 lg:top-12 left-8 lg:left-12 label-sm text-on-surface-variant/10 text-[7px] lg:text-[9px] uppercase tracking-widest">Strategic Gamble</div>
            <div class="absolute top-8 lg:top-12 right-8 lg:right-12 label-sm text-on-surface-variant/10 text-[7px] lg:text-[9px] uppercase tracking-widest">Core Priority</div>
            <div class="absolute bottom-8 lg:bottom-12 left-8 lg:left-12 label-sm text-on-surface-variant/10 text-[7px] lg:text-[9px] uppercase tracking-widest">Tactical Pivot</div>
            <div class="absolute bottom-8 lg:bottom-12 right-8 lg:right-12 label-sm text-on-surface-variant/10 text-[7px] lg:text-[9px] uppercase tracking-widest">Quick Win</div>

            <!-- Data Points -->
            ${alternatives.map(alt => {
              const viability = store.getViability(alt);
              const x = viability * 100;
                // AHP merit is already 0-1, but often small values.
                // Let's normalize for the quadrant view so the best merit is at the top.
                const maxMerit = Math.max(...alternatives.map(a => a.merit)) || 1;
                const normalizedMerit = alt.merit / maxMerit;
                const y = (1 - normalizedMerit) * 100; // Invert for top-down
              const color = viability > 0.5 ? 'var(--color-primary)' : 'var(--color-error)';
              return this.renderPoint(alt.label, x, y, color);
            }).join('')}
          </div>
        </div>

        <!-- Legend (Bottom) -->
        <div class="bg-surface-container-low p-4 lg:p-8 border-t border-outline-variant/5">
          <div class="flex flex-wrap items-center justify-center gap-4 lg:gap-12">
            ${alternatives.map((alt, i) => `
              <div class="flex items-center gap-2 lg:gap-3">
                <div class="w-2 h-2 lg:w-3 lg:h-3 rounded-full" style="background-color: ${i === 0 ? 'var(--color-primary)' : i === 1 ? 'var(--color-tertiary)' : 'var(--color-secondary)'}"></div>
                <span class="label-sm text-on-surface-variant/60 text-[9px] lg:text-[10px] uppercase tracking-tighter">${alt.label}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  private renderPoint(label: string, x: number, y: number, color: string): string {
    return `
      <div 
        class="absolute w-4 h-4 lg:w-6 lg:h-6 rounded-full border border-white/20 flex items-center justify-center group cursor-pointer transition-all hover:scale-150 z-10 -translate-x-1/2 -translate-y-1/2"
        style="left: ${x}%; top: ${y}%; background-color: ${color}22; border-color: ${color}"
      >
        <div class="w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full" style="background-color: ${color}"></div>
        <div class="absolute top-full mt-2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
          <div class="px-2 py-1 lg:px-3 lg:py-1.5 rounded-lg bg-surface-container-highest/90 backdrop-blur-md text-on-surface text-[8px] lg:text-[10px] label-sm border border-outline-variant/10 shadow-2xl uppercase tracking-widest">
            ${label}
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('quadrant-view', DecisionQuadrantView);

