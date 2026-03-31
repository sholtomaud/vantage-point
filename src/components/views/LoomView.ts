import { BobaElement } from '../BobaElement';
import { store } from '../../store/DecisionStore';
import { geminiService } from '../../services/GeminiService';

interface Message {
  role: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export class LoomView extends BobaElement {
  private messages: Message[] = [
    {
      role: 'ai',
      text: 'Welcome to Vantage Point. I am your Strategic Loom. What complex decision are we framing today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ];
  private isTyping = false;

  constructor() {
    super();
    store.addEventListener('change', () => this.update());
  }

  protected render(): string {
    const project = store.getProject();

    return `
      <div class="flex h-full w-full bg-surface transition-calm overflow-hidden">
        <!-- Chat Area -->
        <div class="flex-1 flex flex-col relative min-w-0">
          <!-- Chat Header -->
          <div class="px-4 lg:px-10 py-4 lg:py-8 flex items-center justify-between border-b border-outline-variant/5 bg-surface-container-low/50 backdrop-blur-md sticky top-0 z-10">
            <div class="flex items-center gap-3 lg:gap-6">
              <div class="w-8 h-8 lg:w-10 lg:h-10 rounded-lg bg-surface-container flex items-center justify-center">
                <span class="material-symbols-outlined text-primary text-xl">forum</span>
              </div>
              <div class="min-w-0">
                <h2 class="font-display text-base lg:text-xl font-bold text-on-surface truncate">Strategic Loom</h2>
                <p class="text-[9px] lg:text-[10px] text-on-surface-variant label-sm opacity-50 mt-0.5 truncate uppercase tracking-widest">${project.goal || 'New Strategic Decision'}</p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <button class="p-2 rounded-lg bg-surface-container text-on-surface-variant hover:text-on-surface transition-calm lg:hidden">
                <span class="material-symbols-outlined text-xl">info</span>
              </button>
              <button class="hidden sm:block px-3 lg:px-4 py-1.5 lg:py-2 rounded-lg bg-surface-container text-[9px] lg:text-[10px] label-sm text-on-surface-variant hover:text-on-surface transition-calm">EXPORT</button>
              <button 
                class="px-3 lg:px-4 py-1.5 lg:py-2 rounded-lg bg-surface-container-high text-[9px] lg:text-[10px] label-sm text-on-surface hover:bg-surface-bright transition-calm"
                onclick="this.closest('loom-view').newThread()"
              >
                NEW
              </button>
            </div>
          </div>

          <!-- Messages -->
          <div id="message-container" class="flex-1 overflow-y-auto px-4 lg:px-10 space-y-8 lg:space-y-12 py-8 lg:py-12">
            ${this.messages.map(msg => this.renderMessage(msg)).join('')}
            ${this.isTyping ? `
              <div class="flex items-start gap-4 lg:gap-6 max-w-3xl animate-pulse">
                <div class="w-8 h-8 lg:w-9 lg:h-9 rounded-full btn-primary flex-shrink-0 flex items-center justify-center overflow-hidden shadow-lg">
                  <span class="material-symbols-outlined text-surface text-sm font-bold">bolt</span>
                </div>
                <div class="flex-1 space-y-2 lg:space-y-3">
                  <div class="flex items-center gap-3">
                    <span class="text-[10px] lg:text-xs font-bold text-on-surface uppercase tracking-widest">Vantage AI</span>
                  </div>
                  <div class="p-5 lg:p-8 rounded-2xl rounded-tl-none glass-chat-ai text-on-surface shadow-2xl border border-white/5 text-sm italic opacity-50">
                    Synthesizing strategic vectors...
                  </div>
                </div>
              </div>
            ` : ''}
          </div>

          <!-- Input Area -->
          <div class="p-4 lg:p-10 bg-surface/90 backdrop-blur-xl border-t border-outline-variant/5">
            <div class="max-w-4xl mx-auto relative group">
              <textarea 
                id="chat-input"
                class="w-full bg-surface-container-lowest border border-outline-variant/10 rounded-xl lg:rounded-2xl p-4 lg:p-6 pr-16 lg:pr-32 text-sm text-on-surface placeholder:text-on-surface-variant/30 focus:outline-none focus:border-primary/30 transition-all resize-none h-20 lg:h-28 shadow-inner"
                placeholder="Ask Vantage AI to analyze or simulate..."
                onkeydown="if(event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); this.closest('loom-view').sendMessage(); }"
              ></textarea>
              <div class="absolute bottom-3 lg:bottom-6 right-3 lg:right-6 flex items-center gap-2 lg:gap-3">
                <button class="hidden sm:flex p-2 rounded-lg hover:bg-surface-container text-on-surface-variant transition-calm">
                  <span class="material-symbols-outlined text-xl">attach_file</span>
                </button>
                <button 
                  class="w-10 h-10 lg:w-12 lg:h-12 rounded-lg lg:rounded-xl btn-primary flex items-center justify-center shadow-xl shadow-primary/20 active:scale-95 transition-transform"
                  onclick="this.closest('loom-view').sendMessage()"
                >
                  <span class="material-symbols-outlined font-bold">send</span>
                </button>
              </div>
            </div>
            <div class="mt-4 lg:mt-6 flex items-center justify-center gap-6 lg:gap-10 text-[8px] lg:text-[9px] text-on-surface-variant/20 label-sm uppercase tracking-widest">
              <span>Vector Analysis</span>
              <span>Scenario Simulation</span>
              <span>Nexus Comparison</span>
            </div>
          </div>
        </div>

        <!-- Sidebar Info -->
        <div class="w-80 lg:w-96 hidden xl:flex flex-col bg-surface-container-low border-l border-outline-variant/5">
          <div class="p-8 lg:p-10">
            <h3 class="text-[10px] label-sm text-on-surface-variant opacity-40 mb-6 lg:mb-8 uppercase tracking-widest">Current Context</h3>
            <div class="space-y-4 lg:space-y-6">
              <div class="p-5 lg:p-6 rounded-xl lg:rounded-2xl bg-surface-container/50 border border-outline-variant/5">
                <p class="text-[9px] label-sm text-on-surface-variant opacity-50 mb-2 uppercase tracking-tighter">Strategic Objective</p>
                <p class="text-sm font-bold text-on-surface">${project.goal || 'New Strategic Decision'}</p>
              </div>
              <div class="p-5 lg:p-6 rounded-xl lg:rounded-2xl bg-surface-container/50 border border-outline-variant/5">
                <p class="text-[9px] label-sm text-on-surface-variant opacity-50 mb-2 uppercase tracking-tighter">Primary Constraint</p>
                <p class="text-sm font-bold text-on-surface">Budget Cap: $${(project.budget / 1000000).toFixed(1)}M / Year</p>
              </div>
            </div>
          </div>
          <div class="p-8 lg:p-10 flex-1 overflow-y-auto">
            <h3 class="text-[10px] label-sm text-on-surface-variant opacity-40 mb-6 lg:mb-8 uppercase tracking-widest">Active Vectors</h3>
            <div class="space-y-6 lg:space-y-8">
              ${this.renderVectorItem('Market Share', 68, 'var(--color-primary)')}
              ${this.renderVectorItem('Innovation Index', 42, 'var(--color-tertiary)')}
              ${this.renderVectorItem('Operational Risk', 15, 'var(--color-error)')}
              ${this.renderVectorItem('Customer LTV', 84, 'var(--color-primary)')}
            </div>
            
            <div class="mt-12 lg:mt-20">
              <h3 class="text-[10px] label-sm text-on-surface-variant opacity-40 mb-6 lg:mb-8 uppercase tracking-widest">Recent Simulations</h3>
              <div class="space-y-2">
                <div class="p-4 rounded-xl hover:bg-surface-bright transition-calm cursor-pointer flex items-center justify-between group border border-transparent hover:border-outline-variant/10">
                  <span class="text-xs font-medium text-on-surface-variant group-hover:text-on-surface transition-calm">Aggressive Expansion v2</span>
                  <span class="material-symbols-outlined text-sm opacity-20">open_in_new</span>
                </div>
                <div class="p-4 rounded-xl hover:bg-surface-bright transition-calm cursor-pointer flex items-center justify-between group border border-transparent hover:border-outline-variant/10">
                  <span class="text-xs font-medium text-on-surface-variant group-hover:text-on-surface transition-calm">Defensive Pivot Q3</span>
                  <span class="material-symbols-outlined text-sm opacity-20">open_in_new</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private renderMessage(msg: Message): string {
    const isAi = msg.role === 'ai';
    return `
      <div class="flex items-start gap-4 lg:gap-6 max-w-3xl ${isAi ? '' : 'ml-auto flex-row-reverse'}">
        <div class="w-8 h-8 lg:w-9 lg:h-9 rounded-full ${isAi ? 'btn-primary' : 'bg-surface-container-highest'} flex-shrink-0 flex items-center justify-center overflow-hidden shadow-lg">
          ${isAi ? 
            '<span class="material-symbols-outlined text-surface text-sm font-bold">bolt</span>' : 
            '<img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User">'
          }
        </div>
        <div class="flex-1 space-y-2 lg:space-y-3 ${isAi ? '' : 'text-right'}">
          <div class="flex items-center gap-3 ${isAi ? '' : 'flex-row-reverse'}">
            <span class="text-[10px] lg:text-xs font-bold text-on-surface uppercase tracking-widest">${isAi ? 'Vantage AI' : 'Strategist'}</span>
            <span class="text-[8px] lg:text-[9px] text-on-surface-variant label-sm opacity-30">${msg.timestamp}</span>
          </div>
          <div class="p-5 lg:p-8 rounded-2xl ${isAi ? 'rounded-tl-none glass-chat-ai text-on-surface shadow-2xl border border-white/5' : 'rounded-tr-none bg-surface-container text-on-surface-variant border border-outline-variant/5'} text-sm leading-relaxed">
            ${msg.text}
          </div>
        </div>
      </div>
    `;
  }

  private renderVectorItem(label: string, value: number, color: string): string {
    return `
      <div class="space-y-3">
        <div class="flex items-center justify-between text-[9px] label-sm uppercase tracking-tighter">
          <span class="text-on-surface-variant opacity-60">${label}</span>
          <span style="color: ${color}" class="font-mono font-bold">${value}%</span>
        </div>
        <div class="h-[2px] w-full bg-surface-container-highest rounded-full overflow-hidden">
          <div class="h-full rounded-full transition-calm" style="width: ${value}%; background-color: ${color}"></div>
        </div>
      </div>
    `;
  }

  public async sendMessage() {
    const input = this.querySelector('#chat-input') as HTMLTextAreaElement;
    const text = input.value.trim();
    if (!text || this.isTyping) return;

    input.value = '';
    this.messages.push({
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    this.isTyping = true;
    this.update();
    this.scrollToBottom();

    try {
      const chatHistory = this.messages.map(m => ({
        role: (m.role === 'user' ? 'user' : 'model') as 'user' | 'model',
        parts: [{ text: m.text }]
      }));

      const responseText = await geminiService.processIntake(chatHistory);
      
      // Check for JSON response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const json = JSON.parse(jsonMatch[0]);
          if (json.type === 'INTAKE_COMPLETE') {
            store.updateProject({
              goal: json.data.goal,
              criteria: json.data.criteria,
              alternatives: json.data.alternatives
            });
            this.messages.push({
              role: 'ai',
              text: 'Strategic intake complete. Decision model updated. You can now explore the Vantage, Frontier, and Nexus views.',
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            });
          } else {
            this.messages.push({
              role: 'ai',
              text: responseText.replace(jsonMatch[0], '').trim(),
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            });
          }
        } catch (e) {
          this.messages.push({
            role: 'ai',
            text: responseText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          });
        }
      } else {
        this.messages.push({
          role: 'ai',
          text: responseText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
      }
    } catch (error) {
      console.error('Gemini Error:', error);
      this.messages.push({
        role: 'ai',
        text: 'I encountered a strategic friction point. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    } finally {
      this.isTyping = false;
      this.update();
      this.scrollToBottom();
    }
  }

  public newThread() {
    this.messages = [
      {
        role: 'ai',
        text: 'New strategic thread initialized. What complex decision are we framing?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
    this.update();
  }

  private scrollToBottom() {
    setTimeout(() => {
      const container = this.querySelector('#message-container');
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }, 0);
  }
}

customElements.define('loom-view', LoomView);
