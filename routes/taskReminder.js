// Import required modules and functions
import express from "express";
import {
  taskReminder
} from "../controllers/taskReminder.js";

// Create a new router instance
const router = express.Router();

router.post("/", taskReminder);

// Export the router for use in other modules
export default router;