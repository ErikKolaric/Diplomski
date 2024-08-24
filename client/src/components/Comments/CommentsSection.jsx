import React, { useState } from "react";
import { Comment } from "./Comment";

const CommentSection = ({ comments, postId, platform }) => {
  const [newCommentText, setNewCommentText] = useState("");
  const [success, setSuccess] = useState(false);

  const addReply = () => {};

  const handleSubmitComment = async (e) => {
    e.preventDefault();

    try {
      const encodedData = localStorage.getItem("encodedData");
      const data = encodedData ? JSON.parse(encodedData) : null;

      const formData = new FormData();
      formData.append("data", JSON.stringify(data));
      formData.append("message", newCommentText);

      const response = await fetch(
        `http://localhost:5001/api/${platform}/comment/${postId}`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Error commenting: " + response.statusText);
      }
      // Optionally, you can update the local state here instead of reloading the page
      // setComments([...comments, result.newComment]);

      setNewCommentText("");
      setSuccess(true);
    } catch (error) {
      console.error("Error posting comment:", error);
      // Handle the error (e.g., show an error message to the user)
    }
  };

  if (!comments) return null;

  return (
    <div className="comment-section">
      {success && <div className="success">Comment added successfully!</div>}
      <form onSubmit={handleSubmitComment}>
        <input
          type="text"
          value={newCommentText}
          onChange={(e) => setNewCommentText(e.target.value)}
          placeholder="Write a comment..."
        />
        <button type="submit">Submit</button>
      </form>
      {comments &&
        comments.map((comment) => (
          <Comment key={comment.id} comment={comment} addReply={addReply} />
        ))}
    </div>
  );
};

export default CommentSection;
