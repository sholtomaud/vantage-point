import { BobaElement } from './BobaElement';
import { store } from '../store/DecisionStore';

export class AppShell extends BobaElement {
  private currentView: string = 'loom';
  private isMobileMenuOpen: boolean = false;

  constructor() {
    super();
    this.addEventListener('navigate', (e: any) => {
      this.currentView = e.detail.view;
      this.isMobileMenuOpen = false;
      this.update();
    });
    store.addEventListener('change', () => this.update());
  }

  protected render(): string {
    return `
      <div class="flex h-screen w-screen bg-surface text-on-surface overflow-hidden font-sans relative">
        <!-- Mobile Drawer Overlay -->
        <div 
          class="fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 ${this.isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} lg:hidden"
          onclick="this.closest('app-shell').toggleMobileMenu()"
        ></div>

        <!-- Sidebar / Drawer -->
        <aside 
          class="fixed inset-y-0 left-0 w-72 bg-surface-container-low z-50 transform transition-transform duration-300 lg:relative lg:translate-x-0 lg:w-64 flex flex-col ${this.isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}"
        >
          <div class="p-6 lg:p-8 flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div class="w-8 h-8 rounded-lg btn-primary flex items-center justify-center shadow-lg">
                <span class="material-symbols-outlined text-surface text-xl">insights</span>
              </div>
              <h1 class="font-display text-lg font-bold tracking-tight text-on-surface">VANTAGE POINT</h1>
            </div>
            <button class="lg:hidden p-2 text-on-surface-variant" onclick="this.closest('app-shell').toggleMobileMenu()">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <nav class="flex-1 px-4 space-y-1 mt-4 lg:mt-8 overflow-y-auto">
            <div class="label-sm text-on-surface-variant/40 px-4 mb-2 uppercase tracking-widest text-[10px]">Analysis</div>
            ${this.renderNavItem('loom', 'forum', 'Loom', 'Conversation')}
            ${this.renderNavItem('nexus', 'compare_arrows', 'Nexus', 'Comparison')}
            ${this.renderNavItem('vantage', 'view_quilt', 'Vantage', 'Analysis')}
            ${this.renderNavItem('quadrant', 'grid_view', 'Quadrant', 'Mapping')}
            ${this.renderNavItem('simulator', 'science', 'Simulator', 'Scenario')}
            ${this.renderNavItem('frontier', 'show_chart', 'Frontier', 'Pareto')}
            
            <div class="pt-6 mt-6 border-t border-outline-variant/10">
              <div class="label-sm text-on-surface-variant/40 px-4 mb-2 uppercase tracking-widest text-[10px]">History</div>
              ${this.renderNavItem('history', 'history', 'Assessments', 'Past Decisions')}
            </div>

            <div class="pt-6 mt-6 border-t border-outline-variant/10">
              <div class="label-sm text-on-surface-variant/40 px-4 mb-2 uppercase tracking-widest text-[10px]">Config</div>
              ${this.renderNavItem('constraints', 'settings_input_component', 'Intake', 'Setup')}
            </div>
          </nav>

          <div class="p-6 bg-surface-container-lowest/50">
            <div class="flex items-center gap-4 p-3 rounded-xl hover:bg-surface-bright transition-calm cursor-pointer">
              <div class="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center overflow-hidden">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Avatar" class="w-full h-full object-cover">
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium truncate">Sholto Maud</p>
                <p class="text-xs text-on-surface-variant truncate">Strategic Lead</p>
              </div>
            </div>
          </div>
        </aside>

        <!-- Main Content -->
        <main class="flex-1 flex flex-col relative overflow-hidden bg-surface">
          <!-- Top Bar -->
          <header class="h-16 lg:h-20 flex items-center justify-between px-4 lg:px-10 bg-surface/80 backdrop-blur-md z-30 border-b border-outline-variant/5">
            <div class="flex items-center gap-4">
              <button class="lg:hidden p-2 -ml-2 text-on-surface-variant" onclick="this.closest('app-shell').toggleMobileMenu()">
                <span class="material-symbols-outlined">menu</span>
              </button>
              <div class="flex items-center gap-3 text-on-surface-variant text-[10px] lg:text-xs label-sm">
                <span class="hidden sm:inline">Workspace</span>
                <span class="hidden sm:inline material-symbols-outlined text-xs opacity-30">chevron_right</span>
                <span class="text-on-surface font-bold uppercase tracking-widest">${this.currentView}</span>
              </div>
            </div>
            
            <div class="flex items-center gap-2 lg:gap-8">
              <div class="hidden md:flex items-center gap-3 px-4 py-2 rounded-full bg-surface-container-low text-[10px] label-sm text-on-surface-variant">
                <span class="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                AI Engine: Gemini 3.1 Pro
              </div>
              <div class="flex items-center gap-2 lg:gap-4">
                <button class="p-2 rounded-lg hover:bg-surface-container text-on-surface-variant transition-calm">
                  <span class="material-symbols-outlined text-xl lg:text-2xl">notifications</span>
                </button>
                <div class="hidden sm:block h-6 w-[1px] bg-outline-variant/10 mx-2"></div>
                <button 
                  class="px-4 lg:px-6 py-2 lg:py-2.5 rounded-lg btn-primary text-[10px] lg:text-xs font-bold label-sm whitespace-nowrap"
                  onclick="this.closest('app-shell').createNewAssessment()"
                >
                  NEW ASSESSMENT
                </button>
              </div>
            </div>
          </header>

          <!-- View Container -->
          <div class="flex-1 overflow-auto bg-surface relative">
            ${this.renderView()}
          </div>
        </main>
      </div>
    `;
  }

  private renderNavItem(id: string, icon: string, label: string, sub: string): string {
    const isActive = this.currentView === id;
    return `
      <div 
        class="group relative flex items-center gap-4 p-4 cursor-pointer transition-calm rounded-xl ${isActive ? 'bg-primary/10 text-primary' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/50'}"
        onclick="this.closest('app-shell').dispatchEvent(new CustomEvent('navigate', {detail: {view: '${id}'}}))"
      >
        <span class="material-symbols-outlined ${isActive ? 'font-bold' : ''}">${icon}</span>
        <div class="flex-1">
          <p class="text-sm font-bold leading-none">${label}</p>
          <p class="text-[9px] opacity-40 mt-1 label-sm uppercase tracking-tighter">${sub}</p>
        </div>
        ${isActive ? '<div class="w-1.5 h-1.5 rounded-full bg-primary"></div>' : ''}
      </div>
    `;
  }

  private renderView(): string {
    switch (this.currentView) {
      case 'loom': return '<loom-view></loom-view>';
      case 'nexus': return '<nexus-view></nexus-view>';
      case 'vantage': return '<vantage-view></vantage-view>';
      case 'quadrant': return '<quadrant-view></quadrant-view>';
      case 'simulator': return '<simulator-view></simulator-view>';
      case 'frontier': return '<frontier-view></frontier-view>';
      case 'constraints': return '<constraint-intake-view></constraint-intake-view>';
      case 'history': return '<history-view></history-view>';
      default: return '<loom-view></loom-view>';
    }
  }

  public toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    this.update();
  }

  public createNewAssessment() {
    store.createNewProject();
    this.currentView = 'loom';
    this.isMobileMenuOpen = false;
    this.update();
  }
}

customElements.define('app-shell', AppShell);
