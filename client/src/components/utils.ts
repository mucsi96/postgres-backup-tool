import '@ungap/custom-elements';
import { CSSResult } from 'lit';

type CustomElementOptions = {
  name: string;
  extends?: string;
  styles?: CSSResult;
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
    `${extendsTag}[is='${name}']`
  );
  style.setAttribute('data-is', name);
  document.head.append(style);
}

export function customElement(options: CustomElementOptions) {
  const { name, extends: extendsTag, styles } = options;
  return (elementClass: CustomElementConstructor) => {
    styles && injectStyles(options);
    customElements.define(name, elementClass, { extends: extendsTag });
  };
}
