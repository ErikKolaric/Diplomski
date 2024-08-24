const express = require("express");
const { TwitterApi } = require("twitter-api-v2");
require("dotenv").config();

const router = express.Router();

// POST route to post a tweet
router.post("/", async (req, res) => {
  const { text, data } = req.body;
  const image = req.file;

  const parsedData = JSON.parse(data);

  if (!parsedData){
    return res.status(400).json({ error: "Social tokens are not loaded" });
  }
  
  const decodedString = Buffer.from(parsedData.socialTokens, 'base64').toString('utf-8');
  const parsedDecoded = JSON.parse(decodedString);
  const { twitterApiKey, twitterApiSecret, twitterAccessToken, twitterApiTokenSecret, twitterBearerToken } = parsedDecoded;

  const client = new TwitterApi({
    appKey: twitterApiKey,
    appSecret: twitterApiSecret,
    accessToken: twitterAccessToken,
    accessSecret: twitterApiTokenSecret,
    bearerToken: twitterBearerToken,
  });

  const rwClient = client.readWrite;

  try {
    let tweetOptions = { text };

    if (image) {
      const mediaId = await client.v1.uploadMedia(image.path);
      tweetOptions.media = { media_ids: [mediaId] };
    }

    const tweet = await rwClient.v2.tweet(tweetOptions);

    res.json({ success: true, tweet });
  } catch (error) {
    console.error("Error posting tweet:", error);
    res
      .status(403)
      .json({ error: "Request failed with code 403", details: error.message });
  }
});

// GET route to fetch recent tweets
router.get("/posts", async (req, res) => {
  try {
    // Fetch the user's timeline (most recent tweets)
    const userTimeline = await rwClient.v2.userTimeline(
      "your-twitter-user-id",
      {
        max_results: 10, // Adjust the number of tweets to fetch
        "tweet.fields": ["created_at", "text", "public_metrics", "attachments"],
        "media.fields": ["url"],
        expansions: ["attachments.media_keys"],
      }
    );

    const tweets = userTimeline.data || [];

    res.json({ success: true, tweets });
  } catch (error) {
    console.error("Error retrieving tweets:", error);
    res
      .status(500)
      .json({ error: "Error retrieving tweets", details: error.message });
  }
});

module.exports = router;
