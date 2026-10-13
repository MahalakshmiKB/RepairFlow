package com.repairflow;

import com.repairflow.dto.*;
import com.repairflow.entity.RepairStatus;
import com.repairflow.entity.RepairTicket;
import com.repairflow.exception.ResourceNotFoundException;
import com.repairflow.repository.RepairStatusHistoryRepository;
import com.repairflow.repository.RepairTicketRepository;
import com.repairflow.service.RepairService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class RepairServiceTest {

    @Autowired
    private RepairService repairService;

    @Autowired
    private RepairTicketRepository repairTicketRepository;

    @Autowired
    private RepairStatusHistoryRepository historyRepository;

    @BeforeEach
    void setUp() {
        historyRepository.deleteAll();
        repairTicketRepository.deleteAll();
    }

    private CreateRepairRequest buildSampleRequest() {
        CreateRepairRequest request = new CreateRepairRequest();
        request.setCustomerName("John Doe");
        request.setCustomerEmail("john@example.com");
        request.setCustomerPhone("+1 555-0199");
        request.setDeviceType("Laptop");
        request.setDeviceBrand("Apple");
        request.setDeviceModel("MacBook Pro M1");
        request.setReportedIssue("Screen flickering and keyboard backlight not turning on");
        request.setDiagnosis("Suspected loose display flex cable");
        request.setDateReceived(LocalDate.now());
        request.setEstimatedCost(new BigDecimal("150.00"));
        return request;
    }

    @Test
    @DisplayName("Should successfully create a repair ticket with generated tracking ID and initial RECEIVED status")
    void testCreateRepairSuccess() {
        CreateRepairRequest request = buildSampleRequest();
        RepairTicketResponse created = repairService.createRepair(request);

        assertNotNull(created.getId());
        assertNotNull(created.getTrackingId());
        assertTrue(created.getTrackingId().startsWith("RF-"), "Tracking ID should start with RF-");
        assertEquals("John Doe", created.getCustomerName());
        assertEquals("MacBook Pro M1", created.getDeviceModel());
        assertEquals(RepairStatus.RECEIVED, created.getStatus());

        // Verify status history has the initial creation record
        List<StatusHistoryResponse> history = repairService.getStatusHistory(created.getId());
        assertEquals(1, history.size());
        assertNull(history.get(0).getPreviousStatus());
        assertEquals(RepairStatus.RECEIVED, history.get(0).getNewStatus());
    }

    @Test
    @DisplayName("Should generate unique sequential tracking IDs for multiple repairs")
    void testUniqueTrackingIds() {
        CreateRepairRequest req1 = buildSampleRequest();
        CreateRepairRequest req2 = buildSampleRequest();

        RepairTicketResponse r1 = repairService.createRepair(req1);
        RepairTicketResponse r2 = repairService.createRepair(req2);

        assertNotEquals(r1.getTrackingId(), r2.getTrackingId());
    }

    @Test
    @DisplayName("Should update repair status and log transition in status history")
    void testUpdateStatusWorkflow() {
        RepairTicketResponse created = repairService.createRepair(buildSampleRequest());

        // Transition: RECEIVED -> DIAGNOSING
        UpdateStatusRequest diagReq = new UpdateStatusRequest(RepairStatus.DIAGNOSING, "Opened device and began diagnosis");
        RepairTicketResponse diagnosing = repairService.updateStatus(created.getId(), diagReq);
        assertEquals(RepairStatus.DIAGNOSING, diagnosing.getStatus());

        // Transition: DIAGNOSING -> IN_REPAIR
        UpdateStatusRequest repairReq = new UpdateStatusRequest(RepairStatus.IN_REPAIR, "Replacement cable arrived, repairing");
        RepairTicketResponse inRepair = repairService.updateStatus(created.getId(), repairReq);
        assertEquals(RepairStatus.IN_REPAIR, inRepair.getStatus());

        // Transition: IN_REPAIR -> COMPLETED
        UpdateStatusRequest compReq = new UpdateStatusRequest(RepairStatus.COMPLETED, "Repair completed and tested");
        RepairTicketResponse completed = repairService.updateStatus(created.getId(), compReq);
        assertEquals(RepairStatus.COMPLETED, completed.getStatus());

        // Check full chronological history
        List<StatusHistoryResponse> history = repairService.getStatusHistory(created.getId());
        assertEquals(4, history.size()); // Initial + 3 transitions
        assertEquals(RepairStatus.RECEIVED, history.get(0).getNewStatus());
        assertEquals(RepairStatus.DIAGNOSING, history.get(1).getNewStatus());
        assertEquals(RepairStatus.IN_REPAIR, history.get(2).getNewStatus());
        assertEquals(RepairStatus.COMPLETED, history.get(3).getNewStatus());
    }

    @Test
    @DisplayName("Should preserve customer privacy in public tracking response")
    void testPublicTrackingPrivacy() {
        RepairTicketResponse created = repairService.createRepair(buildSampleRequest());

        TrackingResponse tracking = repairService.getTrackingByTrackingId(created.getTrackingId());

        assertNotNull(tracking);
        assertEquals(created.getTrackingId(), tracking.getTrackingId());
        assertEquals("Laptop", tracking.getDeviceType());
        assertEquals("MacBook Pro M1", tracking.getDeviceModel());
        assertEquals(RepairStatus.RECEIVED, tracking.getStatus());
        assertFalse(tracking.getStatusHistory().isEmpty());
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException for non-existent tracking ID")
    void testTrackingNotFound() {
        assertThrows(ResourceNotFoundException.class, () -> {
            repairService.getTrackingByTrackingId("RF-9999-9999");
        });
    }

    @Test
    @DisplayName("Should accurately calculate dashboard statistics")
    void testDashboardStatistics() {
        RepairTicketResponse r1 = repairService.createRepair(buildSampleRequest());
        RepairTicketResponse r2 = repairService.createRepair(buildSampleRequest());
        RepairTicketResponse r3 = repairService.createRepair(buildSampleRequest());

        repairService.updateStatus(r2.getId(), new UpdateStatusRequest(RepairStatus.DIAGNOSING, "Diagnosis started"));
        repairService.updateStatus(r3.getId(), new UpdateStatusRequest(RepairStatus.COMPLETED, "Done"));

        DashboardStats stats = repairService.getDashboardStats();

        assertEquals(3, stats.getTotalTickets());
        assertEquals(1, stats.getReceived());
        assertEquals(1, stats.getDiagnosing());
        assertEquals(0, stats.getInRepair());
        assertEquals(1, stats.getCompleted());
        assertEquals(0, stats.getUnrepairable());
    }
}
