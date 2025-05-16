import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  registerForm: FormGroup;
  showVerificationForm = false;
  verificationForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      tenantIdentifier: [''],
    });

    this.verificationForm = this.fb.group({
      verificationCode: ['', [Validators.required]],
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe({
        next: () => {
          this.showVerificationForm = true;
        },
        error: (error) => {
          console.error('Registration failed:', error);
        },
      });
    }
  }

  onVerify() {
    if (this.verificationForm.valid) {
      const verificationData = {
        email: this.registerForm.value.email,
        verificationCode: this.verificationForm.value.verificationCode,
      };

      this.authService.verifyEmail(verificationData).subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Email verification failed:', error);
        },
      });
    }
  }
}
