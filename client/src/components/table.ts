import { css } from 'lit';
import { customElement } from './utils';

@customElement({
  name: 'bt-table',
  extends: 'table',
  styles: css`
    :host {
      border-collapse: collapse;
      text-align: left;

      th {
        padding: 12px 24px;
        font-weight: 600;
        background-color: hsl(217, 19%, 27%);
        color: hsl(218, 11%, 65%);
        text-transform: uppercase;
      }

      tr {
        font-weight: 500;
        background-color: hsl(215, 28%, 17%);
        transition: background-color 0.3s;

        &:has([is='bt-row-selector']) {
          cursor: pointer;

          &:hover {
            background-color: hsl(217, 19%, 27%);
          }
        }

        &:has([is='bt-row-selector'][selected]) {
          background-color: hsl(215, 44%, 28%);
          color: hsl(218, 11%, 65%);

          &:hover {
            background-color: hsl(215, 44%, 28%);
          }
        }
      }

      td {
        padding: 12px 24px;
        border-bottom: 1px solid hsl(217, 19%, 27%);
      }

      th[right-align],
      td[right-align] {
        text-align: right;
      }

      th[center-align],
      td[center-align] {
        text-align: center;
      }

      th[no-wrap],
      td[no-wrap] {
        white-space: nowrap;
      }
    }
  `,
})
export class BTTable extends HTMLTableElement {}
