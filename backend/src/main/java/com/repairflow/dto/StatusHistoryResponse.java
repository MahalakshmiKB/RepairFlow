package com.repairflow.dto;

import com.repairflow.entity.RepairStatus;
import com.repairflow.entity.RepairStatusHistory;
import java.time.LocalDateTime;

public class StatusHistoryResponse {

    private Long id;
    private RepairStatus previousStatus;
    private RepairStatus newStatus;
    private LocalDateTime changedAt;
    private String note;

    public StatusHistoryResponse() {}

    public StatusHistoryResponse(RepairStatusHistory history) {
        this.id = history.getId();
        this.previousStatus = history.getPreviousStatus();
        this.newStatus = history.getNewStatus();
        this.changedAt = history.getChangedAt();
        this.note = history.getNote();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public RepairStatus getPreviousStatus() { return previousStatus; }
    public void setPreviousStatus(RepairStatus previousStatus) { this.previousStatus = previousStatus; }

    public RepairStatus getNewStatus() { return newStatus; }
    public void setNewStatus(RepairStatus newStatus) { this.newStatus = newStatus; }

    public LocalDateTime getChangedAt() { return changedAt; }
    public void setChangedAt(LocalDateTime changedAt) { this.changedAt = changedAt; }

    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }
}
