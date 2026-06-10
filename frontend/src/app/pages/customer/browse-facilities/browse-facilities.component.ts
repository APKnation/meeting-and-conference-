import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MeetingService } from '../../../core/services/meeting.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-browse-facilities',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mt-4">
      <h1 class="page-title">Available Facilities</h1>
      
      <div class="grid">
        <div class="card" *ngFor="let facility of facilities">
          <div class="card-body">
            <h3>{{ facility.name }}</h3>
            <p class="text-muted"><i class="fas fa-map-marker-alt"></i> {{ facility.location }}</p>
            <p><strong>Capacity:</strong> {{ facility.capacity }} people</p>
            <p>{{ facility.description }}</p>
            
            <button class="btn-primary mt-2" (click)="openBookingForm(facility)">Book Now</button>
            
            <div *ngIf="selectedFacility?.id === facility.id" class="booking-form mt-4">
              <h4>Book {{ facility.name }}</h4>
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
                  <label>Purpose</label>
                  <input type="text" [(ngModel)]="bookingRequest.purpose" name="purpose" class="form-control" required>
                </div>
                <button class="btn-primary" type="submit">Submit Request</button>
                <button class="btn-secondary ml-2" type="button" (click)="selectedFacility = null">Cancel</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-title { margin-bottom: 2rem; color: var(--text-main); }
    .mt-4 { margin-top: 2rem; }
    .mt-2 { margin-top: 1rem; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; }
    .card { background: var(--white); border-radius: var(--radius); box-shadow: var(--shadow); overflow: hidden; transition: transform 0.2s; }
    .card:hover { transform: translateY(-4px); }
    .card-body { padding: 1.5rem; }
    .card h3 { color: var(--primary); margin-bottom: 0.5rem; }
    .text-muted { color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1rem; }
    .booking-form { padding: 1rem; background: #f8fafc; border-radius: var(--radius); border: 1px solid var(--border); }
    .form-group { margin-bottom: 1rem; }
    .form-control { width: 100%; padding: 0.5rem; border: 1px solid var(--border); border-radius: 4px; }
    .btn-secondary { background: #e2e8f0; color: #475569; padding: 0.5rem 1rem; border-radius: var(--radius); border: none; cursor: pointer; }
    .ml-2 { margin-left: 0.5rem; }
  `]
})
export class BrowseFacilitiesComponent implements OnInit {
  meetingService = inject(MeetingService);
  facilities: any[] = [];
  selectedFacility: any = null;
  bookingRequest: any = { startTime: '', endTime: '', purpose: '' };

  ngOnInit(): void {
    this.meetingService.getAllFacilities().subscribe(data => this.facilities = data.filter((f: any) => f.status === 'AVAILABLE'));
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
        alert('Booking submitted successfully! Waiting for approval.');
        this.selectedFacility = null;
      },
      error: err => alert(err.error.message || 'Error creating booking')
    });
  }
}
