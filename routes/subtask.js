// Import required modules and functions
import express from "express";
import {
    createSubtask, deleteSubtask, getAllSubtasks, updateSubtask
} from "../controllers/subtask.js";
import { verifyToken } from "../middleware/auth.js";

// Create a new router instance
const router = express.Router({mergeParams:  true});

/* CREATE */
router.post("/create-subtask", verifyToken, createSubtask)

/* READ */
router.get("/", verifyToken, getAllSubtasks);

/* UPDATE */
router.put("/:subtaskId", verifyToken, updateSubtask);

/* DELETE */
router.delete("/:subtaskId", verifyToken, deleteSubtask);

// Export the router for use in other modules
export default router;