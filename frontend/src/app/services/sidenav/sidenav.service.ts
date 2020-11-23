import { EventEmitter, Injectable, Output } from '@angular/core';
import { NGXLogger } from 'ngx-logger';

@Injectable({
  providedIn: 'root'
})
export class SidenavService {

  @Output()
  toggleChanged = new EventEmitter<void>();

  constructor(private logger: NGXLogger) { }

  toggle(): void {
    this.logger.info('Sidenav toggle');
    this.toggleChanged.emit();
  }
}
