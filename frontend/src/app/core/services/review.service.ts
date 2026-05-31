import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

export interface Review {
  _id?: string;
  restaurantName: string;
  rating: number;
  visitDate: string | Date;
  observations: string;
  user?: {
    _id: string;
    username: string;
  };
  createdAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/reviews`;

  constructor() {}

  getAllReviews(): Observable<Review[]> {
    return this.http.get<Review[]>(this.apiUrl);
  }

  createReview(review: Review): Observable<Review> {
    return this.http.post<Review>(this.apiUrl, review);
  }

  updateReview(id: string, review: Review): Observable<Review> {
    return this.http.put<Review>(`${this.apiUrl}/${id}`, review);
  }

  deleteReview(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
