import { Injectable, signal } from '@angular/core';
import { finalize, map, Observable, shareReplay, tap } from 'rxjs';
import { Backup } from '../../types';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { handleError } from '../utils/handleError';
import { toSignal } from '@angular/core/rxjs-interop';
import { SuccessNotificationEvent } from '@mucsi96/ui-elements';

@Injectable({
  providedIn: 'root',
})
export class BackupsService {
  $backups: Observable<Backup[]>;
  loading = signal(true);
  processing = signal(false);

  constructor(private readonly http: HttpClient) {
    this.$backups = this.http
      .get<Backup[]>(environment.apiContextPath + '/backups')
      .pipe(
        map((backups) =>
          backups.map((backup) => ({
            ...backup,
            lastModified: new Date(backup.lastModified),
          }))
        ),
        handleError('Could not fetch backups.'),
        shareReplay(1),
        finalize(() => this.loading.set(false))
      );
  }

  getBackups() {
    return toSignal(this.$backups);
  }

  isLoading() {
    return this.loading;
  }

  createBackup(retentionPeriod: number) {
    this.processing.set(true);
    this.http
      .post<void>(
        environment.apiContextPath +
          `/backup?retention_period=${retentionPeriod}`,
        {}
      )
      .pipe(
        handleError('Could not create backup.'),
        finalize(() => this.processing.set(false))
      )
      .subscribe({
        complete: () =>
          document.dispatchEvent(
            new SuccessNotificationEvent('Backup created')
          ),
      });
  }

  cleanupBackups() {
    this.processing.set(true);
    this.http
      .post<void>(environment.apiContextPath + '/cleanup', {})
      .pipe(
        handleError('Could not cleanup backups.'),
        finalize(() => this.processing.set(false))
      )
      .subscribe({
        complete: () =>
          document.dispatchEvent(
            new SuccessNotificationEvent('Backup cleanup finished')
          ),
      });
  }

  isProcessing() {
    return this.processing;
  }
}
