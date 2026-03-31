import { BobaElement } from '../BobaElement';
import { store, Alternative } from '../../store/DecisionStore';

export class ScenarioSimulatorView extends BobaElement {
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
              <span class="material-symbols-outlined text-tertiary text-xl lg:text-2xl">science</span>
            </div>
            <div>
              <h2 class="font-display text-xl lg:text-2xl font-medium tracking-tight text-on-surface">Scenario Simulator</h2>
              <p class="label-sm text-on-surface-variant mt-1 uppercase tracking-widest text-[9px] lg:text-[10px]">Stress-Testing Reality</p>
            </div>
          </div>
          <div class="flex items-center gap-2 lg:gap-3">
            <button 
              class="px-4 py-2 rounded-lg bg-surface-container text-on-surface-variant text-[10px] label-sm hover:bg-surface-container-high transition-all border border-outline-variant/5"
              onclick="this.closest('simulator-view').reset()"
            >
              RESET
            </button>
            <button class="px-4 py-2 rounded-lg btn-primary text-[10px] label-sm font-bold">
              SAVE
            </button>
          </div>
        </div>

        <div class="flex-1 flex flex-col lg:flex-row p-4 lg:p-8 gap-6 lg:gap-8 overflow-auto lg:overflow-hidden">
          <!-- Control Panel -->
          <div class="w-full lg:w-96 space-y-8 lg:space-y-10 lg:overflow-y-auto lg:pr-4 shrink-0">
            <section class="space-y-6">
              <div class="flex items-center justify-between">
                <h3 class="label-sm text-on-surface-variant/40 uppercase tracking-widest text-[10px]">Global Constraints</h3>
                <span class="material-symbols-outlined text-on-surface-variant/20 text-sm">info</span>
              </div>
              
              <!-- Budget Slider -->
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <label class="label-sm text-on-surface-variant/60 text-[10px] uppercase">Total Budget Cap</label>
                  <span class="text-sm font-mono font-bold text-primary">$${(project.budget / 1000000).toFixed(1)}M</span>
                </div>
                <input 
                  type="range" 
                  min="1000000" 
                  max="50000000" 
                  step="1000000"
                  value="${project.budget}"
                  class="w-full h-1.5 bg-surface-container-high rounded-full appearance-none cursor-pointer accent-primary"
                  oninput="this.closest('simulator-view').updateBudget(this.value)"
                >
                <div class="flex justify-between text-[9px] text-on-surface-variant/20 label-sm">
                  <span>$1M</span>
                  <span>$50M</span>
                </div>
              </div>

              <!-- Time Slider -->
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <label class="label-sm text-on-surface-variant/60 text-[10px] uppercase">Strategic Horizon</label>
                  <span class="text-sm font-mono font-bold text-tertiary">${project.timeHorizon} Months</span>
                </div>
                <input 
                  type="range" 
                  min="3" 
                  max="60" 
                  step="3"
                  value="${project.timeHorizon}"
                  class="w-full h-1.5 bg-surface-container-high rounded-full appearance-none cursor-pointer accent-tertiary"
                  oninput="this.closest('simulator-view').updateTime(this.value)"
                >
                <div class="flex justify-between text-[9px] text-on-surface-variant/20 label-sm">
                  <span>3M</span>
                  <span>60M</span>
                </div>
              </div>

              <!-- Risk Slider -->
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <label class="label-sm text-on-surface-variant/60 text-[10px] uppercase">Risk Tolerance</label>
                  <span class="text-sm font-mono font-bold text-secondary">${(project.riskTolerance * 100).toFixed(0)}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.05"
                  value="${project.riskTolerance}"
                  class="w-full h-1.5 bg-surface-container-high rounded-full appearance-none cursor-pointer accent-secondary"
                  oninput="this.closest('simulator-view').updateRisk(this.value)"
                >
                <div class="flex justify-between text-[9px] text-on-surface-variant/20 label-sm uppercase tracking-tighter">
                  <span>Conservative</span>
                  <span>Aggressive</span>
                </div>
              </div>
            </section>

            <section class="space-y-6 pt-6 border-t border-outline-variant/10">
              <h3 class="label-sm text-on-surface-variant/40 uppercase tracking-widest text-[10px]">Kinetic Impact</h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                ${alternatives.map(alt => this.renderImpactRow(alt)).join('')}
              </div>
            </section>
          </div>

