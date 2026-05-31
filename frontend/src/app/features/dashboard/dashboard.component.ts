import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReviewService, Review } from '../../core/services/review.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="dashboard-wrapper">
      <div class="slideshow">
        <div class="slide slide-1"></div>
        <div class="slide slide-2"></div>
        <div class="slide slide-3"></div>
      </div>
      <div class="bg-overlay"></div>

      <nav class="navbar glass-panel">
        <h1 class="logo">🍽️ FoodieReviews</h1>
        <div class="user-actions">
          <span class="welcome-text">Hola, <b>{{ currentUsername }}</b></span>
          <button class="btn-danger" (click)="logout()">Salir</button>
        </div>
      </nav>

      <div class="main-content">
        <div class="glass-panel form-panel animate-fade-in">
          <h2>{{ isEditing ? 'Editar Reseña' : 'Nueva Reseña' }}</h2>
          <form (ngSubmit)="saveReview()" #reviewForm="ngForm">
            <div class="form-group">
              <input type="text" class="form-control" placeholder="Restaurante" [(ngModel)]="currentReview.restaurantName" name="restaurantName" required>
            </div>
            <div class="form-row">
              <div class="form-group half">
                <input type="number" class="form-control" placeholder="Calificación (1-5)" [(ngModel)]="currentReview.rating" name="rating" min="1" max="5" required>
              </div>
              <div class="form-group half">
                <input type="date" class="form-control" [(ngModel)]="currentReview.visitDate" name="visitDate" required>
              </div>
            </div>
            <div class="form-group">
              <textarea class="form-control" placeholder="Observaciones" [(ngModel)]="currentReview.observations" name="observations" rows="3" required></textarea>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn-primary w-100" [disabled]="!reviewForm.form.valid">
                {{ isEditing ? 'Actualizar' : 'Publicar Reseña' }}
              </button>
              <button *ngIf="isEditing" type="button" class="btn-secondary w-100 mt-2" (click)="cancelEdit()">Cancelar</button>
            </div>
          </form>
        </div>

        <div class="reviews-grid">
          <div class="glass-panel review-card animate-fade-in" *ngFor="let r of reviews; let i = index" [style.animation-delay]="i * 0.1 + 's'">
            <div class="card-header">
              <h3 class="restaurant-name">{{ r.restaurantName }}</h3>
              <div class="rating">⭐ {{ r.rating }}/5</div>
            </div>
            <p class="observations">"{{ r.observations }}"</p>
            <div class="card-footer">
              <span class="author">Por: <b>{{ r.user?.username }}</b></span>
              <span class="date">{{ r.visitDate | date:'mediumDate' }}</span>
            </div>
            
            <div class="actions" *ngIf="r.user?.username === currentUsername">
              <button class="btn-edit" (click)="editReview(r)">Editar</button>
              <button class="btn-danger" (click)="deleteReview(r._id!)">Borrar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-wrapper { position: relative; min-height: 100vh; overflow-x: hidden; }
    .slideshow { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: -2; }
    .slide { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-size: cover; background-position: center; opacity: 0; animation: fadeSlide 24s infinite; }
    .slide-1 { background-image: url('https://images.unsplash.com/photo-1498654896293-37aacf113fd9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80'); animation-delay: 0s; }
    .slide-2 { background-image: url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80'); animation-delay: 8s; }
    .slide-3 { background-image: url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80'); animation-delay: 16s; }

    @keyframes fadeSlide {
      0% { opacity: 0; transform: scale(1); }
      10% { opacity: 1; }
      33% { opacity: 1; }
      43% { opacity: 0; transform: scale(1.1); }
      100% { opacity: 0; }
    }

    .bg-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: linear-gradient(135deg, rgba(20,20,30,0.85) 0%, rgba(0,0,0,0.95) 100%); z-index: -1; }

    .navbar { display: flex; justify-content: space-between; align-items: center; padding: 15px 40px; border-radius: 0; border: none; background: rgba(15, 23, 42, 0.7); backdrop-filter: blur(15px); border-bottom: 1px solid rgba(255,255,255,0.1); position: sticky; top: 0; z-index: 10; }
    .logo { color: #fff; font-weight: 700; margin: 0; font-size: 1.5rem; text-shadow: 0 2px 10px rgba(0,0,0,0.5); }
    .welcome-text { margin-right: 20px; color: #cbd5e1; }
    .welcome-text b { color: #fff; }
    
    .main-content { display: grid; grid-template-columns: 350px 1fr; gap: 30px; padding: 30px; max-width: 1400px; margin: 0 auto; }
    .form-panel { padding: 30px; height: fit-content; position: sticky; top: 100px; background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 20px; }
    .form-panel h2 { margin-bottom: 25px; color: #fff; font-size: 1.4rem; text-shadow: 0 2px 5px rgba(0,0,0,0.5); }
    .form-row { display: flex; gap: 15px; }
    .half { width: 50%; }
    .w-100 { width: 100%; padding: 12px; border-radius: 8px;}
    .mt-2 { margin-top: 10px; }
    
    .btn-secondary { background: #475569; color: white; border: none; padding: 12px; border-radius: 8px; cursor: pointer; transition: 0.3s; font-weight: 600; }
    .btn-secondary:hover { background: #64748b; }

    .reviews-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 25px; align-content: start; }
    
    .review-card { padding: 25px; display: flex; flex-direction: column; transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); background: rgba(255, 255, 255, 0.92); border: none; border-radius: 16px; }
    .review-card:hover { transform: translateY(-8px) scale(1.02); box-shadow: 0 20px 40px rgba(0,0,0,0.3); }
    .card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 15px; }
    .restaurant-name { margin: 0; font-size: 1.3rem; color: #1e293b; font-weight: 700; line-height: 1.2;}
    .rating { background: #fef08a; color: #854d0e; padding: 5px 10px; border-radius: 20px; font-weight: 700; font-size: 0.9rem; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
    .observations { font-style: italic; color: #475569; flex-grow: 1; margin-bottom: 20px; font-size: 1rem; line-height: 1.6;}
    .card-footer { display: flex; justify-content: space-between; font-size: 0.85rem; color: #94a3b8; margin-bottom: 15px; padding-top: 15px; border-top: 1px solid #e2e8f0;}
    .author b { color: #64748b; }
    .actions { display: flex; gap: 10px; justify-content: flex-end;}

    @media (max-width: 900px) { .main-content { grid-template-columns: 1fr; } .form-panel { position: static; } }
  `]
})
export class DashboardComponent implements OnInit {
  reviews: Review[] = [];
  currentUsername = '';
  isEditing = false;
  currentReview: Review = this.getEmptyReview();

  private reviewService = inject(ReviewService);
  private authService = inject(AuthService);

  ngOnInit() {
    this.currentUsername = this.authService.getCurrentUsername() || '';
    this.loadReviews();
  }

  loadReviews() {
    this.reviewService.getAllReviews().subscribe({
      next: (data) => this.reviews = data,
      error: (err) => console.error(err)
    });
  }

  saveReview() {
    if(this.currentReview.visitDate) {
      this.currentReview.visitDate = new Date(this.currentReview.visitDate).toISOString();
    }
    if (this.isEditing && this.currentReview._id) {
      this.reviewService.updateReview(this.currentReview._id, this.currentReview).subscribe({
        next: () => { this.loadReviews(); this.cancelEdit(); }
      });
    } else {
      this.reviewService.createReview(this.currentReview).subscribe({
        next: () => { this.loadReviews(); this.cancelEdit(); }
      });
    }
  }

  editReview(review: Review) {
    this.isEditing = true;
    this.currentReview = { ...review, visitDate: new Date(review.visitDate).toISOString().split('T')[0] };
  }

  deleteReview(id: string) {
    if (confirm('¿Eliminar reseña?')) {
      this.reviewService.deleteReview(id).subscribe({ next: () => this.loadReviews() });
    }
  }

  cancelEdit() { this.isEditing = false; this.currentReview = this.getEmptyReview(); }
  logout() { this.authService.logout(); }
  private getEmptyReview(): Review { return { restaurantName: '', rating: 5, visitDate: '', observations: '' }; }
}
