using Microsoft.EntityFrameworkCore;
using PerformanceManagementApi.Models;

namespace PerformanceManagementApi.Data
{
    public class AppDbContext : DbContext
    {
        public DbSet<Employee> Employees { get; set; }
        public DbSet<PerformanceGoal> PerformanceGoals { get; set; }

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<PerformanceGoal>()
                .HasOne(g => g.Employee)
                .WithMany(e => e.PerformanceGoals)
                .HasForeignKey(g => g.EmployeeId);

            // Seeding data
            modelBuilder.Entity<Employee>().HasData(
                new Employee { Id = 1, FullName = "John Doe", Department = "IT" },
                new Employee { Id = 2, FullName = "Jane Smith", Department = "HR" }
            );

            modelBuilder.Entity<PerformanceGoal>().HasData(
                new PerformanceGoal
                {
                    Id = 1,
                    EmployeeId = 1,
                    GoalTitle = "Complete API",
                    Description = "Build REST API",
                    DueDate = new DateTime(2025, 6, 1),
                    Status = GoalStatus.NotStarted
                },
                new PerformanceGoal
                {
                    Id = 2,
                    EmployeeId = 1,
                    GoalTitle = "Unit Tests",
                    Description = "Write unit tests",
                    DueDate = new DateTime(2025, 5, 17),
                    Status = GoalStatus.InProgress
                },
                new PerformanceGoal
                {
                    Id = 3,
                    EmployeeId = 2,
                    GoalTitle = "Onboarding",
                    Description = "Create onboarding plan",
                    DueDate = new DateTime(2025, 5, 22),
                    Status = GoalStatus.NotStarted
                }
            );
        }
    }
}
