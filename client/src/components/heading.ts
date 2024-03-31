import { css } from 'lit';
import { customElement } from './utils';

@customElement({
  name: 'bt-heading',
  extends: 'h1',
  styles: css`
    [is="bt-heading"] {
      display: block;
      color: white;
      margin: unset;

      h1& {
        font-size: 24px;
        font-weight: 700;
      }

      h2& {
        font-size: 21px;
        font-weight: 700;
      }

      h3& {
        font-size: 16px;
        font-weight: 700;
      }
    }
  `,
})
export class BTHeading extends HTMLHeadingElement {}
