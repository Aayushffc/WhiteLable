import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TenantService, Tenant } from '../../../services/tenant/tenant.service';

@Component({
  selector: 'app-tenant-details',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-4xl mx-auto">
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-2xl font-bold text-gray-800">Tenant Details</h1>
          <div class="space-x-4">
            <button
              (click)="goBack()"
              class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Back
            </button>
            <button
              (click)="deleteTenant()"
              class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Delete Tenant
            </button>
          </div>
        </div>

        <div *ngIf="tenant" class="bg-white rounded-lg shadow overflow-hidden">
          <div class="p-6">
            <div class="grid grid-cols-2 gap-6">
              <div>
                <h3 class="text-sm font-medium text-gray-500">Name</h3>
                <p class="mt-1 text-lg text-gray-900">{{ tenant.name }}</p>
              </div>

              <div>
                <h3 class="text-sm font-medium text-gray-500">Identifier</h3>
                <p class="mt-1 text-lg text-gray-900">{{ tenant.identifier }}</p>
              </div>

              <div>
                <h3 class="text-sm font-medium text-gray-500">Domain</h3>
                <p class="mt-1 text-lg text-gray-900">{{ tenant.domain || 'N/A' }}</p>
              </div>

              <div>
                <h3 class="text-sm font-medium text-gray-500">Status</h3>
                <span
                  [class]="tenant.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                  class="mt-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                >
                  {{ tenant.isActive ? 'Active' : 'Inactive' }}
                </span>
              </div>

              <div>
                <h3 class="text-sm font-medium text-gray-500">Subscription Plan</h3>
                <p class="mt-1 text-lg text-gray-900">{{ tenant.subscriptionPlan || 'N/A' }}</p>
              </div>

              <div>
                <h3 class="text-sm font-medium text-gray-500">Created At</h3>
                <p class="mt-1 text-lg text-gray-900">{{ tenant.createdAt | date:'medium' }}</p>
              </div>
            </div>

            <div class="mt-6">
              <h3 class="text-sm font-medium text-gray-500">Description</h3>
              <p class="mt-1 text-lg text-gray-900">{{ tenant.description || 'No description provided' }}</p>
            </div>

            <div class="mt-6">
              <h3 class="text-sm font-medium text-gray-500">Database Information</h3>
              <div class="mt-2 bg-gray-50 p-4 rounded-md">
                <p class="text-sm text-gray-600">
                  <span class="font-medium">Database Name:</span> {{ tenant.databaseName }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div *ngIf="!tenant" class="text-center py-12">
          <p class="text-gray-500">Loading tenant details...</p>
        </div>
      </div>
    </div>
  `,
})
export class TenantDetailsComponent implements OnInit {
  tenant: Tenant | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tenantService: TenantService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadTenant(id);
    }
  }

  loadTenant(id: string): void {
    this.tenantService.getTenant(id).subscribe({
      next: (response) => {
        this.tenant = response.tenant;
      },
      error: (error) => {
        console.error('Error loading tenant:', error);
        this.router.navigate(['/tenants']);
      },
    });
  }

  deleteTenant(): void {
    if (this.tenant && confirm('Are you sure you want to delete this tenant?')) {
      this.tenantService.deleteTenant(this.tenant.id).subscribe({
        next: () => {
          this.router.navigate(['/tenants']);
        },
        error: (error) => {
          console.error('Error deleting tenant:', error);
        },
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/tenants']);
  }
}
