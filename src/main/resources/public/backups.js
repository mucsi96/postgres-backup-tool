import {
  LitElement,
  html,
  css,
} from "https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js";
import { fetchJSON, formatSize, getRelativeTimeString } from "./utils.js";
import { BackupRestoredEvent } from "./events.js";
import { LightDOMLitElement } from "./core.js";

function formatRetention(value) {
  if (!value) {
    return "";
  }

  if (value === 1) {
    return `${value} day`;
  }

  return `${value} days`;
}

class AppBackups extends LightDOMLitElement {
  static properties = {
    backups: { type: Array },
    selectedBackup: { type: String },
    processing: { type: Boolean },
  };

  static styles = css`
    app-backups {
      display: grid;
      gap: 20px;
    }
  `;

  render() {
    this.style.justifyContent = this.backups ? "flex-start" : "center";

    if (!this.backups) {
      return html`<app-loader></app-loader>`;
    }

    return html`
      <app-heading level="2"
        >Backups <app-badge>${this.backups.length}</app-badge></app-heading
      >
      ${this.backups.length
        ? html`<app-table id="backups">
            <app-thead>
              <app-tr>
                <app-th></app-th>
                <app-th>Date</app-th>
                <app-th>Name</app-th>
                <app-th>Records</app-th>
                <app-th>Size</app-th>
                <app-th>Retention</app-th>
                <app-th>Action</app-th>
              </app-tr>
            </app-thead>
            <app-tbody>
              ${this.backups.map((backup) => this.#renderBackup(backup))}
            </app-tbody>
          </app-table>`
        : ""}
    `;
  }

  #renderBackup(backup) {
    const actionsDisabled =
      backup.name !== this.selectedBackup || this.processing;
    return html`
      <app-tr
        selectable
        ?selected=${backup.name === this.selectedBackup}
        @click=${() => {
          this.selectedBackup = backup.name;
        }}
      >
        <app-td highlighted no-wrap
          >${getRelativeTimeString(new Date(backup.lastModified))}</app-td
        >
        <app-td no-wrap>${backup.name}</app-td>
        <app-td>${backup.totalRowCount}</app-td>
        <app-td no-wrap>${formatSize(backup.size)}</app-td>
        <app-td>${formatRetention(backup.retentionPeriod)}</app-td>
        <app-td>
          <app-button
            ?disabled=${actionsDisabled}
            @click=${actionsDisabled ? undefined : () => this.#restore()}
            >Restore</app-button
          >
        </app-td>
      </app-tr>
    `;
  }

  #restore() {
    this.processing = true;
    fetchJSON(`/restore/${this.selectedBackup}`, { method: "POST" })
      .then(() => this.dispatchEvent(new BackupRestoredEvent()))
      .catch((err) =>
        this.dispatchEvent(new AppErrorEvent("Unable to create backup", err))
      )
      .finally(() => {
        this.processing = false;
      });
  }
}

window.customElements.define("app-backups", AppBackups);
