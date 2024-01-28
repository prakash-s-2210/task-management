import twilio from "twilio";
import { Task, User } from "../models/index.js";
import { calculatePriority } from "../utils/index.js";

export const updatePriority = async (req, res) => {
  try {
    // Step 1: Find all tasks with `deletedAt: null`
    const tasks = await Task.find({ deletedAt: null });

    // Step 2: Calculate and update priority for each task
    for (const task of tasks) {
      const priority = calculatePriority(task.dueDate);
      await Task.findByIdAndUpdate(
        task._id,
        { priority },
        {
          new: true,
        }
      );
    }

    res.status(200).json("Successfully updated task priorities");
  } catch (error) {
    console.error(
      "Error updating task priorities and making calls ",
      error.message
    );
  }
};

export const taskReminder = async (req, res) => {
  try {
    async function getSingleUserToCall() {
      // Find one task that is either past due or due today
      const task = await Task.findOne({
        priority: 0,
        deletedAt: null,
        called: false,
      })
        .sort({ dueDate: 1 })
        .populate({
          path: "user",
          model: User,
        });

      // Check if a task was found and return the associated user
      if (task && task.user) {
        return task.user;
      }

      // Return null if no task or user is found
      return null;
    }

    // Find user with task past due date or due today, sorted by priority
    const userToCall = await getSingleUserToCall();

    if (!userToCall) {
      return res.status(200).json({
        message:
          "No users available to call at the moment. All tasks are up to date or already called.",
      });
    }

    // Make call to user
    const accountSid = process.env.ACCOUNT_SID;
    const authToken = process.env.AUTH_TOKEN;
    const client = twilio(accountSid, authToken);
    const call = await client.calls.create({
      statusCallback: "https://task-management-145y.onrender.com/events",
      statusCallbackEvent: ["completed"],
      statusCallbackMethod: "POST",
      url: "http://demo.twilio.com/docs/voice.xml",
      to: `+91${userToCall.phoneNumber}`,
      from: process.env.FROM,
    });

    res
      .status(200)
      .json(
        "Started making call to the user"
      );
  } catch (error) {
    console.error(
      "Error updating task priorities and making calls ",
      error.message
    );
  }
};
