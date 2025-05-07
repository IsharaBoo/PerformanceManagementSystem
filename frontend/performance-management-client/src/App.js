import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [error, setError] = useState(null);
  const [newGoal, setNewGoal] = useState({ employeeId: '', goalTitle: '', description: '', dueDate: '', status: 0 });
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [editingGoal, setEditingGoal] = useState(null);
  const [filterType, setFilterType] = useState('status');  // Default to filter by Goal Status
  const [filterValue, setFilterValue] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    fetch('https://localhost:7230/api/Employees', { signal: controller.signal })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        clearTimeout(timeoutId);
        if (data && data.$values && Array.isArray(data.$values)) {
          setEmployees(data.$values);
          setFilteredEmployees(data.$values);  // Set filtered employees as all initially
        } else {
          throw new Error('Unexpected response format: $values is not an array');
        }
      })
      .catch((error) => {
        console.error('Error fetching employees:', error);
        setError(error.message);
      });

    return () => clearTimeout(timeoutId);
  };

  // Handle the filter changes
  const handleFilterChange = (e) => {
    const value = e.target.value;
    setFilterValue(value);

    let filtered = employees;

    if (filterType === 'status') {
      // Filter by goal status
      filtered = employees.filter((employee) => 
        employee.performanceGoals?.$values.some((goal) => goal.status === parseInt(value))
      );
    } else if (filterType === 'dueDate') {
      // Filter by due date (simple date range for this example)
      filtered = employees.filter((employee) => 
        employee.performanceGoals?.$values.some((goal) => goal.dueDate.includes(value))
      );
    }

    setFilteredEmployees(filtered);
  };

  const handleFilterTypeChange = (e) => {
    const selectedType = e.target.value;
    setFilterType(selectedType);
    setFilterValue(''); // Reset the filter value when filter type changes
    setFilteredEmployees(employees); // Reset the filtered list
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewGoal({ ...newGoal, [name]: name === 'status' ? parseInt(value) : value });
  };

  const handleEmployeeSelect = (e) => {
    setSelectedEmployeeId(e.target.value);
    setNewGoal({ ...newGoal, employeeId: e.target.value });
  };

  const handleSubmitGoal = (e) => {
    e.preventDefault();
    const employeeId = parseInt(newGoal.employeeId);
    if (isNaN(employeeId) || employeeId <= 0) {
      setError('Please select a valid employee.');
      return;
    }

    const payload = {
      Id: editingGoal ? editingGoal.id : 0,
      EmployeeId: employeeId,
      GoalTitle: newGoal.goalTitle,
      Description: newGoal.description,
      DueDate: new Date(newGoal.dueDate).toISOString(),
      Status: parseInt(newGoal.status)
    };

    const method = editingGoal ? 'PUT' : 'POST';
    const url = editingGoal ? `https://localhost:7230/api/Goals/${editingGoal.id}` : 'https://localhost:7230/api/Goals';

    fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((err) => {
            let errorMessage = 'Unknown error';
            if (err.errors) {
              errorMessage = Object.entries(err.errors)
                .map(([field, messages]) => {
                  const msgText = Array.isArray(messages) ? messages.join(', ') : messages || 'No details';
                  return `${field}: ${msgText}`;
                })
                .join('; ');
            } else if (err.title) {
              errorMessage = err.title;
            }
            throw new Error(`Failed to save performance goal: ${errorMessage}`);
          });
        }
        return response.status === 204 ? {} : response.json();
      })
      .then(() => {
        setNewGoal({ employeeId: '', goalTitle: '', description: '', dueDate: '', status: 0 });
        setSelectedEmployeeId('');
        setEditingGoal(null);
        fetchEmployees();
      })
      .catch((error) => {
        console.error('Error saving performance goal:', error);
        setError(error.message);
      });
  };

  const handleEditGoal = (goal) => {
    setEditingGoal(goal);
    setSelectedEmployeeId(goal.employeeId.toString());
    setNewGoal({
      employeeId: goal.employeeId.toString(),
      goalTitle: goal.goalTitle,
      description: goal.description,
      dueDate: goal.dueDate.split('T')[0],
      status: goal.status
    });
  };

  const handleDeleteGoal = (goalId) => {
    fetch(`https://localhost:7230/api/Goals/${goalId}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to delete performance goal');
        }
        fetchEmployees();
      })
      .catch((error) => {
        console.error('Error deleting performance goal:', error);
        setError(error.message);
      });
  };

  const handleCancelEdit = () => {
    setEditingGoal(null);
    setNewGoal({ employeeId: '', goalTitle: '', description: '', dueDate: '', status: 0 });
    setSelectedEmployeeId('');
  };

  return (
    <div className="App">
      <h1>Performance Management System</h1>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      <h2>{editingGoal ? 'Edit Performance Goal' : 'Add New Performance Goal'}</h2>
      <form onSubmit={handleSubmitGoal}>
        <div>
          <label htmlFor="employeeId">Employee</label>
          <select
            id="employeeId"
            name="employeeId"
            value={selectedEmployeeId}
            onChange={handleEmployeeSelect}
            required
            aria-label="Select an employee"
          >
            <option value="">Select Employee</option>
            {employees.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.fullName}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="goalTitle">Goal Title</label>
          <input
            id="goalTitle"
            type="text"
            name="goalTitle"
            placeholder="Goal Title"
            value={newGoal.goalTitle}
            onChange={handleInputChange}
            required
            aria-label="Goal Title"
          />
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <input
            id="description"
            type="text"
            name="description"
            placeholder="Description"
            value={newGoal.description}
            onChange={handleInputChange}
            required
            aria-label="Description"
          />
        </div>
        <div>
          <label htmlFor="dueDate">Due Date</label>
          <input
            id="dueDate"
            type="date"
            name="dueDate"
            value={newGoal.dueDate}
            onChange={handleInputChange}
            required
            aria-label="Due Date"
          />
        </div>
        <div>
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={newGoal.status}
            onChange={handleInputChange}
            required
            aria-label="Goal Status"
          >
            <option value="0">Not Started</option>
            <option value="1">In Progress</option>
            <option value="2">Completed</option>
            <option value="3">Cancelled</option>
          </select>
        </div>
        <button type="submit">{editingGoal ? 'Update Goal' : 'Add Goal'}</button>
        {editingGoal && (
          <button type="button" onClick={handleCancelEdit} style={{ marginLeft: '10px' }}>
            Cancel
          </button>
        )}
      </form>

      {/* Filter Section */}
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="filterType">Filter by:</label>
        <select
          id="filterType"
          value={filterType}
          onChange={handleFilterTypeChange}
        >
          <option value="status">Goal Status</option>
          <option value="dueDate">Due Date</option>
        </select>

        {filterType === 'status' && (
          <select
            id="filterValue"
            value={filterValue}
            onChange={handleFilterChange}
          >
            <option value="">All Statuses</option>
            <option value="0">Not Started</option>
            <option value="1">In Progress</option>
            <option value="2">Completed</option>
            <option value="3">Cancelled</option>
          </select>
        )}

        {filterType === 'dueDate' && (
          <input
            type="date"
            id="filterValue"
            value={filterValue}
            onChange={handleFilterChange}
          />
        )}
      </div>

      {filteredEmployees.length > 0 ? (
        <ul>
          {filteredEmployees.map((employee) => (
            <li key={employee.id}>
              <strong>{employee.fullName} - {employee.department}</strong>
              {employee.performanceGoals && employee.performanceGoals.$values.length > 0 ? (
                <ul>
                  {employee.performanceGoals.$values.map((goal) => (
                    <li key={goal.id}>
                      <strong>{goal.goalTitle}</strong>: {goal.description}
                      <br />
                      Due: {new Date(goal.dueDate).toLocaleDateString()}
                      , Status: {['Not Started', 'In Progress', 'Completed', 'Cancelled'][goal.status]}
                      <div>
                        <button onClick={() => handleEditGoal(goal)} style={{ marginLeft: '10px' }}>
                          Edit
                        </button>
                        <button onClick={() => handleDeleteGoal(goal.id)} style={{ marginLeft: '10px' }}>
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No performance goals assigned.</p>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading employees...</p>
      )}
    </div>
  );
}

export default App;
