package org.project.food_management.request;

import lombok.Data;
import org.project.food_management.model.Category;

@Data
public class CreateMenuItemRequest {
    private String name;
    private String description;
    private Long price;
    private Category category;
    private boolean available;
}
