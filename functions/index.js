const functions = require("firebase-functions");
const express = require("express");
const multer = require("multer");
const bodyParser = require("body-parser");
const cors = require("cors");
const cron = require("node-cron");

// Import your route handlers
const facebook = require("./api/facebook"); // Adjust the path as necessary
const instagram = require("./api/instagram"); // Adjust the path as necessary
const ai = require("./api/ai"); // Adjust the path as necessary
const sendMail = require("./helpers/mailer");

const app = express();

// Setup multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB file limit
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Dynamic configuration
let dynamicConfig = {};

// Route to update dynamic configuration
app.post("/api/env", (req, res) => {
  console.log("Received POST request to /api/env");
  console.log("Request body:", req.body);

  const { facebookPageID, facebookPageAccessToken, ...rest } = req.body;

  dynamicConfig = {
    facebookPageID,
    facebookPageAccessToken,
    ...rest,
  };

  res.status(200).send("Configuration updated");
});

// Middleware to attach dynamic config to requests
app.use((req, res, next) => {
  req.dynamicConfig = dynamicConfig;
  next();
});

// Setup routes
app.use("/api/facebook", upload.single("media"), facebook); // Use the Facebook router
app.use("/api/instagram", upload.single("media"), instagram); // Use the Instagram router
app.use("/api/ai", ai); // Use the AI router

// Scheduler setup
let currentCronJob = null;

// Route to set up cron jobs
app.post("/api/set-schedule", (req, res) => {
  const { frequency, to } = req.body;

  let cronExpression;

  switch (frequency) {
    case "daily":
      cronExpression = "0 9 * * *"; // Every day at 9:00 AM
      break;
    case "weekly":
      cronExpression = "0 9 * * 1"; // Every Monday at 9:00 AM
      break;
    case "monthly":
      cronExpression = "0 9 1 * *"; // The 1st of every month at 9:00 AM
      break;
    default:
      return res.status(400).json({ message: "Invalid frequency" });
  }

  // Cancel the existing job if there is one
  if (currentCronJob) {
    currentCronJob.stop();
  }

  // Schedule the new job
  currentCronJob = cron.schedule(
    cronExpression,
    async () => {
      try {
        await sendMail(
          to,
          "Reminder: Time to Update Your Post",
          "Hello, \n\nThis is a friendly reminder to update your post. Please ensure that your content is up-to-date and reflects the latest information.\n\nThank you!"
        );
        console.log("Email sent successfully.");
      } catch (error) {
        console.error("Failed to send email:", error);
      }
    },
    {
      timezone: "Europe/Ljubljana", // Adjust timezone if necessary
    }
  );

  res.json({
    message: `Email scheduled successfully with ${frequency} frequency.`,
  });
});

// Export the Express API as a single Cloud Function
exports.api = functions.https.onRequest(app);
