package meeting.meetings.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Data
public class FacilityRequest {
    @NotBlank
    private String name;
    
    @NotNull
    private Integer capacity;
    
    private String location;
    private String description;
    private String equipment;
    private String status;
}
