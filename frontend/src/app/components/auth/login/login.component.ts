import { AfterViewInit, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';

declare var google: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
})
export class LoginComponent implements AfterViewInit {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngAfterViewInit() {
    // Wait for the Google script to load
    if (typeof google !== 'undefined') {
      google.accounts.id.initialize({
        client_id: '334522416360-h3ipni5mvi5g9pnds92ts48j32k7stpr.apps.googleusercontent.com',
        callback: this.handleCredentialResponse.bind(this)
      });

      google.accounts.id.renderButton(
        document.getElementById('google-btn'),
        {
          theme: 'outline',
          size: 'large',
          width: '100%',
          text: 'continue_with'
        }
      );
    } else {
      console.error('Google Identity Services script not loaded');
    }
  }

  handleCredentialResponse(response: any) {
    if (response.credential) {
      this.authService.googleLogin(response.credential).subscribe({
        next: () => {
          // Google login is successful, redirect to dashboard
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          console.error('Backend login error:', err);
          this.errorMessage = err.error?.message || 'Google login failed. Please try again.';
        }
      });
    }
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Login failed:', error);
          this.errorMessage = error.error?.message || 'Login failed. Please try again.';
        },
      });
    }
  }
}
