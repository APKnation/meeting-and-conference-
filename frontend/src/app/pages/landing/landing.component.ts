import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
  http = inject(HttpClient);

  facilities: any[] = [];
  loading = true;

  features = [
    { icon: '🏢', title: 'Premium Rooms', desc: 'Fully equipped meeting rooms, board rooms and conference halls for every need.' },
    { icon: '📅', title: 'Easy Booking', desc: 'Book your preferred facility in minutes. Real-time availability at your fingertips.' },
    { icon: '🔒', title: 'Conflict-Free', desc: 'Our smart scheduling system automatically prevents double-bookings.' },
    { icon: '📊', title: 'Live Updates', desc: 'Track your booking status instantly — from pending to approved.' },
    { icon: '🧑‍💼', title: 'Managed by Experts', desc: 'Dedicated facility managers ensure every room is ready for your meeting.' },
    { icon: '🔔', title: 'Notifications', desc: 'Get notified as soon as your booking is confirmed or updated.' }
  ];

  ngOnInit(): void {
    this.http.get<any[]>('http://localhost:8080/api/facilities').subscribe({
      next: data => { this.facilities = data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }
}
