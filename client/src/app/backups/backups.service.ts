import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  ErrorNotificationEvent,
  SuccessNotificationEvent,
} from '@mucsi96/ui-elements';
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
import { Backup } from '../../types';
import { handleError } from '../utils/handleError';

@Injectable({
  providedIn: 'root',
})
export class BackupsService {
  $lastBackupTime: Observable<Date | undefined>;
  $backups: Observable<Backup[]>;
  $backupMutations = new BehaviorSubject<void>(undefined);
  loading = signal(true);
  processing = signal(false);

  constructor(private readonly http: HttpClient) {
    this.$backups = this.$backupMutations.pipe(
      tap(() => this.loading.set(true)),
      switchMap(() =>
        this.http.get<Backup[]>(environment.apiContextPath + '/backups').pipe(
          map((backups) =>
            backups.map((backup) => ({
              ...backup,
              lastModified: new Date(backup.lastModified),
            }))
          ),
          handleError('Could not fetch backups.'),
          shareReplay(1),
          finalize(() => this.loading.set(false))
        )
      )
    );
    this.$lastBackupTime = this.$backupMutations.pipe(
      switchMap(() =>
        this.http.get<Date | undefined>(
          environment.apiContextPath + '/last-backup-time'
        )
      ),
      map((lastBackupTime) => lastBackupTime && new Date(lastBackupTime)),
      tap((lastBackupTime) => {
        if (
          !lastBackupTime ||
          lastBackupTime.getTime() +
            1 /*d*/ * 24 /*h*/ * 60 /*m*/ * 60 /*s*/ * 1000 /*ms*/ <
            Date.now()
        ) {
          document.dispatchEvent(
            new ErrorNotificationEvent('No backup since one day')
          );
        }
      }),
      handleError('Unable to fetch last backup time'),
      shareReplay(1)
    );
  }

  getLastBackupTime() {
    return toSignal(this.$lastBackupTime);
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
        complete: () => {
          document.dispatchEvent(
            new SuccessNotificationEvent('Backup created')
          );
          this.$backupMutations.next();
        },
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
        complete: () => {
          document.dispatchEvent(
            new SuccessNotificationEvent('Backup cleanup finished')
          );
          this.$backupMutations.next();
        },
      });
  }

  isProcessing() {
    return this.processing;
  }
}
