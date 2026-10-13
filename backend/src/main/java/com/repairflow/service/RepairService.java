package com.repairflow.service;

import com.repairflow.dto.*;
import com.repairflow.entity.RepairStatus;
import com.repairflow.entity.RepairStatusHistory;
import com.repairflow.entity.RepairTicket;
import com.repairflow.exception.ResourceNotFoundException;
import com.repairflow.repository.RepairStatusHistoryRepository;
import com.repairflow.repository.RepairTicketRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RepairService {

    private final RepairTicketRepository repairTicketRepository;
    private final RepairStatusHistoryRepository historyRepository;

    public RepairService(RepairTicketRepository repairTicketRepository, 
                         RepairStatusHistoryRepository historyRepository) {
        this.repairTicketRepository = repairTicketRepository;
        this.historyRepository = historyRepository;
    }

    @Transactional
    public synchronized String generateUniqueTrackingId() {
        int year = LocalDate.now().getYear();
        long count = repairTicketRepository.count() + 1;
        String trackingId = String.format("RF-%d-%04d", year, count);
        int suffix = 1;
        while (repairTicketRepository.existsByTrackingId(trackingId)) {
            trackingId = String.format("RF-%d-%04d", year, count + suffix);
            suffix++;
        }
        return trackingId;
    }

    @Transactional
    public RepairTicketResponse createRepair(CreateRepairRequest request) {
        RepairTicket ticket = new RepairTicket();
        ticket.setTrackingId(generateUniqueTrackingId());
        ticket.setCustomerName(request.getCustomerName());
        ticket.setCustomerEmail(request.getCustomerEmail());
        ticket.setCustomerPhone(request.getCustomerPhone());
        ticket.setDeviceType(request.getDeviceType());
        ticket.setDeviceBrand(request.getDeviceBrand());
        ticket.setDeviceModel(request.getDeviceModel());
        ticket.setReportedIssue(request.getReportedIssue());
        ticket.setDiagnosis(request.getDiagnosis());
        ticket.setDateReceived(request.getDateReceived() != null ? request.getDateReceived() : LocalDate.now());
        ticket.setEstimatedCost(request.getEstimatedCost());
        ticket.setStatus(RepairStatus.RECEIVED);

        RepairTicket saved = repairTicketRepository.save(ticket);

        // Record initial status in history
        RepairStatusHistory history = new RepairStatusHistory(
                saved,
                null,
                RepairStatus.RECEIVED,
                "Ticket created and received at shop."
        );
        historyRepository.save(history);
        saved.getStatusHistory().add(history);

        return new RepairTicketResponse(saved);
    }

    @Transactional(readOnly = true)
    public Page<RepairTicketResponse> getRepairs(String search, RepairStatus status, Pageable pageable) {
        return repairTicketRepository.searchRepairs(search, status, pageable)
                .map(RepairTicketResponse::new);
    }

    @Transactional(readOnly = true)
    public RepairTicketResponse getRepairById(Long id) {
        RepairTicket ticket = repairTicketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Repair ticket not found with id: " + id));
        return new RepairTicketResponse(ticket);
    }

    @Transactional
    public RepairTicketResponse updateRepair(Long id, UpdateRepairRequest request) {
        RepairTicket ticket = repairTicketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Repair ticket not found with id: " + id));

        ticket.setCustomerName(request.getCustomerName());
        ticket.setCustomerEmail(request.getCustomerEmail());
        ticket.setCustomerPhone(request.getCustomerPhone());
        ticket.setDeviceType(request.getDeviceType());
        ticket.setDeviceBrand(request.getDeviceBrand());
        ticket.setDeviceModel(request.getDeviceModel());
        ticket.setReportedIssue(request.getReportedIssue());
        ticket.setDiagnosis(request.getDiagnosis());
        ticket.setInternalNotes(request.getInternalNotes());
        ticket.setDateReceived(request.getDateReceived());
        ticket.setEstimatedCost(request.getEstimatedCost());
        ticket.setFinalCost(request.getFinalCost());

        RepairTicket updated = repairTicketRepository.save(ticket);
        return new RepairTicketResponse(updated);
    }

    @Transactional
    public RepairTicketResponse updateStatus(Long id, UpdateStatusRequest request) {
        RepairTicket ticket = repairTicketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Repair ticket not found with id: " + id));

        RepairStatus previousStatus = ticket.getStatus();
        RepairStatus newStatus = request.getStatus();

        ticket.setStatus(newStatus);
        RepairTicket saved = repairTicketRepository.save(ticket);

        String note = (request.getNote() != null && !request.getNote().trim().isEmpty())
                ? request.getNote().trim()
                : "Status changed from " + previousStatus + " to " + newStatus;

        RepairStatusHistory history = new RepairStatusHistory(saved, previousStatus, newStatus, note);
        historyRepository.save(history);
        saved.getStatusHistory().add(history);

        return new RepairTicketResponse(saved);
    }

    @Transactional
    public void deleteRepair(Long id) {
        RepairTicket ticket = repairTicketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Repair ticket not found with id: " + id));
        repairTicketRepository.delete(ticket);
    }

    @Transactional(readOnly = true)
    public List<StatusHistoryResponse> getStatusHistory(Long id) {
        if (!repairTicketRepository.existsById(id)) {
            throw new ResourceNotFoundException("Repair ticket not found with id: " + id);
        }
        return historyRepository.findByRepairTicketIdOrderByChangedAtAsc(id)
                .stream()
                .map(StatusHistoryResponse::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TrackingResponse getTrackingByTrackingId(String trackingId) {
        RepairTicket ticket = repairTicketRepository.findByTrackingId(trackingId)
                .orElseThrow(() -> new ResourceNotFoundException("No repair record found for tracking ID: " + trackingId));
        return new TrackingResponse(ticket);
    }

    @Transactional(readOnly = true)
    public DashboardStats getDashboardStats() {
        long total = repairTicketRepository.count();
        long received = repairTicketRepository.countByStatus(RepairStatus.RECEIVED);
        long diagnosing = repairTicketRepository.countByStatus(RepairStatus.DIAGNOSING);
        long inRepair = repairTicketRepository.countByStatus(RepairStatus.IN_REPAIR);
        long completed = repairTicketRepository.countByStatus(RepairStatus.COMPLETED);
        long unrepairable = repairTicketRepository.countByStatus(RepairStatus.UNREPAIRABLE);
        long receivedToday = repairTicketRepository.countReceivedToday();

        return new DashboardStats(total, received, diagnosing, inRepair, completed, unrepairable, receivedToday);
    }
}
