import { css, html, LitElement } from "lit";

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
    return html`<slot></slot>`
  }
}

window.customElements.define("app-badge", AppBadge);
