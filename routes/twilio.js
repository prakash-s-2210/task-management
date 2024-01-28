// Import required modules and functions
import express from "express";
import {
  callStatus
} from "../controllers/twilio.js";

// Create a new router instance
const router = express.Router();

router.post("/", callStatus);

// Export the router for use in other modules
export default router;