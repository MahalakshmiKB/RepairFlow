package com.repairflow.controller;

import com.repairflow.dto.*;
import com.repairflow.entity.RepairStatus;
import com.repairflow.service.RepairService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/repairs")
public class RepairController {

    private final RepairService repairService;

    public RepairController(RepairService repairService) {
        this.repairService = repairService;
    }

    @PostMapping
    public ResponseEntity<RepairTicketResponse> createRepair(@Valid @RequestBody CreateRepairRequest request) {
        RepairTicketResponse response = repairService.createRepair(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<Page<RepairTicketResponse>> getRepairs(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) RepairStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction
    ) {
        Sort.Direction sortDirection = direction.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));
        Page<RepairTicketResponse> response = repairService.getRepairs(search, status, pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RepairTicketResponse> getRepairById(@PathVariable Long id) {
        RepairTicketResponse response = repairService.getRepairById(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<RepairTicketResponse> updateRepair(
            @PathVariable Long id,
            @Valid @RequestBody UpdateRepairRequest request
    ) {
        RepairTicketResponse response = repairService.updateRepair(id, request);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<RepairTicketResponse> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateStatusRequest request
    ) {
        RepairTicketResponse response = repairService.updateStatus(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRepair(@PathVariable Long id) {
        repairService.deleteRepair(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/history")
    public ResponseEntity<List<StatusHistoryResponse>> getStatusHistory(@PathVariable Long id) {
        List<StatusHistoryResponse> response = repairService.getStatusHistory(id);
        return ResponseEntity.ok(response);
    }
}
