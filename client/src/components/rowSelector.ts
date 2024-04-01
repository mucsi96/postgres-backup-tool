import { css, html } from 'lit';
import { customElement, htmlToString } from './utils';

@customElement({
  name: 'bt-row-selector',
  extends: 'td',
  styles: css`
    :host {
      transition: color 0.3s;

      &[selected] {
        color: white;
      }

      svg {
        transform: rotate(-90deg);
      }
    }
  `,
})
export class BTRowSelector extends HTMLTableCellElement {
  template = document.createElement('template');

  constructor() {
    super();
    this.template.innerHTML = htmlToString(html`
      <svg
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
      </svg>
    `);
  }

  connectedCallback() {
    this.appendChild(this.template.content.cloneNode(true));
  }
}
