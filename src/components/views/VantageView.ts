import { BobaElement } from '../BobaElement';
import { store, Alternative } from '../../store/DecisionStore';

export class VantageView extends BobaElement {
  private useUtilityDensity: boolean = false;

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
        <div class="p-4 lg:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-container-low border-b border-outline-variant/5">
          <div class="flex items-center gap-4 lg:gap-6">
            <div class="w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl bg-surface-container flex items-center justify-center">
              <span class="material-symbols-outlined text-primary text-xl lg:text-2xl">view_quilt</span>
            </div>
            <div>
              <h2 class="font-display text-xl lg:text-2xl font-medium tracking-tight text-on-surface">Strategic Vantage</h2>
              <p class="label-sm text-on-surface-variant mt-1 uppercase tracking-widest text-[9px] lg:text-[10px]">Merit vs. Viability Analysis</p>
            </div>
          </div>
          <div class="flex items-center gap-2 lg:gap-4 overflow-x-auto pb-2 sm:pb-0">
            <div class="flex items-center gap-1 bg-surface-container p-1 rounded-xl shrink-0">
              <button 
                class="px-3 lg:px-4 py-1.5 lg:py-2 rounded-lg text-[9px] lg:text-[10px] label-sm transition-calm ${!this.useUtilityDensity ? 'bg-primary text-surface shadow-lg shadow-primary/20' : 'text-on-surface-variant hover:text-on-surface'}"
                onclick="this.closest('vantage-view').toggleLens(false)"
              >STANDARD</button>
              <button 
                class="px-3 lg:px-4 py-1.5 lg:py-2 rounded-lg text-[9px] lg:text-[10px] label-sm transition-calm ${this.useUtilityDensity ? 'bg-primary text-surface shadow-lg shadow-primary/20' : 'text-on-surface-variant hover:text-on-surface'}"
                onclick="this.closest('vantage-view').toggleLens(true)"
              >VALUE LENS</button>
            </div>
            <button class="px-4 py-2 rounded-lg btn-primary text-[10px] label-sm font-bold shrink-0">
              ADVISORY
            </button>
          </div>
        </div>

        <!-- Quadrant Area -->
        <div class="flex-1 flex flex-col lg:flex-row p-4 lg:p-8 gap-6 lg:gap-8 overflow-hidden">
          <!-- The Matrix -->
          <div class="flex-1 relative bg-surface-container-lowest rounded-2xl lg:rounded-3xl border border-outline-variant/5 overflow-hidden shadow-2xl min-h-[350px] lg:min-h-0">
            <!-- Grid Lines & Labels -->
            <div class="absolute inset-0 flex flex-col pointer-events-none">
              <div class="flex-1 border-b border-outline-variant/5 relative">
                <span class="absolute top-4 left-4 label-sm text-on-surface-variant/10 uppercase tracking-widest text-[8px] lg:text-[10px] max-w-[100px] lg:max-w-none">High Merit / Low Viability</span>
                <span class="absolute top-4 right-4 label-sm text-on-surface-variant/10 uppercase tracking-widest text-[8px] lg:text-[10px] text-right max-w-[100px] lg:max-w-none">High Merit / High Viability</span>
              </div>
              <div class="flex-1 relative">
                <span class="absolute bottom-4 left-4 label-sm text-on-surface-variant/10 uppercase tracking-widest text-[8px] lg:text-[10px] max-w-[100px] lg:max-w-none">Low Merit / Low Viability</span>
                <span class="absolute bottom-4 right-4 label-sm text-on-surface-variant/10 uppercase tracking-widest text-[8px] lg:text-[10px] text-right max-w-[100px] lg:max-w-none">Low Merit / High Viability</span>
              </div>
            </div>
            
            <!-- Axes -->
            <div class="absolute left-1/2 top-0 bottom-0 w-[1px] bg-outline-variant/10"></div>
            <div class="absolute top-1/2 left-0 right-0 h-[1px] bg-outline-variant/10"></div>

            <!-- Axis Labels -->
            <div class="absolute left-2 top-1/2 -translate-y-1/2 -rotate-90 label-sm text-on-surface-variant/30 tracking-[0.3em] text-[8px] lg:text-[10px]">MERIT</div>
            <div class="absolute bottom-2 left-1/2 -translate-x-1/2 label-sm text-on-surface-variant/30 tracking-[0.3em] text-[8px] lg:text-[10px]">VIABILITY</div>

