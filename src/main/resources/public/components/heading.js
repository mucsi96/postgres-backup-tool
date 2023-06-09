import {
  css
} from "https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js";
import { LightDOMLitElement } from "../core.js";

class AppHeading extends LightDOMLitElement {
  static properties = {
    level: { type: Number },
  };

  static styles = css`
    app-heading {
      display: block;
      color: white;
    }

    app-heading[level="2"] {
      font-size: 21px;
      font-weight: 700;
    }

    app-heading[level="3"] {
      font-size: 16px;
      font-weight: 700;
    }
  `;

  render() {
    return this.children;
  }
}

window.customElements.define("app-heading", AppHeading);
