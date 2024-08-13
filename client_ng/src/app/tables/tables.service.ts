import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Table } from '../../types';
import { catchError, map, Observable, of, shareReplay } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { ErrorNotificationEvent } from '@mucsi96/ui-elements';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TablesService {
  $tables: Observable<{
    tables: Table[];
    totalRowCount: number;
  }>;

  constructor(private http: HttpClient) {
    this.$tables = this.http
      .get<{
        tables: Table[];
        totalRowCount: number;
      }>(environment.apiContextPath + '/tables')
      .pipe(
        catchError(() => {
          document.dispatchEvent(
            new ErrorNotificationEvent('Could not fetch tables.')
          );

          return of();
        }),
        shareReplay(1)
      );
  }

  getTables() {
    return toSignal(this.$tables.pipe(map((data) => data.tables)));
  }

  getTotalRowCount() {
    return toSignal(this.$tables.pipe(map((data) => data.totalRowCount)));
  }
}
