# Task Management API

## Overview

This API provides a comprehensive task and subtask management system with features like creating tasks and subtasks, updating them, soft deletion, and various filters. It also includes cron jobs for managing task priorities and making voice calls using Twilio for overdue tasks.

## Features

- JWT Authentication for secure API access.
- CRUD operations for tasks and subtasks.
- Filters for task retrieval based on priority, due date, etc.
- Pagination for task listings.
- Soft deletion for tasks and subtasks.
- Cron job for updating task priority based on the due date.
- Cron job for making Twilio voice calls for overdue tasks based on user priority.

## Models

### Task Model

- `title` (string)
- `description` (string)
- `due_date` (date/string)
- `priority` (int)
- `status` (enum: TODO, IN_PROGRESS, DONE)
- `called` (boolean)

### Sub Task Model

- `id` (int, unique identifier)
- `task_id` (int) //references task table
- `status` (0,1) //0- incomplete, 1- complete
- `deleted_at` (date/string)

### User Model

- `id` (int, unique identifier)
- `email` (string, unique identifier)
- `password` (int, unique identifier)
- `phone_number` (num)
- `priority` (0,1,2) //for Twilio calling priority

## Setup and Installation

1. Clone the repository to your local machine.
2. Install the required dependencies using `npm install` or `yarn`.
3. Configure environment variables for JWT secret and Twilio credentials.
4. Deploy the application on Render.
5. Set up cron jobs using https://console.cron-job.org/ to schedule priority updates and Twilio calls.

## API Endpoints

1. `POST /tasks/create-task` - Create a new task.
2. `POST /tasks/:taskId/create-subtask` - Create a subtask for a given task.
3. `GET /tasks` - Get all user tasks with filters and pagination.
4. `GET /subtasks` - Get all subtasks for a task.
5. `PUT /tasks/:taskId` - Update a task.
6. `PUT /tasks/:taskId/subtasks/:subTaskId` - Update a subtask.
7. `DELETE /tasks/:taskId` - Soft delete a task.
8. `DELETE /tasks/:taskId/subtasks/:subTaskId` - Soft delete a subtask.

## Using Cron Jobs

- Configure the cron jobs for priority updates and Twilio calls based on the cron expressions suitable for your requirements.
- The cron jobs will interact with the API to perform their tasks.


## Error Handling and Validation

- The API includes proper validation for all inputs.
- User-friendly error messages are provided for better understanding and debugging.
