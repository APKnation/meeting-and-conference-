package meeting.meetings.controller;

import meeting.meetings.dto.BookingRequest;
import meeting.meetings.dto.MessageResponse;
import meeting.meetings.entity.Booking;
import meeting.meetings.entity.User;
import meeting.meetings.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/bookings")
public class BookingController {
    @Autowired
    private BookingService bookingService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('FACILITY_MANAGER')")
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN')")
    public ResponseEntity<List<Booking>> getMyBookings(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(bookingService.getCustomerBookings(user.getId()));
    }

    @GetMapping("/facility/{facilityId}")
    public ResponseEntity<List<Booking>> getFacilityBookings(@PathVariable Long facilityId) {
        return ResponseEntity.ok(bookingService.getFacilityBookings(facilityId));
    }

    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> createBooking(@Valid @RequestBody BookingRequest request, @AuthenticationPrincipal User user) {
        try {
            bookingService.createBooking(request, user);
            return ResponseEntity.ok(new MessageResponse("Booking request submitted successfully!"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN') or hasRole('FACILITY_MANAGER')")
    public ResponseEntity<?> updateBookingStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String status = body.get("status");
        if (status == null || (!status.equals("APPROVED") && !status.equals("REJECTED") && !status.equals("CANCELLED"))) {
            return ResponseEntity.badRequest().body(new MessageResponse("Invalid status"));
        }
        try {
            bookingService.updateBookingStatus(id, status);
            return ResponseEntity.ok(new MessageResponse("Booking status updated to " + status));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
}
