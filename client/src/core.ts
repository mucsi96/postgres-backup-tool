import { CSSResult, LitElement } from 'lit';

export class LightDOMLitElement extends LitElement {
  createRenderRoot() {
    if (
      document.head.querySelector(`style[data-tagname="${this.tagName}"]`) ||
      !(
        'styles' in this.constructor &&
        this.constructor.styles instanceof CSSResult
      )
    ) {
      return this;
    }

    const style = document.createElement('style');
    style.innerHTML = `${this.tagName} {${this.constructor.styles.cssText}}`;
    style.setAttribute('data-tagname', this.tagName);
    document.head.append(style);
    return this;
  }
}
