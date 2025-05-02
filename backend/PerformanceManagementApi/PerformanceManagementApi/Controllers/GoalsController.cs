using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PerformanceManagementApi.Data;
using PerformanceManagementApi.Models;
using System.Collections.Generic;
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
        public async Task<ActionResult<PerformanceGoal>> CreateGoal(PerformanceGoal goal)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.PerformanceGoals.Add(goal);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetGoals), new { id = goal.Id }, goal);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateGoal(int id, PerformanceGoal goal)
        {
            if (id != goal.Id)
            {
                return BadRequest();
            }

            var existingGoal = await _context.PerformanceGoals.FindAsync(id);
            if (existingGoal == null)
            {
                return NotFound();
            }

            existingGoal.GoalTitle = goal.GoalTitle;
            existingGoal.Description = goal.Description;
            existingGoal.DueDate = goal.DueDate;
            existingGoal.Status = goal.Status;

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