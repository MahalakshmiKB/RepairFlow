-- ==========================================================
-- RepairFlow - Repeatable Demonstration Seed Data Script
-- Currency: Indian Rupees (INR)
-- Idempotent: Can be safely re-run without duplicate entries
-- ==========================================================

-- 1. Insert Demonstration Repair Tickets (if they do not already exist)
INSERT INTO repair_tickets (
    tracking_id, customer_name, customer_email, customer_phone,
    device_type, device_brand, device_model, reported_issue,
    diagnosis, internal_notes, status, estimated_cost, final_cost,
    date_received, created_at, updated_at
)
SELECT 'RF-2026-0003', 'Rohan Sharma', 'rohan.sharma@example.com', '+91 98765 43210',
       'Smartphone', 'OnePlus', '11R 5G', 'Cracked AMOLED screen and charging port loose',
       'Screen replacement needed, charging flex cable loose', 'Customer requested original OEM display panel',
       'IN_REPAIR', 6500.00, NULL,
       CURRENT_DATE - INTERVAL '2 days', CURRENT_TIMESTAMP - INTERVAL '2 days', CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM repair_tickets WHERE tracking_id = 'RF-2026-0003');

INSERT INTO repair_tickets (
    tracking_id, customer_name, customer_email, customer_phone,
    device_type, device_brand, device_model, reported_issue,
    diagnosis, internal_notes, status, estimated_cost, final_cost,
    date_received, created_at, updated_at
)
SELECT 'RF-2026-0004', 'Priya Patel', 'priya.patel@example.com', '+91 98234 56789',
       'Laptop', 'Lenovo', 'ThinkPad E14', 'Spilled coffee over keyboard, power LED blinking but no display',
       'Liquid ingress cleaned from motherboard with ultrasonic bath. Keyboard replaced.', 'Tested battery charging and RAM diagnostics passed',
       'COMPLETED', 4200.00, 4000.00,
       CURRENT_DATE - INTERVAL '4 days', CURRENT_TIMESTAMP - INTERVAL '4 days', CURRENT_TIMESTAMP - INTERVAL '1 day'
WHERE NOT EXISTS (SELECT 1 FROM repair_tickets WHERE tracking_id = 'RF-2026-0004');

INSERT INTO repair_tickets (
    tracking_id, customer_name, customer_email, customer_phone,
    device_type, device_brand, device_model, reported_issue,
    diagnosis, internal_notes, status, estimated_cost, final_cost,
    date_received, created_at, updated_at
)
SELECT 'RF-2026-0005', 'Arjun Verma', 'arjun.verma@example.com', '+91 97112 34567',
       'Tablet', 'Apple', 'iPad Air (5th Gen)', 'Dropped on corner, severe chassis bend and cracked digitizer',
       'Chassis bent beyond repair threshold, motherboard micro-fractures detected', 'Customer advised repair cost exceeds residual device value',
       'UNREPAIRABLE', 18000.00, 0.00,
       CURRENT_DATE - INTERVAL '1 day', CURRENT_TIMESTAMP - INTERVAL '1 day', CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM repair_tickets WHERE tracking_id = 'RF-2026-0005');

-- 2. Insert Status History for Ticket RF-2026-0003
INSERT INTO repair_status_history (repair_ticket_id, previous_status, new_status, changed_at, note)
SELECT id, NULL, 'RECEIVED', CURRENT_TIMESTAMP - INTERVAL '2 days', 'Device checked in at front desk.'
FROM repair_tickets WHERE tracking_id = 'RF-2026-0003'
AND NOT EXISTS (
    SELECT 1 FROM repair_status_history h 
    JOIN repair_tickets r ON h.repair_ticket_id = r.id 
    WHERE r.tracking_id = 'RF-2026-0003' AND h.new_status = 'RECEIVED'
);

INSERT INTO repair_status_history (repair_ticket_id, previous_status, new_status, changed_at, note)
SELECT id, 'RECEIVED', 'DIAGNOSING', CURRENT_TIMESTAMP - INTERVAL '1 day', 'Technician confirmed cracked display and loose USB-C port.'
FROM repair_tickets WHERE tracking_id = 'RF-2026-0003'
AND NOT EXISTS (
    SELECT 1 FROM repair_status_history h 
    JOIN repair_tickets r ON h.repair_ticket_id = r.id 
    WHERE r.tracking_id = 'RF-2026-0003' AND h.new_status = 'DIAGNOSING'
);

