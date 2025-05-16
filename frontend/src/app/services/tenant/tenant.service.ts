import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Tenant {
  id: string;
  name: string;
  identifier: string;
  description?: string;
  databaseName: string;
  connectionString: string;
  logoUrl?: string;
  theme?: string;
  domain?: string;
  subscriptionPlan?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt?: Date;
  subscriptionExpiry?: Date;
}

export interface CreateTenantDTO {
  name: string;
  identifier: string;
  description?: string;
  logoUrl?: string;
  theme?: string;
  domain?: string;
  subscriptionPlan?: string;
}

export interface UpdateTenantDTO {
  name?: string;
  description?: string;
  isActive?: boolean;
  logoUrl?: string;
  theme?: string;
  domain?: string;
  subscriptionPlan?: string;
  subscriptionExpiry?: Date;
}

export interface AssignUserToTenantDTO {
  userId: string;
  tenantId: string;
}

@Injectable({
  providedIn: 'root'
})
export class TenantService {
  private apiUrl = `${environment.apiUrl}/api/tenant`;

  constructor(private http: HttpClient) {}

  createTenant(dto: CreateTenantDTO): Observable<{ message: string; tenant: Tenant }> {
    return this.http.post<{ message: string; tenant: Tenant }>(this.apiUrl, dto);
  }

  updateTenant(id: string, dto: UpdateTenantDTO): Observable<{ message: string; tenant: Tenant }> {
    return this.http.put<{ message: string; tenant: Tenant }>(`${this.apiUrl}/${id}`, dto);
  }

  deleteTenant(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }

  getTenant(id: string): Observable<{ message: string; tenant: Tenant }> {
    return this.http.get<{ message: string; tenant: Tenant }>(`${this.apiUrl}/${id}`);
  }

  getAllTenants(): Observable<{ message: string; tenants: Tenant[] }> {
    return this.http.get<{ message: string; tenants: Tenant[] }>(this.apiUrl);
  }

  assignUserToTenant(dto: AssignUserToTenantDTO): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/assign`, dto);
  }

  removeUserFromTenant(userId: string, tenantId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/users/${userId}/tenants/${tenantId}`);
  }

  getUsersInTenant(tenantId: string): Observable<{ message: string; userIds: string[] }> {
    return this.http.get<{ message: string; userIds: string[] }>(`${this.apiUrl}/${tenantId}/users`);
  }

  getUserTenants(userId: string): Observable<{ message: string; tenants: Tenant[] }> {
    return this.http.get<{ message: string; tenants: Tenant[] }>(`${this.apiUrl}/users/${userId}/tenants`);
  }
}