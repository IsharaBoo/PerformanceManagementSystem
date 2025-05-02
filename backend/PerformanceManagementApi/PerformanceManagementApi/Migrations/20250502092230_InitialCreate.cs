using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace PerformanceManagementApi.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Employees",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FullName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Department = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Employees", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PerformanceGoals",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EmployeeId = table.Column<int>(type: "int", nullable: false),
                    GoalTitle = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DueDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PerformanceGoals", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PerformanceGoals_Employees_EmployeeId",
                        column: x => x.EmployeeId,
                        principalTable: "Employees",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Employees",
                columns: new[] { "Id", "Department", "FullName" },
                values: new object[,]
                {
                    { 1, "IT", "John Doe" },
                    { 2, "HR", "Jane Smith" }
                });

            migrationBuilder.InsertData(
                table: "PerformanceGoals",
                columns: new[] { "Id", "Description", "DueDate", "EmployeeId", "GoalTitle", "Status" },
                values: new object[,]
                {
                    { 1, "Build REST API", new DateTime(2025, 6, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 1, "Complete API", 0 },
                    { 2, "Write unit tests", new DateTime(2025, 5, 17, 0, 0, 0, 0, DateTimeKind.Unspecified), 1, "Unit Tests", 1 },
                    { 3, "Create onboarding plan", new DateTime(2025, 5, 22, 0, 0, 0, 0, DateTimeKind.Unspecified), 2, "Onboarding", 0 }
                });

            migrationBuilder.CreateIndex(
                name: "IX_PerformanceGoals_EmployeeId",
                table: "PerformanceGoals",
                column: "EmployeeId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PerformanceGoals");

            migrationBuilder.DropTable(
                name: "Employees");
        }
    }
}
