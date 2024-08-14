import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { finalize, map, Observable, shareReplay } from 'rxjs';
import { environment } from '../../environments/environment';
import { Table } from '../../types';
import { handleError } from '../utils/handleError';
import { SuccessNotificationEvent } from '@mucsi96/ui-elements';

@Injectable({
  providedIn: 'root',
})
export class TablesService {
  $tables: Observable<{
    tables: Table[];
    totalRowCount: number;
  }>;
  loading = signal(true);
  processing = signal(false);

  constructor(private readonly http: HttpClient) {
    this.$tables = this.http
      .get<{
        tables: Table[];
        totalRowCount: number;
      }>(environment.apiContextPath + '/tables')
      .pipe(
        handleError('Could not fetch tables.'),
        shareReplay(1),
        finalize(() => this.loading.set(false))
      );
  }

  getTables() {
    return toSignal(this.$tables.pipe(map((data) => data.tables)));
  }

  getTotalRowCount() {
    return toSignal(this.$tables.pipe(map((data) => data.totalRowCount)));
  }

  isLoading() {
    return this.loading;
  }

  cleanupTables() {
    this.processing.set(true);
    this.http
      .post<void>(environment.apiContextPath + '/cleanup', {})
      .pipe(
        handleError('Could not cleanup tables.'),
        finalize(() => this.processing.set(false))
      )
      .subscribe({
        complete: () =>
          document.dispatchEvent(
            new SuccessNotificationEvent('Cleanup finished')
          ),
      });
  }

  isProcessing() {
    return this.processing;
  }
}
