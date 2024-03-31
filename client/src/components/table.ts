import { css } from 'lit';
import { customElement } from './utils';

@customElement({
  name: 'bt-table',
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

    :host tr:has(bt-row-selector) {
      cursor: pointer;
    }

    :host tr:has(bt-row-selector):hover {
      background-color: hsl(217, 19%, 27%);
    }

    :host tr:has(bt-row-selector[selected]) {
      background-color: hsl(215, 44%, 28%);
      color: hsl(218, 11%, 65%);
    }

    :host tr:has(bt-row-selector[selected]):hover {
      background-color: hsl(215, 44%, 28%);
    }

    :host td {
      padding: 12px 24px;
      border-bottom: 1px solid hsl(217, 19%, 27%);
    }

    :host th[right-align],
    :host td[right-align] {
      text-align: right;
    }

    :host th[center-align],
    :host td[center-align] {
      text-align: center;
    }

    :host th[no-wrap],
    :host td[no-wrap] {
      white-space: nowrap;
    }
  `,
})
export class BTTable extends HTMLTableElement {}
