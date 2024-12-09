package org.project.food_management.controller;


import org.project.food_management.model.MenuItem;
import org.project.food_management.model.TableStatus;
import org.project.food_management.model.Tables;
import org.project.food_management.request.ChangeTableStatusRequest;
import org.project.food_management.service.TablesService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
public class TableController {

    private TablesService tablesService;

    public TableController(TablesService tablesService) {
        this.tablesService = tablesService;
    }

    @PostMapping("/api/admin/table/create")
    public ResponseEntity<Tables> createTable(
            @RequestParam("number") int number
    ) throws Exception {
        Tables tables = tablesService.createTable(number);
        return new ResponseEntity<>(tables, HttpStatus.CREATED);
    }



    @PutMapping("/tables")
    public ResponseEntity<Tables> changeTableStatus(
            @RequestBody ChangeTableStatusRequest req
    ) throws Exception {
        Tables tables = tablesService.changeTableStatus(req.getId(), req.getStatus());
        return new ResponseEntity<>(tables, HttpStatus.OK);
    }

    @GetMapping("/tables")
    public ResponseEntity<List<Tables>> getAllTables() throws Exception {
        List<Tables> tables = tablesService.getAllTable();
        return new ResponseEntity<>(tables, HttpStatus.OK);
    }

    @GetMapping("/tables/{id}")
    public ResponseEntity<Tables> getTableById(@PathVariable("id") Long id) throws Exception {
        Tables tables = tablesService.loadTableById(id);
        return new ResponseEntity<>(tables, HttpStatus.OK);
    }

}
