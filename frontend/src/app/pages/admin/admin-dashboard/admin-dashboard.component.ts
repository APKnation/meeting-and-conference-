import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MeetingService } from '../../../core/services/meeting.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  meetingService = inject(MeetingService);

  activeTab: 'dashboard' | 'users' | 'facilities' | 'bookings' = 'dashboard';

  stats: any;
  users: any[] = [];
  facilities: any[] = [];
  bookings: any[] = [];
  loading = false;

  showAddFacility = false;
  newFacility: any = { name: '', capacity: 10, location: '', description: '' };

  ngOnInit(): void {
    this.loadAll();
  }

  setTab(tab: 'dashboard' | 'users' | 'facilities' | 'bookings') {
    this.activeTab = tab;
  }

  loadAll() {
    this.meetingService.getStats().subscribe({ next: d => this.stats = d });
    this.meetingService.getAllUsers().subscribe({ next: d => this.users = d });
    this.meetingService.getAllFacilities().subscribe({ next: d => this.facilities = d });
    this.meetingService.getAllBookings().subscribe({ next: d => this.bookings = d });
  }

  deleteUser(id: number) {
    if (confirm('Delete this user permanently?')) {
      this.meetingService.deleteUser(id).subscribe({ next: () => this.meetingService.getAllUsers().subscribe(d => this.users = d) });
    }
  }

  toggleAddFacility() { this.showAddFacility = !this.showAddFacility; }

  saveFacility() {
    this.meetingService.createFacility(this.newFacility).subscribe({
      next: () => {
        this.meetingService.getAllFacilities().subscribe(d => this.facilities = d);
        this.meetingService.getStats().subscribe(d => this.stats = d);
        this.showAddFacility = false;
        this.newFacility = { name: '', capacity: 10, location: '', description: '' };
      }
    });
  }

  deleteFacility(id: number) {
    if (confirm('Delete this facility?')) {
      this.meetingService.deleteFacility(id).subscribe({
        next: () => {
          this.meetingService.getAllFacilities().subscribe(d => this.facilities = d);
          this.meetingService.getStats().subscribe(d => this.stats = d);
        }
      });
    }
  }

  updateBookingStatus(id: number, status: string) {
    this.meetingService.updateBookingStatus(id, status).subscribe({
      next: () => this.meetingService.getAllBookings().subscribe(d => this.bookings = d),
      error: err => alert(err.error?.message || 'Error updating booking')
    });
  }
}
