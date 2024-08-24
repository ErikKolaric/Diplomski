import React from "react";

function GrowBanner() {
  return (
    <div className="banner-start-container">
      <div className="banner-text">
        <h2>Grow your audience on social and beyond</h2>
        <p>
          Buffer helps you build an audience organically. We’re a values-driven
          company that provides affordable, intuitive marketing tools for
          ambitious people and teams.
        </p>
        <form className="email-subscription">
          <input type="email" placeholder="Enter your email" />
          <button type="submit">Get Started Now</button>
        </form>
      </div>
      <div className="banner-image">
        <img
          src="https://buffer.com/static/homepage/webp/hero-2.webp"
          alt="Banner"
        />
      </div>
    </div>
  );
}

export default GrowBanner;