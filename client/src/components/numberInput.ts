import { css, html } from 'lit';
import { LightDOMLitElement } from '../core';
import { customElement, property } from 'lit/decorators.js';

export class ValueChangeEvent extends CustomEvent<string> {
  constructor(value: string) {
    super('value-change', { bubbles: true, composed: true, detail: value });
  }
}

@customElement('app-number-input')
class NumberInput extends LightDOMLitElement {
  @property({ type: String })
  label = '';

  @property({ type: String })
  value = '';

  @property({ type: Number })
  min = 0;

  @property({ type: Number })
  max = 100;

  @property({ type: Number })
  step = 1;

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
        @change=${(event: Event) =>
          event.target instanceof HTMLInputElement &&
          this.dispatchEvent(new ValueChangeEvent(event.target.value))}
    /></label>`;
  }
}
