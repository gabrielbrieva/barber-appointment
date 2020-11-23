import { Component } from '@angular/core';
import { SidenavService } from '../../services/sidenav/sidenav.service';

@Component({
  selector: 'app-menubar',
  templateUrl: './menubar.component.html',
  styleUrls: ['./menubar.component.scss']
})
export class MenubarComponent {

  constructor(private sideNavSrv: SidenavService) { }

  toogleSidenav(): void {
    this.sideNavSrv.toggle();
  }

}
