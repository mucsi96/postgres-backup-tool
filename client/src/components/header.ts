import { css, html } from 'lit';
import { LightDOMLitElement } from '../core';
import { customElement, property } from 'lit/decorators.js';

@customElement('app-header')
class AppHeader extends LightDOMLitElement {
  @property({ type: String })
  title = '';

  static styles = css`
    & {
      display: block;
      background-color: hsl(215, 28%, 17%);
      border-bottom: 1px solid hsl(215, 14%, 34%);
      position: sticky;
      top: 0;
      z-index: 40;
      font-family: system-ui;
      font-size: 14px;
    }

    & header {
      padding: 18px 1rem 19px;
      max-width: 90rem;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  `;

  render() {
    return html`
      <header>
        <h1 is="app-heading">${this.title}</h1>
        ${this.children}
      </header>
    `;
  }
}
