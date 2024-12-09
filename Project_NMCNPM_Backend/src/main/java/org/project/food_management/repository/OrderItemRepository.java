package org.project.food_management.repository;

import org.project.food_management.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    public List<OrderItem> findOrderItemsByOrderId(Long id);
}
