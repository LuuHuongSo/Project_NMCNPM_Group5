package org.project.food_management.request;

import lombok.Data;
@Data
public class ChangeOrderStatusRequest {
    private Long orderId;
    private String status;
}
