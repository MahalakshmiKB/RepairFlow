package com.repairflow;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.repairflow.dto.CreateRepairRequest;
import com.repairflow.dto.UpdateStatusRequest;
import com.repairflow.entity.RepairStatus;
import com.repairflow.repository.RepairStatusHistoryRepository;
import com.repairflow.repository.RepairTicketRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class RepairControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private RepairTicketRepository ticketRepository;

    @Autowired
    private RepairStatusHistoryRepository historyRepository;

    @BeforeEach
    void setUp() {
        historyRepository.deleteAll();
        ticketRepository.deleteAll();
    }

    private CreateRepairRequest createSampleRequest() {
        CreateRepairRequest request = new CreateRepairRequest();
        request.setCustomerName("Alice Smith");
        request.setCustomerEmail("alice@example.com");
        request.setCustomerPhone("9876543210");
        request.setDeviceType("Smartphone");
        request.setDeviceBrand("Samsung");
        request.setDeviceModel("Galaxy S23");
        request.setReportedIssue("Cracked front AMOLED display");
        request.setDateReceived(LocalDate.now());
        request.setEstimatedCost(new BigDecimal("120.00"));
        return request;
    }

    @Test
    @DisplayName("POST /api/repairs - creates repair and returns 201 Created with tracking ID")
    void testCreateRepairEndpoint() throws Exception {
        CreateRepairRequest request = createSampleRequest();

        mockMvc.perform(post("/api/repairs")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.trackingId", startsWith("RF-")))
                .andExpect(jsonPath("$.customerName", is("Alice Smith")))
                .andExpect(jsonPath("$.status", is("RECEIVED")));
    }

    @Test
    @DisplayName("POST /api/repairs - validation failure with blank customer name returns 400 Bad Request")
    void testCreateRepairValidationFailure() throws Exception {
        CreateRepairRequest request = createSampleRequest();
        request.setCustomerName(""); // invalid blank

        mockMvc.perform(post("/api/repairs")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.customerName").exists());
    }

    @Test
    @DisplayName("GET /api/repairs - retrieves page of repairs")
    void testGetRepairsList() throws Exception {
        // Create one repair
        CreateRepairRequest request = createSampleRequest();
        mockMvc.perform(post("/api/repairs")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)));

        mockMvc.perform(get("/api/repairs"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(1)))
                .andExpect(jsonPath("$.content[0].customerName", is("Alice Smith")));
    }

    @Test
    @DisplayName("PATCH /api/repairs/{id}/status - updates status and logs history")
    void testPatchStatus() throws Exception {
        CreateRepairRequest request = createSampleRequest();
        MvcResult result = mockMvc.perform(post("/api/repairs")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andReturn();

        String json = result.getResponse().getContentAsString();
        Long id = objectMapper.readTree(json).get("id").asLong();

        UpdateStatusRequest statusRequest = new UpdateStatusRequest(RepairStatus.DIAGNOSING, "Inspected screen damage");

        mockMvc.perform(patch("/api/repairs/" + id + "/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(statusRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("DIAGNOSING")));
    }

    @Test
    @DisplayName("GET /api/tracking/{trackingId} - returns customer safe response")
    void testTrackingEndpoint() throws Exception {
        CreateRepairRequest request = createSampleRequest();
        MvcResult result = mockMvc.perform(post("/api/repairs")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andReturn();

        String json = result.getResponse().getContentAsString();
        String trackingId = objectMapper.readTree(json).get("trackingId").asText();

        mockMvc.perform(get("/api/tracking/" + trackingId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.trackingId", is(trackingId)))
                .andExpect(jsonPath("$.deviceModel", is("Galaxy S23")))
                .andExpect(jsonPath("$.status", is("RECEIVED")))
                .andExpect(jsonPath("$.customerEmail").doesNotExist())
                .andExpect(jsonPath("$.customerPhone").doesNotExist())
                .andExpect(jsonPath("$.internalNotes").doesNotExist());
    }

    @Test
    @DisplayName("GET /api/dashboard/stats - returns real counts")
    void testDashboardStatsEndpoint() throws Exception {
        mockMvc.perform(get("/api/dashboard/stats"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalTickets", is(0)));
    }
}
