package com.example.inventory.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoleAssignmentDto {
    @NotBlank(message = "Username is required")
    private String username;

    @NotBlank(message = "Role name is required")
    @Pattern(regexp = "^ROLE_(USER|ADMIN)$", message = "Role must be either ROLE_USER or ROLE_ADMIN")
    private String roleName;
}