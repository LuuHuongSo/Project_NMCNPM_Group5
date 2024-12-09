package org.project.food_management.service.Impl;

import org.project.food_management.model.MenuItem;
import org.project.food_management.repository.MenuItemRepository;
import org.project.food_management.request.CreateMenuItemRequest;
import org.project.food_management.service.MenuItemService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MenuItemServiceImpl implements MenuItemService {


    private MenuItemRepository menuItemRepository;

    public MenuItemServiceImpl(MenuItemRepository menuItemRepository) {
        this.menuItemRepository = menuItemRepository;
    }

    @Override
    public MenuItem findMenuItemById(Long id) throws Exception {
        Optional<MenuItem> optionalMenuItem = menuItemRepository.findById(id);
        if(optionalMenuItem.isEmpty()){
            throw new Exception("Menu item not found with id: " + id);
        }
        return optionalMenuItem.get();
    }

    @Override
    public MenuItem createMenuItem(CreateMenuItemRequest req) throws Exception {
        MenuItem menuItem = new MenuItem();
        menuItem.setName(req.getName());
        menuItem.setDescription(req.getDescription());
        menuItem.setCategory(req.getCategory());
        menuItem.setPrice(req.getPrice());
        menuItem.setAvailable(req.isAvailable());
        return menuItemRepository.save(menuItem);
    }

    @Override
    public MenuItem changeStatusItem(Long id) throws Exception {
        MenuItem menuItem = findMenuItemById(id);
        menuItem.setAvailable(!menuItem.isAvailable());
        return menuItemRepository.save(menuItem);
    }

    @Override
    public List<MenuItem> getAllMenuItem() {
        return menuItemRepository.findAll();
    }

    @Override
    public MenuItem deleteItemById(Long id) throws Exception {
        MenuItem menuItem = findMenuItemById(id);
        menuItemRepository.deleteById(id);
        return menuItem;
    }
}
