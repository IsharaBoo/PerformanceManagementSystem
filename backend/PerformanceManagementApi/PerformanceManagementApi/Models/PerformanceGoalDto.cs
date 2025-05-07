using System;
using System.ComponentModel.DataAnnotations;

namespace PerformanceManagementApi.Models
{
    public class PerformanceGoalDto
    {
        public int Id { get; set; }

        [Required]
        public int EmployeeId { get; set; }

        [Required]
        public string GoalTitle { get; set; }

        [Required]
        public string Description { get; set; }

        [Required]
        public DateTime DueDate { get; set; }

        [Required]
        public GoalStatus Status { get; set; }
    }
}
