import React from "react";

function Pricing() {
  return (
    <div className="pricing-container">
      <h2>Our Pricing Plans</h2>
      <div className="pricing-cards">
        <div className="pricing-card">
          <div>
            <h3>Basic Plan</h3>
            <p>Perfect for individuals</p>
            <p className="price">Free</p>
            <ul>
              <li className="bold">Features:</li>
              <li className="">Adding Posts</li>
              <li className="">Removing Posts</li>
            </ul>
          </div>
          <button>Select</button>
        </div>
        <div className="pricing-card">
          <div>
            <h3>Standard Plan</h3>
            <p>Best for small teams</p>
            <p className="price">$20/month</p>
            <ul>
              <li className="bold">Features:</li>
              <li>Adding Posts</li>
              <li>Removing Posts</li>
              <li className="bold-blue">Viewing Statistics</li>
              <li className="bold-blue">Scheduling Posts</li>
            </ul>
          </div>
          <button>Select</button>
        </div>
        <div className="pricing-card">
          <div>
            <h3>Premium Plan</h3>
            <p>Ideal for large organizations</p>
            <p className="price">$30/month</p>
            <ul>
              <li className="bold">Features:</li>
              <li>Adding Posts</li>
              <li>Removing Posts</li>
              <li>Viewing Statistics</li>
              <li>Scheduling Posts</li>
              <li className="bold-blue">Analytics Dashboard</li>
            </ul>
          </div>
          <button>Select</button>
        </div>
      </div>
    </div>
  );
}

export default Pricing;
