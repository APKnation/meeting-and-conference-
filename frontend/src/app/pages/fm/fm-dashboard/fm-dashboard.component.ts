import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MeetingService } from '../../../core/services/meeting.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-fm-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mt-4">
      <h1 class="page-title">Facility Manager Dashboard</h1>
      
      <div class="section mt-4">
        <div class="flex-between mb-4">
          <h2>Manage Facilities</h2>
          <button class="btn-primary" (click)="toggleAddFacility()">+ Add Facility</button>
        </div>

        <div class="card p-4 mb-4" *ngIf="showAddFacility">
          <h3>Add New Facility</h3>
          <form (ngSubmit)="saveFacility()">
            <div class="form-group">
              <label>Name</label>
              <input type="text" [(ngModel)]="newFacility.name" name="name" class="form-control" required>
            </div>
            <div class="form-group">
              <label>Capacity</label>
              <input type="number" [(ngModel)]="newFacility.capacity" name="capacity" class="form-control" required>
            </div>
            <div class="form-group">
              <label>Location</label>
              <input type="text" [(ngModel)]="newFacility.location" name="location" class="form-control">
            </div>
            <button class="btn-primary mt-2" type="submit">Save</button>
            <button class="btn-secondary mt-2 ml-2" type="button" (click)="toggleAddFacility()">Cancel</button>
          </form>
        </div>

        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Capacity</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let facility of facilities">
                <td>{{ facility.id }}</td>
                <td>{{ facility.name }}</td>
                <td>{{ facility.capacity }}</td>
                <td><span class="badge" [ngClass]="{'bg-green': facility.status==='AVAILABLE'}">{{ facility.status }}</span></td>
                <td>
                  <button class="btn-danger btn-sm" (click)="deleteFacility(facility.id)">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="section mt-4">
        <h2>Booking Requests</h2>
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Facility</th>
                <th>Customer</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let booking of bookings">
                <td>{{ booking.id }}</td>
                <td>{{ booking.facility?.name || 'Unknown' }}</td>
                <td>{{ booking.customer?.name || 'Unknown' }}</td>
                <td>{{ booking.startTime | date:'short' }}</td>
                <td>{{ booking.endTime | date:'short' }}</td>
                <td><span class="badge">{{ booking.status }}</span></td>
                <td *ngIf="booking.status === 'PENDING'">
                  <button class="btn-success btn-sm mr-2" (click)="updateBookingStatus(booking.id, 'APPROVED')">Approve</button>
                  <button class="btn-danger btn-sm" (click)="updateBookingStatus(booking.id, 'REJECTED')">Reject</button>
                </td>
                <td *ngIf="booking.status !== 'PENDING'">-</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-title { margin-bottom: 2rem; color: var(--text-main); }
    .mt-4 { margin-top: 2rem; }
    .mb-4 { margin-bottom: 1.5rem; }
    .flex-between { display: flex; justify-content: space-between; align-items: center; }
    .section h2 { margin-bottom: 1rem; color: var(--text-main); }
    .table-container { background: var(--white); border-radius: var(--radius); box-shadow: var(--shadow); overflow: hidden; }
    .data-table { width: 100%; border-collapse: collapse; }
    .data-table th, .data-table td { padding: 1rem; text-align: left; border-bottom: 1px solid var(--border); }
    .data-table th { background-color: #f8fafc; font-weight: 600; color: var(--text-muted); }
    .btn-sm { padding: 0.4rem 0.8rem; border-radius: var(--radius); cursor: pointer; border: none; font-size: 0.85rem;}
    .btn-danger { background-color: #ef4444; color: white; }
    .btn-success { background-color: #10b981; color: white; }
    .mr-2 { margin-right: 0.5rem; }
    .ml-2 { margin-left: 0.5rem; }
    .badge { padding: 0.25rem 0.5rem; border-radius: 999px; font-size: 0.8rem; font-weight: 500; background: #e2e8f0; }
    .bg-green { background-color: #dcfce3; color: #166534; }
    .card { background: var(--white); border-radius: var(--radius); box-shadow: var(--shadow); }
    .p-4 { padding: 1.5rem; }
    .form-group { margin-bottom: 1rem; }
    .form-control { width: 100%; padding: 0.5rem; border: 1px solid var(--border); border-radius: 4px; }
    .btn-secondary { background: #e2e8f0; color: #475569; padding: 0.5rem 1rem; border-radius: var(--radius); border: none; cursor: pointer; }
  `]
})
export class FmDashboardComponent implements OnInit {
  meetingService = inject(MeetingService);
  facilities: any[] = [];
  bookings: any[] = [];
  
  showAddFacility = false;
  newFacility: any = { name: '', capacity: 10, location: '' };

  ngOnInit(): void {
    this.loadFacilities();
    this.loadBookings();
  }

  loadFacilities() {
    this.meetingService.getAllFacilities().subscribe(data => this.facilities = data);
  }

  loadBookings() {
    this.meetingService.getAllBookings().subscribe(data => this.bookings = data);
  }

  toggleAddFacility() {
    this.showAddFacility = !this.showAddFacility;
  }

  saveFacility() {
    this.meetingService.createFacility(this.newFacility).subscribe(() => {
      this.loadFacilities();
      this.showAddFacility = false;
      this.newFacility = { name: '', capacity: 10, location: '' };
    });
  }

  deleteFacility(id: number) {
    if (confirm('Are you sure?')) {
      this.meetingService.deleteFacility(id).subscribe(() => this.loadFacilities());
    }
  }

  updateBookingStatus(id: number, status: string) {
    this.meetingService.updateBookingStatus(id, status).subscribe({
      next: () => this.loadBookings(),
      error: err => alert(err.error.message || 'Error updating status')
    });
  }
}
