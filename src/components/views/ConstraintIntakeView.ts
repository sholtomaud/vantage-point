import { BobaElement } from '../BobaElement';

export class ConstraintIntakeView extends BobaElement {
  protected render(): string {
    return `
      <div class="flex h-full w-full bg-surface animate-fade-in flex-col overflow-hidden">
        <!-- Header -->
        <div class="p-8 flex items-center justify-between bg-surface-container-low">
          <div class="flex items-center gap-6">
            <div class="w-12 h-12 rounded-2xl bg-surface-container flex items-center justify-center">
              <span class="material-symbols-outlined text-white/40 text-2xl">settings_input_component</span>
            </div>
            <div>
              <h2 class="font-display text-2xl font-medium tracking-tight text-white">Constraint Intake</h2>
              <p class="label-sm text-white/40 mt-1">Strategic Setup: New Project Initialization</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <button class="btn-primary">
              INITIALIZE PROJECT
            </button>
          </div>
        </div>

        <!-- Intake Form -->
        <div class="flex-1 p-8 overflow-auto">
          <div class="max-w-4xl mx-auto space-y-12">
            <!-- Section 1: Core Parameters -->
            <section class="space-y-6">
              <h3 class="label-sm text-white/40">Core Strategic Parameters</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="space-y-2">
                  <label class="label-sm text-white/40">Project Name</label>
                  <input type="text" class="w-full bg-surface-container-low border-none rounded-xl p-4 text-sm text-white focus:ring-1 focus:ring-primary/20 transition-all" placeholder="e.g. APAC Expansion 2026">
                </div>
                <div class="space-y-2">
                  <label class="label-sm text-white/40">Strategic Horizon</label>
                  <select class="w-full bg-surface-container-low border-none rounded-xl p-4 text-sm text-white focus:ring-1 focus:ring-primary/20 transition-all appearance-none">
                    <option>12 Months</option>
                    <option>24 Months</option>
                    <option>36 Months</option>
                    <option>60 Months</option>
                  </select>
                </div>
              </div>
            </section>

            <!-- Section 2: Budget & Resources -->
            <section class="space-y-6">
              <h3 class="label-sm text-white/40">Budget & Resource Constraints</h3>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div class="space-y-2">
                  <label class="label-sm text-white/40">Total Budget Cap</label>
                  <div class="relative">
                    <span class="absolute left-4 top-1/2 -translate-y-1/2 text-white/20">$</span>
                    <input type="number" class="w-full bg-surface-container-low border-none rounded-xl p-4 pl-8 text-sm text-white focus:ring-1 focus:ring-primary/20 transition-all" placeholder="15,000,000">
                  </div>
                </div>
                <div class="space-y-2">
                  <label class="label-sm text-white/40">Max Risk Tolerance</label>
                  <div class="relative h-1.5 w-full bg-surface-container-low rounded-full overflow-hidden mt-6">
                    <div class="h-full rounded-full bg-primary" style="width: 50%"></div>
                    <input type="range" class="absolute inset-0 opacity-0 cursor-pointer">
                  </div>
                </div>
                <div class="space-y-2">
                  <label class="label-sm text-white/40">Resource Allocation</label>
                  <div class="flex items-center gap-2 mt-4">
                    <div class="flex-1 h-2 bg-surface-container-low rounded-full overflow-hidden flex">
                      <div class="h-full bg-primary" style="width: 40%"></div>
                      <div class="h-full bg-tertiary" style="width: 30%"></div>
                      <div class="h-full bg-secondary" style="width: 30%"></div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <!-- Section 3: Vector Selection -->
            <section class="space-y-6">
              <h3 class="label-sm text-white/40">Primary Success Vectors</h3>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                ${this.renderVectorToggle('Market Share', true)}
                ${this.renderVectorToggle('Innovation Velocity', true)}
                ${this.renderVectorToggle('Operational Efficiency', false)}
                ${this.renderVectorToggle('Customer LTV', true)}
                ${this.renderVectorToggle('Brand Equity', false)}
                ${this.renderVectorToggle('Risk Mitigation', true)}
                ${this.renderVectorToggle('Talent Retention', false)}
                ${this.renderVectorToggle('EBITDA Margin', true)}
              </div>
            </section>
          </div>
        </div>
      </div>
    `;
  }

  private renderVectorToggle(label: string, active: boolean): string {
    return `
      <div class="p-4 rounded-xl ${active ? 'bg-primary/10 text-primary' : 'bg-surface-container-low text-white/40'} flex items-center justify-between cursor-pointer hover:bg-surface-container transition-all">
        <span class="label-sm">${label}</span>
        <span class="material-symbols-outlined text-sm">${active ? 'check_circle' : 'add_circle'}</span>
      </div>
    `;
  }
}

customElements.define('constraint-intake-view', ConstraintIntakeView);
