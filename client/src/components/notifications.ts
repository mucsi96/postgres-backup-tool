import { LitElement, css, html } from 'lit';
import './notification';
import {
  BTNotification,
  ErrorNotificationEvent,
  NotificationEndEvent,
  SuccessNotificationEvent,
} from './notification';
import { customElement } from './utils';

interface CustomEventMap {
  'success-notification': SuccessNotificationEvent;
  'error-notification': ErrorNotificationEvent;
  'notification-end': NotificationEndEvent;
}
declare global {
  interface Document {
    addEventListener<K extends keyof CustomEventMap>(
      type: K,
      listener: (this: Document, ev: CustomEventMap[K]) => void
    ): void;
    dispatchEvent<K extends keyof CustomEventMap>(
      ev: CustomEventMap[K]
    ): boolean;
  }
}

@customElement({
  name: 'bt-notifications',
  extends: 'section',
  styles: css`
    :host {
      pointer-events: none;
      position: fixed;
      z-index: 100;
      inset: 8px 8px auto 8px;
      display: flex;
      flex-direction: column-reverse;
      gap: 16px;
      align-items: flex-end;
    }
  `,
})
export class BTNotifications extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = html`
      <template>
        <output is="bt-notification" role="status"></output>
      </template>
    `.strings.join('');
    document.addEventListener(
      'success-notification',
      (event: SuccessNotificationEvent) =>
        this.addNotification('success', event.detail)
    );
    document.addEventListener(
      'error-notification',
      (event: ErrorNotificationEvent) =>
        this.addNotification('error', event.detail)
    );
    document.addEventListener(
      'notification-end',
      (event: NotificationEndEvent) => {
        if (event.target && event.target instanceof HTMLElement) {
          event.target.remove();
        }
      }
    );
  }

  addNotification(type: string, text: string) {
    const heightBefore = this.offsetHeight;
    const notification = this.querySelector('template')?.content.firstElementChild?.cloneNode(
      true
    ) as BTNotification;
    notification.textContent = text;
    notification.setAttribute('type', type);
    this.appendChild(notification);
    const heightAfter = this.offsetHeight;
    const initialOffset = heightBefore - heightAfter;
    this.animate(
      [
        { transform: `translateY(${initialOffset}px)` },
        { transform: 'translateY(0)' },
      ],
      {
        duration: 150,
        easing: 'ease-out',
      }
    );
  }
}
