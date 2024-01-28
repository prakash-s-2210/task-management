import twilio from "twilio";
import { Task, User } from "../models/index.js";
import { calculatePriority } from "../utils/index.js";

export const callStatus = async (req, res) => {
  try {
    const exp = req.body;
    res.send(exp);
  } catch (error) {
    console.error("Error getting call status", error.message);
  }
};
