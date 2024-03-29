import { css, html } from 'lit';
import { fetchJSON, formatSize, getRelativeTimeString } from './utils';
import { AppErrorEvent, BackupRestoredEvent } from './events';
import { LightDOMLitElement } from './core';
import { customElement, property } from 'lit/decorators.js';

type Backup = {
  name: string;
  lastModified: string;
  totalRowCount: number;
  size: number;
  retentionPeriod: number;
};

function formatRetention(value: number) {
  if (!value) {
    return '';
  }

  if (value === 1) {
    return `${value} day`;
  }

  return `${value} days`;
}

@customElement('app-backups')
class AppBackups extends LightDOMLitElement {
  @property({ type: Array })
  backups = [];

  @property({ type: String })
  selectedBackup?: string;

  @property({ type: Boolean })
  processing = false;

  static styles = css`
    & {
      display: grid;
      gap: 20px;
    }
  `;

  render() {
    this.style.justifyContent = this.backups ? 'flex-start' : 'center';

    if (!this.backups) {
      return html`<app-loader></app-loader>`;
    }

    return html`
      <h2 is="app-heading">
        Backups <span is="app-badge">${this.backups.length}</span>
      </h2>
      ${this.backups.length
        ? html`<table is="app-table" id="backups">
            <thead>
              <tr>
                <th></th>
                <th>Date</th>
                <th>Name</th>
                <th>Records</th>
                <th>Size</th>
                <th>Retention</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${this.backups.map((backup) => this.#renderBackup(backup))}
            </tbody>
          </table>`
        : ''}
    `;
  }

  #renderBackup(backup: Backup) {
    const actionsDisabled =
      backup.name !== this.selectedBackup || !!this.processing;
    return html`
      <tr
        @click=${() => {
          this.selectedBackup = backup.name;
        }}
      >
        <td>
          <app-row-selector
            ?selected=${backup.name === this.selectedBackup}
          ></app-row-selector>
        </td>
        <td highlighted no-wrap>
          ${backup.lastModified
            ? getRelativeTimeString(new Date(backup.lastModified))
            : '-'}
        </td>
        <td no-wrap>${backup.name}</td>
        <td>${backup.totalRowCount}</td>
        <td no-wrap>${formatSize(backup.size)}</td>
        <td>${formatRetention(backup.retentionPeriod)}</td>
        <td>
          <button
            is="app-button"
            ?disabled=${actionsDisabled}
            @click=${actionsDisabled ? undefined : () => this.#restore()}
          >
            Restore
          </button>
        </td>
      </tr>
    `;
  }

  #restore() {
    this.processing = true;
    fetchJSON(`/restore/${this.selectedBackup}`, { method: 'POST' })
      .then(() => this.dispatchEvent(new BackupRestoredEvent()))
      .catch((err) =>
        this.dispatchEvent(new AppErrorEvent('Unable to create backup', err))
      )
      .finally(() => {
        this.processing = false;
      });
  }
}
