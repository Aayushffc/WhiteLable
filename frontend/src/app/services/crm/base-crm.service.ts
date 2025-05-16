import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export abstract class BaseCRMService<T, CreateDTO, UpdateDTO> {
  protected constructor(
    protected http: HttpClient,
    protected endpoint: string,
    protected authService: AuthService
  ) {}

  protected get apiUrl(): string {
    const tenantId = this.authService.getTenantId();
    return `${environment.apiUrl}/api/${this.endpoint}`;
  }

  create(dto: CreateDTO): Observable<{ message: string; data: T }> {
    return this.http.post<{ message: string; data: T }>(this.apiUrl, dto).pipe(
      catchError(this.handleError)
    );
  }

  update(id: string, dto: UpdateDTO): Observable<{ message: string; data: T }> {
    return this.http.put<{ message: string; data: T }>(`${this.apiUrl}/${id}`, dto).pipe(
      catchError(this.handleError)
    );
  }

  delete(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  getById(id: string): Observable<{ message: string; data: T }> {
    return this.http.get<{ message: string; data: T }>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  getAll(): Observable<{ message: string; data: T[] }> {
    return this.http.get<{ message: string; data: T[] }>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  protected handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      errorMessage = error.error?.message || error.message;
    }

    return throwError(() => new Error(errorMessage));
  }
}
