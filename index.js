// Importing necessary packages and modules
import express from "express"; // web framework
import connectDB from "./mongodb/connect.js";
import bodyParser from "body-parser";// middleware for parsing request bodies
import cors from "cors"; // middleware for enabling Cross-Origin Resource Sharing
import * as dotenv from "dotenv"; // package for managing environment variables
import helmet from "helmet"; // middleware for securing HTTP headers
import morgan from "morgan"; // middleware for logging HTTP requests and responses
import authRoutes from "./routes/auth.js";
import taskRoutes from "./routes/task.js";
import subtaskRoutes from "./routes/subtask.js";
import taskReminderRoutes from "./routes/taskReminder.js";
import callStatusRoutes from "./routes/twilio.js";


//CONFIGURATIONS AND SETUP
dotenv.config(); // load environment variables from .env file
const app = express(); // create express app
app.use(express.json()); // middleware for parsing JSON request bodies
app.use(helmet()); // middleware for setting various security-related HTTP headers
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" })); // middleware for enabling CORS with cross-origin policy
app.use(morgan("common")); // middleware for logging HTTP requests and responses
app.use(bodyParser.json({ limit: "30mb", extended: true })); // middleware for parsing JSON request bodies with specified size limit and extended mode
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true })); // middleware for parsing URL-encoded request bodies with specified size limit and extended mode
app.use(cors()); // middleware for enabling CORS with default options

app.get("/", (req, res) => {
  res.send({ message: "Hello World!" }); // root endpoint
});

/* ROUTES */
app.use("/auth", authRoutes); // use authentication routes
app.use("/tasks", taskRoutes); // use task routes
app.use("/tasks/:taskId", subtaskRoutes); // use sub task routes
app.use("/subtasks", subtaskRoutes); // use sub task routes
app.use("/cron", taskReminderRoutes); // Cron logic for changing priority of task based on due_date of task
app.use("/events", callStatusRoutes); // webhook for call status

 
/* MONGOOSE SETUP */
const PORT = process.env.PORT || 6001; // set server port

const startServer = async () => {
  try {
      connectDB(process.env.MONGO_URL, () => {
      console.log("MongoDB connected, starting server...");
      app.listen(PORT, () => console.log("Server started on port http://localhost:8080")
      );
    });
  } catch (error) {
      console.log(error);
  }
};
startServer();

