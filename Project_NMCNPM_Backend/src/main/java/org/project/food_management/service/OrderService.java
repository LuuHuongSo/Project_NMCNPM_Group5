package org.project.food_management.service;

import org.project.food_management.model.Order;
import org.project.food_management.model.OrderItem;
import org.project.food_management.model.OrderStatus;
import org.project.food_management.request.CreateOrderItemRequest;
import org.project.food_management.request.CreateOrderRequest;

import java.util.List;

public interface OrderService {
    public List<Order> getAllOrder();
    public List<Order> getAllOrderByCustomerId(Long customerId) throws Exception;
    public List<OrderItem> getAllOrderItemByOrderId(Long orderId) throws Exception;
    //public OrderItem createOrderItem(CreateOrderItemRequest req) throws Exception;
    public Order createOrder(CreateOrderRequest req) throws Exception;
    public Order findOrderByOrderId(Long id) throws Exception;
    public OrderItem findOrderByOrderItemId(Long id) throws Exception;
    public void deleteOrderItemById(Long id) throws Exception;
    public void deleteOrderById(Long orderId) throws Exception;
    public Order changeOrderStatus(Long orderId, String orderStatus) throws Exception;

}
