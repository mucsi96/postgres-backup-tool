import { ErrorNotificationEvent } from '@mucsi96/ui-elements';
import { catchError, Observable, of, pipe } from 'rxjs';

export function handleError<T>(message: string) {
  return pipe(
    catchError<T, Observable<T>>((e) => {
      document.dispatchEvent(new ErrorNotificationEvent(message));

      return of(e);
    })
  );
}
