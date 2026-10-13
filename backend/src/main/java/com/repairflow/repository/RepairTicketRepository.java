package com.repairflow.repository;

import com.repairflow.entity.RepairStatus;
import com.repairflow.entity.RepairTicket;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RepairTicketRepository extends JpaRepository<RepairTicket, Long> {

    Optional<RepairTicket> findByTrackingId(String trackingId);

    boolean existsByTrackingId(String trackingId);

    @Query("SELECT r FROM RepairTicket r WHERE " +
           "(:search IS NULL OR :search = '' OR " +
           "LOWER(r.trackingId) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(r.customerName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(r.deviceType) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(r.deviceBrand) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(r.deviceModel) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "AND (:status IS NULL OR r.status = :status)")
    Page<RepairTicket> searchRepairs(
        @Param("search") String search,
        @Param("status") RepairStatus status,
        Pageable pageable
    );

    long countByStatus(RepairStatus status);

    @Query("SELECT COUNT(r) FROM RepairTicket r WHERE r.dateReceived = CURRENT_DATE")
    long countReceivedToday();
}
