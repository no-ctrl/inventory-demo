package com.example.inventory.service.impl;

import com.example.inventory.dto.RoleAssignmentDto;
import com.example.inventory.dto.UserLoginDto;
import com.example.inventory.dto.UserRegistrationDto;
import com.example.inventory.exception.DuplicateResourceException;
import com.example.inventory.exception.ResourceNotFoundException;
import com.example.inventory.model.Role;
import com.example.inventory.model.User;
import com.example.inventory.repository.RoleRepository;
import com.example.inventory.repository.UserRepository;
import com.example.inventory.security.JwtUtil;
import com.example.inventory.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authManager;
    private final JwtUtil jwtUtil;

    @Override
    public void register(UserRegistrationDto dto) {
        if (userRepository.findByUsername(dto.getUsername()).isPresent()) {
            throw new DuplicateResourceException("User exists: " + dto.getUsername());
        }
        User user = User.builder()
                .username(dto.getUsername())
                .password(passwordEncoder.encode(dto.getPassword()))
                .build();
        Role role = roleRepository.findByName("ROLE_USER")
                .orElseThrow(() -> new ResourceNotFoundException("ROLE_USER not found"));
        user.getRoles().add(role);
        userRepository.save(user);
    }

    @Override
    public String login(UserLoginDto dto) {
        Authentication auth = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(dto.getUsername(), dto.getPassword())
        );
        UserDetails userDetails = (UserDetails) auth.getPrincipal();
        return jwtUtil.generateToken(userDetails);
    }

    @Override
    public void assignRole(RoleAssignmentDto dto) {
        User user = userRepository.findByUsername(dto.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + dto.getUsername()));
        Role role = roleRepository.findByName(dto.getRoleName())
                .orElseThrow(() -> new ResourceNotFoundException("Role not found: " + dto.getRoleName()));
        user.getRoles().add(role);
        userRepository.save(user);
    }
}