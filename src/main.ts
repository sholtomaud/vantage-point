import './components/AppShell';
import './components/views/LoomView';
import './components/views/NexusView';
import './components/views/VantageView';
import './components/views/DecisionQuadrantView';
import './components/views/ScenarioSimulatorView';
import './components/views/ValueFrontierView';
import './components/views/ConstraintIntakeView';
import './components/views/HistoryView';
import './index.css';

const app = document.getElementById('app');
if (app) {
  app.innerHTML = `<app-shell></app-shell>`;
}
