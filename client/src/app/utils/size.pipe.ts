import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'size',
  standalone: true,
})
export class SizePipe implements PipeTransform {
  transform(size: number): string {
    for (const unit of ['', 'K', 'M']) {
      if (Math.abs(size) < 1024) {
        return `${size.toFixed(1)} ${unit}B`;
      }

      size /= 1024;
    }

    return `${size.toFixed(1)} GB`;
  }
}
