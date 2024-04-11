import { LitElement, css, html } from 'lit';
import { property } from 'lit/decorators.js';
import {
  AppErrorEvent,
  BackupCreatedEvent,
  CleanupFinishedEvent,
} from './events';
import { fetchJSON } from './utils';
import { Table } from './models';
import { customElement } from '@mucsi96/ui-elements';

@customElement({
  name: 'app-tables',
  styles: css`
    :host {
      display: grid;
      gap: 40px;
    }

    .tables,
    .backup,
    .cleanup {
      display: grid;
      gap: 20px;
    }
  `,
})
class AppTables extends LitElement {
  @property({ type: Array })
  tables?: Table[];

  @property({ type: Number })
  totalCount?: number;

  @property({ type: Boolean })
  processing = false;

  @property({ type: Number })
  retentionPeriod = 1;

  render() {
    this.style.justifyContent = this.tables ? 'flex-start' : 'center';

    if (!this.tables) {
      return html`<div is="bt-loader"></div>`;
    }

    const actionsDisabled = this.processing;

    return html`
      <h2 is="bt-heading">Records <span is="bt-badge">${this.totalCount}</span></h2>
      <div class="tables">
        <h2 is="bt-heading">
          Tables <span is="bt-badge">${this.tables.length}</span>
        </h2>
        ${this.tables.length
          ? html`<table is="bt-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Records</th>
                </tr>
              </thead>
              <tbody>
                ${this.tables.map(
                  (table) => html`
                    <tr>
                      <td highlighted>${table.name}</td>
                      <td>${table.rowCount}</td>
                    </tr>
                  `
                )}
              </tbody>
            </table>`
          : ''}
      </div>
      <div class="backup">
        <h2 is="bt-heading">Backup</h2>
        <label is="bt-input-label"
          >Retention period (days)<input
            type="number"
            value=${this.retentionPeriod}
            min="1"
            max="356"
            step="1"
            @change=${(event: Event) => {
              if (
                event.target instanceof HTMLInputElement &&
                event.target.value
              ) {
                this.retentionPeriod = parseInt(event.target.value);
              }
            }}
        /></label>
        <section>
          <button
            is="bt-button"
            ?disabled=${actionsDisabled}
            @click="${actionsDisabled
              ? undefined
              : () => this.#backup(this.retentionPeriod)}"
          >
            Backup
          </button>
        </section>
      </div>
      <div class="cleanup">
        <h2 is="bt-heading">Cleanup</h2>
        <section>
          <button
            is="bt-button"
            color="red"
            ?disabled=${actionsDisabled}
            @click="${actionsDisabled ? undefined : () => this.#cleanup()}"
          >
            Cleanup
          </button>
        </section>
      </div>
    `;
  }

  #backup(retentionPeriod: number) {
    this.processing = true;
    fetchJSON(`/backup?retention_period=${retentionPeriod}`, { method: 'POST' })
      .then(() => this.dispatchEvent(new BackupCreatedEvent()))
      .catch((err) =>
        this.dispatchEvent(new AppErrorEvent('Unable to create backup', err))
      )
      .finally(() => {
        this.processing = false;
      });
  }

  #cleanup() {
    this.processing = true;
    fetchJSON('/cleanup', { method: 'POST' })
      .then(() => this.dispatchEvent(new CleanupFinishedEvent()))
      .catch((err) =>
        this.dispatchEvent(new AppErrorEvent('Unable to cleanup', err))
      )
      .finally(() => {
        this.processing = false;
      });
  }
}