            <!-- Nodes -->
            <div class="absolute inset-0 p-8 lg:p-12">
              ${alternatives.map(alt => this.renderNode(alt)).join('')}
            </div>
          </div>

          <!-- Pulse Cards Sidebar -->
          <div class="w-full lg:w-80 space-y-4 overflow-y-auto pr-2">
            <h3 class="label-sm text-on-surface-variant/40 px-2 uppercase tracking-widest text-[10px]">Strategic Drill-down</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              ${alternatives.map(alt => this.renderPulseCard(alt)).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private renderNode(alt: Alternative): string {
    const viability = store.getViability(alt);
    const x = viability * 100;
    const y = alt.merit * 100;
    
    // Size based on Utility Density if lens is active
    const utilityDensity = store.getUtilityDensity(alt);
    const baseSize = 40;
    const size = this.useUtilityDensity ? Math.max(28, Math.min(100, utilityDensity * 8)) : baseSize;

    return `
      <div 
        class="absolute group cursor-pointer transition-all duration-700 ease-out"
        style="left: ${x}%; bottom: ${y}%; transform: translate(-50%, 50%);"
      >
        <div 
          class="rounded-full flex flex-col items-center justify-center border-2 transition-all duration-500 shadow-2xl relative"
          style="
            width: ${size}px; 
            height: ${size}px; 
            background: ${viability > 0.5 ? 'rgba(0, 229, 255, 0.05)' : 'rgba(255, 68, 68, 0.05)'};
            border-color: ${viability > 0.5 ? 'rgba(0, 229, 255, 0.3)' : 'rgba(255, 68, 68, 0.3)'};
          "
        >
          <div class="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-primary shadow-[0_0_10px_rgba(0,229,255,0.5)] animate-pulse"></div>
          
          <!-- Label - Always visible on mobile, hover on desktop -->
          <div class="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none transition-all duration-300 opacity-100 lg:opacity-0 lg:group-hover:opacity-100">
            <span class="px-2 py-1 rounded bg-surface-container-highest/80 backdrop-blur-sm text-[8px] font-bold text-on-surface border border-outline-variant/10 shadow-lg uppercase tracking-tighter">
              ${alt.label}
            </span>
          </div>
        </div>
      </div>
    `;
  }

  private renderPulseCard(alt: Alternative): string {
    const viability = store.getViability(alt);
    const isLowViability = viability < 0.3;
    const project = store.getProject();
    const costPercent = (alt.cost / project.budget) * 100;

    return `
      <div class="p-5 rounded-2xl bg-surface-container-low border border-outline-variant/5 hover:bg-surface-container transition-all cursor-pointer group">
        <div class="flex items-center justify-between mb-3">
          <h4 class="text-xs lg:text-sm font-bold text-on-surface group-hover:text-primary transition-colors truncate pr-2">${alt.label}</h4>
          <span class="label-sm text-[9px] lg:text-[10px] ${viability > 0.5 ? 'text-primary' : 'text-error'} font-bold">${(viability * 100).toFixed(0)}% VIABLE</span>
        </div>
        <div class="space-y-2">
          <div class="flex items-center justify-between text-[9px] label-sm text-on-surface-variant/60">
            <span>Budget Consumption</span>
            <span class="${costPercent > 80 ? 'text-error font-bold' : ''}">${costPercent.toFixed(1)}%</span>
          </div>
          <div class="h-1 w-full bg-surface-container rounded-full overflow-hidden">
            <div class="h-full rounded-full transition-all duration-1000 ${costPercent > 80 ? 'bg-error' : 'bg-primary'}" style="width: ${costPercent}%"></div>
          </div>
          ${isLowViability ? `
            <div class="mt-3 p-2 rounded-lg bg-error/5 border border-error/10 flex items-start gap-2">
              <span class="material-symbols-outlined text-error text-[14px]">warning</span>
              <p class="text-[9px] text-error/80 leading-tight">Critical Friction detected.</p>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  public toggleLens(active: boolean) {
    this.useUtilityDensity = active;
    this.update();
  }
}

customElements.define('vantage-view', VantageView);

