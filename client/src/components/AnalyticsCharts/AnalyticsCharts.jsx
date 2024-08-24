import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import "./AnalyticsCharts.css";

const RechartsChart = ({ facebookPost, instagramPost }) => {
  const extractData = (post) => {
    if (!post) {
      return { likes: 0, comments: 0 };
    }
    if (post.message) {
      return {
        likes: post.likes?.summary?.total_count || 0,
        comments: post.comments?.summary?.total_count || 0,
      };
    } else if (post.caption) {
      return {
        likes: post.like_count || 0,
        comments: post.comments_count || 0,
      };
    }
    return { likes: 0, comments: 0 };
  };

  const facebookData = facebookPost ? extractData(facebookPost) : null;
  const instagramData = instagramPost ? extractData(instagramPost) : null;

  const barData = [];
  if (facebookData) {
    barData.push(
      { name: "Fb Likes", value: facebookData.likes },
      { name: "Fb Comments", value: facebookData.comments }
    );
  }
  if (instagramData) {
    barData.push(
      { name: "Ig Likes", value: instagramData.likes },
      { name: "Ig Comments", value: instagramData.comments }
    );
  }

  const pieLikesData = [];
  const pieCommentsData = [];

  if (facebookData) {
    pieLikesData.push({ name: "Facebook", value: facebookData.likes });
    pieCommentsData.push({ name: "Facebook", value: facebookData.comments });
  }
  if (instagramData) {
    pieLikesData.push({ name: "Instagram", value: instagramData.likes });
    pieCommentsData.push({ name: "Instagram", value: instagramData.comments });
  }

  // Colors
  const PIE_LIKES_COLORS = ["#FF4D4D", "#0033FF"]; // Red and Dark Blue for likes
  const PIE_COMMENTS_COLORS = ["#FF4D4D", "#0033FF"]; // Red and Dark Blue for comments
  const BAR_COLOR = "#FF4D4D"; // Dark Blue for bar chart

  const renderCustomizedLabel = ({ name, value, percent }) => {
    return `${name}: ${value} (${(percent * 100).toFixed(0)}%)`;
  };

  return (
    <div className="social-metrics">
      {barData.length > 0 && (
        <div className="engagement-metrics-section">
          <h3 className="section-title">Engagement Metrics</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill={BAR_COLOR} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {(pieLikesData.length > 0 || pieCommentsData.length > 0) && (
        <div className="distribution-section">
          {pieLikesData.length > 0 && (
            <div className="chart-box">
              <h3 className="section-title">Likes Distribution</h3>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={pieLikesData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius="60%"
                      dataKey="value"
                    >
                      {pieLikesData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            PIE_LIKES_COLORS[index % PIE_LIKES_COLORS.length]
                          }
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {pieCommentsData.length > 0 && (
            <div className="chart-box">
              <h3 className="section-title">Comments Distribution</h3>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={pieCommentsData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius="60%"
                      dataKey="value"
                    >
                      {pieCommentsData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            PIE_COMMENTS_COLORS[
                              index % PIE_COMMENTS_COLORS.length
                            ]
                          }
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RechartsChart;
