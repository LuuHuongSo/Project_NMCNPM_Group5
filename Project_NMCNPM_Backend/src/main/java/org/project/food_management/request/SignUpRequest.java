package org.project.food_management.request;

import lombok.Data;
import org.project.food_management.model.USER_ROLE;

@Data
public class SignUpRequest {
    private String email;
    private String password;
    private String username;
    private USER_ROLE role;
}
