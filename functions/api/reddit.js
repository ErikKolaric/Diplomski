const express = require("express");
const axios = require("axios");
const qs = require('querystring')
require("dotenv").config();

const router = express.Router();

async function getRedditAccessToken(redditId, redditSecret, redditUsername) {
  const auth = Buffer.from(`${redditId}:${redditSecret}`).toString('base64');
  
  try {
    const response = await axios.post(
      'https://www.reddit.com/api/v1/access_token',
      qs.stringify({
        grant_type: 'client_credentials'
      }),
      {
        headers: {
          Authorization: `bearer ${auth}`,
          "User-Agent": `MyApp/1.0.0 (by /u/${redditUsername})`,
        },
      }
    );

    return response.data.access_token;
  } catch (error) {
    console.error('Error getting Reddit access token:', error);
    throw error;
  }
}
// POST method to submit a new post to Reddit
router.post("/", async (req, res) => {
  const { title, text, imageUrl, thumbnail, data } = req.body; // Assuming imageUrl is sent for link posts

  const parsedData = JSON.parse(data);
 
  if (!parsedData){
    return res.status(400).json({ error: "Social tokens are not loaded" });
  }
  
  const decodedString = Buffer.from(parsedData.socialTokens, 'base64').toString('utf-8');
  const parsedDecoded = JSON.parse(decodedString);
  const {redditId, redditSecret, redditUsername} = parsedDecoded;

  const auth = await getRedditAccessToken(redditId, redditSecret, redditUsername)

  try {
    const response = await axios.post( 
      "https://www.reddit.com/api/submit",
      {
        sr: "ProjektOlga",
        kind: imageUrl ? "link" : "self", // Choose "link" if imageUrl is provided
        resubmit: true,
        title,
        text,
        url: imageUrl, // Include image URL for link posts
        thumbnail: thumbnail,
      },
      {
        headers: {
          Authorization: `bearer ${auth}`,
          "User-Agent": "MyApp/1.0.0 (http://example.com)",
        },
      }
    );

    return res.status(200).json({ success: true, response: response.data });
  } catch (error) {
    console.error("Error posting to Reddit:", error.message);
    return res.status(500).send("Error posting to Reddit");
  }
});

// GET method to fetch all posts from a specific subreddit
router.get("/posts", async (req, res) => {
  try {
    const response = await axios.get(
      "https://www.reddit.com/r/ProjektOlga/new.json",
      {
        params: {
          limit: 10, // Adjust based on how many posts you want to fetch
        },
        headers: {
          "User-Agent": "MyApp/1.0.0 (http://example.com)",
        },
      }
    );

    const posts = response.data.data.children.map((post) => {
      const data = post.data;

      // Ensure `data.url` and `data.thumbnail` are defined before using
      const imageUrl = data.url || ""; // Default to empty string if undefined

      return {
        id: data.id,
        title: data.title,
        text: data.selftext,
        imageUrl:
          imageUrl.endsWith(".jpg") || imageUrl.endsWith(".png")
            ? imageUrl
            : null, // Example usage of `endsWith` for image URL
        thumbnail:
          data.thumbnail && !data.thumbnail.startsWith("http") // Ensure thumbnail URL is valid
            ? `https://www.reddit.com${data.thumbnail}`
            : data.thumbnail,
        permalink: `https://www.reddit.com${data.permalink}`,
      };
    });

    return res.status(200).json(posts);
  } catch (error) {
    console.error("Error retrieving posts from Reddit:", error.message);
    return res.status(500).send("Error retrieving posts from Reddit");
  }
});

module.exports = router;
