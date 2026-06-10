package meeting.meetings.service;

import meeting.meetings.dto.FacilityRequest;
import meeting.meetings.entity.Facility;
import meeting.meetings.entity.User;
import meeting.meetings.repository.FacilityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FacilityService {
    @Autowired
    private FacilityRepository facilityRepository;

    public List<Facility> getAllFacilities() {
        return facilityRepository.findAll();
    }

    public Facility getFacilityById(Long id) {
        return facilityRepository.findById(id).orElseThrow(() -> new RuntimeException("Facility not found"));
    }

    public Facility createFacility(FacilityRequest request, User manager) {
        Facility facility = Facility.builder()
                .name(request.getName())
                .capacity(request.getCapacity())
                .location(request.getLocation())
                .description(request.getDescription())
                .equipment(request.getEquipment())
                .status(request.getStatus() != null ? request.getStatus() : "AVAILABLE")
                .manager(manager)
                .build();
        return facilityRepository.save(facility);
    }

    public Facility updateFacility(Long id, FacilityRequest request) {
        Facility facility = getFacilityById(id);
        facility.setName(request.getName());
        facility.setCapacity(request.getCapacity());
        facility.setLocation(request.getLocation());
        facility.setDescription(request.getDescription());
        facility.setEquipment(request.getEquipment());
        if (request.getStatus() != null) {
            facility.setStatus(request.getStatus());
        }
        return facilityRepository.save(facility);
    }

    public void deleteFacility(Long id) {
        facilityRepository.deleteById(id);
    }
}
