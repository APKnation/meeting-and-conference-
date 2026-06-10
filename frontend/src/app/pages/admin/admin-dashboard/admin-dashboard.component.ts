import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MeetingService } from '../../../core/services/meeting.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mt-4">
      <h1 class="page-title">Admin Dashboard</h1>
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
      
      <div class="section mt-4">
        <h2>Users Management</h2>
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
    </div>
  `,
  styles: [`
    .page-title { margin-bottom: 2rem; color: var(--text-main); }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; }
    .stat-card { background: var(--white); padding: 2rem; border-radius: var(--radius); box-shadow: var(--shadow); text-align: center; }
    .stat-card h3 { color: var(--text-muted); font-size: 1rem; margin-bottom: 0.5rem; }
    .stat-value { font-size: 2.5rem; font-weight: 700; color: var(--primary); }
    .mt-4 { margin-top: 2rem; }
    .section h2 { margin-bottom: 1rem; color: var(--text-main); }
    .table-container { background: var(--white); border-radius: var(--radius); box-shadow: var(--shadow); overflow: hidden; }
    .data-table { width: 100%; border-collapse: collapse; }
    .data-table th, .data-table td { padding: 1rem; text-align: left; border-bottom: 1px solid var(--border); }
    .data-table th { background-color: #f8fafc; font-weight: 600; color: var(--text-muted); }
    .btn-danger { background-color: #ef4444; color: white; border: none; padding: 0.4rem 0.8rem; border-radius: var(--radius); cursor: pointer; transition: background-color 0.2s; }
    .btn-danger:hover { background-color: #dc2626; }
    .badge { padding: 0.25rem 0.5rem; border-radius: 999px; font-size: 0.8rem; font-weight: 500; }
    .ADMIN { background-color: #fee2e2; color: #991b1b; }
    .FACILITY_MANAGER { background-color: #dbeafe; color: #1e40af; }
    .CUSTOMER { background-color: #dcfce3; color: #166534; }
  `]
})
export class AdminDashboardComponent implements OnInit {
  meetingService = inject(MeetingService);
  stats: any;
  users: any[] = [];

  ngOnInit(): void {
    this.loadStats();
    this.loadUsers();
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

  deleteUser(id: number) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.meetingService.deleteUser(id).subscribe(() => this.loadUsers());
    }
  }
}
