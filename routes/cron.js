// Import required modules and functions
import express from "express";
import {
  updatePriority,
  taskReminder
} from "../controllers/cron.js";

// Create a new router instance
const router = express.Router();

router.post("/update-priority", updatePriority);
router.post("/task-reminder", taskReminder);

// Export the router for use in other modules
export default router;