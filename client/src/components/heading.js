import { css, html, LitElement } from "lit";

class AppHeading extends LitElement {
  static properties = {
    level: { type: Number },
  };

  static styles = css`
    :host {
      display: block;
      color: white;
    }

    :host([level="1"]) {
      font-size: 24px;
      font-weight: 700;
    }

    :host([level="2"]) {
      font-size: 21px;
      font-weight: 700;
    }

    :host([level="3"]) {
      font-size: 16px;
      font-weight: 700;
    }
  `;

  render() {
    return html`<slot></slot>`;
  }
}

window.customElements.define("app-heading", AppHeading);
