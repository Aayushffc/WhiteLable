import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TenantService, Tenant } from '../../../services/tenant/tenant.service';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-tenant-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Loading Overlay -->
    <div *ngIf="loading" class="loading-overlay">
      <div class="loading-spinner"></div>
    </div>

    <!-- Tenant Creation Container -->
    <div class="min-h-screen bg-gray-100">
      <!-- Header -->
      <header class="bg-white shadow">
        <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center">
            <h1 class="text-3xl font-bold text-gray-900">Create New Tenant</h1>
            <button
              (click)="navigateToTenantList()"
              class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Back to List
            </button>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <!-- Error Message -->
        <div *ngIf="errorMessage" class="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-red-700">{{ errorMessage }}</p>
            </div>
          </div>
        </div>

        <!-- Tenant Creation Form -->
        <div class="bg-white shadow rounded-lg p-6">
          <form (ngSubmit)="onSubmit()" class="space-y-6">
            <!-- Name -->
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                [(ngModel)]="tenant.name"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                [class.border-red-300]="submitted && !tenant.name"
              >
              <p *ngIf="submitted && !tenant.name" class="mt-1 text-sm text-red-600">
                Name is required
              </p>
            </div>

            <!-- Identifier -->
            <div>
              <label for="identifier" class="block text-sm font-medium text-gray-700">Identifier</label>
              <input
                type="text"
                id="identifier"
                name="identifier"
                [(ngModel)]="tenant.identifier"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                [class.border-red-300]="submitted && !tenant.identifier"
              >
              <p *ngIf="submitted && !tenant.identifier" class="mt-1 text-sm text-red-600">
                Identifier is required
              </p>
            </div>

            <!-- Domain -->
            <div>
              <label for="domain" class="block text-sm font-medium text-gray-700">Domain</label>
              <input
                type="text"
                id="domain"
                name="domain"
                [(ngModel)]="tenant.domain"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                [class.border-red-300]="submitted && !tenant.domain"
              >
              <p *ngIf="submitted && !tenant.domain" class="mt-1 text-sm text-red-600">
                Domain is required
              </p>
            </div>

            <!-- Status -->
            <div>
              <label for="isActive" class="block text-sm font-medium text-gray-700">Status</label>
              <select
                id="isActive"
                name="isActive"
                [(ngModel)]="tenant.isActive"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option [ngValue]="true">Active</option>
                <option [ngValue]="false">Inactive</option>
              </select>
            </div>

            <!-- Logo URL -->
            <div>
              <label for="logoUrl" class="block text-sm font-medium text-gray-700">Logo URL</label>
              <input
                type="text"
                id="logoUrl"
                name="logoUrl"
                [(ngModel)]="tenant.logoUrl"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
            </div>

            <!-- Form Actions -->
            <div class="flex justify-end space-x-4">
              <button
                type="button"
                (click)="navigateToTenantList()"
                class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Create Tenant
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .loading-spinner {
      border: 4px solid #f3f3f3;
      border-top: 4px solid #3498db;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `]
})
export class TenantCreateComponent implements OnInit {
  tenant: Partial<Tenant> = {
    name: '',
    identifier: '',
    domain: '',
    isActive: true,
    logoUrl: ''
  };
  loading = false;
  errorMessage: string | null = null;
  submitted = false;

  constructor(
    private router: Router,
    private tenantService: TenantService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/auth/login']);
      return;
    }
  }

  onSubmit(): void {
    this.submitted = true;
    if (!this.tenant.name || !this.tenant.identifier || !this.tenant.domain) {
      return;
    }

    this.loading = true;
    this.errorMessage = null;
    this.tenantService.createTenant(this.tenant as Tenant).subscribe({
      next: (response: { tenant: Tenant }) => {
        this.loading = false;
        this.router.navigate(['/tenant/list']);
      },
      error: (error: any) => {
        this.loading = false;
        if (error.status === 403) {
          this.errorMessage = 'You do not have permission to create tenants. Please contact your administrator.';
        } else {
          this.errorMessage = 'Error creating tenant. Please try again later.';
        }
        console.error('Error creating tenant:', error);
      }
    });
  }

  navigateToTenantList(): void {
    this.router.navigate(['/tenant/list']);
  }
}
