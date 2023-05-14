import {
  LitElement,
  html,
  css,
} from "https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js";

class AppMain extends LitElement {
  static styles = css`
    :host {
      display: block;
      background-color: hsl(222, 47%, 11%);
      color: hsl(218, 11%, 65%);
      font-family: system-ui;
      font-size: 14px;
      padding: 1px 0;
    }
    
    main {
      padding: 0 1rem;
      max-width: 90rem;
      margin: 0 auto;
    }
  `;

  render() {
    return html`
      <main>
          <slot></slot>
      </main>
    `;
  }
}

window.customElements.define("app-main", AppMain);
