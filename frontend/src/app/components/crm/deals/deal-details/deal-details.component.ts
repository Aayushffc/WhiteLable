import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { DealService, Deal } from '../../../../services/crm/deal.service';

@Component({
  selector: 'app-deal-details',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-4xl mx-auto">
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-2xl font-bold text-gray-800">Deal Details</h1>
          <div class="space-x-4">
            <button
              (click)="goBack()"
              class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Back
            </button>
            <button
              (click)="deleteDeal()"
              class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Delete Deal
            </button>
          </div>
        </div>

        <div *ngIf="deal" class="bg-white rounded-lg shadow overflow-hidden">
          <div class="p-6">
            <div class="grid grid-cols-2 gap-6">
              <div>
                <h3 class="text-sm font-medium text-gray-500">Title</h3>
                <p class="mt-1 text-lg text-gray-900">{{ deal.title }}</p>
              </div>

              <div>
                <h3 class="text-sm font-medium text-gray-500">Customer</h3>
                <p class="mt-1 text-lg text-gray-900">{{ deal.customerName }}</p>
              </div>

              <div>
                <h3 class="text-sm font-medium text-gray-500">Value</h3>
                <p class="mt-1 text-lg text-gray-900">{{ deal.value | currency }}</p>
              </div>

              <div>
                <h3 class="text-sm font-medium text-gray-500">Stage</h3>
                <span
                  [class]="getStageClass(deal.stage)"
                  class="px-2 py-1 inline-flex text-sm leading-5 font-semibold rounded-full"
                >
                  {{ deal.stage }}
                </span>
              </div>

              <div>
                <h3 class="text-sm font-medium text-gray-500">Expected Close Date</h3>
                <p class="mt-1 text-lg text-gray-900">{{ deal.expectedCloseDate | date:'mediumDate' }}</p>
              </div>

              <div>
                <h3 class="text-sm font-medium text-gray-500">Probability</h3>
                <div class="mt-1">
                  <div class="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      class="bg-blue-600 h-2.5 rounded-full"
                      [style.width.%]="deal.probability"
                    ></div>
                  </div>
                  <p class="mt-1 text-sm text-gray-600">{{ deal.probability }}%</p>
                </div>
              </div>

              <div>
                <h3 class="text-sm font-medium text-gray-500">Created At</h3>
                <p class="mt-1 text-lg text-gray-900">{{ deal.createdAt | date:'medium' }}</p>
              </div>

              <div>
                <h3 class="text-sm font-medium text-gray-500">Last Updated</h3>
                <p class="mt-1 text-lg text-gray-900">{{ deal.updatedAt | date:'medium' }}</p>
              </div>
            </div>

            <div class="mt-6">
              <h3 class="text-sm font-medium text-gray-500">Description</h3>
              <p class="mt-1 text-lg text-gray-900">{{ deal.description || 'No description provided' }}</p>
            </div>

            <div class="mt-6">
              <h3 class="text-sm font-medium text-gray-500">Deal History</h3>
              <div class="mt-2 space-y-4">
                <div *ngFor="let history of deal.history" class="flex items-start">
                  <div class="flex-shrink-0">
                    <div class="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <span class="text-blue-600 text-sm font-medium">{{ history.stage[0] }}</span>
                    </div>
                  </div>
                  <div class="ml-4">
                    <p class="text-sm font-medium text-gray-900">{{ history.stage }}</p>
                    <p class="text-sm text-gray-500">{{ history.date | date:'medium' }}</p>
                    <p class="text-sm text-gray-500">{{ history.notes }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div *ngIf="!deal" class="text-center py-12">
          <p class="text-gray-500">Loading deal details...</p>
        </div>
      </div>
    </div>
  `,
})
export class DealDetailsComponent implements OnInit {
  deal: Deal | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dealService: DealService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadDeal(id);
    }
  }

  loadDeal(id: string): void {
    this.dealService.getById(id).subscribe({
      next: (response) => {
        this.deal = response.data;
      },
      error: (error) => {
        console.error('Error loading deal:', error);
        this.router.navigate(['/crm/deals']);
      },
    });
  }

  deleteDeal(): void {
    if (this.deal && confirm('Are you sure you want to delete this deal?')) {
      this.dealService.delete(this.deal.id).subscribe({
        next: () => {
          this.router.navigate(['/crm/deals']);
        },
        error: (error) => {
          console.error('Error deleting deal:', error);
        },
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/crm/deals']);
  }

  getStageClass(stage: string): string {
    const stageClasses: { [key: string]: string } = {
      'Qualification': 'bg-blue-100 text-blue-800',
      'Proposal': 'bg-yellow-100 text-yellow-800',
      'Negotiation': 'bg-purple-100 text-purple-800',
      'Closed Won': 'bg-green-100 text-green-800',
      'Closed Lost': 'bg-red-100 text-red-800',
    };
    return stageClasses[stage] || 'bg-gray-100 text-gray-800';
  }
}
