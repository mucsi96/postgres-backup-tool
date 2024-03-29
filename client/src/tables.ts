import { html, css } from 'lit';
import { LightDOMLitElement } from './core';
import {
  AppErrorEvent,
  BackupCreatedEvent,
  CleanupFinishedEvent,
} from './events';
import { fetchJSON } from './utils';
import { customElement, property } from 'lit/decorators.js';

@customElement('app-tables')
class AppTables extends LightDOMLitElement {
  @property({ type: Array })
  tables: { name: string; rowCount: number }[] = [];

  @property({ type: Number })
  totalCount = 0;

  @property({ type: Boolean })
  processing = false;

  @property({ type: Number })
  retentionPeriod = 1;

  static styles = css`
    & {
      display: grid;
      gap: 40px;
    }

    .tables,
    .backup,
    .cleanup {
      display: grid;
      gap: 20px;
    }
  `;

  render() {
    this.style.justifyContent = this.tables ? 'flex-start' : 'center';

    if (!this.tables) {
      return html`<app-loader></app-loader>`;
    }

    const actionsDisabled = this.processing;

    return html`
      <h2 is="app-heading">
        Records <span is="app-badge">${this.totalCount}</span>
      </h2>
      <div class="tables">
        <h2 is="app-heading">
          Tables <span is="app-badge">${this.tables.length}</span>
        </h2>
        ${this.tables.length
          ? html`<table is="app-table">
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
        <h2 is="app-heading">Backup</h2>
        <app-number-input
          label="Retention period (days)"
          value=${this.retentionPeriod}
          min="1"
          max="356"
          step="1"
          @value-change=${(event: CustomEvent<number>) => {
            this.retentionPeriod = event.detail;
          }}
        ></app-number-input>
        <section>
          <button
            is="app-button"
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
        <h2 is="app-heading">Cleanup</h2>
        <section>
          <button
            is="app-button"
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
