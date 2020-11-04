import { Component, OnInit } from '@angular/core';
import { SidenavService } from '../../services/sidenav.service';

@Component({
  selector: 'app-menubar',
  templateUrl: './menubar.component.html',
  styleUrls: ['./menubar.component.scss']
})
export class MenubarComponent implements OnInit {

  constructor(private sideNavSrv: SidenavService) { }

  ngOnInit(): void {
  }

  toogleSidenav(): void {
    this.sideNavSrv.toggle();
  }

}
