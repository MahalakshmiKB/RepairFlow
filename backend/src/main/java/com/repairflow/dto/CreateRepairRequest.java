package com.repairflow.dto;

import com.repairflow.entity.RepairStatus;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;

public class CreateRepairRequest {

    @NotBlank(message = "Customer name is required")
    @Size(max = 100, message = "Name must be at most 100 characters")
    private String customerName;

    @Email(message = "Invalid email format")
    @Size(max = 150, message = "Email must be at most 150 characters")
    private String customerEmail;

    @Size(max = 20, message = "Phone must be at most 20 characters")
    private String customerPhone;

    @NotBlank(message = "Device type is required")
    @Size(max = 50, message = "Device type must be at most 50 characters")
    private String deviceType;

    @Size(max = 50, message = "Device brand must be at most 50 characters")
    private String deviceBrand;

    @Size(max = 100, message = "Device model must be at most 100 characters")
    private String deviceModel;

    @NotBlank(message = "Reported issue is required")
    private String reportedIssue;

    private String diagnosis;

    @NotNull(message = "Date received is required")
    private LocalDate dateReceived;

    @DecimalMin(value = "0.0", message = "Estimated cost cannot be negative")
    private BigDecimal estimatedCost;

    // Getters and Setters
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

    public LocalDate getDateReceived() { return dateReceived; }
    public void setDateReceived(LocalDate dateReceived) { this.dateReceived = dateReceived; }

    public BigDecimal getEstimatedCost() { return estimatedCost; }
    public void setEstimatedCost(BigDecimal estimatedCost) { this.estimatedCost = estimatedCost; }
}
