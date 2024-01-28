import axios from "axios";
import { Task } from "../models/index.js";

export const callStatus = async (req, res) => {
  try {
    const { CallStatus } = req.body;
    const task = await Task.findOne({
      priority: 0,
      deletedAt: null,
      called: false,
    }).sort({ dueDate: 1 });
    task.called = true;

    await task.save();
    if (CallStatus === "completed") {
      return res
        .status(200)
        .json("The call to the user was made successfully.");
    } else if (
      CallStatus === "no-answer" ||
      CallStatus === "busy" ||
      CallStatus === "failed" ||
      CallStatus === "canceled"
    ) {
      await axios.post(
        "https://task-management-145y.onrender.com/cron/task-reminder"
      );
    }
  } catch (error) {
    console.error("Error getting call status", error.message);
  }
};
