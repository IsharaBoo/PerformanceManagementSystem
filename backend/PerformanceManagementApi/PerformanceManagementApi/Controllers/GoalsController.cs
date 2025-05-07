using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PerformanceManagementApi.Data;
using PerformanceManagementApi.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PerformanceManagementApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GoalsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public GoalsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<PerformanceGoal>>> GetGoals()
        {
            return await _context.PerformanceGoals
                .Include(g => g.Employee)
                .ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<PerformanceGoal>> PostPerformanceGoal([FromBody] PerformanceGoalDto performanceGoalDto)
        {
            if (!ModelState.IsValid)
            {
                // Debugging: Output model state validation errors
                var errors = ModelState
                    .Where(x => x.Value.Errors.Count > 0)
                    .ToDictionary(
                        kvp => kvp.Key,
                        kvp => kvp.Value.Errors.Select(e => e.ErrorMessage).ToArray()
                    );

                return BadRequest(new { title = "Validation failed", errors });
            }

            var performanceGoal = new PerformanceGoal
            {
                Id = performanceGoalDto.Id,
                EmployeeId = performanceGoalDto.EmployeeId,
                GoalTitle = performanceGoalDto.GoalTitle,
                Description = performanceGoalDto.Description,
                DueDate = performanceGoalDto.DueDate,
                Status = performanceGoalDto.Status
            };

            _context.PerformanceGoals.Add(performanceGoal);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetGoals), new { id = performanceGoal.Id }, performanceGoal);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateGoal(int id, PerformanceGoalDto goalDto)
        {
            if (id != goalDto.Id)
            {
                return BadRequest();
            }

            var existingGoal = await _context.PerformanceGoals.FindAsync(id);
            if (existingGoal == null)
            {
                return NotFound();
            }

            existingGoal.EmployeeId = goalDto.EmployeeId;
            existingGoal.GoalTitle = goalDto.GoalTitle;
            existingGoal.Description = goalDto.Description;
            existingGoal.DueDate = goalDto.DueDate;
            existingGoal.Status = goalDto.Status;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!GoalExists(id))
                {
                    return NotFound();
                }
                throw;
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteGoal(int id)
        {
            var goal = await _context.PerformanceGoals.FindAsync(id);
            if (goal == null)
            {
                return NotFound();
            }

            _context.PerformanceGoals.Remove(goal);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool GoalExists(int id)
        {
            return _context.PerformanceGoals.Any(e => e.Id == id);
        }
    }
}
