import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MeetingService } from '../../../core/services/meeting.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-layout">
      <!-- Sidebar -->
      <aside class="sidebar">
        <div class="sidebar-header">
          <h2>Admin Center</h2>
        </div>
        <ul class="sidebar-nav">
          <li [class.active]="activeTab === 'dashboard'" (click)="setActiveTab('dashboard')">
            Dashboard
          </li>
          <li [class.active]="activeTab === 'users'" (click)="setActiveTab('users')">
            Manage Users
          </li>
          <li [class.active]="activeTab === 'facilities'" (click)="setActiveTab('facilities')">
            Manage Facilities
          </li>
          <li [class.active]="activeTab === 'bookings'" (click)="setActiveTab('bookings')">
            Manage Bookings
          </li>
        </ul>
      </aside>

      <!-- Main Content -->
      <main class="main-content">
        
        <!-- DASHBOARD TAB -->
        <div *ngIf="activeTab === 'dashboard'" class="fade-in">
          <h1 class="page-title">System Overview</h1>
          <div class="stats-grid">
            <div class="stat-card">
              <h3>Total Users</h3>
              <p class="stat-value">{{ stats?.totalUsers || 0 }}</p>
            </div>
            <div class="stat-card">
              <h3>Total Facilities</h3>
              <p class="stat-value">{{ stats?.totalFacilities || 0 }}</p>
            </div>
            <div class="stat-card">
              <h3>Total Bookings</h3>
              <p class="stat-value">{{ stats?.totalBookings || 0 }}</p>
            </div>
          </div>
        </div>

        <!-- USERS TAB -->
        <div *ngIf="activeTab === 'users'" class="fade-in">
          <h1 class="page-title">Users Management</h1>
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let user of users">
                  <td>{{ user.id }}</td>
                  <td>{{ user.name }}</td>
                  <td>{{ user.email }}</td>
                  <td><span class="badge" [ngClass]="user.role">{{ user.role }}</span></td>
                  <td>
                    <button class="btn-danger btn-sm" (click)="deleteUser(user.id)" *ngIf="user.role !== 'ADMIN'">Delete</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- FACILITIES TAB -->
        <div *ngIf="activeTab === 'facilities'" class="fade-in">
          <div class="flex-between mb-4">
            <h1 class="page-title">Facilities Management</h1>
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

        <!-- BOOKINGS TAB -->
        <div *ngIf="activeTab === 'bookings'" class="fade-in">
          <h1 class="page-title">Bookings Management</h1>
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
                  <td><span class="badge status-{{booking.status}}">{{ booking.status }}</span></td>
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

      </main>
    </div>
  `,
  styles: [`
    .admin-layout {
      display: flex;
      min-height: calc(100vh - 60px); /* minus navbar height */
      background-color: var(--bg-color);
    }
    
    /* Sidebar Styles */
    .sidebar {
      width: 260px;
      background-color: var(--white);
      border-right: 1px solid var(--border);
      display: flex;
      flex-direction: column;
    }
    
    .sidebar-header {
      padding: 1.5rem;
      border-bottom: 1px solid var(--border);
    }
    
    .sidebar-header h2 {
      font-size: 1.25rem;
      color: var(--primary);
      margin: 0;
    }
    
    .sidebar-nav {
      list-style: none;
      padding: 1rem 0;
      margin: 0;
    }
    
    .sidebar-nav li {
      padding: 1rem 1.5rem;
      color: var(--text-muted);
      cursor: pointer;
      font-weight: 500;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    
    .sidebar-nav li:hover {
      background-color: #f1f5f9;
      color: var(--primary);
    }
    
    .sidebar-nav li.active {
      background-color: #e0e7ff;
      color: var(--primary);
      border-right: 4px solid var(--primary);
    }
    
    /* Main Content Styles */
    .main-content {
      flex: 1;
      padding: 2rem;
      overflow-y: auto;
    }

    .fade-in {
      animation: fadeIn 0.3s ease-in-out;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .page-title { margin-bottom: 2rem; color: var(--text-main); font-size: 1.75rem; font-weight: 600; }
    
    /* Stats Grid */
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; }
    .stat-card { background: var(--white); padding: 2rem; border-radius: var(--radius); box-shadow: var(--shadow); text-align: center; }
    .stat-card h3 { color: var(--text-muted); font-size: 1rem; margin-bottom: 0.5rem; }
    .stat-value { font-size: 2.5rem; font-weight: 700; color: var(--primary); }
    
    /* Shared Utilites */
    .mt-4 { margin-top: 2rem; }
    .mb-4 { margin-bottom: 1.5rem; }
    .flex-between { display: flex; justify-content: space-between; align-items: center; }
    
    /* Tables */
    .table-container { background: var(--white); border-radius: var(--radius); box-shadow: var(--shadow); overflow: auto; }
    .data-table { width: 100%; border-collapse: collapse; min-width: 600px; }
    .data-table th, .data-table td { padding: 1rem; text-align: left; border-bottom: 1px solid var(--border); }
    .data-table th { background-color: #f8fafc; font-weight: 600; color: var(--text-muted); }
    .data-table tr:last-child td { border-bottom: none; }
    
    /* Buttons */
    .btn-sm { padding: 0.4rem 0.8rem; border-radius: var(--radius); cursor: pointer; border: none; font-size: 0.85rem; font-weight: 500;}
    .btn-danger { background-color: #ef4444; color: white; transition: background-color 0.2s; }
    .btn-danger:hover { background-color: #dc2626; }
    .btn-success { background-color: #10b981; color: white; transition: background-color 0.2s; }
    .btn-success:hover { background-color: #059669; }
    .btn-secondary { background: #e2e8f0; color: #475569; padding: 0.5rem 1rem; border-radius: var(--radius); border: none; cursor: pointer; font-weight: 500; }
    .btn-secondary:hover { background: #cbd5e1; }
    .btn-primary { background-color: var(--primary); color: white; border: none; padding: 0.5rem 1rem; border-radius: var(--radius); cursor: pointer; transition: background-color 0.2s; }
    .btn-primary:hover { background-color: var(--primary-hover); }
    .mr-2 { margin-right: 0.5rem; }
    .ml-2 { margin-left: 0.5rem; }
    
    /* Badges */
    .badge { padding: 0.25rem 0.6rem; border-radius: 999px; font-size: 0.75rem; font-weight: 600; letter-spacing: 0.025em; }
    .ADMIN { background-color: #fee2e2; color: #991b1b; }
    .FACILITY_MANAGER { background-color: #dbeafe; color: #1e40af; }
    .CUSTOMER { background-color: #dcfce3; color: #166534; }
    .bg-green { background-color: #dcfce3; color: #166534; }
    .status-PENDING { background-color: #fef3c7; color: #b45309; }
    .status-APPROVED { background-color: #dcfce3; color: #166534; }
    .status-REJECTED { background-color: #fee2e2; color: #991b1b; }
    .status-CANCELLED { background-color: #f1f5f9; color: #475569; }

    /* Forms */
    .card { background: var(--white); border-radius: var(--radius); box-shadow: var(--shadow); }
    .p-4 { padding: 1.5rem; }
    .form-group { margin-bottom: 1rem; }
    .form-control { width: 100%; padding: 0.5rem; border: 1px solid var(--border); border-radius: 4px; font-family: inherit;}
    .form-control:focus { outline: none; border-color: var(--primary); }
    label { display: block; font-size: 0.9rem; font-weight: 500; margin-bottom: 0.5rem; color: var(--text-main); }
  `]
})
export class AdminDashboardComponent implements OnInit {
  meetingService = inject(MeetingService);
  
  activeTab: 'dashboard' | 'users' | 'facilities' | 'bookings' = 'dashboard';
  
  stats: any;
  users: any[] = [];
  facilities: any[] = [];
  bookings: any[] = [];
  
  showAddFacility = false;
  newFacility: any = { name: '', capacity: 10, location: '' };

  ngOnInit(): void {
    this.loadStats();
    this.loadUsers();
    this.loadFacilities();
    this.loadBookings();
  }

  setActiveTab(tab: 'dashboard' | 'users' | 'facilities' | 'bookings') {
    this.activeTab = tab;
  }

  loadStats() {
    this.meetingService.getStats().subscribe({
      next: data => this.stats = data,
      error: () => console.log('Error fetching stats')
    });
  }

  loadUsers() {
    this.meetingService.getAllUsers().subscribe({
      next: data => this.users = data,
      error: () => console.log('Error fetching users')
    });
  }

  loadFacilities() {
    this.meetingService.getAllFacilities().subscribe(data => this.facilities = data);
  }

  loadBookings() {
    this.meetingService.getAllBookings().subscribe(data => this.bookings = data);
  }

  deleteUser(id: number) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.meetingService.deleteUser(id).subscribe(() => {
        this.loadUsers();
        this.loadStats();
      });
    }
  }

  toggleAddFacility() {
    this.showAddFacility = !this.showAddFacility;
  }

  saveFacility() {
    this.meetingService.createFacility(this.newFacility).subscribe(() => {
      this.loadFacilities();
      this.loadStats();
      this.showAddFacility = false;
      this.newFacility = { name: '', capacity: 10, location: '' };
    });
  }

  deleteFacility(id: number) {
    if (confirm('Are you sure you want to delete this facility?')) {
      this.meetingService.deleteFacility(id).subscribe(() => {
        this.loadFacilities();
        this.loadStats();
      });
    }
  }

  updateBookingStatus(id: number, status: string) {
    this.meetingService.updateBookingStatus(id, status).subscribe({
      next: () => {
        this.loadBookings();
        this.loadStats();
      },
      error: err => alert(err.error.message || 'Error updating status')
    });
  }
}
