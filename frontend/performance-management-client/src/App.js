import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState(null);
  const [newGoal, setNewGoal] = useState({ employeeId: '', goalTitle: '', description: '', dueDate: '', status: 0 });
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = () => {
    console.log('Starting fetch...');
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
      console.log('Fetch timed out after 5 seconds');
    }, 5000);

    fetch('https://localhost:7230/api/Employees', { signal: controller.signal })
      .then((response) => {
        console.log('Fetch response received:', response.status);
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Data fetched:', data);
        clearTimeout(timeoutId);
        if (data && data.$values && Array.isArray(data.$values)) {
          setEmployees(data.$values);
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
    fetch('https://localhost:7230/api/PerformanceGoals', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...newGoal, dueDate: new Date(newGoal.dueDate).toISOString() }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to add performance goal');
        }
        return response.json();
      })
      .then(() => {
        setNewGoal({ employeeId: '', goalTitle: '', description: '', dueDate: '', status: 0 });
        fetchEmployees(); // Refresh the list
      })
      .catch((error) => {
        console.error('Error adding performance goal:', error);
        setError(error.message);
      });
  };

  return (
    <div className="App">
      <h1>Performance Management System</h1>
      {error ? (
        <p style={{ color: 'red' }}>Error: {error}</p>
      ) : null}

      <h2>Add New Performance Goal</h2>
      <form onSubmit={handleSubmitGoal}>
        <select name="employeeId" value={selectedEmployeeId} onChange={handleEmployeeSelect} required>
          <option value="">Select Employee</option>
          {employees.map((employee) => (
            <option key={employee.id} value={employee.id}>
              {employee.fullName}
            </option>
          ))}
        </select>
        <input
          type="text"
          name="goalTitle"
          placeholder="Goal Title"
          value={newGoal.goalTitle}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={newGoal.description}
          onChange={handleInputChange}
          required
        />
        <input
          type="date"
          name="dueDate"
          value={newGoal.dueDate}
          onChange={handleInputChange}
          required
        />
        <select name="status" value={newGoal.status} onChange={handleInputChange} required>
          <option value="0">Not Started</option>
          <option value="1">In Progress</option>
          <option value="2">Completed</option>
        </select>
        <button type="submit">Add Goal</button>
      </form>

      {employees.length > 0 ? (
        <ul>
          {employees.map((employee) => (
            <li key={employee.id}>
              <strong>{employee.fullName} - {employee.department}</strong>
              {employee.performanceGoals && employee.performanceGoals.$values.length > 0 ? (
                <ul>
                  {employee.performanceGoals.$values.map((goal) => (
                    <li key={goal.id}>
                      <strong>{goal.goalTitle}</strong>: {goal.description}
                      <br />
                      Due: {new Date(goal.dueDate).toLocaleDateString()}
                      , Status: {goal.status === 0 ? 'Not Started' : goal.status === 1 ? 'In Progress' : 'Completed'}
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