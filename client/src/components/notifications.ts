import { LitElement, css } from 'lit';
import './notification';
import {
  ErrorNotificationEvent,
  SuccessNotificationEvent,
} from './notification';
import { customElement } from './utils';

interface CustomEventMap {
  'success-notification': SuccessNotificationEvent;
  'error-notification': ErrorNotificationEvent;
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
  shadow: true,
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
class Notifications extends LitElement {
  constructor() {
    super();
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
  }

  addNotification(type: string, text: string) {
    const notification = document.createElement('bt-notification');
    notification.setAttribute('type', type);
    notification.appendChild(document.createTextNode(text));
    notification.addEventListener('notification-end', () =>
      this.removeChild(notification)
    );
    const heightBefore = this.offsetHeight;
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
