import {
  html,
  css,
} from "https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js";
import { LightDOMLitElement } from "../core.js";

class AppBadge extends LightDOMLitElement {
  static properties = {
    type: { type: String },
  };

  static styles = css`
    app-badge {
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
  `;

  render() {
    return this.children;
  }
}

window.customElements.define("app-badge", AppBadge);
