package com.repairflow.dto;

import com.repairflow.entity.RepairStatus;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class UpdateStatusRequest {

    @NotNull(message = "New status is required")
    private RepairStatus status;

    @Size(max = 500, message = "Status note must be at most 500 characters")
    private String note;

    public UpdateStatusRequest() {}

    public UpdateStatusRequest(RepairStatus status, String note) {
        this.status = status;
        this.note = note;
    }

    public RepairStatus getStatus() { return status; }
    public void setStatus(RepairStatus status) { this.status = status; }

    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }
}
