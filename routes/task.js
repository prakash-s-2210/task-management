// Import required modules and functions
import express from "express";
import {
  createTask,
  deleteTask,
  getAllTasks,
  updateTask,
} from "../controllers/task.js";
import { verifyToken } from "../middleware/auth.js";

// Create a new router instance
const router = express.Router();

/* CREATE */
router.post("/create-task", verifyToken, createTask);

/* READ */
router.get("/", verifyToken, getAllTasks);

/* UPDATE */
router.put("/:taskId", verifyToken, updateTask);

/* DELETE */
router.delete("/:taskId", verifyToken, deleteTask);

// Export the router for use in other modules
export default router;
