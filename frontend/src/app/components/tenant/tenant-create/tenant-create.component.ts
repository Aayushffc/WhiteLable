import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TenantService, CreateTenantDTO } from '../../../services/tenant/tenant.service';

@Component({
  selector: 'app-tenant-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-2xl mx-auto">
        <h1 class="text-2xl font-bold text-gray-800 mb-6">Create New Tenant</h1>

        <form [formGroup]="tenantForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              id="name"
              formControlName="name"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <div *ngIf="tenantForm.get('name')?.errors?.['required'] && tenantForm.get('name')?.touched" class="text-red-500 text-sm mt-1">
              Name is required
            </div>
          </div>

          <div>
            <label for="identifier" class="block text-sm font-medium text-gray-700">Identifier</label>
            <input
              type="text"
              id="identifier"
              formControlName="identifier"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <div *ngIf="tenantForm.get('identifier')?.errors?.['required'] && tenantForm.get('identifier')?.touched" class="text-red-500 text-sm mt-1">
              Identifier is required
            </div>
          </div>

          <div>
            <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="description"
              formControlName="description"
              rows="3"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            ></textarea>
          </div>

          <div>
            <label for="domain" class="block text-sm font-medium text-gray-700">Domain</label>
            <input
              type="text"
              id="domain"
              formControlName="domain"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label for="subscriptionPlan" class="block text-sm font-medium text-gray-700">Subscription Plan</label>
            <select
              id="subscriptionPlan"
              formControlName="subscriptionPlan"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select a plan</option>
              <option value="basic">Basic</option>
              <option value="professional">Professional</option>
              <option value="enterprise">Enterprise</option>
            </select>
          </div>

          <div class="flex justify-end space-x-4">
            <button
              type="button"
              (click)="goBack()"
              class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              [disabled]="tenantForm.invalid"
              class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Tenant
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class TenantCreateComponent {
  tenantForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private tenantService: TenantService,
    private router: Router
  ) {
    this.tenantForm = this.fb.group({
      name: ['', Validators.required],
      identifier: ['', Validators.required],
      description: [''],
      domain: [''],
      subscriptionPlan: [''],
    });
  }

  onSubmit(): void {
    if (this.tenantForm.valid) {
      const tenantData: CreateTenantDTO = this.tenantForm.value;
      this.tenantService.createTenant(tenantData).subscribe({
        next: () => {
          this.router.navigate(['/tenants']);
        },
        error: (error) => {
          console.error('Error creating tenant:', error);
        },
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/tenants']);
  }
}
