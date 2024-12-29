// src/app/services/api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  ApiResponse,
  Category,
  IEvent,
  Submission,
  TrendingEvent,
} from '../models/api.types';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly apiUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  // Categories
  getCategories(): Observable<ApiResponse<Category[]>> {
    return this.http.get<ApiResponse<Category[]>>(`${this.apiUrl}/categories`);
  }

  getCategoryById(id: string): Observable<ApiResponse<Category>> {
    return this.http.get<ApiResponse<Category>>(
      `${this.apiUrl}/categories/${id}`
    );
  }

  // Submissions
  getSubmission(id: string): Observable<ApiResponse<Submission>> {
    return this.http.get<ApiResponse<Submission>>(
      `${this.apiUrl}/submissions/${id}`
    );
  }

  getSubmissionByShareCode(code: string): Observable<ApiResponse<Submission>> {
    return this.http.get<ApiResponse<Submission>>(
      `${this.apiUrl}/submissions/share/${code}`
    );
  }

  generateWrapImage(id: string): Observable<ApiResponse<{ imageUrl: string }>> {
    return this.http.post<ApiResponse<{ imageUrl: string }>>(
      `${this.apiUrl}/submissions/generate-image`,
      { id }
    );
  }

  createSubmission(
    submission: Partial<Submission>
  ): Observable<ApiResponse<Submission>> {
    return this.http.post<ApiResponse<Submission>>(
      `${this.apiUrl}/submissions`,
      submission
    );
  }

  getTrendingEvents(): Observable<ApiResponse<TrendingEvent[]>> {
    return this.http.get<ApiResponse<TrendingEvent[]>>(
      `${this.apiUrl}/events/popular`
    );
  }

  getEvents(params?: {
    categoryId?: string;
    isAdult?: boolean;
  }): Observable<ApiResponse<IEvent[]>> {
    let httpParams = new HttpParams();

    if (params?.categoryId) {
      httpParams = httpParams.set('categoryId', params.categoryId);
    }
    if (params?.isAdult !== undefined) {
      httpParams = httpParams.set('isAdult', params.isAdult.toString());
    }

    return this.http.get<ApiResponse<IEvent[]>>(`${this.apiUrl}/events`, {
      params: httpParams,
    });
  }
}
