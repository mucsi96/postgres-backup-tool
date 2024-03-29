class AppEvent<T> extends CustomEvent<T> {
  constructor(name: string, detail?: T) {
    super(name, { bubbles: true, composed: true, detail });
  }
}

export class AppErrorEvent extends AppEvent<{ message: string; error?: Error }> {
  constructor(message: string, error?: Error) {
    super('app-error', { message, error });
  }
}

export class BackupCreatedEvent extends AppEvent<void> {
  constructor() {
    super('backup-created');
  }
}

export class BackupRestoredEvent extends AppEvent<void> {
  constructor() {
    super('backup-restored');
  }
}

export class CleanupFinishedEvent extends AppEvent<void> {
  constructor() {
    super('cleanup-finished');
  }
}
