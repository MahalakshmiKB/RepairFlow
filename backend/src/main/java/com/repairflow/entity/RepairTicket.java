package com.repairflow.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "repair_tickets", indexes = {
    @Index(name = "idx_tracking_id", columnList = "trackingId", unique = true),
    @Index(name = "idx_customer_name", columnList = "customerName"),
    @Index(name = "idx_status", columnList = "status")
})
public class RepairTicket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tracking_id", unique = true, nullable = false, length = 20)
    private String trackingId;

    @Column(name = "customer_name", nullable = false, length = 100)
    private String customerName;

    @Column(name = "customer_email", length = 150)
    private String customerEmail;

    @Column(name = "customer_phone", length = 20)
    private String customerPhone;

    @Column(name = "device_type", nullable = false, length = 50)
    private String deviceType;

    @Column(name = "device_brand", length = 50)
    private String deviceBrand;

    @Column(name = "device_model", length = 100)
    private String deviceModel;

    @Column(name = "reported_issue", nullable = false, columnDefinition = "TEXT")
    private String reportedIssue;

    @Column(name = "diagnosis", columnDefinition = "TEXT")
    private String diagnosis;

    @Column(name = "internal_notes", columnDefinition = "TEXT")
    private String internalNotes;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private RepairStatus status = RepairStatus.RECEIVED;

    @Column(name = "estimated_cost", precision = 10, scale = 2)
    private BigDecimal estimatedCost;

    @Column(name = "final_cost", precision = 10, scale = 2)
    private BigDecimal finalCost;

    @Column(name = "date_received", nullable = false)
    private LocalDate dateReceived;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = true)
    private Customer customer;

    @OneToMany(mappedBy = "repairTicket", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("changedAt ASC")
    private List<RepairStatusHistory> statusHistory = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
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

    public Customer getCustomer() { return customer; }
    public void setCustomer(Customer customer) { this.customer = customer; }
    public List<RepairStatusHistory> getStatusHistory() { return statusHistory; }
    public void setStatusHistory(List<RepairStatusHistory> statusHistory) { this.statusHistory = statusHistory; }
}
