import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import CommentSection from "../components/Comments/CommentsSection";
import { AiFillLike } from "react-icons/ai";
import { FaComment } from "react-icons/fa";

function DetailsPage() {
  const { platform, id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState({
    content: "",
    comments: [],
    like_count: 0,
    share_count: 0,
    media_url: "",
    timestamp: "",
    views: 0,
  });
  const [relatedPost, setRelatedPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleDelete = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = JSON.parse(localStorage.getItem("encodedData"));

      const formData = new FormData();
      formData.append("data", JSON.stringify(data));

      if (!data) return;

      const response = await fetch(
        `http://localhost:5001/api/${platform}/delete/${id}`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Error deleting: " + response.statusText);
      }

      navigate("/analytics");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = JSON.parse(localStorage.getItem("encodedData"));

        const formData = new FormData();
        formData.append("data", JSON.stringify(data));

        if (!data) return;

        const response = await fetch(
          `http://localhost:5001/api/${platform}/${id}`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        setData({
          content: result.content,
          media_url: result.media_url,
          timestamp: result.timestamp,
          comments: result.comments,
          like_count: result.like_count,
          share_count: result.share_count || 0,
          views: result.views || 0,
        });

        const mergedPosts =
          JSON.parse(localStorage.getItem("mergedPosts")) || [];

        const currentPost = mergedPosts.find((post) => {
          if (platform === "facebook") {
            return post.facebook && post.facebook.id === id;
          } else if (platform === "instagram") {
            return post.instagram && post.instagram.id === id;
          }
          return false;
        });

        if (currentPost) {
          const related = mergedPosts.find((post) => {
            if (platform === "facebook") {
              return (
                post.instagram &&
                post.instagram.caption === currentPost.facebook.message
              );
            } else if (platform === "instagram") {
              return (
                post.facebook &&
                post.facebook.message === currentPost.instagram.caption
              );
            }
            return false;
          });

          setRelatedPost(
            related
              ? platform === "facebook"
                ? related.instagram
                : related.facebook
              : null
          );
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [platform, id]);

  // Function to get the URL for the related post
  const getRelatedPostUrl = () => {
    if (relatedPost) {
      const relatedPlatform =
        platform === "facebook" ? "instagram" : "facebook";
      const relatedId = relatedPost.id;
      return `/analytics/details/${relatedPlatform}/${relatedId}`;
    }
    return "#";
  };

  return (
    <div className="input-container container">
      {platform === "facebook" ? (
        <h2>Facebook Detailed Post</h2>
      ) : (
        <h2>Instagram Detailed Post</h2>
      )}
      {loading ? (
        <>Loading...</>
      ) : (
        <>
          <div className="post-details-image-container">
            <div className="form-group">
              <label htmlFor="content">Title</label>
              <p>{data.content.match(/^[^\n]+/)[0] || "No content"}</p>
            </div>
            <div className="form-group">
              <label htmlFor="content">Description</label>
              <p>
                {data.content.split("\n").slice(1).join("\n") || "No content"}
              </p>
            </div>
            <div className="form-group">
              <label htmlFor="likes">Likes</label>
              <p>{data.like_count}</p>
            </div>
            <div className="form-group">
              <label htmlFor="shares">Shares</label>
              {platform === "instagram" ? (
                <p>Instagram API does not support share count.</p>
              ) : (
                <p>{data.share_count}</p>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="views">Views</label>
              <p>{data.views}</p>
            </div>
            <div className="form-group">
              <label htmlFor="comments">Comments</label>
              {data.comments && (
                <CommentSection
                  comments={data.comments}
                  postId={id}
                  platform={platform}
                />
              )}
            </div>
            <div className="form-group">
              {data.media_url && (
                <img
                  style={{ width: "100%" }}
                  src={data.media_url}
                  alt="Post media"
                />
              )}
            </div>

            {error && <p className="error">{error}</p>}
            <div className="details-buttons">
              {platform !== "instagram" ? (
                <button
                  className="delete-button"
                  onClick={handleDelete}
                  disabled={loading}
                >
                  {loading ? "Deleting..." : "Delete"}
                </button>
              ) : (
                <p>Instagram does not support deleting posts with API.</p>
              )}
            </div>
          </div>

          {relatedPost && (
            <Link to={getRelatedPostUrl()}>
              <div className="related-post-container">
                <h2>
                  Related Post on{" "}
                  {platform === "facebook" ? "Instagram" : "Facebook"}
                </h2>
                <div className="post-container">
                  <p className="post-caption">
                    {relatedPost.message?.match(/^[^\n]+/)[0] ||
                      relatedPost.caption?.match(/^[^\n]+/)[0] ||
                      "No caption"}
                  </p>
                  {/* Conditionally render the image based on the platform */}
                  {platform === "instagram"
                    ? (data.media_url || data.thumbnail_url) && (
                        <img
                          style={{ width: "100%" }}
                          src={data.thumbnail_url || data.media_url}
                          alt={data.content.split("\n")[0] || "Post media"}
                        />
                      )
                    : data.media_url && (
                        <img
                          style={{ width: "100%" }}
                          src={data.media_url}
                          alt="Post media"
                        />
                      )}

                  <p className="post-date">
                    Date:{" "}
                    {new Date(
                      relatedPost.created_time || relatedPost.timestamp
                    ).toLocaleDateString()}
                  </p>
                  <div className="select-fields">
                    <p>
                      <AiFillLike />{" "}
                      {relatedPost.likes?.summary?.total_count ||
                        relatedPost.likes?.data?.length ||
                        relatedPost.like_count ||
                        0}
                    </p>
                    <p>
                      <FaComment />{" "}
                      {relatedPost.comments?.summary?.total_count ||
                        relatedPost.comments?.data?.length ||
                        relatedPost.comments_count ||
                        0}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          )}
        </>
      )}
    </div>
  );
}

export default DetailsPage;
