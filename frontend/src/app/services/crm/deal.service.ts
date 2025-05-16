import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseCRMService } from './base-crm.service';
import { AuthService } from '../auth/auth.service';

export interface Deal {
  id: string;
  title: string;
  description?: string;
  value: number;
  currency: string;
  status: DealStatus;
  stage: string;
  customerId: string;
  customerName: string;
  contactId?: string;
  expectedCloseDate?: Date;
  probability: number;
  notes?: string;
  createdAt: Date;
  updatedAt?: Date;
  history: DealHistory[];
}

export interface DealHistory {
  stage: string;
  date: Date;
  notes: string;
}

export enum DealStatus {
  New = 'New',
  Contacted = 'Contacted',
  Qualified = 'Qualified',
  Proposal = 'Proposal',
  Negotiation = 'Negotiation',
  Won = 'Won',
  Lost = 'Lost'
}

export interface CreateDealDTO {
  title: string;
  description?: string;
  value: number;
  currency: string;
  status: DealStatus;
  customerId: string;
  contactId?: string;
  expectedCloseDate?: Date;
  probability: number;
  notes?: string;
}

export interface UpdateDealDTO {
  title?: string;
  description?: string;
  value?: number;
  currency?: string;
  status?: DealStatus;
  customerId?: string;
  contactId?: string;
  expectedCloseDate?: Date;
  probability?: number;
  notes?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DealService extends BaseCRMService<Deal, CreateDealDTO, UpdateDealDTO> {
  constructor(
    http: HttpClient,
    authService: AuthService
  ) {
    super(http, 'deals', authService);
  }
}
