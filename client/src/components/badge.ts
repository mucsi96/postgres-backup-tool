import { css } from 'lit';
import { customElement } from './utils';

@customElement({
  name: 'bt-badge',
  extends: 'span',
  styles: css`
    :host {
      position: relative;
      color: rgb(30, 66, 159);
      display: inline-block;
      font-weight: 700;
      white-space: nowrap;
      margin: 0 0.6em;
      z-index: 1;
      transform: scale(0.8) translateY(0.05em);
      transform-origin: center left;

      &:before {
        display: inline-block;
        content: '';
        inset: 0 -0.4em;
        border-radius: 0.6em;
        background-color: white;
        position: absolute;
        z-index: -1;
      }
    }
  `,
})
export class BTBadge extends HTMLSpanElement {}
