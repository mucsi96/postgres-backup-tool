import { css, html } from "lit";
import "./components/header.js";
import "./components/main.js";
import "./components/heading.js";
import "./components/button.js";
import "./components/table.js";
import "./components/loader.js";
import "./components/badge.js";
import "./components/notifications.js";
import "./components/numberInput.js";
import "./tables.js";
import "./backups.js";
import { AppErrorEvent } from "./events.js";
import {
  ErrorNotificationEvent,
  SuccessNotificationEvent,
} from "./components/notifications.js";
import { fetchJSON, getRelativeTimeString } from "./utils.js";
import { LightDOMLitElement } from "./core.js";

class App extends LightDOMLitElement {
  static styles = css`
    #main {
      margin-top: 32px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      align-items: flex-start;
      gap: 32px;
    }
  `;

  static properties = {
    tables: { type: Array },
    totalRowCount: { type: Number },
    backups: { type: Array },
    lastBackupTime: { type: String },
  };

  constructor() {
    super();
    document.addEventListener("app-error", (event) => {
      console.error(event.details.error);
      this.dispatchEvent(new ErrorNotificationEvent(event.details.message));
    });
  }

  async #fetchTables() {
    try {
      const { tables, totalRowCount } = await fetchJSON("/tables");
      this.tables = tables;
      this.totalRowCount = totalRowCount;
    } catch (err) {
      this.tables = [];
      this.dispatchEvent(new AppErrorEvent("Unable to fetch tables", err));
    }
  }

  async #fetchBackups() {
    try {
      this.backups = await fetchJSON("/backups");
    } catch (err) {
      this.backups = [];
      this.dispatchEvent(new AppErrorEvent("Unable to fetch backups", err));
    }
  }

  async #fetchLastBackupTime() {
    try {
      const lastBackupResponse = await fetchJSON("/last-backup-time")
      const lastBackupTime = lastBackupResponse && new Date(lastBackupResponse);
      if (
        !lastBackupTime ||
        lastBackupTime.getTime() +
          1 /*d*/ * 24 /*h*/ * 60 /*m*/ * 60 /*s*/ * 1000 /*ms*/ <
          Date.now()
      ) {
        this.dispatchEvent(new AppErrorEvent("No backup since one day"));
      }
      this.lastBackupTime = lastBackupTime && getRelativeTimeString(lastBackupTime);
    } catch (err) {
      this.lastBackupTime = "";
      this.dispatchEvent(
        new AppErrorEvent("Unable to fetch last backup time", err)
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
        ><app-heading level="3"
          >Last backup
          <app-badge>${this.lastBackupTime}</app-badge></app-heading
        ></app-header
      >
      <app-main>
        <div id="main">
          <app-tables
            .tables=${this.tables}
            total-count=${this.totalRowCount}
            @backup-created=${() => {
              this.#fetchBackups();
              this.#fetchLastBackupTime();
              this.dispatchEvent(
                new SuccessNotificationEvent("Backup created")
              );
            }}
            @cleanup-finished=${() => {
              this.#fetchBackups();
              this.#fetchLastBackupTime();
              this.dispatchEvent(
                new SuccessNotificationEvent("Cleanup finished")
              );
            }}
          ></app-tables>
          <app-backups
            .backups=${this.backups}
            @backup-restored=${() => {
              this.#fetchTables();
              this.dispatchEvent(
                new SuccessNotificationEvent("Backup restored")
              );
            }}
          ></app-backups>
        </div>
      </app-main>
      <app-notifications></app-notifications>
    `;
  }
}

window.customElements.define("app-body", App);
