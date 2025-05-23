package com.example.inventory.config;

import com.example.inventory.model.Role;
import com.example.inventory.model.User;
import com.example.inventory.repository.RoleRepository;
import com.example.inventory.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Slf4j
@RequiredArgsConstructor
@Component
public class DataLoader implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        loadRoles();
        loadDefaultAdmin();
    }

    private void loadRoles() {
        if (roleRepository.count() == 0) {
            Role userRole = Role.builder()
                    .name("ROLE_USER")
                    .build();
            Role adminRole = Role.builder()
                    .name("ROLE_ADMIN")
                    .build();

            roleRepository.save(userRole);
            roleRepository.save(adminRole);
            log.info("Roles created successfully");
        }
    }

    private void loadDefaultAdmin() {
        if (userRepository.findByUsername("admin").isEmpty()) {
            Role adminRole = roleRepository.findByName("ROLE_ADMIN")
                    .orElseThrow(() -> new RuntimeException("ROLE_ADMIN not found"));

            User admin = User.builder()
                    .username("admin")
                    .password(passwordEncoder.encode("admin123"))
                    .build();
            admin.getRoles().add(adminRole);

            userRepository.save(admin);
            log.info("Default admin user created: admin/admin123");
        }
    }
}