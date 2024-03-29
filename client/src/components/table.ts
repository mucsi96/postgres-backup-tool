import { css } from 'lit';
import { customElement } from './utils';

@customElement({
  name: 'app-table',
  extends: 'table',
  styles: css`
    :host {
      border-collapse: collapse;
      text-align: left;
    }

    :host th {
      padding: 12px 24px;
      font-weight: 600;
      background-color: hsl(217, 19%, 27%);
      color: hsl(218, 11%, 65%);
      text-transform: uppercase;
    }

    :host tr {
      font-weight: 500;
      background-color: hsl(215, 28%, 17%);
      transition: background-color 0.3s;
    }

    :host tr:has(app-row-selector) {
      cursor: pointer;
    }

    :host tr:has(app-row-selector):hover {
      background-color: hsl(217, 19%, 27%);
    }

    :host tr:has(app-row-selector[selected]) {
      background-color: hsl(215, 44%, 28%);
      color: hsl(218, 11%, 65%);
    }

    :host tr:has(app-row-selector[selected]):hover {
      background-color: hsl(215, 44%, 28%);
    }

    :host td {
      padding: 12px 24px;
      border-bottom: 1px solid hsl(217, 19%, 27%);
    }

    :host td[no-wrap] {
      white-space: nowrap;
    }
  `,
})
class AppTable extends HTMLTableElement {}
