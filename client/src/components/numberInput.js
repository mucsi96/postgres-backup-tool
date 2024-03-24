import { css, html } from "lit";
import { LightDOMLitElement } from "../core.js";

export class ValueChangeEvent extends Event {
  constructor(value) {
    super("value-change", { bubbles: true, composed: true });
    this.details = value;
  }
}

class NumberInput extends LightDOMLitElement {
  static properties = {
    label: { type: String },
    value: { type: String },
    min: { type: Number },
    max: { type: Number },
    step: { type: Number },
  };

  static styles = css`
    & {
      display: inline;
    }

    & label {
      display: flex;
      gap: 8px;
      flex-direction: column;

      color: white;
      font-size: 14px;
      font-weight: 500;
    }

    & input {
      background-color: hsl(217, 19%, 27%);
      border: 1px solid hsl(215, 14%, 34%);
      color: white;
      font-size: 14px;
      font-weight: 400;
      padding: 10px;
      border-radius: 8px;
      outline: none;
    }

    & input:focus {
      border: 1px solid hsl(218, 93%, 61%);
      box-shadow: hsl(218, 93%, 61%) 0 0 0 1px;
    }

    & input:invalid {
      border: 1px solid hsl(0, 96%, 77%);
      box-shadow: hsl(0, 96%, 77%) 0 0 0 1px;
    }

    & input::-webkit-inner-spin-button {
      opacity: 0 !important;
    }
  `;

  render() {
    return html`<label
      >${this.label}
      <input
        type="number"
        value=${this.value}
        min=${this.min}
        max=${this.max}
        step=${this.step}
        @change=${(event) =>
          this.dispatchEvent(new ValueChangeEvent(event.target.value))}
    /></label>`;
  }
}

window.customElements.define("app-number-input", NumberInput);
