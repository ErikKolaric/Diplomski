const express = require("express");
const axios = require("axios");
const FormData = require("form-data");
require("dotenv").config();

const router = express.Router();

router.post("/", async (req, res) => {
  const { title, text, data } = req.body;
  const file = req.file;
  const parsedData = JSON.parse(data);

  if (!parsedData) {
    return res.status(400).json({ error: "Social tokens are not loaded" });
  }

  const decodedString = Buffer.from(parsedData.socialTokens, "base64").toString(
    "utf-8"
  );
  const parsedDecoded = JSON.parse(decodedString);
  const { facebookPageID, facebookPageAccessToken } = parsedDecoded;

  // Parse profileData if needed
  // const { username, email } = typeof profileData === 'string' ? JSON.parse(profileData) : profileData;

  if (!title || !text) {
    return res.status(400).json({
      error: "Please fill out all fields and select at least one platform.",
    });
  }

  if (file == undefined) {
    return res.status(400).json({ error: "Upload file to post" });
  }

  try {
    let postId = "";

    const formData = new FormData();
    formData.append("access_token", facebookPageAccessToken);
    const message = `${title}\n\n${text}`;

    if (file.mimetype.startsWith("image/")) {
      formData.append("source", file.buffer, {
        filename: file.originalname,
      });
      formData.append("caption", message);

      const uploadResponse = await axios.post(
        `https://graph.facebook.com/v20.0/${facebookPageID}/photos`,
        formData,
        {
          headers: formData.getHeaders(),
        }
      );

      postId = uploadResponse.data.id;
    } else if (file.mimetype.startsWith("video/")) {
      formData.append("file", file.buffer, { filename: file.originalname });
      formData.append("description", message);

      const uploadResponse = await axios.post(
        `https://graph.facebook.com/v20.0/${facebookPageID}/videos`,
        formData,
        {
          headers: formData.getHeaders(),
        }
      );

      if (!uploadResponse.data) {
        return res.status(400).send("Cannot post");
      }

      postId = uploadResponse.data.id;
    }

    return res.status(200).json({ success: true, postId });
  } catch (error) {
    console.error("Error posting to Facebook:", error);
    return res
      .status(400)
      .json({ error: "Facebook tokens are not valid or an error occurred" });
  }
});

router.post("/delete/:id", async (req, res) => {
  const postId = req.params.id;
  const { data } = req.body;

  if (!data) {
    return res.status(400).json({ error: "Data is required" });
  }

  try {
    const parsedData = typeof data === "string" ? JSON.parse(data) : data;
    const decodedString = Buffer.from(
      parsedData.socialTokens,
      "base64"
    ).toString("utf-8");
    const parsedDecoded = JSON.parse(decodedString);
    const { facebookPageAccessToken, instagramBusinessAccountID } =
      parsedDecoded;

    if (!facebookPageAccessToken || !instagramBusinessAccountID) {
      return res.status(400).json({
        error:
          "Facebook Page Access Token and Instagram Business Account ID are required",
      });
    }

    const response = await axios.delete(
      `https://graph.facebook.com/v17.0/${postId}`,
      {
        params: {
          access_token: facebookPageAccessToken,
        },
      }
    );

    return res.status(200).json({
      message: "Instagram post deleted successfully",
      data: response.data,
    });
  } catch (error) {
    console.error(
      "Error deleting Instagram post:",
      error.response?.data || error.message
    );
    return res.status(error.response?.status || 500).json({
      error: "Error deleting Instagram post",
      details: error.response?.data?.error || error.message,
    });
  }
});

