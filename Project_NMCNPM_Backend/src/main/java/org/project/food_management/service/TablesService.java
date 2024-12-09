package org.project.food_management.service;

import org.project.food_management.model.Tables;

import java.util.List;

public interface TablesService {
    public Tables loadTableById(Long id) throws Exception;
    public Tables changeTableStatus(Long id, String status) throws Exception;

    public Tables createTable(int number) throws Exception;
    public List<Tables> getAllTable() throws Exception;
}
