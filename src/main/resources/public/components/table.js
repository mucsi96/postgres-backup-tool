import {
  LitElement,
  css,
  html,
} from "https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js";

class AppTable extends LitElement {
  static styles = css`
    :host {
      display: table;
      border-collapse: collapse;
      text-align: left;
    }
  `;

  render() {
    return html`<slot></slot>`;
  }
}

class AppTableHead extends LitElement {
  static styles = css`
    :host {
      display: table-header-group;
    }
  `;

  render() {
    return html`<slot></slot>`;
  }
}

class AppTableBody extends LitElement {
  static styles = css`
    :host {
      display: table-row-group;
    }
  `;

  render() {
    return html`<slot></slot>`;
  }
}

class AppTableRow extends LitElement {
  static styles = css`
    :host {
      display: table-row;
      font-weight: 500;
      background-color: hsl(215, 28%, 17%);
      transition: background-color .3s;
    }

    :host([selectable]) {
      cursor: pointer;
    }
    
    :host([selectable]:hover) {
      background-color: hsl(217, 19%, 27%);
    }

    :host([selected]) {
      background-color: hsl(215, 44%, 28%);
      color: hsl(218, 11%, 65%);
    }

    :host([selected]:hover) {
      background-color: hsl(215, 44%, 28%);
    }

    .selector {
      padding: 12px;
      vertical-align: middle;
      transition: color .3s;
    }

    .selector svg {
      transform: rotate(-90deg);
    }

    :host([selected]) .selector {
      color: white;
    }
  `;

  static properties = {
    selectable: { type: Boolean },
    selected: { type: Boolean },
  };

  render() {
    if (this.selectable) {
      return html`<app-td class="selector"
          ><svg
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
            ></path></svg></app-td
        ><slot></slot>`;
    }

    return html`<slot></slot>`;
  }
}

class AppTableHeadCell extends LitElement {
  static styles = css`
    :host {
      display: table-cell;
      padding: 12px 24px;
      font-weight: 600;
      background-color: hsl(217, 19%, 27%);
      color: hsl(218, 11%, 65%);
      text-transform: uppercase;
    }
  `;

  render() {
    return html`<slot></slot>`;
  }
}

class AppTableCell extends LitElement {
  static styles = css`
    :host {
      display: table-cell;
      padding: 12px 24px;
      border-bottom: 1px solid hsl(217, 19%, 27%);
    }

    :host([highlighted]) {
      color: white;
    }

    :host([no-wrap]) {
      white-space: nowrap;
    }
  `;

  static properties = {
    highlighted: { type: Boolean },
    "no-wrap": { type: Boolean },
  };

  render() {
    return html`<slot></slot>`;
  }
}

window.customElements.define("app-table", AppTable);
window.customElements.define("app-thead", AppTableHead);
window.customElements.define("app-tbody", AppTableBody);
window.customElements.define("app-tr", AppTableRow);
window.customElements.define("app-th", AppTableHeadCell);
window.customElements.define("app-td", AppTableCell);
