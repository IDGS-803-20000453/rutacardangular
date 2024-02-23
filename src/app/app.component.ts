import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  template: `
    <app-admin-header *ngIf="isAdmin()"></app-admin-header>
    <app-header *ngIf="!isAdmin()"></app-header>

    <router-outlet></router-outlet>

    <app-footer></app-footer>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private authService: AuthService) {}
  isAdmin(): boolean {
    return this.authService.currentUserValue?.rolId === 1;
  }
  title = 'rutacard';
}
