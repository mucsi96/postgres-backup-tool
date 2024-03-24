import {
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
    & {
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
        ? html`<app-table id="backups"
            ><table>
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
            </table></app-table
          >`
        : ""}
    `;
  }

  #renderBackup(backup) {
    const actionsDisabled =
      backup.name !== this.selectedBackup || this.processing;
    return html`
      <tr
        @click=${() => {
          this.selectedBackup = backup.name;
        }}
      >
        <td>
          <app-table-selector
            ?selected=${backup.name === this.selectedBackup}
          ></app-table-selector>
        </td>
        <td highlighted no-wrap>
          ${getRelativeTimeString(new Date(backup.lastModified))}
        </td>
        <td no-wrap>${backup.name}</td>
        <td>${backup.totalRowCount}</td>
        <td no-wrap>${formatSize(backup.size)}</td>
        <td>${formatRetention(backup.retentionPeriod)}</td>
        <td>
          <app-button
            ?disabled=${actionsDisabled}
            @click=${actionsDisabled ? undefined : () => this.#restore()}
            >Restore</app-button
          >
        </td>
      </tr>
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
