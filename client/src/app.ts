import { css, html } from 'lit';
import './components/header';
import './components/main';
import './components/heading';
import './components/button';
import './components/table';
import './components/rowSelector';
import './components/loader';
import './components/badge';
import './components/notifications';
import './components/numberInput';
import './tables';
import './backups';
import { AppErrorEvent } from './events';
import { fetchJSON, getRelativeTimeString } from './utils';
import { LightDOMLitElement } from './core';
import { ErrorNotificationEvent, SuccessNotificationEvent } from './components/notification';
import { customElement, property } from 'lit/decorators.js';

interface CustomEventMap {
  'app-error': AppErrorEvent;
}
declare global {
  interface Document {
    addEventListener<K extends keyof CustomEventMap>(
      type: K,
      listener: (this: Document, ev: CustomEventMap[K]) => void
    ): void;
    dispatchEvent<K extends keyof CustomEventMap>(ev: CustomEventMap[K]): boolean;
  }
}

@customElement('app-body')
class App extends LightDOMLitElement {
  @property({ type: Array })
  tables = [];

  @property({ type: Number })
  totalRowCount = 0;

  @property({ type: Array })
  backups = [];

  @property({ type: String })
  lastBackupTime?: string;

  static styles = css`
    #main {
      margin-top: 32px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      align-items: flex-start;
      gap: 32px;
    }
  `;

  constructor() {
    super();
    document.addEventListener('app-error', (event: AppErrorEvent) => {
      console.error(event.detail.error);
      this.dispatchEvent(new ErrorNotificationEvent(event.detail.message));
    });
  }

  async #fetchTables() {
    try {
      const { tables, totalRowCount } = await fetchJSON('/tables');
      this.tables = tables;
      this.totalRowCount = totalRowCount;
    } catch (err) {
      this.tables = [];
      this.dispatchEvent(new AppErrorEvent('Unable to fetch tables', err as Error));
    }
  }

  async #fetchBackups() {
    try {
      this.backups = await fetchJSON('/backups');
    } catch (err) {
      this.backups = [];
      this.dispatchEvent(new AppErrorEvent('Unable to fetch backups', err as Error));
    }
  }

  async #fetchLastBackupTime() {
    try {
      const lastBackupResponse = await fetchJSON('/last-backup-time');
      const lastBackupTime = lastBackupResponse && new Date(lastBackupResponse);
      if (
        !lastBackupTime ||
        lastBackupTime.getTime() +
          1 /*d*/ * 24 /*h*/ * 60 /*m*/ * 60 /*s*/ * 1000 /*ms*/ <
          Date.now()
      ) {
        this.dispatchEvent(new AppErrorEvent('No backup since one day'));
      }
      this.lastBackupTime =
        lastBackupTime && getRelativeTimeString(lastBackupTime);
    } catch (err) {
      this.lastBackupTime = '';
      this.dispatchEvent(
        new AppErrorEvent('Unable to fetch last backup time', err as Error)
      );
    }
  }

  firstUpdated() {
    this.#fetchTables();
    this.#fetchBackups();
    this.#fetchLastBackupTime();
  }

  render() {
    return html`
      <app-header title="Postgres Backup Tool" ]
        ><h3 is="app-heading">
          Last backup <span is="app-badge">${this.lastBackupTime}</span>
        </h3></app-header
      >
      <main is="app-main">
        <div id="main">
          <app-tables
            .tables=${this.tables}
            total-count=${this.totalRowCount}
            @backup-created=${() => {
              this.#fetchBackups();
              this.#fetchLastBackupTime();
              this.dispatchEvent(
                new SuccessNotificationEvent('Backup created')
              );
            }}
            @cleanup-finished=${() => {
              this.#fetchBackups();
              this.#fetchLastBackupTime();
              this.dispatchEvent(
                new SuccessNotificationEvent('Cleanup finished')
              );
            }}
          ></app-tables>
          <app-backups
            .backups=${this.backups}
            @backup-restored=${() => {
              this.#fetchTables();
              this.dispatchEvent(
                new SuccessNotificationEvent('Backup restored')
              );
            }}
          ></app-backups>
        </div>
      </main>
      <app-notifications></app-notifications>
    `;
  }
}
