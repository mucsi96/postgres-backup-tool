import { LitElement, css, html } from 'lit';
import { property } from 'lit/decorators.js';
import './backups';
import './components/badge';
import './components/button';
import './components/header';
import './components/heading';
import './components/loader';
import './components/main';
import {
  ErrorNotificationEvent,
  SuccessNotificationEvent,
} from './components/notification';
import './components/notifications';
import './components/inputLabel';
import './components/rowSelector';
import './components/table';
import { customElement } from './components/utils';
import { AppErrorEvent } from './events';
import './tables';
import { fetchJSON, getRelativeTimeString } from './utils';
import { Backup, Table } from './models';

interface CustomEventMap {
  'app-error': AppErrorEvent;
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
  name: 'app-body',
  styles: css`
    #main {
      margin-top: 32px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      align-items: flex-start;
      gap: 32px;
    }
  `,
})
class App extends LitElement {
  @property({ type: Array })
  tables?: Table[];

  @property({ type: Number })
  totalRowCount?: number;

  @property({ type: Array })
  backups?: Backup[]

  @property({ type: String })
  lastBackupTime?: string;

  constructor() {
    super();
    document.addEventListener('app-error', (event: AppErrorEvent) => {
      console.error(event.detail.error);
      this.dispatchEvent(new ErrorNotificationEvent(event.detail.message));
    });
  }

  async #fetchTables() {
    try {
      const { tables, totalRowCount } = await fetchJSON<{tables: Table[], totalRowCount: number }>('/tables');
      this.tables = tables;
      this.totalRowCount = totalRowCount;
    } catch (err) {
      this.tables = [];
      this.dispatchEvent(
        new AppErrorEvent('Unable to fetch tables', err as Error)
      );
    }
  }

  async #fetchBackups() {
    try {
      this.backups = await fetchJSON<Backup[]>('/backups');
    } catch (err) {
      this.backups = [];
      this.dispatchEvent(
        new AppErrorEvent('Unable to fetch backups', err as Error)
      );
    }
  }

  async #fetchLastBackupTime() {
    try {
      const lastBackupResponse = await fetchJSON<Date>('/last-backup-time');
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
      <header is="bt-header" title="Postgres Backup Tool">
        <h3 is="bt-heading">
          Last backup <bt-badge>${this.lastBackupTime}</bt-badge>
        </h3>
      </header>
      <main is="bt-main">
        <div id="main">
          <app-tables
            .tables=${this.tables}
            .totalCount=${this.totalRowCount}
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
      <bt-notifications></bt-notifications>
    `;
  }
}
