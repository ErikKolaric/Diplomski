import React from "react";
import BannerFour from "./BannerFour";
import BannerOne from "./BannerOne";
import BannerThree from "./BannerThree";
import BannerTwo from "./BannerTwo";

function BuildBanner() {
  return (
    <div>
      <div className="steps-container">
        <h2>Build a following without draining your time</h2>
        <p>
          Creating content is hard enough. Let alone distributing it to all the
          different marketing channels. Here are four ways Buffer can help.
        </p>
      </div>
      <BannerOne />
      <BannerTwo />
      <BannerThree />
      <BannerFour />
    </div>
  );
}

export default BuildBanner;