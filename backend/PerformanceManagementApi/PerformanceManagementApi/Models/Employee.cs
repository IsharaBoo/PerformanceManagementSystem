using System.Collections.Generic;

namespace PerformanceManagementApi.Models
{
    public class Employee
    {
        public int Id { get; set; }
        public string FullName { get; set; }
        public string Department { get; set; }
        public ICollection<PerformanceGoal> PerformanceGoals { get; set; } = new List<PerformanceGoal>();
    }
}