          <!-- Kinetic Preview -->
          <div class="flex-1 bg-surface-container-lowest rounded-2xl lg:rounded-3xl border border-outline-variant/5 relative overflow-hidden flex flex-col min-h-[400px] lg:min-h-0 shadow-2xl">
            <div class="p-6 lg:p-8 border-b border-outline-variant/5 flex items-center justify-between">
              <h3 class="label-sm text-on-surface-variant/40 uppercase tracking-widest text-[10px]">Live Viability Shift</h3>
              <div class="flex items-center gap-4">
                <div class="flex items-center gap-2">
                  <div class="w-2 h-2 rounded-full bg-primary"></div>
                  <span class="text-[9px] label-sm text-on-surface-variant/40">Viable</span>
                </div>
                <div class="flex items-center gap-2">
                  <div class="w-2 h-2 rounded-full bg-error"></div>
                  <span class="text-[9px] label-sm text-on-surface-variant/40">Friction</span>
                </div>
              </div>
            </div>
            
            <div class="flex-1 relative p-8 lg:p-12">
              <!-- Horizontal Viability Tracks -->
              <div class="absolute inset-0 flex flex-col justify-around px-8 lg:px-12 py-16 lg:py-20">
                ${alternatives.map(alt => `
                  <div class="h-[1px] w-full bg-outline-variant/5 relative">
                    <div 
                      class="absolute top-1/2 -translate-y-1/2 transition-all duration-700 ease-out"
                      style="left: ${store.getViability(alt) * 100}%"
                    >
                      <div class="flex flex-col items-center gap-2">
                        <div class="w-3 h-3 lg:w-4 lg:h-4 rounded-full ${store.getViability(alt) > 0.5 ? 'bg-primary' : 'bg-error'} shadow-lg shadow-black/20"></div>
                        <span class="text-[8px] lg:text-[9px] label-sm text-on-surface-variant/40 whitespace-nowrap uppercase tracking-tighter">${alt.label}</span>
                      </div>
                    </div>
                  </div>
                `).join('')}
              </div>
              
              <!-- Vertical Indicators -->
              <div class="absolute left-8 lg:left-12 top-8 lg:top-12 bottom-8 lg:bottom-12 w-[1px] bg-outline-variant/10"></div>
              <div class="absolute right-8 lg:right-12 top-8 lg:top-12 bottom-8 lg:bottom-12 w-[1px] bg-outline-variant/10"></div>
              <div class="absolute left-8 lg:left-12 bottom-8 lg:bottom-12 right-8 lg:right-12 h-[1px] bg-outline-variant/10"></div>
            </div>

            <div class="p-6 lg:p-8 bg-surface-container-low/30 border-t border-outline-variant/5">
              <div class="flex items-center gap-4">
                <span class="material-symbols-outlined text-primary text-xl">info</span>
                <p class="text-[10px] lg:text-xs text-on-surface-variant/60 leading-relaxed">
                  Nodes glide horizontally as you adjust the <strong class="text-on-surface">Execution Ceiling</strong>. 
                  The <strong class="text-primary">Viability Index</strong> reacts in real-time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private renderImpactRow(alt: Alternative): string {
    const viability = store.getViability(alt);
    return `
      <div class="flex items-center justify-between group p-3 rounded-xl bg-surface-container-low/50 border border-outline-variant/5">
        <span class="text-[10px] lg:text-xs text-on-surface-variant/60 group-hover:text-on-surface transition-colors truncate pr-2">${alt.label}</span>
        <div class="flex items-center gap-3 shrink-0">
          <div class="w-16 lg:w-24 h-1 bg-surface-container rounded-full overflow-hidden">
            <div class="h-full rounded-full transition-all duration-1000 ${viability > 0.5 ? 'bg-primary' : 'bg-error'}" style="width: ${viability * 100}%"></div>
          </div>
          <span class="text-[9px] lg:text-[10px] font-mono font-bold ${viability > 0.5 ? 'text-primary' : 'text-error'} w-8 text-right">${(viability * 100).toFixed(0)}%</span>
        </div>
      </div>
    `;
  }

  public updateBudget(value: string) {
    store.updateProject({ budget: parseInt(value) });
  }

  public updateTime(value: string) {
    store.updateProject({ timeHorizon: parseInt(value) });
  }

  public updateRisk(value: string) {
    store.updateProject({ riskTolerance: parseFloat(value) });
  }

  public reset() {
    store.updateProject({
      budget: 15000000,
      timeHorizon: 24,
      riskTolerance: 0.6
    });
  }
}

customElements.define('simulator-view', ScenarioSimulatorView);

