const express = require("express");
const axios = require("axios");
require("dotenv").config();

const router = express.Router();
const LINKEDIN_PERSON_ID = process.env.LINKEDIN_PERSON_ID;
const LINKEDIN_ACCESS_TOKEN = process.env.LINKEDIN_ACCESS_TOKEN;

router.post("/", async (req, res) => {
  const { title, text, selectedPlatforms } = req.body;
  const file = req.file;

  let platforms;
  try {
    platforms =
      typeof selectedPlatforms === "string"
        ? JSON.parse(selectedPlatforms)
        : selectedPlatforms;
  } catch (error) {
    console.error("Error parsing selectedPlatforms:", error.message);
    return res.status(400).send("Invalid selectedPlatforms format");
  }

  if (!title || !text || !platforms || platforms.length === 0) {
    return res
      .status(400)
      .send("Please fill out all fields and select at least one platform.");
  }

  if (platforms.includes("LinkedIn")) {
    try {
      let asset;
      if (file) {
        const registerUpload = {
          registerUploadRequest: {
            recipes: ["urn:li:digitalmediaRecipe:feedshare-image"],
            owner: `urn:li:person:${LINKEDIN_PERSON_ID}`,
            serviceRelationships: [
              {
                relationshipType: "OWNER",
                identifier: "urn:li:userGeneratedContent",
              },
            ],
          },
        };

        const mediaUploadResponse = await axios.post(
          "https://api.linkedin.com/v2/assets?action=registerUpload",
          registerUpload,
          {
            headers: {
              Authorization: `Bearer ${LINKEDIN_ACCESS_TOKEN}`,
              "Content-Type": "application/json",
            },
          }
        );

        const uploadUrl =
          mediaUploadResponse.data.value.uploadMechanism[
            "com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest"
          ].uploadUrl;
        asset = mediaUploadResponse.data.value.asset;

        await axios.put(uploadUrl, file.buffer, {
          headers: {
            Authorization: `Bearer ${LINKEDIN_ACCESS_TOKEN}`,
            "Content-Type": file.mimetype,
          },
        });
      }

      const postData = {
        author: `urn:li:person:${LINKEDIN_PERSON_ID}`,
        lifecycleState: "PUBLISHED",
        specificContent: {
          "com.linkedin.ugc.ShareContent": {
            shareCommentary: {
              text: `${title}\n\n${text}`,
            },
            shareMediaCategory: file ? "IMAGE" : "NONE",
            media: file
              ? [
                  {
                    status: "READY",
                    description: {
                      text: "Image description",
                    },
                    media: asset,
                    title: {
                      text: "Image title",
                    },
                  },
                ]
              : [],
          },
        },
        visibility: {
          "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
        },
      };

      const response = await axios.post(
        "https://api.linkedin.com/v2/ugcPosts",
        postData,
        {
          headers: {
            Authorization: `Bearer ${LINKEDIN_ACCESS_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );

      res.status(200).json({ success: true, postId: response.data.id });
    } catch (error) {
      console.error(
        "Error posting to LinkedIn:",
        error.response ? error.response.data : error.message
      );
      res.status(500).send("Error posting to LinkedIn");
    }
  } else {
    res.status(200).send("No supported platform selected");
  }
});

router.get("/posts", async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.linkedin.com/v2/ugcPosts?q=authors&authors=List(urn:li:person:${LINKEDIN_PERSON_ID})`,
      {
        headers: {
          Authorization: `Bearer ${LINKEDIN_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );
    res.status(200).json(response.data.elements);
  } catch (error) {
    console.error("Error fetching LinkedIn posts:", error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
      console.error("Response headers:", error.response.headers);
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).send("Error fetching LinkedIn posts");
    }
  }
});

module.exports = router;
