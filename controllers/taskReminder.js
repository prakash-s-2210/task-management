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

    async function getUsersToCall() {
      //   Find tasks that are either past due or due today
      const tasks = await Task.find({
        priority: 0,
        deletedAt: null,
        called: false,
      }).sort({ dueDate: 1 });

      // Extract unique user IDs from tasks
      const userIds = Array.from(
        new Set(tasks.map((task) => task.user.toString()))
      );

      // Find users based on extracted IDs
      const users = await User.find({ _id: { $in: userIds } });

      return users;
    }

    // Step 3: Find users with tasks past due date or due today, sorted by priority
    const usersToCall = await getUsersToCall();

    // Step 4: Make calls to users
    for (const user of usersToCall) {
      console.log(user);
      const accountSid = process.env.ACCOUNT_SID;
      const authToken = process.env.AUTH_TOKEN;
      const client = twilio(accountSid, authToken);

      const call = await client.calls.create({
        statusCallback: "https://www.myapp.com/events",
        statusCallbackEvent: ["initiated", "answered"],
        statusCallbackMethod: "POST",
        url: "http://demo.twilio.com/docs/voice.xml",
        to: `+91${user.phoneNumber}`,
        from: "+13153524686",
      });
    }
  } catch (error) {
    console.error("Error processing tasks:", error);
  }
};
