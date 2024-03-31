import { LitElement, css, html } from 'lit';
import { property } from 'lit/decorators.js';
import { customElement } from './utils';

@customElement({
  name: 'bt-row-selector',
  shadow: true,
  styles: css`
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
  `,
})
export class BTRowSelector extends LitElement {
  @property({ type: Boolean })
  selected = false;

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
