import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MeetingService } from '../../../core/services/meeting.service';
import { AuthService } from '../../../core/services/auth.service';
import { BookingsByUserPipe, StatusCountPipe, FacilityStatusPipe } from '../../../core/pipes/admin.pipes';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, BookingsByUserPipe, StatusCountPipe, FacilityStatusPipe],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  meetingService = inject(MeetingService);
  authService = inject(AuthService);

  activeTab: string = 'dashboard';

  stats: any = {};
  users: any[] = [];
  facilities: any[] = [];
  bookings: any[] = [];

  // User form
  showAddUser = false;
  editingUser: any = null;
  userForm: any = { name: '', email: '', password: '', role: 'CUSTOMER' };

  // Facility form
  showAddFacility = false;
  facilityForm: any = { name: '', capacity: 10, location: '', description: '', status: 'AVAILABLE' };
  selectedImage?: File;

  ngOnInit(): void {
    this.loadAll();
  }

  setTab(tab: string) { this.activeTab = tab; }

  loadAll() {
    this.meetingService.getStats().subscribe({ next: d => this.stats = d, error: () => {} });
    this.meetingService.getAllUsers().subscribe({ next: d => this.users = d, error: () => {} });
    this.meetingService.getAllFacilities().subscribe({ next: d => this.facilities = d, error: () => {} });
    this.meetingService.getAllBookings().subscribe({ next: d => this.bookings = d, error: () => {} });
  }

  // ── Users ──
  openAddUser() { this.showAddUser = true; this.editingUser = null; this.userForm = { name: '', email: '', password: '', role: 'CUSTOMER' }; }
  closeUserForm() { this.showAddUser = false; this.editingUser = null; }

  saveUser() {
    this.meetingService.register(this.userForm).subscribe({
      next: () => { this.meetingService.getAllUsers().subscribe(d => this.users = d); this.closeUserForm(); this.meetingService.getStats().subscribe(d => this.stats = d); },
      error: err => alert(err.error?.message || 'Error saving user')
    });
  }

  deleteUser(id: number) {
    if (confirm('Delete this user permanently?')) {
      this.meetingService.deleteUser(id).subscribe({
        next: () => { this.meetingService.getAllUsers().subscribe(d => this.users = d); this.meetingService.getStats().subscribe(d => this.stats = d); },
        error: err => alert(err.error?.message || 'Cannot delete user')
      });
    }
  }

  // ── Facilities ──
  openAddFacility() { this.showAddFacility = true; this.selectedImage = undefined; this.facilityForm = { name: '', capacity: 10, location: '', description: '', status: 'AVAILABLE' }; }
  closeAddFacility() { this.showAddFacility = false; this.selectedImage = undefined; }

  onImageSelected(event: any) {
    if (event.target.files.length > 0) {
      this.selectedImage = event.target.files[0];
    }
  }

  saveFacility() {
    this.meetingService.createFacility(this.facilityForm, this.selectedImage).subscribe({
      next: () => { this.meetingService.getAllFacilities().subscribe(d => this.facilities = d); this.meetingService.getStats().subscribe(d => this.stats = d); this.closeAddFacility(); },
      error: err => alert(err.error?.message || 'Error saving facility')
    });
  }

  deleteFacility(id: number) {
    if (confirm('Delete this facility?')) {
      this.meetingService.deleteFacility(id).subscribe({
        next: () => { this.meetingService.getAllFacilities().subscribe(d => this.facilities = d); this.meetingService.getStats().subscribe(d => this.stats = d); },
        error: err => alert(err.error?.message || 'Error deleting facility')
      });
    }
  }

  // ── Bookings ──
  updateBookingStatus(id: number, status: string) {
    this.meetingService.updateBookingStatus(id, status).subscribe({
      next: () => { this.meetingService.getAllBookings().subscribe(d => this.bookings = d); this.meetingService.getStats().subscribe(d => this.stats = d); },
      error: err => alert(err.error?.message || 'Error updating booking')
    });
  }

  // ── Helpers ──
  get fmUsers() { return this.users.filter(u => u.role === 'FACILITY_MANAGER'); }
  get customers() { return this.users.filter(u => u.role === 'CUSTOMER'); }
  get pendingBookings() { return this.bookings.filter(b => b.status === 'PENDING'); }
  get approvedBookings() { return this.bookings.filter(b => b.status === 'APPROVED'); }
  get utilizationRate() {
    if (!this.facilities.length) return 0;
    const busy = this.facilities.filter(f => f.status !== 'AVAILABLE').length;
    return Math.round((busy / this.facilities.length) * 100);
  }
}
