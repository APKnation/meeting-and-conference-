import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:8080/api/';

@Injectable({
  providedIn: 'root'
})
export class MeetingService {
  constructor(private http: HttpClient) {}

  // Dashboard
  getStats(): Observable<any> {
    return this.http.get(API_URL + 'dashboard/stats');
  }

  // Users
  getAllUsers(): Observable<any> {
    return this.http.get(API_URL + 'users');
  }
  deleteUser(id: number): Observable<any> {
    return this.http.delete(API_URL + `users/${id}`);
  }

  // Facilities
  getAllFacilities(): Observable<any> {
    return this.http.get(API_URL + 'facilities');
  }
  createFacility(data: any): Observable<any> {
    return this.http.post(API_URL + 'facilities', data);
  }
  updateFacility(id: number, data: any): Observable<any> {
    return this.http.put(API_URL + `facilities/${id}`, data);
  }
  deleteFacility(id: number): Observable<any> {
    return this.http.delete(API_URL + `facilities/${id}`);
  }

  // Bookings
  getAllBookings(): Observable<any> {
    return this.http.get(API_URL + 'bookings');
  }
  getMyBookings(): Observable<any> {
    return this.http.get(API_URL + 'bookings/my');
  }
  createBooking(data: any): Observable<any> {
    return this.http.post(API_URL + 'bookings', data);
  }
  updateBookingStatus(id: number, status: string): Observable<any> {
    return this.http.put(API_URL + `bookings/${id}/status`, { status });
  }
}
