import { Component, computed, signal, Signal } from '@angular/core';
import { Table } from '../../types';
import { TablesService } from './tables.service';

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
  actionsDisabled = signal(false);

  constructor(private readonly tableService: TablesService) {
    this.tables = this.tableService.getTables();
    this.totalRowCount = this.tableService.getTotalRowCount();
  }
}
