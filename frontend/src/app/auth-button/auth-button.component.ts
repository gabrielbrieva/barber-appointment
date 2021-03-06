import { Component, Inject, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-auth-button',
  templateUrl: './auth-button.component.html',
  styleUrls: ['./auth-button.component.scss']
})
export class AuthButtonComponent implements OnInit {

  returnTo: string;

  constructor(@Inject(DOCUMENT) private document: any, public auth: AuthService) { }

  ngOnInit(): void {
    this.returnTo = this.document.location.origin;
  }

}
