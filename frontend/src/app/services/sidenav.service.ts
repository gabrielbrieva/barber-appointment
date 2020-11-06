import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidenavService {

  @Output()
  toggleChanged = new EventEmitter<void>();

  constructor() { }

  toggle(): void {
    this.toggleChanged.emit();
  }
}
