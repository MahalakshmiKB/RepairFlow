package com.repairflow.controller;

import com.repairflow.dto.DashboardStats;
import com.repairflow.service.RepairService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final RepairService repairService;

    public DashboardController(RepairService repairService) {
        this.repairService = repairService;
    }

    @GetMapping("/stats")
    public ResponseEntity<DashboardStats> getDashboardStats() {
        DashboardStats stats = repairService.getDashboardStats();
        return ResponseEntity.ok(stats);
    }
}
