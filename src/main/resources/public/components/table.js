import {
  LitElement,
  css,
  html,
} from "https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js";
import { LightDOMLitElement } from "../core.js";

class AppTable extends LightDOMLitElement {
  static styles = css`
    app-table table {
      border-collapse: collapse;
      text-align: left;
    }

    app-table th {
      padding: 12px 24px;
      font-weight: 600;
      background-color: hsl(217, 19%, 27%);
      color: hsl(218, 11%, 65%);
      text-transform: uppercase;
    }

    app-table tr {
      font-weight: 500;
      background-color: hsl(215, 28%, 17%);
      transition: background-color 0.3s;
    }

    app-table tr:has(app-table-selector) {
      cursor: pointer;
    }

    app-table tr:has(app-table-selector):hover {
      background-color: hsl(217, 19%, 27%);
    }

    app-table tr:has(app-table-selector[selected]) {
      background-color: hsl(215, 44%, 28%);
      color: hsl(218, 11%, 65%);
    }

    app-table tr:has(app-table-selector[selected]):hover {
      background-color: hsl(215, 44%, 28%);
    }

    app-table td {
      padding: 12px 24px;
      border-bottom: 1px solid hsl(217, 19%, 27%);
    }

    app-table td[highlighted] {
      color: white;
    }

    app-table td[no-wrap] {
      white-space: nowrap;
    }

    app-table td:has(app-table-selector) {
      padding: 12px;
      vertical-align: middle;
    }
  `;

  render() {
    return this.children;
  }
}

class AppTableSelector extends LitElement {
  static styles = css`
    :host {
      display: contents;
      transition: color 0.3s;
    }

    :host([selected]) {
      color: white;
    }

    :host svg {
      transform: rotate(-90deg);
    }
  `;

  static properties = {
    selected: { type: Boolean },
  };

  render() {
    return html`<svg
      width="24"
      height="24"
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
        clip-rule="evenodd"
      ></path>
    </svg>`;
  }
}

window.customElements.define("app-table", AppTable);
window.customElements.define("app-table-selector", AppTableSelector);
