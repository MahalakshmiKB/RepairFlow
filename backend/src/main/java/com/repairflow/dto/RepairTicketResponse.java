package com.repairflow.dto;

import com.repairflow.entity.RepairStatus;
import com.repairflow.entity.RepairTicket;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class RepairTicketResponse {

    private Long id;
    private String trackingId;
    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private String deviceType;
    private String deviceBrand;
    private String deviceModel;
    private String reportedIssue;
    private String diagnosis;
    private String internalNotes;
    private RepairStatus status;
    private BigDecimal estimatedCost;
    private BigDecimal finalCost;
    private LocalDate dateReceived;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<StatusHistoryResponse> statusHistory;

    public RepairTicketResponse() {}

    public RepairTicketResponse(RepairTicket ticket) {
        this.id = ticket.getId();
        this.trackingId = ticket.getTrackingId();
        this.customerName = ticket.getCustomerName();
        this.customerEmail = ticket.getCustomerEmail();
        this.customerPhone = ticket.getCustomerPhone();
        this.deviceType = ticket.getDeviceType();
        this.deviceBrand = ticket.getDeviceBrand();
        this.deviceModel = ticket.getDeviceModel();
        this.reportedIssue = ticket.getReportedIssue();
        this.diagnosis = ticket.getDiagnosis();
        this.internalNotes = ticket.getInternalNotes();
        this.status = ticket.getStatus();
        this.estimatedCost = ticket.getEstimatedCost();
        this.finalCost = ticket.getFinalCost();
        this.dateReceived = ticket.getDateReceived();
        this.createdAt = ticket.getCreatedAt();
        this.updatedAt = ticket.getUpdatedAt();
        if (ticket.getStatusHistory() != null) {
            this.statusHistory = ticket.getStatusHistory().stream()
                    .map(StatusHistoryResponse::new)
                    .collect(Collectors.toList());
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTrackingId() { return trackingId; }
    public void setTrackingId(String trackingId) { this.trackingId = trackingId; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getCustomerEmail() { return customerEmail; }
    public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }

    public String getCustomerPhone() { return customerPhone; }
    public void setCustomerPhone(String customerPhone) { this.customerPhone = customerPhone; }

    public String getDeviceType() { return deviceType; }
    public void setDeviceType(String deviceType) { this.deviceType = deviceType; }

    public String getDeviceBrand() { return deviceBrand; }
    public void setDeviceBrand(String deviceBrand) { this.deviceBrand = deviceBrand; }

    public String getDeviceModel() { return deviceModel; }
    public void setDeviceModel(String deviceModel) { this.deviceModel = deviceModel; }

    public String getReportedIssue() { return reportedIssue; }
    public void setReportedIssue(String reportedIssue) { this.reportedIssue = reportedIssue; }

    public String getDiagnosis() { return diagnosis; }
    public void setDiagnosis(String diagnosis) { this.diagnosis = diagnosis; }

    public String getInternalNotes() { return internalNotes; }
    public void setInternalNotes(String internalNotes) { this.internalNotes = internalNotes; }

    public RepairStatus getStatus() { return status; }
    public void setStatus(RepairStatus status) { this.status = status; }

    public BigDecimal getEstimatedCost() { return estimatedCost; }
    public void setEstimatedCost(BigDecimal estimatedCost) { this.estimatedCost = estimatedCost; }

    public BigDecimal getFinalCost() { return finalCost; }
    public void setFinalCost(BigDecimal finalCost) { this.finalCost = finalCost; }

    public LocalDate getDateReceived() { return dateReceived; }
    public void setDateReceived(LocalDate dateReceived) { this.dateReceived = dateReceived; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public List<StatusHistoryResponse> getStatusHistory() { return statusHistory; }
    public void setStatusHistory(List<StatusHistoryResponse> statusHistory) { this.statusHistory = statusHistory; }
}
