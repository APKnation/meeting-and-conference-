package meeting.meetings.service;

import meeting.meetings.entity.User;
import meeting.meetings.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        if (user.getRole().name().equals("ADMIN")) {
            throw new RuntimeException("Cannot delete the admin account.");
        }
        userRepository.deleteById(id);
    }
}
