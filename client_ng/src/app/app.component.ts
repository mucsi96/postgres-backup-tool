import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TablesComponent } from './tables/tables.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TablesComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
}
