import twilio from "twilio";
import { Task, User } from "../models/index.js";
import { calculatePriority } from "../utils/index.js";

export const taskReminder = async (req, res) => {
  try {
    // Step 1: Find all tasks with `deletedAt: null`
    const tasks = await Task.find({ deletedAt: null });

    // Step 2: Calculate and update priority for each task
    for (const task of tasks) {
      const priority = calculatePriority(task.dueDate);
      await Task.findByIdAndUpdate(task._id, { priority });
    }

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

    // Step 3: Find user with task past due date or due today, sorted by priority
    const userToCall = await getSingleUserToCall();

    // Step 4: Make call to user
    const accountSid = process.env.ACCOUNT_SID;
    const authToken = process.env.AUTH_TOKEN;
    const client = twilio(accountSid, authToken);

    const call = await client.calls.create({
      statusCallback: "https://task-management-145y.onrender.com/events",
      statusCallbackEvent: ["initiated", "answered"],
      statusCallbackMethod: "POST",
      url: "http://demo.twilio.com/docs/voice.xml",
      to: `+91${userToCall.phoneNumber}`,
      from: "+13153524686",
    });

    res
      .status(200)
      .json({ message: "Successfully updated task priorities and started making call to the user", task: udpatedTask });
  } catch (error) {
    console.error(
      "Error updating task priorities and making calls ",
      error.message
    );
  }
};
