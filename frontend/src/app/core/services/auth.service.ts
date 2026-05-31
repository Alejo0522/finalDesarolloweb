import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  
  private currentUserSubject = new BehaviorSubject<string | null>(sessionStorage.getItem('username'));
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {}

  register(username: string, password: string) {
    return this.http.post(`${environment.apiUrl}/auth/register`, { username, password });
  }

  login(username: string, password: string) {
    return this.http.post<any>(`${environment.apiUrl}/auth/login`, { username, password })
      .pipe(
        tap(response => {
          sessionStorage.setItem('token', response.token);
          sessionStorage.setItem('username', response.username);
          this.currentUserSubject.next(response.username);
        })
      );
  }

  logout() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('username');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!sessionStorage.getItem('token');
  }

  getCurrentUsername(): string | null {
    return sessionStorage.getItem('username');
  }
}
