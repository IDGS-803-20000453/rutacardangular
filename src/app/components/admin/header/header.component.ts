import { Component } from '@angular/core';
import { Router } from '@angular/router'; // Importa el Router
import { AuthService } from 'src/app/services/auth.service';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-admin-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('in', style({ opacity: 1 })),
      transition(':enter', [
        style({ opacity: 0 }),
        animate(600)
      ]),
      transition(':leave', [
        animate(600, style({ opacity: 0 }))
      ])
    ])
  ]
})
export class HeaderComponent {
  constructor(
    public authService: AuthService,
    private router: Router // Inyecta el Router
  ) { }
  logout() {
    console.log('Cerrando sesión...');
    this.authService.logout();
    this.router.navigate(['/']); // Redirige a la página de inicio
  }
  
}
