import { LitElement } from "lit";

export class LightDOMLitElement extends LitElement {
  createRenderRoot() {
    if (document.head.querySelector(`style[data-tagname="${this.tagName}"]`)) {
      return this;
    }

    const style = document.createElement("style");
    style.innerHTML = `${this.tagName} {${this.constructor.elementStyles}}`;
    style.setAttribute("data-tagname", this.tagName);
    document.head.append(style);
    return this;
  }
}
