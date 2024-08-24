import React, { useState } from "react";
import { useParams } from "react-router-dom";

export const Comment = ({ comment, addReply }) => {
  const [replyText, setReplyText] = useState("");
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const { platform } = useParams();

  const handleSubmitReply = async (e) => {
    e.preventDefault();

    setLoading(true);
    addReply(comment.id, replyText);

    const encodedData = localStorage.getItem("encodedData");
    const data = encodedData ? JSON.parse(encodedData) : null;

    const formData = new FormData();
    formData.append("data", JSON.stringify(data));
    formData.append("message", replyText);

    const response = await fetch(
      `http://localhost:5001/api/${platform}/reply/${comment.id}`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Error replying: " + response.statusText);
    }

    setReplyText("");
    setShowReplyInput(false);
    setLoading(false);
    window.location.reload();
  };

  const formatDate = (date1) => {
    const date = new Date(date1);

    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();

    return `${hours}:${minutes} ${day}.${month}.${year}`;
  };

  return (
    <div className="comment">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div className="details">
          <p className="text">{comment.text}</p>
          <span className="user-details">
            <p className="username">{comment.username}</p>
            <p className="timestamp">{formatDate(comment.timestamp)}</p>
          </span>
        </div>
        <div className="reply-button">
          <button onClick={() => setShowReplyInput(!showReplyInput)}>
            Reply
          </button>
        </div>
      </div>
      {showReplyInput && (
        <form
          style={{ width: "100%", display: "flex" }}
          onSubmit={handleSubmitReply}
        >
          <input
            type="text"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write a reply..."
          />
          <button type="submit">{loading ? "Replying..." : "Submit"}</button>
        </form>
      )}
      {comment.comments &&
        comment.comments.map((reply) => (
          <Comment key={reply.id} comment={reply} addReply={addReply} />
        ))}
    </div>
  );
};
