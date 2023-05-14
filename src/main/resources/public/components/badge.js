import {
  LitElement,
  html,
  css,
} from "https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js";

class AppBadge extends LitElement {
  static properties = {
    type: { type: String },
  };

  static styles = css`
    :host {
      background-color: white;
      color: rgb(30, 66, 159);
      display: inline-block;
      padding: 0.125em 0.4em;
      font-size: 75%;
      font-weight: 700;
      line-height: 1;
      white-space: nowrap;
      border-radius: 0.6em;
      margin: 0 0.6em;
      position: relative;
      bottom: 0.1em;
    }
  `;

  render() {
    return html`<slot></slot> `;
  }
}

window.customElements.define("app-badge", AppBadge);
