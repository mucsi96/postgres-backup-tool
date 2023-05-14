import {
  LitElement,
  html,
  css,
} from "https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js";

class AppHeading extends LitElement {
  static properties = {
    level: { type: Number },
  };

  static styles = css`
    :host {
      display: block;
      color: white;
    }

    :host([level="2"]) {
      font-size: 21px;
      font-weight: 700;
    }
  `;

  render() {
    return html`<slot></slot>`;
  }
}

window.customElements.define("app-heading", AppHeading);
