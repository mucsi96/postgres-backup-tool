import {
  LitElement,
  html,
  css,
} from "https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js";

class AppHeader extends LitElement {
  static properties = {
    title: "",
  };

  static styles = css`
    :host {
      display: block;
      background-color: hsl(215, 28%, 17%);
      border-bottom: 1px solid hsl(215, 14%, 34%);
      position: sticky;
      top: 0;
      z-index: 40;
      font-family: system-ui;
      font-size: 14px;
    }

    header {
      padding: 18px 1rem 19px;
      max-width: 90rem;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    h1 {
      font-size: 24px;
      font-family: system-ui;
      margin: 0;
      color: white;
    }
  `;

  render() {
    return html`
      <header>
        <h1>${this.title}</h1>
        <slot></slot>
      </header>
    `;
  }
}

window.customElements.define("app-header", AppHeader);
