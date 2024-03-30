import { html, css, LitElement } from 'lit';
import { customElement } from './utils';

@customElement({
  name: 'bt-loader',
  shadow: true,
  styles: css`
    :host {
      display: grid;
      justify-content: center;
      height: 300px;
      align-items: center;
      grid-template-columns: repeat(5, auto);
      gap: 3px;
    }

    div {
      background-color: white;
      opacity: 0.85;
      height: 60px;
      width: 7px;
      display: inline-block;
      animation: sk-stretchdelay 1.2s infinite ease-in-out;

      &:nth-child(2) {
        animation-delay: -1.1s;
      }

      &:nth-child(3) {
        animation-delay: -1s;
      }

      &:nth-child(4) {
        animation-delay: -0.9s;
      }

      &:nth-child(5) {
        animation-delay: -0.8s;
      }
    }

    @keyframes sk-stretchdelay {
      0%,
      40%,
      100% {
        transform: scaleY(0.4);
      }
      20% {
        transform: scaleY(1);
      }
    }
  `,
})
class BTLoader extends LitElement {
  render() {
    return html`
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    `;
  }
}
