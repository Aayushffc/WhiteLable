import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RoleService, Role } from '../../../services/role/role.service';

@Component({
  selector: 'app-role-management',
  templateUrl: './role-management.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class RoleManagementComponent implements OnInit {
  roles: Role[] = [];
  newRoleName: string = '';
  selectedRole: string = '';
  usersInRole: any[] = [];
  loading = false;
  error: string | null = null;
  successMessage: string | null = null;

  constructor(private roleService: RoleService) {}

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles(): void {
    this.loading = true;
    this.roleService.getAllRoles().subscribe({
      next: (response) => {
        this.roles = response.roles;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load roles';
        this.loading = false;
      }
    });
  }

  createRole(): void {
    if (!this.newRoleName.trim()) {
      this.error = 'Role name cannot be empty';
      return;
    }

    this.loading = true;
    this.roleService.createRole(this.newRoleName).subscribe({
      next: (response) => {
        this.successMessage = response.message;
        this.newRoleName = '';
        this.loadRoles();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to create role';
        this.loading = false;
      }
    });
  }

  deleteRole(roleName: string): void {
    if (confirm(`Are you sure you want to delete the role "${roleName}"?`)) {
      this.loading = true;
      this.roleService.deleteRole(roleName).subscribe({
        next: (response) => {
          this.successMessage = response.message;
          this.loadRoles();
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to delete role';
          this.loading = false;
        }
      });
    }
  }

  viewUsersInRole(roleName: string): void {
    this.selectedRole = roleName;
    this.loading = true;
    this.roleService.getUsersInRole(roleName).subscribe({
      next: (response) => {
        this.usersInRole = response.users;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load users in role';
        this.loading = false;
      }
    });
  }

  clearMessages(): void {
    this.error = null;
    this.successMessage = null;
  }
}