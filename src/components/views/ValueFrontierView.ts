import { BobaElement } from '../BobaElement';
import { store, Alternative } from '../../store/DecisionStore';

export class ValueFrontierView extends BobaElement {
  constructor() {
    super();
    store.addEventListener('change', () => this.update());
  }

  protected render(): string {
    const project = store.getProject();
    const alternatives = [...project.alternatives].sort((a, b) => a.cost - b.cost);

    return `
      <div class="flex h-full w-full bg-surface animate-fade-in flex-col overflow-hidden">
        <!-- Header -->
        <div class="px-4 py-3 lg:px-8 lg:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-container-low border-b border-outline-variant/5">
          <div class="flex items-center gap-4 lg:gap-6">
            <div class="w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl bg-surface-container flex items-center justify-center">
              <span class="material-symbols-outlined text-tertiary text-xl lg:text-2xl">insights</span>
            </div>
            <div>
              <h2 class="font-display text-xl lg:text-2xl font-medium tracking-tight text-on-surface">Value Frontier</h2>
              <p class="label-sm text-on-surface-variant mt-1 uppercase tracking-widest text-[9px] lg:text-[10px]">Efficiency Curve: Merit vs. Cost</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <button class="px-4 py-2 rounded-lg btn-primary text-[10px] label-sm font-bold">
              EXPORT
            </button>
          </div>
        </div>

        <!-- Frontier Visualization -->
        <div class="flex-1 p-4 lg:p-8 overflow-auto flex flex-col gap-6 lg:gap-8">
          <div class="flex-1 bg-surface-container-lowest rounded-2xl lg:rounded-3xl p-8 lg:p-12 relative border border-outline-variant/5 shadow-2xl overflow-hidden min-h-[300px] lg:min-h-0">
            <!-- Grid Lines -->
            <div class="absolute inset-0 p-8 lg:p-12 flex flex-col justify-between pointer-events-none">
              ${[0, 25, 50, 75, 100].map(v => `
                <div class="w-full h-[1px] bg-outline-variant/5 relative">
                  <span class="absolute -left-6 lg:-left-8 top-1/2 -translate-y-1/2 text-[8px] lg:text-[9px] text-on-surface-variant/20">${100 - v}%</span>
                </div>
              `).join('')}
            </div>

            <!-- SVG Frontier Line -->
            <svg class="absolute inset-0 w-full h-full p-8 lg:p-12 overflow-visible pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path 
                d="${this.calculateFrontierPath(alternatives)}" 
                fill="none" 
                stroke="var(--tertiary)" 
                stroke-width="0.5" 
                stroke-dasharray="2 2"
                class="opacity-30"
              />
              <path 
                d="${this.calculateFrontierPath(alternatives, true)}" 
                fill="url(#frontier-gradient)" 
                class="opacity-10"
              />
              <defs>
                <linearGradient id="frontier-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style="stop-color:var(--tertiary);stop-opacity:0.5" />
                  <stop offset="100%" style="stop-color:var(--tertiary);stop-opacity:0" />
                </linearGradient>
              </defs>
            </svg>

            <!-- Data Points -->
            <div class="absolute inset-0 p-8 lg:p-12">
              ${alternatives.map(alt => {
                const x = (alt.cost / project.budget) * 100;
                const y = (1 - alt.merit) * 100;
                return this.renderDataPoint(alt, x, y);
              }).join('')}
            </div>

            <!-- Axis Labels -->
            <div class="absolute bottom-2 lg:bottom-4 left-1/2 -translate-x-1/2 label-sm text-on-surface-variant/30 tracking-[0.3em] text-[8px] lg:text-[10px]">COST</div>
            <div class="absolute left-2 lg:left-4 top-1/2 -translate-y-1/2 -rotate-90 label-sm text-on-surface-variant/30 tracking-[0.3em] text-[8px] lg:text-[10px]">VALUE</div>
          </div>

          <!-- Analysis Summary -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8 mb-4">
            <div class="p-5 lg:p-6 rounded-2xl bg-surface-container-low border border-outline-variant/5">
              <p class="label-sm text-on-surface-variant/40 mb-2 uppercase tracking-widest text-[9px] lg:text-[10px]">Optimal Efficiency</p>
              <p class="text-xl lg:text-2xl font-display font-medium text-primary">Hybrid Pivot</p>
              <p class="text-[9px] lg:text-[10px] text-on-surface-variant/30 mt-2">Highest Merit-to-Cost ratio detected.</p>
            </div>
            <div class="p-5 lg:p-6 rounded-2xl bg-surface-container-low border border-outline-variant/5">
              <p class="label-sm text-on-surface-variant/40 mb-2 uppercase tracking-widest text-[9px] lg:text-[10px]">Diminishing Returns</p>
              <p class="text-xl lg:text-2xl font-display font-medium text-tertiary">Aggressive Exp.</p>
              <p class="text-[9px] lg:text-[10px] text-on-surface-variant/30 mt-2">Cost increases 2.4x for 15% merit gain.</p>
            </div>
            <div class="p-5 lg:p-6 rounded-2xl bg-surface-container-low border border-outline-variant/5 sm:col-span-2 lg:col-span-1">
              <p class="label-sm text-on-surface-variant/40 mb-2 uppercase tracking-widest text-[9px] lg:text-[10px]">Strategic Slack</p>
              <p class="text-xl lg:text-2xl font-display font-medium text-secondary">Defensive Cons.</p>
              <p class="text-[9px] lg:text-[10px] text-on-surface-variant/30 mt-2">Unutilized budget capacity: 68%</p>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private calculateFrontierPath(alternatives: Alternative[], closed: boolean = false): string {
    if (alternatives.length === 0) return '';
    const project = store.getProject();
    const points = alternatives.map(alt => ({
      x: (alt.cost / project.budget) * 100,
      y: (1 - alt.merit) * 100
    }));
    
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      path += ` L ${points[i].x} ${points[i].y}`;
    }
    
    if (closed) {
      const lastPoint = points[points.length - 1];
      const firstPoint = points[0];
      path += ` L ${lastPoint.x} 100 L ${firstPoint.x} 100 Z`;
    }
    
    return path;
  }

  private renderDataPoint(alt: Alternative, x: number, y: number): string {
    return `
      <div 
        class="absolute group cursor-pointer transition-all duration-500 hover:scale-125 z-10"
        style="left: ${x}%; top: ${y}%; transform: translate(-50%, -50%)"
      >
        <div class="w-3 h-3 lg:w-4 lg:h-4 rounded-full bg-surface border-2 border-tertiary shadow-[0_0_15px_rgba(212,255,0,0.3)]"></div>
        
        <!-- Tooltip - Always visible on mobile, hover on desktop -->
        <div class="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 transition-all duration-300 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 pointer-events-none">
          <div class="px-3 py-1.5 rounded-xl bg-surface-container-highest/90 backdrop-blur-xl border border-outline-variant/10 shadow-2xl whitespace-nowrap">
            <p class="text-[10px] font-bold text-on-surface mb-0.5 uppercase tracking-tighter">${alt.label}</p>
            <div class="flex items-center gap-2">
              <span class="text-[8px] label-sm text-on-surface-variant/60">M: ${(alt.merit * 100).toFixed(0)}%</span>
              <span class="text-[8px] label-sm text-on-surface-variant/60">C: $${(alt.cost / 1000000).toFixed(1)}M</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('frontier-view', ValueFrontierView);

