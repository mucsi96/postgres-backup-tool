import { css, html } from "lit";
import { LightDOMLitElement } from "../core.js";

class AppMain extends LightDOMLitElement {
  static styles = css`
    & {
      display: block;
      background-color: hsl(222, 47%, 11%);
      color: hsl(218, 11%, 65%);
      font-family: system-ui;
      font-size: 14px;
      padding: 1px 0;
    }

    & main {
      padding: 0 1rem;
      max-width: 90rem;
      margin: 0 auto;
    }
  `;

  render() {
    return html`
      <main>
          ${this.children}
      </main>
    `;
  }
}

window.customElements.define("app-main", AppMain);
