import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TenantService, Tenant } from '../../../services/tenant/tenant.service';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-tenant-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Loading Overlay -->
    <div *ngIf="loading" class="loading-overlay">
      <div class="loading-spinner"></div>
    </div>

    <!-- Tenant Management Container -->
    <div class="min-h-screen bg-gray-100">
      <!-- Header -->
      <header class="bg-white shadow">
        <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center">
            <h1 class="text-3xl font-bold text-gray-900">Tenant Management</h1>
            <div class="flex space-x-4">
              <button
                (click)="navigateToCreate()"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Create New Tenant
              </button>
              <button
                (click)="navigateToDashboard()"
                class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Back to Dashboard
              </button>
            </div>
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

        <!-- Tenant List -->
        <div class="bg-white shadow rounded-lg p-6">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Identifier</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Domain</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr *ngFor="let tenant of tenants">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-10 w-10" *ngIf="tenant.logoUrl">
                        <img class="h-10 w-10 rounded-full" [src]="tenant.logoUrl" [alt]="tenant.name">
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">{{tenant.name}}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{tenant.identifier}}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{tenant.domain}}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span [class]="tenant.isActive ? 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800' : 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800'">
                      {{tenant.isActive ? 'Active' : 'Inactive'}}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      (click)="navigateToDetails(tenant)"
                      class="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      View
                    </button>
                    <button
                      (click)="navigateToEdit(tenant)"
                      class="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      (click)="deleteTenant(tenant)"
                      class="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
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
export class TenantListComponent implements OnInit {
  tenants: Tenant[] = [];
  loading = false;
  errorMessage: string | null = null;

  constructor(
    private tenantService: TenantService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/auth/login']);
      return;
    }
    this.loadTenants();
  }

  loadTenants(): void {
    this.loading = true;
    this.errorMessage = null;
    this.tenantService.getAllTenants().subscribe({
      next: (response) => {
        this.tenants = response.tenants;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        if (error.status === 403) {
          this.errorMessage = 'You do not have permission to view tenants. Please contact your administrator.';
        } else {
          this.errorMessage = 'Error loading tenants. Please try again later.';
        }
        console.error('Error loading tenants:', error);
      }
    });
  }

  navigateToCreate(): void {
    this.router.navigate(['/tenant/create']);
  }

  navigateToDetails(tenant: Tenant): void {
    this.router.navigate(['/tenant/details', tenant.id]);
  }

  navigateToEdit(tenant: Tenant): void {
    this.router.navigate(['/tenant/edit', tenant.id]);
  }

  navigateToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  deleteTenant(tenant: Tenant): void {
    if (confirm(`Are you sure you want to delete ${tenant.name}?`)) {
      this.loading = true;
      this.errorMessage = null;
      this.tenantService.deleteTenant(tenant.id).subscribe({
        next: () => {
          this.tenants = this.tenants.filter(t => t.id !== tenant.id);
          this.loading = false;
        },
        error: (error) => {
          this.loading = false;
          if (error.status === 403) {
            this.errorMessage = 'You do not have permission to delete tenants. Please contact your administrator.';
          } else {
            this.errorMessage = 'Error deleting tenant. Please try again later.';
          }
          console.error('Error deleting tenant:', error);
        }
      });
    }
  }
}
