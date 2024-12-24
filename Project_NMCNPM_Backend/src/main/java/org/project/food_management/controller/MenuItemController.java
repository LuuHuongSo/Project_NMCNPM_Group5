package org.project.food_management.controller;

import org.project.food_management.model.MenuItem;
import org.project.food_management.request.ChangeMenuItemPriceRequest;
import org.project.food_management.request.CreateMenuItemRequest;
import org.project.food_management.service.MenuItemService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
public class MenuItemController {

    private MenuItemService menuItemService;

    public MenuItemController(MenuItemService menuItemService) {
        this.menuItemService = menuItemService;
    }

    @PostMapping("/menu")
    public ResponseEntity<MenuItem> createMenuItem(
            @RequestBody CreateMenuItemRequest req
    ) throws Exception {
        MenuItem menuItem = menuItemService.createMenuItem(req);
        return new ResponseEntity<>(menuItem, HttpStatus.CREATED);
    }

    @PutMapping("/menu")
    public ResponseEntity<MenuItem> changeMenuItemPrice(
            @RequestBody ChangeMenuItemPriceRequest req
    ) throws Exception {
        MenuItem menuItem = menuItemService.changePriceMenuItem(req);
        return new ResponseEntity<>(menuItem, HttpStatus.OK);
    }

    @GetMapping("/menu/{id}")
    public ResponseEntity<MenuItem> findMenuItemById(@PathVariable("id") Long id) throws Exception {
        MenuItem menuItem = menuItemService.findMenuItemById(id);
        return new ResponseEntity<>(menuItem, HttpStatus.OK);
    }
    @GetMapping("/menu")
    public ResponseEntity<List<MenuItem>> getAllMenuItems(){
        List<MenuItem> menuItemList = menuItemService.getAllMenuItem();
        return new ResponseEntity<>(menuItemList, HttpStatus.OK);
    }
    @DeleteMapping("/menu/{id}")
    public ResponseEntity<MenuItem> deleteItemById(@PathVariable("id") Long id) throws Exception {
        MenuItem menuItem = menuItemService.deleteItemById(id);
        return new ResponseEntity<>(menuItem, HttpStatus.OK);
    }
}
