import {
  LitElement,
  html,
  css,
} from "https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js";

class AppButton extends LitElement {
  static properties = {
    disabled: { type: Boolean },
    color: { type: String },
  };

  static styles = css`
    :host {
      display: inline-block;
      --button-color: hsl(220, 89%, 53%);
      --button-hover-color: hsl(221, 79%, 48%);
    }

    :host([color="green"]) {
      --button-color: hsl(161, 92%, 25%);
      --button-hover-color: hsl(163, 93%, 22%);
    }

    :host([color="red"]) {
      --button-color: hsl(0, 75%, 51%);
      --button-hover-color: hsl(0, 74%, 45%);
    }

    :host([color="yellow"]) {
      --button-color: hsl(42, 93%, 46%);
      --button-hover-color: hsl(37, 97%, 39%);
    }

    button {
      background-color: var(--button-color);
      border: 1px solid var(--button-color);
      padding: 10px 20px;
      border-radius: 8px;
      color: white;
      font-weight: 500;
      transition: background-color 0.3s;
    }

    button:not([disabled]):hover {
      background-color: var(--button-hover-color);
      border: 1px solid var(--button-hover-color);
      cursor: pointer;
    }

    button[disabled] {
      background-color: hsl(215, 28%, 17%);
      color: hsl(218, 11%, 65%);
      border: 1px solid hsl(215, 14%, 34%);
      pointer-events: none;
    }
  `;

  render() {
    return html`
      <button type="${this.type}" ?disabled="${this.disabled}">
        <slot></slot>
      </button>
    `;
  }
}

window.customElements.define("app-button", AppButton);
