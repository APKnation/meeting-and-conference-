package meeting.meetings.service;

import meeting.meetings.dto.BookingRequest;
import meeting.meetings.entity.Booking;
import meeting.meetings.entity.Facility;
import meeting.meetings.entity.Notification;
import meeting.meetings.entity.User;
import meeting.meetings.repository.BookingRepository;
import meeting.meetings.repository.FacilityRepository;
import meeting.meetings.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class BookingService {
    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private FacilityRepository facilityRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public List<Booking> getCustomerBookings(Long customerId) {
        return bookingRepository.findByCustomerId(customerId);
    }

    public List<Booking> getFacilityBookings(Long facilityId) {
        return bookingRepository.findByFacilityId(facilityId);
    }

    public Booking createBooking(BookingRequest request, User customer) {
        Facility facility = facilityRepository.findById(request.getFacilityId())
                .orElseThrow(() -> new RuntimeException("Facility not found"));

        // Check for conflicts
        List<Booking> existingBookings = bookingRepository.findByFacilityId(facility.getId());
        for (Booking existing : existingBookings) {
            if ("APPROVED".equals(existing.getStatus()) &&
                request.getStartTime().isBefore(existing.getEndTime()) &&
                request.getEndTime().isAfter(existing.getStartTime())) {
                throw new RuntimeException("Facility is already booked for the selected time");
            }
        }

        Booking booking = Booking.builder()
                .facility(facility)
                .customer(customer)
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .purpose(request.getPurpose())
                .status("PENDING")
                .build();
        
        booking = bookingRepository.save(booking);

        createNotification(customer, "Your booking request for " + facility.getName() + " has been submitted and is PENDING approval.");

        return booking;
    }

    public Booking updateBookingStatus(Long bookingId, String status) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        booking.setStatus(status);
        booking = bookingRepository.save(booking);

        createNotification(booking.getCustomer(), "Your booking request for " + booking.getFacility().getName() + " has been " + status + ".");

        return booking;
    }

    private void createNotification(User user, String message) {
        Notification notification = Notification.builder()
                .user(user)
                .message(message)
                .isRead(false)
                .createdAt(LocalDateTime.now())
                .build();
        notificationRepository.save(notification);
    }
}
