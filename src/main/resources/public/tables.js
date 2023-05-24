import {
  LitElement,
  html,
  css,
} from "https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js";
import {
  BackupCreatedEvent,
  AppErrorEvent,
  CleanupFinishedEvent,
} from "./events.js";
import { fetchJSON } from "./utils.js";

class AppTables extends LitElement {
  static properties = {
    tables: { type: Array },
    "total-count": { type: Number },
    processing: { type: Boolean },
    "retention-period": { type: Number },
  };

  static styles = css`
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
          ? html`<app-table>
              <app-thead>
                <app-tr>
                  <app-th>Name</app-th>
                  <app-th>Records</app-th>
                </app-tr>
              </app-thead>
              <app-tbody>
                ${this.tables.map(
                  (table) => html`
                    <app-tr>
                      <app-td highlighted>${table.name}</app-td>
                      <app-td>${table.count}</app-td>
                    </app-tr>
                  `
                )}
              </app-tbody>
            </app-table>`
          : ""}
      </div>
      <div class="backup">
        <app-heading level="2">Backup</app-heading>
        <app-number-input
          value=${this["retention-period"]}
          min="1"
          max="356"
          step="1"
          @value-change=${(event) => {
            this["retention-period"] = event.details;
          }}
          >Retention period (days)</app-number-input
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
    fetchJSON(`./backup?retention_period=${retentionPeriod}`, { method: "POST" })
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
