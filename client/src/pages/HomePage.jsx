import React from "react";
import BuildBanner from "../components/BuildBanner/BuildBanner";
import GrowBanner from "../components/GrowBanner/GrowBanner";

function HomePage() {
  return (
    <div className="container">
      <GrowBanner />
      <BuildBanner />
    </div>
  );
}

export default HomePage;
