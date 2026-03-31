import { BobaElement } from '../BobaElement';
import { store, DecisionProject, Criterion, Alternative } from '../../store/DecisionStore';

export class AHPWizardView extends BobaElement {
  private step: 'criteria' | 'alternatives' = 'criteria';
  private currentCriterionIndex: number = 0; // For alternative comparisons

  constructor() {
    super();
    store.addEventListener('change', () => this.update());
  }

  protected render(): string {
    const project = store.getProject();
    if (!project || project.criteria.length < 2 || project.alternatives.length < 2) {
      return `<div class="p-10 text-on-surface-variant italic">Waiting for decision structure discovery in Loom...</div>`;
    }

    return `
      <div class="flex h-full w-full bg-surface animate-fade-in flex-col overflow-hidden">
        <!-- Header -->
        <div class="p-4 lg:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-container-low border-b border-outline-variant/5">
          <div class="flex items-center gap-4 lg:gap-6">
            <div class="w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl bg-surface-container flex items-center justify-center">
              <span class="material-symbols-outlined text-primary text-xl lg:text-2xl">balance</span>
            </div>
            <div>
              <h2 class="font-display text-xl lg:text-2xl font-medium tracking-tight text-on-surface">AHP Pairwise Wizard</h2>
              <p class="label-sm text-on-surface-variant mt-1 uppercase tracking-widest text-[9px] lg:text-[10px]">Deterministic Evaluation</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button
              class="px-4 py-2 rounded-lg ${this.step === 'criteria' ? 'btn-primary' : 'bg-surface-container text-on-surface-variant'} text-[10px] label-sm font-bold"
              onclick="this.closest('ahp-wizard-view').setStep('criteria')"
            >
              CRITERIA
            </button>
            <button
              class="px-4 py-2 rounded-lg ${this.step === 'alternatives' ? 'btn-primary' : 'bg-surface-container text-on-surface-variant'} text-[10px] label-sm font-bold"
              onclick="this.closest('ahp-wizard-view').setStep('alternatives')"
            >
              ALTERNATIVES
            </button>
          </div>
        </div>

        <div class="flex-1 p-4 lg:p-8 overflow-y-auto">
          <div class="max-w-4xl mx-auto space-y-12">
            ${this.step === 'criteria' ? this.renderCriteriaComparisons(project) : this.renderAlternativesComparisons(project)}
          </div>
        </div>

        <!-- Results Preview -->
        <div class="p-6 bg-surface-container-low border-t border-outline-variant/5">
           <div class="max-w-4xl mx-auto">
             <h3 class="label-sm text-on-surface-variant/40 mb-4 uppercase tracking-widest text-[10px]">Current Priority Vectors (OVP)</h3>
             <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                ${project.alternatives.map(alt => `
                  <div class="p-3 rounded-xl bg-surface-container/50 border border-outline-variant/5">
                    <p class="text-[9px] label-sm text-on-surface-variant opacity-50 uppercase tracking-tighter">${alt.label}</p>
                    <p class="text-sm font-bold text-primary">${(alt.merit * 100).toFixed(1)}%</p>
                  </div>
                `).join('')}
             </div>
           </div>
        </div>
      </div>
    `;
  }

  private renderCriteriaComparisons(project: DecisionProject): string {
    const pairs = this.getPairs(project.criteria);
    return `
      <div class="space-y-8">
        <div class="text-center">
          <h3 class="text-lg font-bold text-on-surface">Relative Importance of Criteria</h3>
          <p class="text-sm text-on-surface-variant italic">Compare which criterion is more important for the overall goal.</p>
        </div>
        <div class="space-y-6">
          ${pairs.map(pair => this.renderComparisonSlider('criteria', pair[0], pair[1], project.criteriaMatrix[pair[0].id][pair[1].id])).join('')}
        </div>
      </div>
    `;
  }

