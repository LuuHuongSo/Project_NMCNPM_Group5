package org.project.food_management.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.project.food_management.model.Order;
import org.project.food_management.model.OrderItem;
import org.project.food_management.request.ChangeOrderStatusRequest;
import org.project.food_management.request.CreateOrderItemRequest;
import org.project.food_management.request.CreateOrderRequest;
import org.project.food_management.service.OrderService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.springframework.data.jpa.domain.AbstractPersistable_.id;

@CrossOrigin
@RestController
public class OrderController {
    private OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping("/order")
    public ResponseEntity<Order> createOrder(
            @RequestBody CreateOrderRequest req
            ) throws Exception {
        System.out.println("Received Order Request: " + new ObjectMapper().writeValueAsString(req));
        Order order = orderService.createOrder(req);
        return new ResponseEntity<>(order, HttpStatus.CREATED);
    }


    @DeleteMapping("/order-item/{id}")
    public ResponseEntity<String> deleteOrderItem(
            @PathVariable("id") Long id
    ) throws Exception {
        orderService.deleteOrderItemById(id);
        return new ResponseEntity<>("Delete successfully", HttpStatus.OK);
    }

    @GetMapping("/order")
    public ResponseEntity<List<Order>> getAllOrder(){
        List<Order> orders = orderService.getAllOrder();
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }

    @GetMapping("/order/{id}")
    public ResponseEntity<Order> getOrderById(
            @PathVariable("id") Long id
    ) throws Exception {
        Order order = orderService.findOrderByOrderId(id);
        return new ResponseEntity<>(order, HttpStatus.OK);
    }

    @GetMapping("/get-all-order/{id}")
    public ResponseEntity<List<OrderItem>> getAllOrderItemByOrderId(
            @PathVariable("id") Long id
    ) throws Exception {
        List<OrderItem> orderItems = orderService.getAllOrderItemByOrderId(id);
        return new ResponseEntity<>(orderItems, HttpStatus.OK);
    }

    @DeleteMapping("/order/{id}")
    public ResponseEntity<String> deleteOrder(
            @PathVariable("id") Long id
    ) throws Exception {
        orderService.deleteOrderById(id);
        return new ResponseEntity<>("Delete successfully", HttpStatus.OK);
    }

    @PutMapping("/order")
    public ResponseEntity<Order> changeOrderStatus(
            @RequestBody ChangeOrderStatusRequest req
    ) throws Exception {
        Order order = orderService.changeOrderStatus(req.getOrderId(), req.getStatus());
        return new ResponseEntity<>(order, HttpStatus.OK);
    }

}
