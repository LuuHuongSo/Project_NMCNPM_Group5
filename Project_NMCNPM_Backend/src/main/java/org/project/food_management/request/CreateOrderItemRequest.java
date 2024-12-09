package org.project.food_management.request;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import org.project.food_management.model.MenuItem;

@Data
public class CreateOrderItemRequest {
    private Long menuItemId;
    private int quantity;
    private Long price;
    private String specialInstruction;
}
