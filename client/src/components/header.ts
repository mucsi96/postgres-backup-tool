import { css, html } from 'lit';
import { customElement, htmlToString } from './utils';

@customElement({
  name: 'bt-header',
  extends: 'header',
  styles: css`
    :host {
      display: block;
      background-color: hsl(215, 28%, 17%);
      border-bottom: 1px solid hsl(215, 14%, 34%);
      position: sticky;
      top: 0;
      z-index: 40;
      font-family: system-ui;
      font-size: 14px;

      > * {
        padding: 18px 1rem 19px;
        max-width: 90rem;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    }
  `,
})
export class BTHeader extends HTMLElement {
  template = document.createElement('template');

  constructor() {
    super();
    this.template.innerHTML = htmlToString(html`
      <h1 is="bt-heading">${this.title}</h1>
    `);
  }

  connectedCallback() {
    this.firstElementChild?.prepend(this.template.content.cloneNode(true));
  }
}
