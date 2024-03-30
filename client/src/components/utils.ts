import '@ungap/custom-elements';
import { CSSResult, html } from 'lit';

type CustomElementOptions = {
  name: string;
  extends?: string;
  styles?: CSSResult;
  shadow?: boolean;
};

function injectStyles({
  name,
  extends: extendsTag,
  styles,
}: CustomElementOptions) {
  if (!styles) {
    return;
  }

  const style = document.createElement('style');
  style.innerHTML = styles.cssText.replace(
    /:host/g,
    extendsTag ? `${extendsTag}[is='${name}']` : name
  );
  style.setAttribute('data-is', name);
  document.head.append(style);
}

export function customElement(options: CustomElementOptions) {
  const { name, extends: extendsTag, styles, shadow } = options;
  return (elementClass: CustomElementConstructor) => {
    if (shadow) {
      (elementClass as any).styles = styles;
    } else {
      styles && injectStyles(options);
      elementClass.prototype.createRenderRoot = function () {
        return this;
      };
    }

    if (shadow) {
      if (!elementClass.prototype.hasOwnProperty('render')) {
        elementClass.prototype.render = function () {
          return html`<slot></slot>`;
        };
      }
    }

    customElements.define(name, elementClass, { extends: extendsTag });
  };
}
