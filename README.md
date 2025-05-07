# PerformanceManagementSystem

Overview

This repository contains a performance management system built with a .NET backend API and a React frontend. The system allows users to manage employee performance goals, including adding, editing, and deleting goals.

Features





Add new performance goals for employees.



Edit existing performance goals.



Delete performance goals.



View employee details and their associated goals.



Error handling for invalid inputs and network issues.

Project Structure

PerformanceManagementSystem/
├── Models/
│   ├── PerformanceGoal.cs
│   └── PerformanceGoalDto.cs
├── Controllers/
│   └── GoalsController.cs
├── frontend/
│   └── performance-management-client/
│       └── src/
│           └── App.js
└── (other files like .gitignore, Program.cs, etc.)

Prerequisites





Backend: .NET SDK (latest version)



Frontend: Node.js and npm



Database: SQL Server (or compatible database configured with Entity Framework)

Setup Instructions

Backend





Navigate to the root directory:

cd C:\Users\IsharaRanasingheBIST\PerformanceManagementSystem



Restore dependencies and build the project:

dotnet restore
dotnet build



Update the database connection string in appsettings.json if needed.



Apply migrations and start the API:

dotnet ef database update
dotnet run

Frontend





Navigate to the frontend directory:

cd C:\Users\IsharaRanasingheBIST\PerformanceManagementSystem\frontend\performance-management-client



Install dependencies:

npm install



Start the React app:

npm start

Usage





Access the backend API at https://localhost:7230/api/Goals.



Access the frontend at http://localhost:3000.



Select an employee, fill out the goal form, and submit to add a goal.



Use the "Edit" and "Delete" buttons to modify or remove goals.

Contributing





Fork the repository.



Create a new branch for your feature or bug fix.



Commit your changes and push to your fork.



Submit a pull request.
│


