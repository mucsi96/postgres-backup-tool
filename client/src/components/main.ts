import { css } from 'lit';
import { customElement } from './utils';

@customElement({
  name: 'app-main',
  extends: 'main',
  styles: css`
    :host {
      display: block;
      background-color: hsl(222, 47%, 11%);
      color: hsl(218, 11%, 65%);
      font-family: system-ui;
      font-size: 14px;
      padding: 1px 1rem;
      max-width: 90rem;
      margin: 0 auto;
    }
  `,
})
class AppMain extends HTMLElement {}
