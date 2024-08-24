import React, { useState } from "react";
import "./AIGenerator.css";

const AIGenerator = ({ onContentGenerated }) => {
  const [prompt, setPrompt] = useState("");
  const [wordCount, setWordCount] = useState(50);
  const [imageUrl, setImageUrl] = useState("");
  const [generatedText, setGeneratedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [isImageUsed, setIsImageUsed] = useState(false);
  const [isTextUsed, setIsTextUsed] = useState(false);

  const generateImage = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        "http://localhost:5001/api/ai/generate-image",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error generating image");
      }

      const data = await response.json();
      setImageUrl(data.imageUrl);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const generateText = async () => {
    setLoading(true);
    setError("");

    try {
      const contentResponse = await fetch(
        "http://localhost:5001/api/ai/generate-text",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: `Write a very short content for a social media post about "${prompt}".`,
          }),
        }
      );

      if (!contentResponse.ok) {
        const errorData = await contentResponse.json();
        throw new Error(errorData.message || "Error generating content");
      }

      const contentData = await contentResponse.json();
      setGeneratedText(contentData.text.trim());
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUseTextContent = () => {
    setIsTextUsed(true);
    onContentGenerated({ text: generatedText });

    if (isImageUsed) {
      onContentGenerated({});
    }
  };

  const handleUseImageContent = () => {
    setIsImageUsed(true);
    onContentGenerated({ imageUrl });

    if (isTextUsed) {
      onContentGenerated({});
    }
  };

  const closeModalIfNeeded = () => {
    if (!isTextUsed && !isImageUsed) {
      onContentGenerated({});
    }
  };

  return (
    <div className="modal-overlay" onClick={closeModalIfNeeded}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button
          className="modal-close-btn"
          onClick={() => onContentGenerated({})}
        >
          &times;
        </button>
        <h2>Generate your post with AI</h2>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="I want my post to be about..."
        />
        <div className="slider-container">
          <label>Word Count: {wordCount}</label>
          <input
            type="range"
            min="5"
            max="50"
            value={wordCount}
            onChange={(e) => setWordCount(e.target.value)}
          />
        </div>
        <div className="button-group">
          <button onClick={generateText} disabled={loading}>
            {loading ? "Generating Content..." : "Generate Content"}
          </button>
          <button onClick={generateImage} disabled={loading}>
            {loading ? "Generating Image..." : "Generate Image"}
          </button>
        </div>
        {error && <p className="error">{error}</p>}
        {!isTextUsed && generatedText && (
          <div className="text_container">
            <p>{generatedText}</p>
            <button
              className="generated"
              onClick={handleUseTextContent}
              disabled={loading}
            >
              Use This Content
            </button>
          </div>
        )}
        {!isImageUsed && imageUrl && (
          <div className="image-container">
            <img
              src={imageUrl}
              alt="Generated_image"
              className="generated_image"
            />
            <button
              className="generated"
              onClick={handleUseImageContent}
              disabled={loading}
            >
              Use This Image
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIGenerator;
