import React, { useEffect, useState } from "react";
import { AiFillLike } from "react-icons/ai";
import { FaComment } from "react-icons/fa";
import { Link } from "react-router-dom";
import AnalyticsCharts from "../components/AnalyticsCharts/AnalyticsCharts";

function AnalyticsDetailedPage() {
  const [currentPost, setCurrentPost] = useState(null);

  useEffect(() => {
    const storedPost = JSON.parse(localStorage.getItem("currentPost"));
    setCurrentPost(storedPost);
  }, []);

  if (!currentPost) {
    return <p>No post selected.</p>;
  }

  const hasSinglePost =
    (currentPost.facebook || currentPost.instagram) &&
    !(currentPost.facebook && currentPost.instagram);

  return (
    <div className="container post-detail">
      <h2>Post Details</h2>

      <div className={`posts-grid ${hasSinglePost ? "single-post" : ""}`}>
        {/* Facebook Post Details */}
        {currentPost.facebook && (
          <Link to={`/analytics/details/facebook/${currentPost.facebook.id}`}>
            <div className="post-container">
              <h3>Facebook Post</h3>
              <p className="post-caption">
                {currentPost.facebook.message?.match(/^[^\n]+/)[0] ||
                  "No caption"}
              </p>
              {currentPost.facebook.full_picture ? (
                <img
                  src={currentPost.facebook.full_picture}
                  alt={currentPost.facebook.message}
                  className="post-image"
                />
              ) : (
                <p className="post-no-image">No image</p>
              )}
              <p className="post-date">
                Date:{" "}
                {new Date(
                  currentPost.facebook.created_time
                ).toLocaleDateString()}
              </p>
              <div className="select-fields">
                <p>
                  <AiFillLike />{" "}
                  {currentPost.facebook.likes.summary.total_count || 0}
                </p>
                <p>
                  <FaComment />{" "}
                  {currentPost.facebook.comments.summary.total_count || 0}
                </p>
              </div>
            </div>
          </Link>
        )}

        {/* Instagram Post Details */}
        {currentPost.instagram && (
          <Link to={`/analytics/details/instagram/${currentPost.instagram.id}`}>
            <div className="post-container">
              <h3>Instagram Post</h3>
              <p className="post-caption">
                {currentPost.instagram.caption?.match(/^[^\n]+/)[0] ||
                  "No caption"}
              </p>
              {currentPost.instagram.thumbnail_url ||
              currentPost.instagram.media_url ? (
                <img
                  src={
                    currentPost.instagram.thumbnail_url ||
                    currentPost.instagram.media_url
                  }
                  alt={currentPost.instagram.caption}
                  className="post-image"
                />
              ) : (
                <p className="post-no-image">No image</p>
              )}
              <p className="post-date">
                Date:{" "}
                {new Date(currentPost.instagram.timestamp).toLocaleDateString()}
              </p>
              <div className="select-fields">
                <p>
                  <AiFillLike /> {currentPost.instagram.like_count || 0}
                </p>
                <p>
                  <FaComment /> {currentPost.instagram.comments_count || 0}
                </p>
              </div>
            </div>
          </Link>
        )}
      </div>

      <AnalyticsCharts
        facebookPost={currentPost.facebook}
        instagramPost={currentPost.instagram}
      />
    </div>
  );
}

export default AnalyticsDetailedPage;
