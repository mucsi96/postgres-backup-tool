import { LitElement, css, html } from 'lit';
import { property } from 'lit/decorators.js';
import { customElement } from './components/utils';
import { AppErrorEvent, BackupRestoredEvent } from './events';
import { fetchJSON, formatSize, getRelativeTimeString } from './utils';
import { Backup } from './models';

function formatRetention(value: number) {
  if (!value) {
    return '';
  }

  if (value === 1) {
    return `${value} day`;
  }

  return `${value} days`;
}

@customElement({
  name: 'app-backups',
  styles: css`
    :host {
      display: grid;
      gap: 20px;
    }
  `,
})
class AppBackups extends LitElement {
  @property({ type: Array })
  backups?: Backup[];

  @property({ type: String })
  selectedBackup?: string;

  @property({ type: Boolean })
  processing = false;

  render() {
    this.style.justifyContent = this.backups ? 'flex-start' : 'center';

    if (!this.backups) {
      return html`<div is="bt-loader"></div>`;
    }

    return html`
      <h2 is="bt-heading">
        Backups <span is="bt-badge">${this.backups.length}</span>
      </h2>
      ${this.backups.length
        ? html`<table is="bt-table" id="backups">
            <thead>
              <tr>
                <th></th>
                <th>Date</th>
                <th>Name</th>
                <th center-align>Records</th>
                <th center-align>Size</th>
                <th center-align>Retention</th>
                <th></th>
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
        <td
          is="bt-row-selector"
          ?selected=${backup.name === this.selectedBackup}
        ></td>
        <td highlighted no-wrap>
          ${backup.lastModified
            ? getRelativeTimeString(new Date(backup.lastModified))
            : '-'}
        </td>
        <td no-wrap>${backup.name}</td>
        <td center-align>${backup.totalRowCount}</td>
        <td no-wrap center-align>${formatSize(backup.size)}</td>
        <td center-align>${formatRetention(backup.retentionPeriod)}</td>
        <td center-align>
          <button
            is="bt-button"
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
