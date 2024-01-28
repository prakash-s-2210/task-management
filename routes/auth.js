// Import required modules and functions
import express from "express";
import { register, login } from "../controllers/auth.js";

// Create a new router instance
const router = express.Router();

/* CREATE */
router.post('/register', register); // User registration
router.post('/login',login); // User login

// Export the router for use in other modules
export default router;