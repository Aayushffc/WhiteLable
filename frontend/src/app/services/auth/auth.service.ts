import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  tenantIdentifier?: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  tenantId?: string;
}

export interface EmailVerificationRequest {
  email: string;
  verificationCode: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/api/auth`;
  private tokenKey = 'auth_token';
  private tenantIdKey = 'tenant_id';
  private userKey = 'user_data';

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(data: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, data).pipe(
      tap(response => {
        this.setToken(response.token);
        if (response.tenantId) {
          this.setTenantId(response.tenantId);
        }
        this.isAuthenticatedSubject.next(true);
      })
    );
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data).pipe(
      tap(response => {
        this.setToken(response.token);
        if (response.tenantId) {
          this.setTenantId(response.tenantId);
        }
        this.isAuthenticatedSubject.next(true);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.tenantIdKey);
    localStorage.removeItem(this.userKey);
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getTenantId(): string | null {
    return localStorage.getItem(this.tenantIdKey);
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  private setTenantId(tenantId: string): void {
    localStorage.setItem(this.tenantIdKey, tenantId);
  }

  private hasToken(): boolean {
    return !!this.getToken();
  }

  isLoggedIn(): boolean {
    return this.hasToken();
  }

  verifyEmail(data: EmailVerificationRequest): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/verify-email`, data);
  }

  requestVerificationCode(email: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/request-verification-code`, { email });
  }

  resetPassword(email: string, code: string, newPassword: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/reset-password`, {
      email,
      code,
      newPassword
    });
  }

  // Google Login SSO

  googleLogin(idToken: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl.replace('/auth', '/sso')}/google`, { idToken }).pipe(
      tap(response => {
        const authResponse: AuthResponse = {
          message: response.message,
          token: response.token,
        };
        this.setToken(authResponse.token);
        if (response.tenantId) {
          this.setTenantId(response.tenantId);
        }
        this.isAuthenticatedSubject.next(true);
      }),
      catchError(error => {
        console.error('Google login error', error);
        return throwError(() => error);
      })
    );
  }
}
