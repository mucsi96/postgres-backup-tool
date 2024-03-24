import {
  css,
  html
} from "https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js";
import { LightDOMLitElement } from "../core.js";

class AppHeader extends LightDOMLitElement {
  static properties = {
    title: "",
  };

  static styles = css`
    & {
      display: block;
      background-color: hsl(215, 28%, 17%);
      border-bottom: 1px solid hsl(215, 14%, 34%);
      position: sticky;
      top: 0;
      z-index: 40;
      font-family: system-ui;
      font-size: 14px;
    }

    & header {
      padding: 18px 1rem 19px;
      max-width: 90rem;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  `;

  render() {
    return html`
      <header>
        <app-heading level="1">${this.title}</app-heading>
        ${this.children}
      </header>
    `;
  }
}

window.customElements.define("app-header", AppHeader);
