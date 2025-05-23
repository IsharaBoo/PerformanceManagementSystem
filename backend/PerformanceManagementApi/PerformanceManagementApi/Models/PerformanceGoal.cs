﻿using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using System;
using System.ComponentModel.DataAnnotations;

namespace PerformanceManagementApi.Models
{
    public class PerformanceGoal
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

        // Added the [ValidateNever] attribute here to avoid validation errors
        [ValidateNever]
        public Employee? Employee { get; set; }
    }

    public enum GoalStatus
    {
        NotStarted,
        InProgress,
        Completed,
        Cancelled
    }
}
