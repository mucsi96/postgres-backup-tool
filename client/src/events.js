class AppEvent extends Event {
  constructor(name) {
    super(name, { bubbles: true, composed: true });
  }
}

export class AppErrorEvent extends AppEvent {
  constructor(message, error) {
    super("app-error");
    this.details = {
      message,
      error
    }
  }
}

export class BackupCreatedEvent extends AppEvent {
  constructor() {
    super("backup-created");
  }
}

export class BackupRestoredEvent extends AppEvent {
  constructor() {
    super("backup-restored");
  }
}

export class CleanupFinishedEvent extends AppEvent {
  constructor() {
    super("cleanup-finished");
  }
}