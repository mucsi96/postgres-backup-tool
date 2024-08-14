import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TablesComponent } from './tables/tables.component';
import { BackupsComponent } from './backups/backups.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TablesComponent, BackupsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
}
