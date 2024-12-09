package org.project.food_management.request;

import lombok.Data;

@Data
public class ChangeTableStatusRequest {
    private Long id;
    private String status;
}
