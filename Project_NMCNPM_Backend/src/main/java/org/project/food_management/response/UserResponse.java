package org.project.food_management.response;

import lombok.Data;

@Data
public class UserResponse {
    private String jwt;
    private String email;
    private String message;
    private String role;
}
