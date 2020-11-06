import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Subscription } from 'rxjs';
import { SidenavService } from 'src/app/services/sidenav.service';

@Component({
  selector: 'app-drawer',
  templateUrl: './drawer.component.html',
  styleUrls: ['./drawer.component.scss']
})
export class DrawerComponent implements OnInit, OnDestroy {

  @ViewChild('sidenav')
  private sidenav: MatSidenav;
  private sidenavObserver: Subscription;

  constructor(private sideNavSrv: SidenavService) { }

  ngOnInit(): void {
    // subscribe to sidenav toggle changed event
    this.sideNavSrv.toggleChanged.subscribe(() => {
      this.sidenav.toggle();
    });
  }

  ngOnDestroy(): void {
    // unsubscribe from sidenav toggle changed event
    this.sidenavObserver?.unsubscribe();
  }

}
