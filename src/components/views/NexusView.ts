import { BobaElement } from '../BobaElement';
import { store, Alternative } from '../../store/DecisionStore';

export class NexusView extends BobaElement {
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
              <span class="material-symbols-outlined text-primary text-xl lg:text-2xl">compare_arrows</span>
            </div>
            <div>
              <h2 class="font-display text-xl lg:text-2xl font-medium tracking-tight text-on-surface">Nexus Comparison</h2>
              <p class="label-sm text-on-surface-variant mt-1 uppercase tracking-widest text-[9px] lg:text-[10px]">Cross-Scenario Analysis</p>
            </div>
          </div>
          <div class="flex items-center gap-2 lg:gap-3">
            <button class="px-4 py-2 rounded-lg bg-surface-container text-on-surface-variant text-[10px] label-sm hover:bg-surface-container-high transition-all border border-outline-variant/5">
              FILTER
            </button>
            <button class="px-4 py-2 rounded-lg btn-primary text-[10px] label-sm font-bold">
              SIMULATE
            </button>
          </div>
        </div>

        <!-- Comparison Grid -->
        <div class="flex-1 p-4 lg:p-8 overflow-auto space-y-8">
          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
            ${alternatives.map(alt => this.renderScenarioCard(alt)).join('')}
          </div>

          <!-- Comparison Table (Bottom) -->
          <div class="bg-surface-container-low p-6 lg:p-8 rounded-2xl lg:rounded-3xl border border-outline-variant/5 shadow-xl">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <h3 class="label-sm text-on-surface-variant/40 uppercase tracking-widest text-[10px]">Detailed Vector Comparison</h3>
              <div class="flex flex-wrap items-center gap-4 label-sm text-on-surface-variant/60 text-[9px] lg:text-[10px]">
                ${alternatives.slice(0, 3).map((alt, i) => `
                  <div class="flex items-center gap-2">
                    <div class="w-2 h-2 rounded-full ${i === 0 ? 'bg-primary' : i === 1 ? 'bg-tertiary' : 'bg-secondary'}"></div>
                    <span class="font-bold">${alt.label}</span>
                  </div>
                `).join('')}
              </div>
            </div>
            <div class="space-y-8">
              ${this.renderComparisonRow('Market Penetration', alternatives)}
              ${this.renderComparisonRow('Operational Cost', alternatives)}
              ${this.renderComparisonRow('Innovation Velocity', alternatives)}
              ${this.renderComparisonRow('Strategic Resilience', alternatives)}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private renderScenarioCard(alt: Alternative): string {
    const viability = store.getViability(alt);
    const utilityDensity = store.getUtilityDensity(alt);
    const project = store.getProject();
    const costPercent = (alt.cost / project.budget) * 100;

    return `
      <div class="bg-surface-container rounded-2xl lg:rounded-3xl p-6 lg:p-8 flex flex-col group transition-all duration-300 hover:bg-surface-container-highest border border-outline-variant/5 shadow-lg">
        <div class="flex items-center justify-between mb-6">
          <div class="w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl bg-surface-container-low flex items-center justify-center">
            <span class="material-symbols-outlined text-on-surface-variant/40 group-hover:text-primary transition-colors text-xl lg:text-2xl">rocket_launch</span>
          </div>
          <div class="px-3 py-1 rounded-full bg-surface-container-low text-on-surface-variant/40 label-sm text-[9px] lg:text-[10px] uppercase tracking-widest">Active</div>
        </div>
        
        <h3 class="font-display text-lg lg:text-xl font-medium mb-2 text-on-surface group-hover:text-primary transition-colors truncate">${alt.label}</h3>
        <p class="text-[10px] lg:text-xs text-on-surface-variant/40 mb-8 uppercase tracking-widest">Merit: ${(alt.merit * 100).toFixed(0)}%</p>
        
        <div class="flex-1 space-y-6">
          <div class="space-y-2">
            <div class="flex items-center justify-between label-sm text-[10px]">
              <span class="text-on-surface-variant/60">Viability Index</span>
              <span class="${viability > 0.5 ? 'text-primary' : 'text-error'} font-bold">${(viability * 100).toFixed(0)}%</span>
            </div>
            <div class="h-1.5 w-full bg-surface-container-low rounded-full overflow-hidden">
              <div class="h-full rounded-full transition-all duration-1000 ${viability > 0.5 ? 'bg-primary' : 'bg-error'}" style="width: ${viability * 100}%"></div>
            </div>
          </div>
          <div class="space-y-2">
            <div class="flex items-center justify-between label-sm text-[10px]">
              <span class="text-on-surface-variant/60">Utility Density</span>
              <span class="text-tertiary font-bold">${utilityDensity.toFixed(1)}x</span>
            </div>
            <div class="h-1.5 w-full bg-surface-container-low rounded-full overflow-hidden">
              <div class="h-full rounded-full bg-tertiary transition-all duration-1000" style="width: ${Math.min(100, utilityDensity * 10)}%"></div>
            </div>
          </div>
          <div class="space-y-2">
            <div class="flex items-center justify-between label-sm text-[10px]">
              <span class="text-on-surface-variant/60">Resource Consumption</span>
              <span class="text-on-surface font-bold">${costPercent.toFixed(1)}%</span>
            </div>
            <div class="h-1.5 w-full bg-surface-container-low rounded-full overflow-hidden">
              <div class="h-full rounded-full bg-on-surface/20 transition-all duration-1000" style="width: ${costPercent}%"></div>
            </div>
          </div>
        </div>
        
        <button class="mt-10 w-full py-3 rounded-xl bg-surface-container-low text-on-surface label-sm text-[10px] font-bold hover:bg-surface-container-highest transition-all border border-outline-variant/10 uppercase tracking-widest">
          SELECT SCENARIO
        </button>
      </div>
    `;
  }

  private renderComparisonRow(label: string, alternatives: Alternative[]): string {
    return `
      <div class="flex flex-col gap-3">
        <span class="label-sm text-on-surface-variant/60 text-[10px] uppercase tracking-widest">${label}</span>
        <div class="h-2.5 flex gap-1 rounded-full overflow-hidden bg-surface-container border border-outline-variant/5">
          ${alternatives.slice(0, 3).map((alt, i) => {
            const val = (alt.merit * 100) + (Math.random() * 20 - 10);
            const color = i === 0 ? 'bg-primary' : i === 1 ? 'bg-tertiary' : 'bg-secondary';
            return `<div class="h-full ${color} rounded-full transition-all duration-1000" style="width: ${Math.max(10, Math.min(100, val))}%"></div>`;
          }).join('')}
        </div>
      </div>
    `;
  }
}

customElements.define('nexus-view', NexusView);