router.post("/posts", async (req, res) => {
  try {
    const { data } = req.body;
    const parsedData = typeof data === "string" ? JSON.parse(data) : data;
    const decodedString = Buffer.from(
      parsedData.socialTokens,
      "base64"
    ).toString("utf-8");
    const parsedDecoded = JSON.parse(decodedString);
    const { facebookPageAccessToken, facebookPageID } = parsedDecoded;

    const response = await axios.get(
      `https://graph.facebook.com/${facebookPageID}/posts?access_token=${facebookPageAccessToken}&fields=id,message,created_time,full_picture,likes.summary(true),comments.summary(true)`
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching Facebook posts:", error.message);
    res.status(500).send("Error fetching Facebook posts");
  }
});

router.post("/comment/:id", async (req, res) => {
  const { message, data } = req.body;
  const postId = req.params.id;

  const parsedData = typeof data === "string" ? JSON.parse(data) : data;
  const decodedString = Buffer.from(parsedData.socialTokens, "base64").toString(
    "utf-8"
  );
  const parsedDecoded = JSON.parse(decodedString);
  const { facebookPageAccessToken } = parsedDecoded;

  if (!postId || !message) {
    return res.status(400).json({ error: "Post ID and message are required" });
  }

  try {
    const response = await axios.post(
      `https://graph.facebook.com/${postId}/comments`,
      {
        message: message,
        access_token: facebookPageAccessToken,
      }
    );

    res.status(200).json({
      success: true,
      message: "Comment posted successfully",
      commentId: response.data.id,
    });
  } catch (error) {
    console.error(
      "Error posting Facebook comment:",
      error.response?.data || error.message
    );
    res.status(500).json({
      success: false,
      error: "Failed to post comment",
      details: error.response?.data?.error?.message || error.message,
    });
  }
});

router.post("/reply/:commentId", async (req, res) => {
  const { message, data } = req.body;
  const commentId = req.params.commentId;

  const parsedData = typeof data === "string" ? JSON.parse(data) : data;
  const decodedString = Buffer.from(parsedData.socialTokens, "base64").toString(
    "utf-8"
  );
  const parsedDecoded = JSON.parse(decodedString);
  const { facebookPageAccessToken } = parsedDecoded;

  if (!commentId || !message) {
    return res
      .status(400)
      .json({ error: "Comment ID and reply message are required" });
  }

  try {
    const response = await axios.post(
      `https://graph.facebook.com/${commentId}/comments`,
      {
        message: message,
        access_token: facebookPageAccessToken,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Reply posted successfully",
      replyId: response.data.id,
    });
  } catch (error) {
    console.error(
      "Error posting Facebook reply:",
      error.response?.data || error.message
    );
    return res.status(500).json({
      success: false,
      error: "Failed to post reply",
      details: error.response?.data?.error?.message || error.message,
    });
  }
});

async function getCommentsRecursively(
  id,
  accessToken,
  depth = 0,
  maxDepth = 3
) {
  if (depth >= maxDepth) return [];

  const response = await axios.get(
    `https://graph.facebook.com/v17.0/${id}/comments`,
    {
      params: {
        access_token: accessToken,
        fields: "id,message,created_time,from",
        order: "reverse_chronological",
        limit: 25,
      },
    }
  );

  const comments = response.data.data;

  for (let comment of comments) {
    comment.comments = await getCommentsRecursively(
      comment.id,
      accessToken,
      depth + 1,
      maxDepth
    );
  }

  return comments;
}

async function getPostWithCircularComments(postId, PAGE_ACCESS_TOKEN) {
  const postResponse = await axios.get(
    `https://graph.facebook.com/v17.0/${postId}`,
    {
      params: {
        access_token: PAGE_ACCESS_TOKEN,
        fields:
          "id,message,created_time,full_picture,likes.summary(true),insights.metric(post_impressions),shares",
      },
    }
  );

  const post = postResponse.data;
  post.views = post.insights.data.length;
  post.comments = await getCommentsRecursively(postId, PAGE_ACCESS_TOKEN);

  return post;
}

function mapComments(comments) {
  if (!comments) return [];

  return comments.map((comment) => ({
    id: comment.id,
    text: comment.message,
    username: comment.from.name,
    timestamp: comment.created_time,
    comments: mapComments(comment.comments),
  }));
}

router.post("/:id", async (req, res) => {
  try {
    const { data } = req.body;
    const parsedData = typeof data === "string" ? JSON.parse(data) : data;
    const decodedString = Buffer.from(
      parsedData.socialTokens,
      "base64"
    ).toString("utf-8");
    const parsedDecoded = JSON.parse(decodedString);
    const { facebookPageAccessToken } = parsedDecoded;

    const postId = req.params.id;
    const postData = await getPostWithCircularComments(
      postId,
      facebookPageAccessToken
    );

    const standardizedResponse = {
      id: postData.id,
      content: postData.message,
      timestamp: postData.created_time,
      media_url: postData.full_picture,
      like_count: postData.likes.summary.total_count,
      share_count: postData.shares ? postData.shares.count : 0, // Add share count
      comments_count: postData.comments ? postData.comments.length : 0,
      views: postData.views,
      comments: mapComments(postData.comments),
    };

    return res.status(200).json(standardizedResponse);
  } catch (error) {
    console.error(
      "Error fetching Facebook post:",
      error.response ? error.response.data : error.message
    );
    res.status(error.response?.status || 500).json({
      message: "Error fetching Facebook post",
      error: error.response?.data || error.message,
    });
  }
});

module.exports = router;
