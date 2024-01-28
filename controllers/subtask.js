import { Subtask, Task } from "../models/index.js";

/* CREATE A NEW SUB TASK.*/
export const createSubtask = async (req, res) => {
  try {
    let { taskId } = req.params;
    const task = await Task.findOne({ _id: taskId });
    if (!task) {
      return res.status(404).json({
        message:
          "The requested Task was not found. Please check the task ID and try again.",
      });
    }

    const newSubtask = new Subtask({
      task: taskId,
      status: 0,
    });

    const createdSubtask = await newSubtask.save();

    res.status(201).json({
      message: "Subtask created successfully",
      task: createdSubtask,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* GET ALL SUB TASKS */

export const getAllSubtasks = async (req, res) => {
  try {
    let { taskId } = req.query;
    let filter = {};

    if (taskId) {
      const task = await Task.findOne({ _id: taskId });
      if (!task) {
        return res.status(404).json({
          message:
            "The requested task was not found. Please check the task ID and try again.",
        });
      }
      filter.task = taskId;
    }

    const subtasks = await Subtask.find(filter);
    res.status(200).json(subtasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* UPDATE SUB TASK */
export const updateSubtask = async (req, res) => {
  try {
    let { taskId, subtaskId } = req.params;
    const { status } = req.body;
    let updateField = {};

    const task = await Task.findOne({ _id: taskId });
    if (!task) {
      return res.status(404).json({
        message:
          "The requested task was not found. Please check the task ID and try again.",
      });
    }

    const subtask = await Subtask.findOne({ _id: subtaskId });
    if (!subtask) {
      return res.status(404).json({
        message:
          "The requested subtask was not found. Please check the subtask ID and try again.",
      });
    }

    if (parseInt(status) === 0 || parseInt(status) === 1) {
      updateField.status = status;
    }

    const udpatedsubTask = await Subtask.findByIdAndUpdate(
      subtaskId,
      updateField,
      { new: true }
    );

    const subtasks = await Subtask.find({ task: taskId, deletedAt: null });

    if (subtasks.every((st) => st.status === 1)) {
      // All subtasks are complete
      await Task.findByIdAndUpdate(taskId, { status: "DONE" }, { new: true });
    } else if (subtasks.some((st) => st.status === 1)) {
      // At least one subtask is complete
      await Task.findByIdAndUpdate(taskId, { status: "IN_PROGRESS" });
    }

    res
      .status(200)
      .json({ message: "Subtask status updated successfully", subtask: udpatedsubTask });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* DELETE SUB TASK */
export const deleteSubtask = async (req, res) => {
  try {
    let { taskId, subtaskId } = req.params;

    const task = await Task.findOne({ _id: taskId });
    if (!task) {
      return res
        .status(404)
        .json({
          message:
            "The requested task was not found. Please check the task ID and try again.",
        });
    }

    const subtask = await Subtask.findOne({ _id: subtaskId });
    if (!subtask) {
      return res.status(404).json({
        message:
          "The requested subtask was not found. Please check the subtask ID and try again.",
      });
    }

    const deletedSubtask = await Subtask.findByIdAndUpdate(
      subtaskId,
      { deletedAt: new Date() },
      { new: true }
    );

    const subtasks = await Subtask.find({ task: taskId, deletedAt: null });

    if (subtasks.every((st) => st.status === 1)) {
      // All subtasks are complete
      await Task.findByIdAndUpdate(taskId, { status: "DONE" }, { new: true });
    } else if (subtasks.some((st) => st.status === 1)) {
      // At least one subtask is complete
      await Task.findByIdAndUpdate(taskId, { status: "IN_PROGRESS" });
    }

    res.status(200).json({message: "Subtask deleted successfully", task: deletedSubtask});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

