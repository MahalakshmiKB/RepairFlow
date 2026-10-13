package com.repairflow.dto;

public class DashboardStats {

    private long totalTickets;
    private long received;
    private long diagnosing;
    private long inRepair;
    private long completed;
    private long unrepairable;
    private long receivedToday;

    public DashboardStats() {}

    public DashboardStats(long totalTickets, long received, long diagnosing, long inRepair, 
                          long completed, long unrepairable, long receivedToday) {
        this.totalTickets = totalTickets;
        this.received = received;
        this.diagnosing = diagnosing;
        this.inRepair = inRepair;
        this.completed = completed;
        this.unrepairable = unrepairable;
        this.receivedToday = receivedToday;
    }

    public long getTotalTickets() { return totalTickets; }
    public void setTotalTickets(long totalTickets) { this.totalTickets = totalTickets; }

    public long getReceived() { return received; }
    public void setReceived(long received) { this.received = received; }

    public long getDiagnosing() { return diagnosing; }
    public void setDiagnosing(long diagnosing) { this.diagnosing = diagnosing; }

    public long getInRepair() { return inRepair; }
    public void setInRepair(long inRepair) { this.inRepair = inRepair; }

    public long getCompleted() { return completed; }
    public void setCompleted(long completed) { this.completed = completed; }

    public long getUnrepairable() { return unrepairable; }
    public void setUnrepairable(long unrepairable) { this.unrepairable = unrepairable; }

    public long getReceivedToday() { return receivedToday; }
    public void setReceivedToday(long receivedToday) { this.receivedToday = receivedToday; }
}
