package org.project.food_management.request;

import lombok.Data;
import org.project.food_management.model.OrderItem;
import org.project.food_management.model.OrderStatus;
import org.project.food_management.model.Tables;

import java.util.List;

@Data
public class CreateOrderRequest {
    private Tables table;
    private Long customerId;
    private List<CreateOrderItemRequest> orderItems;
    private OrderStatus orderStatus;
    private Long totalAmount;
}
