
export interface Criterion {
  id: string;
  label: string;
  weight: number;
}

export interface Alternative {
  id: string;
  label: string;
  cost: number;
  time: number;
  risk: number;
  merit: number; // OVP (0-1)
}

export interface DecisionProject {
  id: string;
  goal: string;
  criteria: Criterion[];
  alternatives: Alternative[];
  budget: number;
  timeHorizon: number;
  riskTolerance: number;
  createdAt: number;
}

class DecisionStore extends EventTarget {
  private assessments: DecisionProject[] = [];
  private currentProjectId: string | null = null;

  private generateId(): string {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return Math.random().toString(36).substring(2, 11);
  }

  constructor() {
    super();
    this.loadFromStorage();
    if (this.assessments.length === 0) {
      this.createInitialProject();
    } else {
      this.currentProjectId = this.assessments[0].id;
    }
  }

  private createInitialProject() {
    const initial: DecisionProject = {
      id: this.generateId(),
      goal: 'APAC Market Expansion 2026',
      criteria: [
        { id: 'c1', label: 'Market Share', weight: 0.4 },
        { id: 'c2', label: 'Innovation Velocity', weight: 0.3 },
        { id: 'c3', label: 'Operational Efficiency', weight: 0.2 },
        { id: 'c4', label: 'Customer LTV', weight: 0.1 },
      ],
      alternatives: [
        { id: 'a1', label: 'Direct Subsidiary', cost: 12000000, time: 24, risk: 0.7, merit: 0.85 },
        { id: 'a2', label: 'Joint Venture', cost: 5000000, time: 12, risk: 0.4, merit: 0.65 },
        { id: 'a3', label: 'Licensing Model', cost: 1000000, time: 6, risk: 0.2, merit: 0.45 },
        { id: 'a4', label: 'Acquisition', cost: 25000000, time: 18, risk: 0.9, merit: 0.95 },
      ],
      budget: 15000000,
      timeHorizon: 24,
      riskTolerance: 0.6,
      createdAt: Date.now(),
    };
    this.assessments = [initial];
    this.currentProjectId = initial.id;
    this.saveToStorage();
  }

  private loadFromStorage() {
    const stored = localStorage.getItem('vantage_point_assessments');
    if (stored) {
      try {
        this.assessments = JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse assessments from storage', e);
        this.assessments = [];
      }
    }
  }

  private saveToStorage() {
    localStorage.setItem('vantage_point_assessments', JSON.stringify(this.assessments));
  }

  getProject(): DecisionProject {
    return this.assessments.find(p => p.id === this.currentProjectId) || this.assessments[0];
  }

  getAssessments(): DecisionProject[] {
    return [...this.assessments].sort((a, b) => b.createdAt - a.createdAt);
  }

  selectProject(id: string) {
    this.currentProjectId = id;
    this.dispatchEvent(new CustomEvent('change', { detail: this.getProject() }));
  }

  createNewProject(goal: string = 'New Strategic Decision') {
    const newProject: DecisionProject = {
      id: this.generateId(),
      goal,
      criteria: [],
      alternatives: [],
      budget: 10000000,
      timeHorizon: 12,
      riskTolerance: 0.5,
      createdAt: Date.now(),
    };
    this.assessments.unshift(newProject);
    this.currentProjectId = newProject.id;
    this.saveToStorage();
    this.dispatchEvent(new CustomEvent('change', { detail: newProject }));
  }

  updateProject(updates: Partial<DecisionProject>) {
    const index = this.assessments.findIndex(p => p.id === this.currentProjectId);
    if (index !== -1) {
      this.assessments[index] = { ...this.assessments[index], ...updates };
      this.saveToStorage();
      this.dispatchEvent(new CustomEvent('change', { detail: this.assessments[index] }));
    }
  }

  deleteProject(id: string) {
    this.assessments = this.assessments.filter(p => p.id !== id);
    if (this.currentProjectId === id) {
      this.currentProjectId = this.assessments.length > 0 ? this.assessments[0].id : null;
      if (!this.currentProjectId) {
        this.createInitialProject();
      }
    }
    this.saveToStorage();
    this.dispatchEvent(new CustomEvent('change'));
  }

  getViability(alt: Alternative): number {
    const project = this.getProject();
    if (alt.cost >= project.budget) return 0;
    return 1 - (alt.cost / project.budget);
  }

  getUtilityDensity(alt: Alternative): number {
    return alt.merit / (alt.cost / 1000000); // Merit per $1M
  }
}

export const store = new DecisionStore();