INSERT INTO repair_status_history (repair_ticket_id, previous_status, new_status, changed_at, note)
SELECT id, 'DIAGNOSING', 'IN_REPAIR', CURRENT_TIMESTAMP - INTERVAL '4 hours', 'OEM replacement screen mounted, charging port flex soldered.'
FROM repair_tickets WHERE tracking_id = 'RF-2026-0003'
AND NOT EXISTS (
    SELECT 1 FROM repair_status_history h 
    JOIN repair_tickets r ON h.repair_ticket_id = r.id 
    WHERE r.tracking_id = 'RF-2026-0003' AND h.new_status = 'IN_REPAIR'
);

-- 3. Insert Status History for Ticket RF-2026-0004 (Completed)
INSERT INTO repair_status_history (repair_ticket_id, previous_status, new_status, changed_at, note)
SELECT id, NULL, 'RECEIVED', CURRENT_TIMESTAMP - INTERVAL '4 days', 'Intake recorded for coffee liquid spill.'
FROM repair_tickets WHERE tracking_id = 'RF-2026-0004'
AND NOT EXISTS (
    SELECT 1 FROM repair_status_history h 
    JOIN repair_tickets r ON h.repair_ticket_id = r.id 
    WHERE r.tracking_id = 'RF-2026-0004' AND h.new_status = 'RECEIVED'
);

INSERT INTO repair_status_history (repair_ticket_id, previous_status, new_status, changed_at, note)
SELECT id, 'RECEIVED', 'DIAGNOSING', CURRENT_TIMESTAMP - INTERVAL '3 days', 'Motherboard removed for ultrasonic isopropyl bath cleaning.'
FROM repair_tickets WHERE tracking_id = 'RF-2026-0004'
AND NOT EXISTS (
    SELECT 1 FROM repair_status_history h 
    JOIN repair_tickets r ON h.repair_ticket_id = r.id 
    WHERE r.tracking_id = 'RF-2026-0004' AND h.new_status = 'DIAGNOSING'
);

INSERT INTO repair_status_history (repair_ticket_id, previous_status, new_status, changed_at, note)
SELECT id, 'DIAGNOSING', 'IN_REPAIR', CURRENT_TIMESTAMP - INTERVAL '2 days', 'Replacement keyboard installed and firmware flashed.'
FROM repair_tickets WHERE tracking_id = 'RF-2026-0004'
AND NOT EXISTS (
    SELECT 1 FROM repair_status_history h 
    JOIN repair_tickets r ON h.repair_ticket_id = r.id 
    WHERE r.tracking_id = 'RF-2026-0004' AND h.new_status = 'IN_REPAIR'
);

INSERT INTO repair_status_history (repair_ticket_id, previous_status, new_status, changed_at, note)
SELECT id, 'IN_REPAIR', 'COMPLETED', CURRENT_TIMESTAMP - INTERVAL '1 day', 'Full hardware test passed. Ready for customer pickup.'
FROM repair_tickets WHERE tracking_id = 'RF-2026-0004'
AND NOT EXISTS (
    SELECT 1 FROM repair_status_history h 
    JOIN repair_tickets r ON h.repair_ticket_id = r.id 
    WHERE r.tracking_id = 'RF-2026-0004' AND h.new_status = 'COMPLETED'
);

-- 4. Insert Status History for Ticket RF-2026-0005 (Unrepairable)
INSERT INTO repair_status_history (repair_ticket_id, previous_status, new_status, changed_at, note)
SELECT id, NULL, 'RECEIVED', CURRENT_TIMESTAMP - INTERVAL '1 day', 'Intake recorded for dropped tablet.'
FROM repair_tickets WHERE tracking_id = 'RF-2026-0005'
AND NOT EXISTS (
    SELECT 1 FROM repair_status_history h 
    JOIN repair_tickets r ON h.repair_ticket_id = r.id 
    WHERE r.tracking_id = 'RF-2026-0005' AND h.new_status = 'RECEIVED'
);

INSERT INTO repair_status_history (repair_ticket_id, previous_status, new_status, changed_at, note)
SELECT id, 'RECEIVED', 'UNREPAIRABLE', CURRENT_TIMESTAMP - INTERVAL '6 hours', 'Internal board fractures render unit economically unviable to fix.'
FROM repair_tickets WHERE tracking_id = 'RF-2026-0005'
AND NOT EXISTS (
    SELECT 1 FROM repair_status_history h 
    JOIN repair_tickets r ON h.repair_ticket_id = r.id 
    WHERE r.tracking_id = 'RF-2026-0005' AND h.new_status = 'UNREPAIRABLE'
);
