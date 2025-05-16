import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  // Auth Routes
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./components/auth/login/login.component').then(
            (m) => m.LoginComponent
          ),
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./components/auth/register/register.component').then(
            (m) => m.RegisterComponent
          ),
      },
      {
        path: 'forgot-password',
        loadComponent: () =>
          import('./components/auth/forgot-password/forgot-password.component').then(
            (m) => m.ForgotPasswordComponent
          ),
      },
      {
        path: 'reset-password',
        loadComponent: () =>
          import('./components/auth/reset-password/reset-password.component').then(
            (m) => m.ResetPasswordComponent
          ),
      },
    ],
  },

  // Dashboard Route
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
  },

  // Tenant Routes
  {
    path: 'tenants',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/tenant/tenant-create/tenant-create.component').then(
        (m) => m.TenantCreateComponent
      ),
  },
  {
    path: 'tenants/create',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/tenant/tenant-create/tenant-create.component').then(
        (m) => m.TenantCreateComponent
      ),
  },
  {
    path: 'tenants/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/tenant/tenant-details/tenant-details.component').then(
        (m) => m.TenantDetailsComponent
      ),
  },

  // CRM Routes
  // Customers
  {
    path: 'crm/customers',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/crm/customers/customer-list/customer-list.component').then(
        (m) => m.CustomerListComponent
      ),
  },
  {
    path: 'crm/customers/create',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/crm/customers/customer-create/customer-create.component').then(
        (m) => m.CustomerCreateComponent
      ),
  },
  {
    path: 'crm/customers/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/crm/customers/customer-details/customer-details.component').then(
        (m) => m.CustomerDetailsComponent
      ),
  },

  // Contacts
  {
    path: 'crm/contacts',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/crm/contacts/contact-list/contact-list.component').then(
        (m) => m.ContactListComponent
      ),
  },
  {
    path: 'crm/contacts/create',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/crm/contacts/contact-create/contact-create.component').then(
        (m) => m.ContactCreateComponent
      ),
  },
  {
    path: 'crm/contacts/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/crm/contacts/contact-details/contact-details.component').then(
        (m) => m.ContactDetailsComponent
      ),
  },

  // Deals
  {
    path: 'crm/deals',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/crm/deals/deal-list/deal-list.component').then(
        (m) => m.DealListComponent
      ),
  },
  {
    path: 'crm/deals/create',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/crm/deals/deal-create/deal-create.component').then(
        (m) => m.DealCreateComponent
      ),
  },
  {
    path: 'crm/deals/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/crm/deals/deal-details/deal-details.component').then(
        (m) => m.DealDetailsComponent
      ),
  },

  // Default Route
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },
];
