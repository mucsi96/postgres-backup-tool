import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'retention',
  standalone: true,
})
export class RetentionPipe implements PipeTransform {
  transform(value: number): string {
    if (!value) {
      return '';
    }

    if (value === 1) {
      return `${value} day`;
    }

    return `${value} days`;
  }
}
