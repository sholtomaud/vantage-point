import { BobaElement } from '../BobaElement';
import { store } from '../../store/DecisionStore';

export class HistoryView extends BobaElement {
  constructor() {
    super();
    store.addEventListener('change', () => this.update());
  }

  protected render(): string {
    const assessments = store.getAssessments();
    const currentProject = store.getProject();

    return `
      <div class="p-4 lg:p-10 max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <header class="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 class="font-display text-3xl lg:text-4xl font-bold tracking-tight text-on-surface">Assessment History</h2>
            <p class="text-on-surface-variant mt-2 max-w-md">Review and manage your strategic decision archives. All data is stored locally on this device.</p>
          </div>
          <button 
            class="px-6 py-3 rounded-xl btn-primary text-xs font-bold label-sm flex items-center gap-2 shadow-xl shadow-primary/20"
            onclick="this.closest('history-view').createNew()"
          >
            <span class="material-symbols-outlined text-sm">add</span>
            NEW ASSESSMENT
          </button>
        </header>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          ${assessments.map(project => this.renderProjectCard(project, project.id === currentProject.id)).join('')}
        </div>

        ${assessments.length === 0 ? `
          <div class="flex flex-col items-center justify-center py-20 text-center space-y-4 opacity-40">
            <span class="material-symbols-outlined text-6xl">folder_open</span>
            <p class="font-display text-xl">No assessments found</p>
            <p class="text-sm max-w-xs">Start a new conversation or manual intake to begin your first strategic analysis.</p>
          </div>
        ` : ''}
      </div>
    `;
  }

  private renderProjectCard(project: any, isActive: boolean): string {
    const date = new Date(project.createdAt).toLocaleDateString(undefined, { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });

    return `
      <div 
        class="group relative p-6 rounded-2xl border transition-calm cursor-pointer overflow-hidden ${isActive ? 'bg-primary/5 border-primary shadow-lg shadow-primary/5' : 'bg-surface-container-low border-outline-variant/10 hover:border-primary/40'}"
        onclick="this.closest('history-view').selectProject('${project.id}')"
      >
        ${isActive ? '<div class="absolute top-0 right-0 p-2"><span class="material-symbols-outlined text-primary text-sm">check_circle</span></div>' : ''}
        
        <div class="space-y-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-on-surface-variant group-hover:text-primary transition-colors">
              <span class="material-symbols-outlined">description</span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-xs text-on-surface-variant/60 label-sm uppercase tracking-widest">${date}</p>
              <h3 class="font-bold text-on-surface truncate group-hover:text-primary transition-colors">${project.goal}</h3>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4 pt-4 border-t border-outline-variant/5">
            <div>
              <p class="text-[10px] text-on-surface-variant/40 label-sm uppercase">Alternatives</p>
              <p class="text-sm font-mono font-bold">${project.alternatives.length}</p>
            </div>
            <div>
              <p class="text-[10px] text-on-surface-variant/40 label-sm uppercase">Budget</p>
              <p class="text-sm font-mono font-bold">$${(project.budget / 1000000).toFixed(1)}M</p>
            </div>
          </div>

          <div class="flex items-center justify-between pt-2">
             <button 
              class="p-2 rounded-lg hover:bg-destructive/10 text-on-surface-variant hover:text-destructive transition-calm"
              onclick="event.stopPropagation(); this.closest('history-view').deleteProject('${project.id}')"
            >
              <span class="material-symbols-outlined text-lg">delete</span>
            </button>
            <div class="flex items-center gap-1 text-[10px] font-bold label-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity">
              OPEN <span class="material-symbols-outlined text-xs">arrow_forward</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private selectProject(id: string) {
    store.selectProject(id);
    this.dispatchEvent(new CustomEvent('navigate', { 
      detail: { view: 'vantage' },
      bubbles: true,
      composed: true
    }));
  }

  private createNew() {
    store.createNewProject();
    this.dispatchEvent(new CustomEvent('navigate', { 
      detail: { view: 'loom' },
      bubbles: true,
      composed: true
    }));
  }

  private deleteProject(id: string) {
    if (confirm('Are you sure you want to delete this assessment? This action cannot be undone.')) {
      store.deleteProject(id);
    }
  }
}

customElements.define('history-view', HistoryView);
