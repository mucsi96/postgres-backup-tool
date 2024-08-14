import { Component, computed, signal, Signal } from '@angular/core';
import { Table } from '../../types';
import { TablesService } from './tables.service';
import { BackupsService } from '../backups/backups.service';

@Component({
  selector: 'app-tables',
  standalone: true,
  imports: [],
  templateUrl: './tables.component.html',
  styleUrl: './tables.component.css',
})
export class TablesComponent {
  totalRowCount: Signal<number | undefined>;
  tables: Signal<Table[] | undefined>;
  retentionPeriod = signal(1);
  processing: Signal<boolean>;
  loading: Signal<boolean>;

  constructor(
    private readonly tableService: TablesService,
    private readonly backupsService: BackupsService
  ) {
    this.tables = this.tableService.getTables();
    this.totalRowCount = this.tableService.getTotalRowCount();
    this.loading = this.tableService.isLoading();
    this.processing = computed(
      () =>
        this.tableService.isProcessing()() ||
        this.backupsService.isProcessing()()
    );
  }

  createBackup() {
    this.backupsService.createBackup(this.retentionPeriod());
  }

  cleanup() {
    this.tableService.cleanupTables();
  }
}
