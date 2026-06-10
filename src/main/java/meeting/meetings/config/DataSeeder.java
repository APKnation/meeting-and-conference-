package meeting.meetings.config;

import meeting.meetings.entity.Role;
import meeting.meetings.entity.User;
import meeting.meetings.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        String adminEmail = "abdulhameed@gmail.com";
        if (!userRepository.existsByEmail(adminEmail)) {
            User admin = new User();
            admin.setName("Super Admin");
            admin.setEmail(adminEmail);
            admin.setPassword(passwordEncoder.encode("abdul1234"));
            admin.setRole(Role.ADMIN);
            
            userRepository.save(admin);
            System.out.println("Super Admin seeded successfully.");
        }
    }
}