  private renderAlternativesComparisons(project: DecisionProject): string {
    const criterion = project.criteria[this.currentCriterionIndex];
    const pairs = this.getPairs(project.alternatives);
    return `
      <div class="space-y-8">
        <div class="flex items-center justify-between">
          <button
            class="p-2 rounded-lg bg-surface-container text-on-surface-variant disabled:opacity-20"
            ${this.currentCriterionIndex === 0 ? 'disabled' : ''}
            onclick="this.closest('ahp-wizard-view').changeCriterion(-1)"
          >
            <span class="material-symbols-outlined">chevron_left</span>
          </button>
          <div class="text-center">
            <h3 class="text-lg font-bold text-on-surface">Alternatives Comparison for "${criterion.label}"</h3>
            <p class="text-sm text-on-surface-variant italic">Which option performs better with respect to ${criterion.label}?</p>
          </div>
          <button
            class="p-2 rounded-lg bg-surface-container text-on-surface-variant disabled:opacity-20"
            ${this.currentCriterionIndex === project.criteria.length - 1 ? 'disabled' : ''}
            onclick="this.closest('ahp-wizard-view').changeCriterion(1)"
          >
            <span class="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
        <div class="space-y-6">
          ${pairs.map(pair => this.renderComparisonSlider('alternatives', pair[0], pair[1], project.alternativesMatrices[criterion.id][pair[0].id], criterion.id)).join('')}
        </div>
      </div>
    `;
  }

  private renderComparisonSlider(type: 'criteria' | 'alternatives', item1: any, item2: any, value: number, criterionId?: string): string {
    // value is on AHP scale 1/9 to 9. We need to map it to a slider -8 to 8
    let sliderValue = 0;
    if (value >= 1) {
      sliderValue = value - 1;
    } else {
      sliderValue = -(1/value - 1);
    }

    const ahpValues = [9, 8, 7, 6, 5, 4, 3, 2, 1, 2, 3, 4, 5, 6, 7, 8, 9];

    return `
      <div class="p-6 rounded-2xl bg-surface-container border border-outline-variant/5 space-y-6">
        <div class="flex items-center justify-between gap-4">
          <div class="flex-1 text-right">
            <p class="text-sm font-bold ${sliderValue < 0 ? 'text-primary' : 'text-on-surface'}">${item1.label || item1.name}</p>
          </div>
          <div class="px-3 py-1 rounded bg-surface-container-high text-[10px] font-mono font-bold text-on-surface">
            ${Math.abs(sliderValue) + 1}
          </div>
          <div class="flex-1 text-left">
            <p class="text-sm font-bold ${sliderValue > 0 ? 'text-primary' : 'text-on-surface'}">${item2.label || item2.name}</p>
          </div>
        </div>
        <input
          type="range"
          min="-8"
          max="8"
          step="1"
          value="${sliderValue}"
          class="w-full h-2 bg-surface-container-highest rounded-full appearance-none cursor-pointer accent-primary"
          oninput="this.closest('ahp-wizard-view').handleSliderInput('${type}', '${item1.id}', '${item2.id}', this.value, '${criterionId || ''}')"
        >
        <div class="flex justify-between text-[8px] text-on-surface-variant/40 label-sm uppercase tracking-widest">
          <span>Extreme Preference</span>
          <span>Equal Importance</span>
          <span>Extreme Preference</span>
        </div>
      </div>
    `;
  }

  private getPairs(items: any[]): any[][] {
    const pairs = [];
    for (let i = 0; i < items.length; i++) {
      for (let j = i + 1; j < items.length; j++) {
        pairs.push([items[i], items[j]]);
      }
    }
    return pairs;
  }

  public setStep(step: 'criteria' | 'alternatives') {
    this.step = step;
    this.update();
  }

  public changeCriterion(delta: number) {
    const project = store.getProject();
    this.currentCriterionIndex = Math.max(0, Math.min(project.criteria.length - 1, this.currentCriterionIndex + delta));
    this.update();
  }

  public handleSliderInput(type: 'criteria' | 'alternatives', id1: string, id2: string, sliderValue: string, criterionId: string) {
    const sVal = parseInt(sliderValue);
    let ahpVal = 1;
    if (sVal >= 0) {
      ahpVal = sVal + 1;
    } else {
      ahpVal = 1 / (Math.abs(sVal) + 1);
    }
    store.updatePairwiseComparison(type as any, id1, id2, ahpVal, criterionId || undefined);
  }
}

customElements.define('ahp-wizard-view', AHPWizardView);
