import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidenavService {

  @Output()
  onToggle = new EventEmitter<void>();

  constructor() { }

  toggle(): void {
    this.onToggle.emit();
  }
}
