import {
  LitElement,
  html,
  css,
} from "https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js";

export class NotificationEvent extends Event {
  constructor(name) {
    super(name, { bubbles: true, composed: true });
  }
}

export class NotificationEndEvent extends NotificationEvent {
  constructor() {
    super("notification-end");
  }
}

class Notification extends LitElement {
  static properties = {
    type: { type: String },
  };

  static styles = css`
    @keyframes fade-in {
      from {
        opacity: 0;
      }
    }

    @keyframes fade-out {
      to {
        opacity: 0;
      }
    }

    @keyframes slide-in {
      from {
        transform: translateY(-5vh);
      }
    }

    :host {
      grid-row-start: -1;
      font-size: 14px;
      font-family: system-ui;
      font-weight: 500;
      display: inline-block;
      border-radius: 8px;
      padding: 16px;
      width: 400px;
      box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.12);
      animation: fade-in 0.3s ease, slide-in 0.3s ease,
        fade-out 0.3s ease 3s forwards;
    }

    :host([type="error"]) {
      background-color: hsl(0, 96%, 77%);
      color: hsl(0, 74%, 16%);
    }

    :host([type="success"]) {
      background-color: hsl(145, 78%, 68%);
      color: hsl(145, 100%, 14%);
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    Promise.allSettled(
      this.getAnimations().map((animation) => animation.finished)
    ).then(() => this.dispatchEvent(new NotificationEndEvent()));
  }

  render() {
    return html`<slot></slot>`;
  }
}

window.customElements.define("app-notification", Notification);
