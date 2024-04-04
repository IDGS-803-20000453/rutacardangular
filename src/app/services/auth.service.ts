import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.model'; 
import { Router } from '@angular/router'; 

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = new BehaviorSubject<boolean>(false);
  private currentUser = new BehaviorSubject<User | null>(null);

  constructor(    private router: Router
    ) {
    this.loadUserFromLocalStorage();

  }

  get isLoggedIn(): Observable<boolean> {
    return this.isAuthenticated.asObservable();
  }

  get currentUserValue(): User | null {
    return this.currentUser.value;
  }

  login(response: any): void {
    localStorage.setItem('token', response.token);
  
    // Almacena también la información del usuario en localStorage
    const userInfo = {
      usuarioId: response.usuarioId,
      email: response.email,
      nombre: response.nombre, 
      rolId: response.rolId,
      imagenURL: response.imagenURL,
      nombreRol: response.nombreRol,
    };
    localStorage.setItem('userInfo', JSON.stringify(userInfo)); // Convierte el objeto del usuario a string para almacenarlo
  
    this.setCurrentUser(userInfo);
  }
  
  private loadUserFromLocalStorage(): void {
    const token = localStorage.getItem('token');
    const userInfoString = localStorage.getItem('userInfo');
    if (token && userInfoString) {
      const userInfo = JSON.parse(userInfoString); // Convierte el string almacenado a un objeto
      this.setCurrentUser(userInfo);
    }
  }
  
  private setCurrentUser(user: User): void {
    this.currentUser.next(user);
    this.isAuthenticated.next(true);
  }
  
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo'); 
    this.currentUser.next(null);
    this.isAuthenticated.next(false);
    this.router.navigate(['/']);
  }
  
}
