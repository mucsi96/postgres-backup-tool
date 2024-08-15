import { Component, signal, Signal, WritableSignal } from '@angular/core';
import { Backup } from '../../types';
import { BackupsService } from './backups.service';
import { SizePipe } from '../utils/size.pipe';
import { RetentionPipe } from '../utils/retention.pipe';
import { RelativeTimePipe } from '../utils/relativeTime.pipe';
import { TablesService } from '../tables/tables.service';

@Component({
  selector: 'app-backups',
  standalone: true,
  imports: [SizePipe, RetentionPipe, RelativeTimePipe],
  templateUrl: './backups.component.html',
  styleUrl: './backups.component.css',
})
export class BackupsComponent {
  backups: Signal<Backup[] | undefined>;
  processing: Signal<boolean>;
  loading: Signal<boolean>;
  selectedBackup: WritableSignal<string | undefined> = signal(undefined);

  constructor(
    private readonly backupsService: BackupsService,
    private readonly tableService: TablesService
  ) {
    this.backups = this.backupsService.getBackups();
    this.processing = this.backupsService.isProcessing();
    this.loading = this.backupsService.isLoading();
  }

  restoreBackup() {
    const selectedBackup = this.selectedBackup();

    if (this.processing() || !selectedBackup) {
      return;
    }

    this.tableService.restoreBackup(selectedBackup);
  }

  selectBackup(backup: Backup) {
    this.selectedBackup.set(backup.name);
  }

  cleanupBackups() {
    this.backupsService.cleanupBackups();
  }
}
