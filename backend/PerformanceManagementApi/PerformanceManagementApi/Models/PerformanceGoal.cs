using System;

namespace PerformanceManagementApi.Models
{
    public class PerformanceGoal
    {
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public string GoalTitle { get; set; }
        public string Description { get; set; }
        public DateTime DueDate { get; set; }
        public GoalStatus Status { get; set; }
        public Employee Employee { get; set; }
    }

    public enum GoalStatus
    {
        NotStarted,
        InProgress,
        Completed,
        Cancelled
    }
}