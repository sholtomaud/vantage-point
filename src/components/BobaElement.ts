export class BobaElement extends HTMLElement {
  protected _root: ShadowRoot | HTMLElement;

  constructor(useShadow = false) {
    super();
    if (useShadow) {
      this._root = this.attachShadow({ mode: 'open' });
    } else {
      this._root = this;
    }
  }

  protected render(): string {
    return ``;
  }

  protected update(): void {
    this._root.innerHTML = this.render();
    this.afterRender();
  }

  protected afterRender(): void {
    // Override in subclasses
  }

  connectedCallback(): void {
    this.update();
  }

  protected emit(event: string, detail: any = {}): void {
    this.dispatchEvent(new CustomEvent(event, {
      detail,
      bubbles: true,
      composed: true
    }));
  }
}
