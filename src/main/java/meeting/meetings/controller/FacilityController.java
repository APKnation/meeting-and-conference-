package meeting.meetings.controller;

import meeting.meetings.dto.FacilityRequest;
import meeting.meetings.dto.MessageResponse;
import meeting.meetings.entity.Facility;
import meeting.meetings.entity.User;
import meeting.meetings.service.FacilityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/facilities")
public class FacilityController {
    @Autowired
    private FacilityService facilityService;

    @GetMapping
    public ResponseEntity<List<Facility>> getAllFacilities() {
        return ResponseEntity.ok(facilityService.getAllFacilities());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Facility> getFacilityById(@PathVariable Long id) {
        return ResponseEntity.ok(facilityService.getFacilityById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('FACILITY_MANAGER')")
    public ResponseEntity<?> createFacility(@Valid @RequestBody FacilityRequest request, @AuthenticationPrincipal User user) {
        facilityService.createFacility(request, user);
        return ResponseEntity.ok(new MessageResponse("Facility created successfully!"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('FACILITY_MANAGER')")
    public ResponseEntity<?> updateFacility(@PathVariable Long id, @Valid @RequestBody FacilityRequest request) {
        facilityService.updateFacility(id, request);
        return ResponseEntity.ok(new MessageResponse("Facility updated successfully!"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('FACILITY_MANAGER')")
    public ResponseEntity<?> deleteFacility(@PathVariable Long id) {
        facilityService.deleteFacility(id);
        return ResponseEntity.ok(new MessageResponse("Facility deleted successfully!"));
    }
}
