package com.repairflow.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "repair_status_history", indexes = {
    @Index(name = "idx_history_ticket", columnList = "repair_ticket_id")
})
public class RepairStatusHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "repair_ticket_id", nullable = false)
    private RepairTicket repairTicket;

    @Enumerated(EnumType.STRING)
    @Column(name = "previous_status", length = 20)
    private RepairStatus previousStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "new_status", nullable = false, length = 20)
    private RepairStatus newStatus;

    @Column(name = "changed_at", nullable = false)
    private LocalDateTime changedAt;

    @Column(name = "note", columnDefinition = "TEXT")
    private String note;

    public RepairStatusHistory() {}

    public RepairStatusHistory(RepairTicket ticket, RepairStatus previousStatus, RepairStatus newStatus, String note) {
        this.repairTicket = ticket;
        this.previousStatus = previousStatus;
        this.newStatus = newStatus;
        this.changedAt = LocalDateTime.now();
        this.note = note;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public RepairTicket getRepairTicket() { return repairTicket; }
    public void setRepairTicket(RepairTicket repairTicket) { this.repairTicket = repairTicket; }

    public RepairStatus getPreviousStatus() { return previousStatus; }
    public void setPreviousStatus(RepairStatus previousStatus) { this.previousStatus = previousStatus; }

    public RepairStatus getNewStatus() { return newStatus; }
    public void setNewStatus(RepairStatus newStatus) { this.newStatus = newStatus; }

    public LocalDateTime getChangedAt() { return changedAt; }
    public void setChangedAt(LocalDateTime changedAt) { this.changedAt = changedAt; }

    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }
}
