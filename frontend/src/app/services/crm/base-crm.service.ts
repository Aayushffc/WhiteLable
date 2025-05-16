import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export abstract class BaseCRMService<T, CreateDTO, UpdateDTO> {
  protected constructor(
    protected http: HttpClient,
    protected endpoint: string
  ) {}

  protected get apiUrl(): string {
    return `${environment.apiUrl}/api/${this.endpoint}`;
  }

  create(dto: CreateDTO): Observable<{ message: string; data: T }> {
    return this.http.post<{ message: string; data: T }>(this.apiUrl, dto);
  }

  update(id: string, dto: UpdateDTO): Observable<{ message: string; data: T }> {
    return this.http.put<{ message: string; data: T }>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }

  getById(id: string): Observable<{ message: string; data: T }> {
    return this.http.get<{ message: string; data: T }>(`${this.apiUrl}/${id}`);
  }

  getAll(): Observable<{ message: string; data: T[] }> {
    return this.http.get<{ message: string; data: T[] }>(this.apiUrl);
  }
}
