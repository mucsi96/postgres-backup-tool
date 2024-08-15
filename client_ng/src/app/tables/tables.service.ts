import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  BehaviorSubject,
  finalize,
  map,
  Observable,
  shareReplay,
  switchMap,
  tap,
} from 'rxjs';
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
  $tableMutations = new BehaviorSubject<void>(undefined);
  loading = signal(true);
  processing = signal(false);

  constructor(private readonly http: HttpClient) {
    this.$tables = this.$tableMutations.pipe(
      tap(() => this.loading.set(true)),
      switchMap(() =>
        this.http
          .get<{
            tables: Table[];
            totalRowCount: number;
          }>(environment.apiContextPath + '/tables')
          .pipe(
            handleError('Could not fetch tables.'),
            shareReplay(1),
            finalize(() => this.loading.set(false))
          )
      )
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

  restoreBackup(selectedBackup: string) {
    this.processing.set(true);
    this.http
      .post<void>(environment.apiContextPath + `/restore/${selectedBackup}`, {})
      .pipe(
        handleError('Could not restore backup.'),
        finalize(() => this.processing.set(false))
      )
      .subscribe({
        complete: () => {
          document.dispatchEvent(
            new SuccessNotificationEvent('Backup restored')
          );
          this.$tableMutations.next();
        },
      });
  }

  isProcessing() {
    return this.processing;
  }
}
