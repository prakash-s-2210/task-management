import { Task, Subtask } from "../models/index.js";
import {
  isValidDueDate,
  calculatePriority,
  parseDate,
} from "../utils/index.js";

/* CREATE A NEW TASK.*/
export const createTask = async (req, res) => {
  try {
    let { title, description, dueDate } = req.body;
    let userId = req.user.id;

    if (!isValidDueDate(dueDate)) {
      return res.status(400).json({ error: "Due date cannot be in the past." });
    }

    dueDate = parseDate(dueDate);

    const newTask = new Task({
      title,
      description,
      dueDate,
      priority: calculatePriority(dueDate),
      status: "TODO",
      user: userId,
    });

    const createdTask = await newTask.save();
    res.status(201).json({
      message: "Task created successfully",
      task: createdTask,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* GET ALL TASKS */

export const getAllTasks = async (req, res) => {
  try {
    let { priority, dueDate, page = 1, limit = 10 } = req.query;
    let filter = {};
    if (priority) filter.priority = parseInt(priority);
    if (dueDate) {
      dueDate = parseDate(dueDate);
      filter.dueDate = dueDate;
    }

    const tasks = await Task.find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* UPDATE TASK */
export const updateTask = async (req, res) => {
  try {
    let { taskId } = req.params;
    const { dueDate, status } = req.body;
    let updateFields = {};

    const task = await Task.findOne({ _id: taskId });
    if (!task) {
      return res
        .status(404)
        .json({
          message:
            "The requested task was not found. Please check the task ID and try again.",
        });
    }

    if (status === "TODO" || status === "DONE") {
      updateFields.status = status;
    }

    if (dueDate) {
      updateFields.dueDate = parseDate(dueDate);
    }

    const udpatedTask = await Task.findByIdAndUpdate(taskId, updateFields, {
      new: true,
    });
    if (status === "DONE") {
      const updatedSubtasks = await Subtask.updateMany(
        { task: taskId, deletedAt: null },
        { $set: { status: 1 } }
      );
    }

    res
      .status(200)
      .json({ message: "Task updated successfully", task: udpatedTask });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* DELETE TASK */
export const deleteTask = async (req, res) => {
  try {
    let { taskId } = req.params;

    const task = await Task.findOne({ _id: taskId });
    if (!task) {
      return res
        .status(404)
        .json({
          message:
            "The requested task was not found. Please check the task ID and try again.",
        });
    }

    const deletedTask = await Task.findByIdAndUpdate(
      taskId,
      { deletedAt: new Date() },
      { new: true }
    );

    const deletedSubtasks = await Subtask.updateMany(
      { task: taskId, deletedAt: null  },
      { $set: { deletedAt: new Date() } }
    );

    res.status(200).json({message: "Task deleted successfully", task: deletedTask});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
