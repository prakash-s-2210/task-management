import mongoose from "mongoose";

// User Schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      },
      message: "Invalid email address format",
    },
  },
  password: { type: String, required: true },
  phoneNumber: { type: Number, required: true },
  priority: { type: Number, enum: [0, 1, 2] },
});

// Task Schema
const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    dueDate: { type: Date, required: true },
    priority: { type: Number, required: true, enum: [0, 1, 2, 3] },
    status: {
      type: String,
      required: true,
      enum: ["TODO", "IN_PROGRESS", "DONE"],
    },
    called: {type: Boolean, default: false},
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    deletedAt: { type: Date },
  },
  { timestamps: true }
);

// Subtask Schema
const subtaskSchema = new mongoose.Schema(
  {
    task: { type: mongoose.Schema.Types.ObjectId, ref: "Task", required: true },
    status: { type: Number, required: true, enum: [0, 1] },
    deletedAt: { type: Date },
  },
  { timestamps: true }
);

// Define models based on the schemas
export const User = mongoose.model("User", userSchema);
export const Task = mongoose.model("Task", taskSchema);
export const Subtask = mongoose.model("Subtask", subtaskSchema);
