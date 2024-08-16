import { Component, Signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TablesComponent } from './tables/tables.component';
import { BackupsComponent } from './backups/backups.component';
import { BackupsService } from './backups/backups.service';
import { RelativeTimePipe } from './utils/relativeTime.pipe';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TablesComponent, BackupsComponent, RelativeTimePipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  lastBackupTime: Signal<Date | undefined>;

  constructor(private readonly backupsService: BackupsService) {
    this.lastBackupTime = this.backupsService.getLastBackupTime();
  }
}
