import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MeetingService } from '../../../core/services/meeting.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mt-4">
      <div class="flex-between mb-4">
        <h1 class="page-title">My Dashboard</h1>
        <a routerLink="/customer/facilities" class="btn-primary">Book a Facility</a>
      </div>
      
      <div class="section mt-4">
        <h2>My Bookings</h2>
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Facility</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Purpose</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let booking of bookings">
                <td>{{ booking.id }}</td>
                <td>{{ booking.facility?.name || 'Unknown' }}</td>
                <td>{{ booking.startTime | date:'medium' }}</td>
                <td>{{ booking.endTime | date:'medium' }}</td>
                <td>{{ booking.purpose }}</td>
                <td>
                  <span class="badge" [ngClass]="{
                    'PENDING': booking.status === 'PENDING',
                    'APPROVED': booking.status === 'APPROVED',
                    'REJECTED': booking.status === 'REJECTED',
                    'CANCELLED': booking.status === 'CANCELLED'
                  }">{{ booking.status }}</span>
                </td>
              </tr>
              <tr *ngIf="bookings.length === 0">
                <td colspan="6" style="text-align: center; padding: 2rem;">No bookings found. <a routerLink="/customer/facilities">Book now</a></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-title { margin-bottom: 0; color: var(--text-main); }
    .mt-4 { margin-top: 2rem; }
    .mb-4 { margin-bottom: 1.5rem; }
    .flex-between { display: flex; justify-content: space-between; align-items: center; }
    .section h2 { margin-bottom: 1rem; color: var(--text-main); }
    .table-container { background: var(--white); border-radius: var(--radius); box-shadow: var(--shadow); overflow: hidden; }
    .data-table { width: 100%; border-collapse: collapse; }
    .data-table th, .data-table td { padding: 1rem; text-align: left; border-bottom: 1px solid var(--border); }
    .data-table th { background-color: #f8fafc; font-weight: 600; color: var(--text-muted); }
    .badge { padding: 0.25rem 0.5rem; border-radius: 999px; font-size: 0.8rem; font-weight: 500; background: #e2e8f0; }
    .PENDING { background-color: #fef3c7; color: #b45309; }
    .APPROVED { background-color: #dcfce3; color: #166534; }
    .REJECTED { background-color: #fee2e2; color: #991b1b; }
    .CANCELLED { background-color: #f1f5f9; color: #475569; }
  `]
})
export class CustomerDashboardComponent implements OnInit {
  meetingService = inject(MeetingService);
  bookings: any[] = [];

  ngOnInit(): void {
    this.meetingService.getMyBookings().subscribe(data => this.bookings = data);
  }
}
