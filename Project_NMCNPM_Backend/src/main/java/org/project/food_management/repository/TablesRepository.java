package org.project.food_management.repository;

import org.project.food_management.model.Tables;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TablesRepository extends JpaRepository<Tables, Long> {
    public Tables findTablesByNumber(int number);
}
