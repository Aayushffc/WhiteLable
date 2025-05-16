import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseCRMService } from './base-crm.service';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  company?: string;
  industry?: string;
  notes?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface CreateCustomerDTO {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  company?: string;
  industry?: string;
  notes?: string;
}

export interface UpdateCustomerDTO {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  company?: string;
  industry?: string;
  notes?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CustomerService extends BaseCRMService<Customer, CreateCustomerDTO, UpdateCustomerDTO> {
  constructor(http: HttpClient) {
    super(http, 'customers');
  }
}
