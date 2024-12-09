package org.project.food_management.service.Impl;

import org.project.food_management.model.TableStatus;
import org.project.food_management.model.Tables;
import org.project.food_management.repository.TablesRepository;
import org.project.food_management.service.TablesService;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.List;
@Service

public class TablesServiceImpl implements TablesService {

    private TablesRepository tablesRepository;

    public TablesServiceImpl(TablesRepository tablesRepository) {
        this.tablesRepository = tablesRepository;
    }

    @Override
    public Tables loadTableById(Long id) throws Exception {
        Optional<Tables> optionalTables = tablesRepository.findById(id);
        if(optionalTables.isEmpty()){
            throw new Exception("Table not found with id: " + id);
        }
        return optionalTables.get();
    }

    @Override
    public Tables changeTableStatus(Long id,String status) throws Exception {
        if(status.equals("AVAILABLE") || status.equals("OCCUPIED") || status.equals("RESERVED")) {
            Tables tables = loadTableById(id);
            tables.setStatus(TableStatus.valueOf(status));
            tablesRepository.save(tables);
            return tables;
        }else{
            throw new Exception("Loi! Hay nhap lai gia tri status");
        }
    }

    @Override
    public Tables createTable(int number) throws Exception {
        Tables tables = tablesRepository.findTablesByNumber(number);
        if(tables == null){
            tables = new Tables();
            tables.setStatus(TableStatus.AVAILABLE);
            tables.setNumber(number);
            return tablesRepository.save(tables);
        }else{
            throw new Exception("Gia tri so ban da ton tai!");
        }
    }

    @Override
    public List<Tables> getAllTable() throws Exception {
        return tablesRepository.findAll();
    }

}
