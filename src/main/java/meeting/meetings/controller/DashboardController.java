package meeting.meetings.controller;

import meeting.meetings.repository.BookingRepository;
import meeting.meetings.repository.FacilityRepository;
import meeting.meetings.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private FacilityRepository facilityRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN') or hasRole('FACILITY_MANAGER')")
    public ResponseEntity<?> getStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("totalFacilities", facilityRepository.count());
        stats.put("totalBookings", bookingRepository.count());
        return ResponseEntity.ok(stats);
    }
}
