const express = require("express");
const multer = require("multer");
const bodyParser = require("body-parser");
const cors = require("cors");
const cron = require("node-cron");

const facebook = require("./api/facebook");
const instagram = require("./api/instagram");
const sendMail = require("./helpers/mailer");
const ai = require("./api/ai");

const app = express();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 20 * 1024 * 1024 },
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let dynamicConfig = {};

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

app.use((req, res, next) => {
  req.dynamicConfig = dynamicConfig;
  next();
});

app.use("/api/facebook", upload.single("media"), facebook);
app.use("/api/instagram", upload.single("media"), instagram);
app.use("/api/ai", ai);

let currentCronJob = null;

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

app.listen(5001, async () => {
  console.log("Server is running on port 5001");
});