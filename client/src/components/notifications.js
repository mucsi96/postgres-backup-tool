import { css, html } from "lit";
import "./notification.js";
import { NotificationEvent } from "./notification.js";
import { LightDOMLitElement } from "../core.js";

class Notifications extends LightDOMLitElement {
  static styles = css`
    & {
      pointer-events: none;
      position: fixed;
      z-index: 100;
      inset: 8px 8px auto 8px;
      display: flex;
      flex-direction: column-reverse;
      gap: 16px;
      align-items: flex-end;
    }
  `;

  constructor() {
    super();
    document.addEventListener("success-notification", (event) =>
      this.addNotification("success", event.details)
    );
    document.addEventListener("error-notification", (event) =>
      this.addNotification("error", event.details)
    );
  }

  addNotification(type, text) {
    const notification = document.createElement("app-notification");
    notification.setAttribute("type", type);
    notification.appendChild(document.createTextNode(text));
    notification.addEventListener("notification-end", () =>
      this.removeChild(notification)
    );
    const heightBefore = this.offsetHeight;
    this.appendChild(notification);
    const heightAfter = this.offsetHeight;
    const initialOffset = heightBefore - heightAfter;
    this.animate(
      [
        { transform: `translateY(${initialOffset}px)` },
        { transform: "translateY(0)" },
      ],
      {
        duration: 150,
        easing: "ease-out",
      }
    );
  }
}

window.customElements.define("app-notifications", Notifications);

export class ErrorNotificationEvent extends NotificationEvent {
  constructor(error) {
    super("error-notification");
    this.details = error;
  }
}

export class SuccessNotificationEvent extends NotificationEvent {
  constructor(error) {
    super("success-notification");
    this.details = error;
  }
}
