package com.example.inventory.service;

import com.example.inventory.dto.RoleAssignmentDto;
import com.example.inventory.dto.UserLoginDto;
import com.example.inventory.dto.UserRegistrationDto;

public interface UserService {
    void register(UserRegistrationDto dto);

    String login(UserLoginDto dto);

    void assignRole(RoleAssignmentDto dto);
}