const express = require("express");
const router = express.Router();
const { ThreadsAPI } = require("threads-api");
require("dotenv").config();

// In-memory storage for posts
let threadsPosts = [];

router.post("/", async (req, res) => {
  const { title, text, data } = req.body;
  const image = req.file;

  const parsedData = JSON.parse(data);

  if (!parsedData){
    return res.status(400).json({ error: "Social tokens are not loaded" });
  }
  const decodedString = Buffer.from(parsedData.socialTokens, 'base64').toString('utf-8');
  const parsedDecoded = JSON.parse(decodedString);
  const {threadsUsername, threadsPassword} = parsedDecoded;

  try {
    const threadsApi = new ThreadsAPI({
      username: threadsUsername,
      password: threadsPassword,
      device_id: 'android-2nb7op9oqfq00000',
    });

    let publishOptions = {
      text: `${title}\n\n${text}`, // Combine title and text
    };

    if (image) {
      const fs = require('fs');
      const imageBuffer = fs.readFileSync(image.path);

      publishOptions.attachment = {
        image: {
          type: image.mimetype,
          data: imageBuffer,
        },
      };
    }

    const response = await threadsApi.publish(publishOptions);

    return res.status(200).json({ success: true, response });
  } catch (error) {
    console.error("Error posting to Instagram Threads:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

router.get("/posts", (req, res) => {
  try {
    return res.status(200).json({ success: true, posts: threadsPosts });
  } catch (error) {
    console.error("Error retrieving Instagram Threads posts:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
