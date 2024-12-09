package org.project.food_management.service;

import org.project.food_management.model.MenuItem;
import org.project.food_management.request.CreateMenuItemRequest;

import java.util.List;

public interface MenuItemService {
    public MenuItem findMenuItemById(Long id) throws Exception;
    public MenuItem createMenuItem(CreateMenuItemRequest req) throws Exception;
    public MenuItem changeStatusItem(Long id) throws Exception;
    public List<MenuItem> getAllMenuItem();
    public MenuItem deleteItemById(Long id) throws Exception;
}
