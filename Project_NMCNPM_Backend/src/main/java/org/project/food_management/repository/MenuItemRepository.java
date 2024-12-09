package org.project.food_management.repository;

import org.project.food_management.model.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository

public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {

}
