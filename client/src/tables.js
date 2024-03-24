import {
  css,
  html,
} from "https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js";
import { LightDOMLitElement } from "./core.js";
import {
  AppErrorEvent,
  BackupCreatedEvent,
  CleanupFinishedEvent,
} from "./events.js";
import { fetchJSON } from "./utils.js";

class AppTables extends LightDOMLitElement {
  static properties = {
    tables: { type: Array },
    "total-count": { type: Number },
    processing: { type: Boolean },
    "retention-period": { type: Number },
  };

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

  constructor() {
    super();
    this["retention-period"] = 1;
  }

  render() {
    this.style.justifyContent = this.tables ? "flex-start" : "center";

    if (!this.tables) {
      return html`<app-loader></app-loader>`;
    }

    const actionsDisabled = this.processing;

    return html`
      <app-heading level="2"
        >Records <app-badge>${this["total-count"]}</app-badge></app-heading
      >
      <div class="tables">
        <app-heading level="2"
          >Tables <app-badge>${this.tables.length}</app-badge></app-heading
        >
        ${this.tables.length
          ? html`<app-table
              ><table>
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
              </table></app-table
            >`
          : ""}
      </div>
      <div class="backup">
        <app-heading level="2">Backup</app-heading>
        <app-number-input
          label="Retention period (days)"
          value=${this["retention-period"]}
          min="1"
          max="356"
          step="1"
          @value-change=${(event) => {
            this["retention-period"] = event.details;
          }}
          ></app-number-input
        >
        <section>
          <app-button
            ?disabled=${actionsDisabled}
            @click="${actionsDisabled
              ? undefined
              : () => this.#backup(this["retention-period"])}"
            >Backup</app-button
          >
        </section>
      </div>
      <div class="cleanup">
        <app-heading level="2">Cleanup</app-heading>
        <section>
          <app-button
            color="red"
            ?disabled=${actionsDisabled}
            @click="${actionsDisabled ? undefined : () => this.#cleanup()}"
            >Cleanup</app-button
          >
        </section>
      </div>
    `;
  }

  #backup(retentionPeriod) {
    this.processing = true;
    fetchJSON(`/backup?retention_period=${retentionPeriod}`, { method: "POST" })
      .then(() => this.dispatchEvent(new BackupCreatedEvent()))
      .catch((err) =>
        this.dispatchEvent(new AppErrorEvent("Unable to create backup", err))
      )
      .finally(() => {
        this.processing = false;
      });
  }

  #cleanup() {
    this.processing = true;
    fetchJSON("/cleanup", { method: "POST" })
      .then(() => this.dispatchEvent(new CleanupFinishedEvent()))
      .catch((err) =>
        this.dispatchEvent(new AppErrorEvent("Unable to cleanup", err))
      )
      .finally(() => {
        this.processing = false;
      });
  }
}

window.customElements.define("app-tables", AppTables);
