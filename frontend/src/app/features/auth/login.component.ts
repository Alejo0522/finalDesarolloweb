import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="auth-wrapper">
      <div class="slideshow">
        <div class="slide slide-1"></div>
        <div class="slide slide-2"></div>
        <div class="slide slide-3"></div>
      </div>
      <div class="bg-overlay"></div>
      
      <div class="glass-panel auth-box animate-fade-in">
        <h2 class="auth-title">FoodieReviews</h2>
        <p class="auth-subtitle">Inicia sesión para descubrir y reseñar</p>
        
        <form (ngSubmit)="onLogin()" #loginForm="ngForm">
          <div class="form-group">
            <input type="text" class="form-control" placeholder="Usuario" [(ngModel)]="username" name="username" required>
          </div>
          <div class="form-group">
            <input type="password" class="form-control" placeholder="Contraseña" [(ngModel)]="password" name="password" required>
          </div>
          
          <div *ngIf="errorMessage" class="error-msg">{{ errorMessage }}</div>
          
          <button type="submit" class="btn-primary w-100" [disabled]="!loginForm.form.valid">Entrar</button>
        </form>
        
        <div class="auth-footer">
          ¿No tienes cuenta? <a routerLink="/register">Regístrate aquí</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-wrapper {
      position: relative;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      overflow: hidden;
    }
    .slideshow {
      position: fixed;
      top: 0; left: 0; width: 100vw; height: 100vh;
      z-index: -2;
    }
    .slide {
      position: absolute;
      top: 0; left: 0; width: 100%; height: 100%;
      background-size: cover;
      background-position: center;
      opacity: 0;
      animation: fadeSlide 24s infinite;
    }
    .slide-1 { background-image: url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80'); animation-delay: 0s; }
    .slide-2 { background-image: url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80'); animation-delay: 8s; }
    .slide-3 { background-image: url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80'); animation-delay: 16s; }

    @keyframes fadeSlide {
      0% { opacity: 0; transform: scale(1); }
      10% { opacity: 1; }
      33% { opacity: 1; }
      43% { opacity: 0; transform: scale(1.1); }
      100% { opacity: 0; }
    }

    .bg-overlay {
      position: absolute;
      top: 0; left: 0; width: 100%; height: 100%;
      background: linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(0, 0, 0, 0.9) 100%);
      z-index: -1;
    }
    
    .auth-box {
      width: 100%;
      max-width: 420px;
      padding: 45px 35px;
      text-align: center;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 15px 35px rgba(0,0,0,0.5);
      border-radius: 24px;
    }
    .auth-title { color: #fff; margin-bottom: 5px; font-weight: 700; font-size: 2.2rem; text-shadow: 0 2px 10px rgba(0,0,0,0.5); }
    .auth-subtitle { color: #cbd5e1; margin-bottom: 35px; font-size: 0.95rem; }
    .w-100 { width: 100%; padding: 14px; font-size: 1.1rem; border-radius: 12px; }
    .form-control { background: rgba(255, 255, 255, 0.95); border: 2px solid transparent; padding: 14px; border-radius: 12px; transition: all 0.3s ease; }
    .form-control:focus { background: #fff; border-color: var(--primary); box-shadow: 0 0 15px rgba(255, 107, 107, 0.3); }
    .error-msg { background: rgba(255, 71, 87, 0.15); color: #ff6b81; padding: 12px; border-radius: 10px; font-size: 0.9rem; margin-bottom: 20px; border: 1px solid rgba(255, 71, 87, 0.3); }
    .auth-footer { margin-top: 25px; font-size: 0.95rem; color: #cbd5e1; }
    .auth-footer a { color: #ff6b6b; text-decoration: none; font-weight: 600; transition: color 0.3s; }
    .auth-footer a:hover { color: #ff8787; text-decoration: underline; }
  `]
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';

  private authService = inject(AuthService);
  private router = inject(Router);

  onLogin() {
    this.authService.login(this.username, this.password).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => this.errorMessage = err.error?.message || 'Error login'
    });
  }
}
