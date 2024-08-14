import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { finalize, map, Observable, shareReplay } from 'rxjs';
import { environment } from '../../environments/environment';
import { Table } from '../../types';
import { handleError } from '../../utils/handleError';

@Injectable({
  providedIn: 'root',
})
export class TablesService {
  $tables: Observable<{
    tables: Table[];
    totalRowCount: number;
  }>;
  $cleanup: Observable<void>;
  loading = signal(true);
  processing = signal(false);

  constructor(private http: HttpClient) {
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

    this.$cleanup = this.http
      .post<void>(environment.apiContextPath + '/cleanup', {})
      .pipe(
        handleError('Could not cleanup tables.'),
        finalize(() => this.processing.set(false))
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
    this.$cleanup.subscribe();
  }

  isProcessing() {
    return this.processing;
  }
}
