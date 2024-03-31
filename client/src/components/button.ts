import { css } from "lit";
import { customElement } from "./utils";

@customElement({
  name: "bt-button",
  extends: "button",
  styles: css`
    :host {
      --button-color: hsl(220, 89%, 53%);
      --button-hover-color: hsl(221, 79%, 48%);
      background-color: var(--button-color);
      border: 1px solid var(--button-color);
      padding: 10px 20px;
      border-radius: 8px;
      color: white;
      font-weight: 500;
      transition: background-color 0.3s;

      &:not([disabled]):hover {
        background-color: var(--button-hover-color);
        border: 1px solid var(--button-hover-color);
        cursor: pointer;
      }

      &[disabled] {
        background-color: hsl(215, 28%, 17%);
        color: hsl(218, 11%, 65%);
        border: 1px solid hsl(215, 14%, 34%);
        pointer-events: none;
      }

      &[color="green"] {
        --button-color: hsl(161, 92%, 25%);
        --button-hover-color: hsl(163, 93%, 22%);
      }

      &[color="red"] {
        --button-color: hsl(0, 75%, 51%);
        --button-hover-color: hsl(0, 74%, 45%);
      }

      &[color="yellow"] {
        --button-color: hsl(42, 93%, 46%);
        --button-hover-color: hsl(37, 97%, 39%);
      }
    }

  `,

})
export class BTButton extends HTMLButtonElement{}
