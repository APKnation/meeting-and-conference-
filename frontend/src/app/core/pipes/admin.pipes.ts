import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'bookingsByUser', standalone: true })
export class BookingsByUserPipe implements PipeTransform {
  transform(bookings: any[], userId: number): any[] {
    return (bookings || []).filter(b => b.customer?.id === userId);
  }
}

@Pipe({ name: 'statusCount', standalone: true })
export class StatusCountPipe implements PipeTransform {
  transform(bookings: any[], status: string): number {
    return (bookings || []).filter(b => b.status === status).length;
  }
}

@Pipe({ name: 'facilityStatus', standalone: true })
export class FacilityStatusPipe implements PipeTransform {
  transform(facilities: any[], status: string): number {
    return (facilities || []).filter(f => f.status === status).length;
  }
}
