package com.repairflow.dto;

import com.repairflow.entity.RepairStatus;
import com.repairflow.entity.RepairTicket;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class TrackingResponse {

    private String trackingId;
    private String deviceType;
    private String deviceBrand;
    private String deviceModel;
    private String reportedIssue;
    private RepairStatus status;
    private LocalDate dateReceived;
    private BigDecimal estimatedCost;
    private List<CustomerStatusHistoryItem> statusHistory;

    public static class CustomerStatusHistoryItem {
        private RepairStatus status;
        private LocalDateTime changedAt;
        private String note;

        public CustomerStatusHistoryItem() {}

        public CustomerStatusHistoryItem(RepairStatus status, LocalDateTime changedAt, String note) {
            this.status = status;
            this.changedAt = changedAt;
            this.note = note;
        }

        public RepairStatus getStatus() { return status; }
        public void setStatus(RepairStatus status) { this.status = status; }

        public LocalDateTime getChangedAt() { return changedAt; }
        public void setChangedAt(LocalDateTime changedAt) { this.changedAt = changedAt; }

        public String getNote() { return note; }
        public void setNote(String note) { this.note = note; }
    }

    public TrackingResponse() {}

    public TrackingResponse(RepairTicket ticket) {
        this.trackingId = ticket.getTrackingId();
        this.deviceType = ticket.getDeviceType();
        this.deviceBrand = ticket.getDeviceBrand();
        this.deviceModel = ticket.getDeviceModel();
        this.reportedIssue = ticket.getReportedIssue();
        this.status = ticket.getStatus();
        this.dateReceived = ticket.getDateReceived();
        this.estimatedCost = ticket.getEstimatedCost();
        if (ticket.getStatusHistory() != null) {
            this.statusHistory = ticket.getStatusHistory().stream()
                    .map(h -> new CustomerStatusHistoryItem(h.getNewStatus(), h.getChangedAt(), h.getNote()))
                    .collect(Collectors.toList());
        }
    }

    public String getTrackingId() { return trackingId; }
    public void setTrackingId(String trackingId) { this.trackingId = trackingId; }

    public String getDeviceType() { return deviceType; }
    public void setDeviceType(String deviceType) { this.deviceType = deviceType; }

    public String getDeviceBrand() { return deviceBrand; }
    public void setDeviceBrand(String deviceBrand) { this.deviceBrand = deviceBrand; }

    public String getDeviceModel() { return deviceModel; }
    public void setDeviceModel(String deviceModel) { this.deviceModel = deviceModel; }

    public String getReportedIssue() { return reportedIssue; }
    public void setReportedIssue(String reportedIssue) { this.reportedIssue = reportedIssue; }

    public RepairStatus getStatus() { return status; }
    public void setStatus(RepairStatus status) { this.status = status; }

    public LocalDate getDateReceived() { return dateReceived; }
    public void setDateReceived(LocalDate dateReceived) { this.dateReceived = dateReceived; }

    public BigDecimal getEstimatedCost() { return estimatedCost; }
    public void setEstimatedCost(BigDecimal estimatedCost) { this.estimatedCost = estimatedCost; }

    public List<CustomerStatusHistoryItem> getStatusHistory() { return statusHistory; }
    public void setStatusHistory(List<CustomerStatusHistoryItem> statusHistory) { this.statusHistory = statusHistory; }
}
