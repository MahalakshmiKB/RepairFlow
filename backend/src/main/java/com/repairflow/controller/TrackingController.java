package com.repairflow.controller;

import com.repairflow.dto.TrackingResponse;
import com.repairflow.service.RepairService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tracking")
public class TrackingController {

    private final RepairService repairService;

    public TrackingController(RepairService repairService) {
        this.repairService = repairService;
    }

    @GetMapping("/{trackingId}")
    public ResponseEntity<TrackingResponse> getTrackingInfo(@PathVariable String trackingId) {
        TrackingResponse response = repairService.getTrackingByTrackingId(trackingId);
        return ResponseEntity.ok(response);
    }
}
