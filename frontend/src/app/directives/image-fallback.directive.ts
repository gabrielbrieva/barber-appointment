import { Directive, HostBinding, Input } from '@angular/core';

@Directive({
  selector: 'img[default]',
  host: {
    '(error)': 'updateUrl()',
    '(load)': 'load()',
    '[src]': 'src'
  }
})
export class ImageFallbackDirective {

  @Input() src: string;
  @Input() default: string;
  @HostBinding('class') className;

  updateUrl(): void {
    this.src = this.default;
  }

  load(): void {
    this.className = 'image-loaded';
  }

}
