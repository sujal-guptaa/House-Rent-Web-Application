package com.houserental.backend.controller;

import com.houserental.backend.model.AdminChangeLog;
import com.houserental.backend.service.AdminChangeLogService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminChangeLogService adminChangeLogService;

    public AdminController(AdminChangeLogService adminChangeLogService) {
        this.adminChangeLogService = adminChangeLogService;
    }

    @GetMapping("/changes")
    public List<AdminChangeLog> getRecentChanges() {
        return adminChangeLogService.getRecentChanges();
    }

    @PostMapping("/rollback/{changeId}")
    public ResponseEntity<AdminChangeLog> rollback(@PathVariable String changeId) {
        return ResponseEntity.ok(adminChangeLogService.rollback(changeId));
    }
}
