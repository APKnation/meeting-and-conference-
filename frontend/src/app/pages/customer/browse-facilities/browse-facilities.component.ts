import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MeetingService } from '../../../core/services/meeting.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-browse-facilities',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bf-wrap">
      <div class="bf-header">
        <div>
          <h1>Browse Meeting Rooms</h1>
          <p class="sub">Click a room to make a booking request. Only available rooms can be booked.</p>
        </div>
        <div class="status-legend">
          <span class="legend-item"><span class="dot dot-avail"></span> Available</span>
          <span class="legend-item"><span class="dot dot-booked"></span> Booked</span>
          <span class="legend-item"><span class="dot dot-maint"></span> Maintenance</span>
        </div>
      </div>

      <div class="bf-grid">
        <div class="bf-card" *ngFor="let f of facilities" [class.bf-card-dimmed]="f.status !== 'AVAILABLE'">

          <!-- Image -->
          <div class="bf-img" *ngIf="f.imageUrl">
            <img [src]="'http://localhost:8080' + f.imageUrl" [alt]="f.name">
          </div>
          <div class="bf-img bf-img-placeholder" *ngIf="!f.imageUrl">
            <span>{{ f.name.charAt(0) }}</span>
          </div>

          <!-- Status banner -->
          <div class="bf-status-bar"
            [ngClass]="{
              'bar-avail':  f.status === 'AVAILABLE',
              'bar-booked': f.status === 'BOOKED',
              'bar-maint':  f.status === 'UNDER_MAINTENANCE'
            }">
            <span class="status-dot-pulse" *ngIf="f.status === 'AVAILABLE'"></span>
            <strong>
              {{ f.status === 'AVAILABLE' ? 'Available — Ready to Book'
               : f.status === 'BOOKED'    ? 'Currently Booked'
               : 'Under Maintenance' }}
            </strong>
          </div>

          <div class="bf-body">
            <h3>{{ f.name }}</h3>
            <div class="bf-meta">
              <span *ngIf="f.location">{{ f.location }}</span>
              <span>Capacity: {{ f.capacity }} people</span>
            </div>
            <p class="bf-desc" *ngIf="f.description">{{ f.description }}</p>

            <!-- Booking form toggle -->
            <div class="bf-actions">
              <button class="btn-book-now"
                *ngIf="f.status === 'AVAILABLE' && selectedFacility?.id !== f.id"
                (click)="openBookingForm(f)">
                Book This Room →
              </button>
              <div class="bf-unavail" *ngIf="f.status === 'BOOKED'">
                This room is currently occupied. Check back later.
              </div>
              <div class="bf-unavail maint" *ngIf="f.status === 'UNDER_MAINTENANCE'">
                Room is under maintenance. Not available for booking.
              </div>
            </div>

            <!-- Booking form -->
            <div class="booking-form" *ngIf="selectedFacility?.id === f.id">
              <h4>Request: {{ f.name }}</h4>
              <form (ngSubmit)="submitBooking()">
                <div class="form-group">
                  <label>Start Time</label>
                  <input type="datetime-local" [(ngModel)]="bookingRequest.startTime" name="startTime" class="form-control" required>
                </div>
                <div class="form-group">
                  <label>End Time</label>
                  <input type="datetime-local" [(ngModel)]="bookingRequest.endTime" name="endTime" class="form-control" required>
                </div>
                <div class="form-group">
                  <label>Purpose of Meeting</label>
                  <input type="text" [(ngModel)]="bookingRequest.purpose" name="purpose" class="form-control" placeholder="e.g. Team standup, Client presentation" required>
                </div>
                <div class="form-actions">
                  <button class="btn-submit" type="submit">Submit Request</button>
                  <button class="btn-cancel-f" type="button" (click)="selectedFacility = null">Cancel</button>
                </div>
              </form>
              <p class="notice">Your request will be reviewed and approved by a Facility Manager.</p>
            </div>
          </div>
        </div>
      </div>

      <div class="bf-empty" *ngIf="facilities.length === 0">
        <p>No facilities found. Check back soon!</p>
      </div>
    </div>
  `,
  styles: [`
    .bf-wrap { padding: 2rem; max-width: 1200px; margin: 0 auto; }
    .bf-header { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem; margin-bottom: 2rem; }
    .bf-header h1 { font-size: 1.6rem; font-weight: 800; color: #0f172a; margin: 0 0 0.3rem; }
    .sub { color: #64748b; font-size: 0.9rem; margin: 0; }

    /* Legend */
    .status-legend { display: flex; gap: 1.25rem; align-items: center; flex-wrap: wrap; }
    .legend-item { display: flex; align-items: center; gap: 0.4rem; font-size: 0.82rem; color: #475569; font-weight: 500; }
    .dot { width: 10px; height: 10px; border-radius: 50%; }
    .dot-avail  { background: #22c55e; }
    .dot-booked { background: #f59e0b; }
    .dot-maint  { background: #ef4444; }

    /* Grid */
    .bf-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(310px, 1fr)); gap: 1.5rem; }
    .bf-card { background: #fff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; transition: transform 0.2s, box-shadow 0.2s; }
    .bf-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,0.1); }
    .bf-card-dimmed { opacity: 0.8; }

    /* Image */
    .bf-img { height: 180px; overflow: hidden; }
    .bf-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s; }
    .bf-card:hover .bf-img img { transform: scale(1.05); }
    .bf-img-placeholder { display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #6366f1, #8b5cf6); }
    .bf-img-placeholder span { font-size: 4rem; font-weight: 800; color: rgba(255,255,255,0.5); }

    /* Status bar */
    .bf-status-bar { padding: 0.55rem 1rem; display: flex; align-items: center; gap: 0.5rem; font-size: 0.8rem; font-weight: 700; }
    .bar-avail  { background: #dcfce7; color: #15803d; }
    .bar-booked { background: #fef3c7; color: #b45309; }
    .bar-maint  { background: #fee2e2; color: #dc2626; }
    .status-dot-pulse { width: 8px; height: 8px; border-radius: 50%; background: #22c55e; animation: pulse 1.5s infinite; flex-shrink: 0; }
    @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }

    /* Body */
    .bf-body { padding: 1.25rem 1.5rem 1.5rem; }
    .bf-body h3 { font-size: 1.1rem; font-weight: 700; color: #0f172a; margin: 0 0 0.4rem; }
    .bf-meta { display: flex; gap: 1rem; flex-wrap: wrap; font-size: 0.8rem; color: #64748b; margin-bottom: 0.6rem; }
    .bf-desc { font-size: 0.85rem; color: #475569; line-height: 1.55; margin: 0 0 1rem; }

    /* Actions */
    .bf-actions { margin-top: 0.75rem; }
    .btn-book-now { background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #fff; border: none; padding: 0.65rem 1.25rem; border-radius: 8px; cursor: pointer; font-weight: 700; font-size: 0.88rem; width: 100%; transition: all 0.2s; }
    .btn-book-now:hover { opacity: 0.9; transform: translateY(-1px); }
    .bf-unavail { font-size: 0.82rem; color: #b45309; background: #fef3c7; padding: 0.5rem 0.75rem; border-radius: 7px; font-weight: 500; }
    .bf-unavail.maint { color: #dc2626; background: #fee2e2; }

    /* Booking form */
    .booking-form { margin-top: 1rem; padding: 1.25rem; background: #f8fafc; border-radius: 10px; border: 1px solid #e2e8f0; }
    .booking-form h4 { font-size: 0.9rem; font-weight: 700; color: #0f172a; margin: 0 0 1rem; }
    .form-group { margin-bottom: 0.85rem; }
    .form-group label { display: block; font-size: 0.78rem; font-weight: 600; color: #475569; margin-bottom: 0.3rem; }
    .form-control { width: 100%; padding: 0.5rem 0.7rem; border: 1px solid #e2e8f0; border-radius: 7px; font-size: 0.87rem; font-family: inherit; }
    .form-control:focus { outline: none; border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }
    .form-actions { display: flex; gap: 0.5rem; margin-top: 0.25rem; }
    .btn-submit { background: #4f46e5; color: #fff; border: none; padding: 0.55rem 1.1rem; border-radius: 7px; cursor: pointer; font-weight: 700; font-size: 0.87rem; }
    .btn-cancel-f { background: #f1f5f9; color: #475569; border: none; padding: 0.55rem 1rem; border-radius: 7px; cursor: pointer; font-size: 0.87rem; }
    .notice { font-size: 0.75rem; color: #94a3b8; margin: 0.75rem 0 0; font-style: italic; }

    .bf-empty { text-align: center; padding: 4rem; color: #94a3b8; }
  `]
})
export class BrowseFacilitiesComponent implements OnInit {
  meetingService = inject(MeetingService);
  facilities: any[] = [];
  selectedFacility: any = null;
  bookingRequest: any = { startTime: '', endTime: '', purpose: '' };

  ngOnInit(): void {
    // Show ALL facilities so customers can see real availability status
    this.meetingService.getAllFacilities().subscribe(data => this.facilities = data);
  }

  openBookingForm(facility: any) {
    this.selectedFacility = facility;
    this.bookingRequest = { startTime: '', endTime: '', purpose: '' };
  }

  submitBooking() {
    const payload = {
      facilityId: this.selectedFacility.id,
      ...this.bookingRequest
    };
    this.meetingService.createBooking(payload).subscribe({
      next: () => {
        alert('Booking request submitted! It is now PENDING approval from a Facility Manager.');
        this.selectedFacility = null;
      },
      error: err => alert(err.error?.message || 'Error creating booking')
    });
  }
}
