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

import org.springframework.web.multipart.MultipartFile;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/facilities")
public class FacilityController {
    @Autowired
    private FacilityService facilityService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @GetMapping
    public ResponseEntity<List<Facility>> getAllFacilities() {
        return ResponseEntity.ok(facilityService.getAllFacilities());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Facility> getFacilityById(@PathVariable Long id) {
        return ResponseEntity.ok(facilityService.getFacilityById(id));
    }

    @PostMapping(consumes = {"multipart/form-data"})
    @PreAuthorize("hasRole('ADMIN') or hasRole('FACILITY_MANAGER')")
    public ResponseEntity<?> createFacility(
            @RequestParam("facility") String facilityJson,
            @RequestParam(value = "image", required = false) MultipartFile image,
            @AuthenticationPrincipal User user) {
        try {
            FacilityRequest request = objectMapper.readValue(facilityJson, FacilityRequest.class);
            facilityService.createFacility(request, image, user);
            return ResponseEntity.ok(new MessageResponse("Facility created successfully!"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    @PostMapping(value = "/{id}", consumes = {"multipart/form-data"})
    @PreAuthorize("hasRole('ADMIN') or hasRole('FACILITY_MANAGER')")
    public ResponseEntity<?> updateFacility(
            @PathVariable Long id,
            @RequestParam("facility") String facilityJson,
            @RequestParam(value = "image", required = false) MultipartFile image) {
        try {
            FacilityRequest request = objectMapper.readValue(facilityJson, FacilityRequest.class);
            facilityService.updateFacility(id, request, image);
            return ResponseEntity.ok(new MessageResponse("Facility updated successfully!"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('FACILITY_MANAGER')")
    public ResponseEntity<?> deleteFacility(@PathVariable Long id) {
        facilityService.deleteFacility(id);
        return ResponseEntity.ok(new MessageResponse("Facility deleted successfully!"));
    }
}
