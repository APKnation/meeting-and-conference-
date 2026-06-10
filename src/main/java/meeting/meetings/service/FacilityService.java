package meeting.meetings.service;

import meeting.meetings.dto.FacilityRequest;
import meeting.meetings.entity.Facility;
import meeting.meetings.entity.User;
import meeting.meetings.repository.FacilityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import org.springframework.web.multipart.MultipartFile;
import org.springframework.util.StringUtils;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;
import java.util.List;

@Service
public class FacilityService {
    @Autowired
    private FacilityRepository facilityRepository;

    private static final String UPLOAD_DIR = "uploads/facilities/";

    public List<Facility> getAllFacilities() {
        return facilityRepository.findAll();
    }

    public Facility getFacilityById(Long id) {
        return facilityRepository.findById(id).orElseThrow(() -> new RuntimeException("Facility not found"));
    }

    public Facility createFacility(FacilityRequest request, MultipartFile multipartFile, User manager) throws IOException {
        String imageUrl = null;
        if (multipartFile != null && !multipartFile.isEmpty()) {
            imageUrl = saveFile(multipartFile);
        }

        Facility facility = Facility.builder()
                .name(request.getName())
                .capacity(request.getCapacity())
                .location(request.getLocation())
                .description(request.getDescription())
                .equipment(request.getEquipment())
                .status(request.getStatus() != null ? request.getStatus() : "AVAILABLE")
                .imageUrl(imageUrl)
                .manager(manager)
                .build();
        return facilityRepository.save(facility);
    }

    public Facility updateFacility(Long id, FacilityRequest request, MultipartFile multipartFile) throws IOException {
        Facility facility = getFacilityById(id);
        facility.setName(request.getName());
        facility.setCapacity(request.getCapacity());
        facility.setLocation(request.getLocation());
        facility.setDescription(request.getDescription());
        facility.setEquipment(request.getEquipment());
        if (request.getStatus() != null) {
            facility.setStatus(request.getStatus());
        }

        if (multipartFile != null && !multipartFile.isEmpty()) {
            String imageUrl = saveFile(multipartFile);
            facility.setImageUrl(imageUrl);
        }

        return facilityRepository.save(facility);
    }

    private String saveFile(MultipartFile multipartFile) throws IOException {
        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String fileName = StringUtils.cleanPath(multipartFile.getOriginalFilename());
        String uniqueFileName = UUID.randomUUID().toString() + "_" + fileName;

        try (InputStream inputStream = multipartFile.getInputStream()) {
            Path filePath = uploadPath.resolve(uniqueFileName);
            Files.copy(inputStream, filePath, StandardCopyOption.REPLACE_EXISTING);
            return "/uploads/facilities/" + uniqueFileName;
        } catch (IOException ioe) {
            throw new IOException("Could not save image file: " + fileName, ioe);
        }
    }

    public void deleteFacility(Long id) {
        facilityRepository.deleteById(id);
    }
}
