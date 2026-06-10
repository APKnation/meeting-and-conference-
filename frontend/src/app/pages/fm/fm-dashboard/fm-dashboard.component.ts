import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MeetingService } from '../../../core/services/meeting.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-fm-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './fm-dashboard.component.html',
  styleUrls: ['../../admin/admin-dashboard/admin-dashboard.component.css']
})
export class FmDashboardComponent implements OnInit {
  meetingService = inject(MeetingService);
  
  activeTab: string = 'dashboard';
  
  facilities: any[] = [];
  bookings: any[] = [];
  
  showAddFacility = false;
  editingFacilityId: any = null;
  newFacility: any = { name: '', capacity: 10, location: '', status: 'AVAILABLE', description: '' };
  selectedImage?: File;

  ngOnInit(): void {
    this.loadFacilities();
    this.loadBookings();
  }

  setTab(tab: string) {
    this.activeTab = tab;
  }

  get pendingBookings() {
    return this.bookings.filter(b => b.status === 'PENDING');
  }

  loadFacilities() {
    this.meetingService.getAllFacilities().subscribe(data => this.facilities = data);
  }

  loadBookings() {
    this.meetingService.getAllBookings().subscribe(data => this.bookings = data);
  }

  openAddFacility() {
    this.showAddFacility = true;
    this.editingFacilityId = null;
    this.selectedImage = undefined;
    this.newFacility = { name: '', capacity: 10, location: '', status: 'AVAILABLE', description: '' };
  }

  closeAddFacility() {
    this.showAddFacility = false;
    this.editingFacilityId = null;
    this.selectedImage = undefined;
  }

  editFacility(f: any) {
    this.showAddFacility = true;
    this.editingFacilityId = f.id;
    this.selectedImage = undefined;
    this.newFacility = { name: f.name, capacity: f.capacity, location: f.location, status: f.status, description: f.description };
  }

  onImageSelected(event: any) {
    if (event.target.files.length > 0) {
      this.selectedImage = event.target.files[0];
    }
  }

  saveFacility() {
    if (this.editingFacilityId) {
      this.meetingService.updateFacility(this.editingFacilityId, this.newFacility, this.selectedImage).subscribe({
        next: () => {
          this.loadFacilities();
          this.closeAddFacility();
        },
        error: err => alert(err.error?.message || 'Error updating facility')
      });
    } else {
      this.meetingService.createFacility(this.newFacility, this.selectedImage).subscribe({
        next: () => {
          this.loadFacilities();
          this.closeAddFacility();
        },
        error: err => alert(err.error?.message || 'Error saving facility')
      });
    }
  }

  deleteFacility(id: number) {
    if (confirm('Are you sure you want to delete this facility?')) {
      this.meetingService.deleteFacility(id).subscribe(() => this.loadFacilities());
    }
  }

  updateBookingStatus(id: number, status: string) {
    this.meetingService.updateBookingStatus(id, status).subscribe({
      next: () => this.loadBookings(),
      error: err => alert(err.error?.message || 'Error updating status')
    });
  }
}
