import { LitElement, css } from 'lit';
import { customElement } from './utils';

@customElement({
  name: 'bt-badge',
  shadow: true,
  styles: css`
    :host {
      background-color: white;
      color: rgb(30, 66, 159);
      display: inline-block;
      padding: 0.125em 0.4em;
      font-weight: 700;
      line-height: 1;
      white-space: nowrap;
      border-radius: 0.6em;
      margin: 0 0.6em;
      transform: scale(0.8) translateY(0.1em);
      transform-origin: center left;
    }
  `,
})
class BTBadge extends LitElement {}
