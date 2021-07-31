import React from "react";
import "../../styles/robot.css";

export default function Robot() {
  return (
    <>
      <div className="fullwidth">
        <div className="r2d2">
          <div className="mainBody">
            <div className="head">
              <div className="topHeadDeco"></div>
              <div className="middleHeadDeco"></div>
              <div className="bottomHeadDeco"></div>
            </div>
            <div className="stomach"></div>
            <div className="stomachSupportBottom">
              <div className="stomachSupportRight"></div>
              <div className="stomachSupportLeft"></div>
              <div className="stomachSupport"></div>
            </div>
            <div className="legSupportMiddle"></div>
          </div>
          <div className="hand">
            <div className="shoulderTop">
              <div className="shoulderHinge"></div>
            </div>
            <div className="shoulderSupport">
              <div className="shoulderSupportRight"></div>
              <div className="shoulderSupportLeft"></div>
              <div className="shoulderSupportMiddle"></div>
            </div>
            <div className="handSupport"></div>
          </div>
          <div className="feet">
            <div className="rightFeet">
              <div className="rightFeetLeft"></div>
              <div className="rightFeetRight"></div>
              <div className="rightFeetMiddle"></div>
            </div>
            <div className="leftFeet">
              <div className="leftFeetLeft"></div>
              <div className="leftFeetRight"></div>
              <div className="leftFeetMiddle"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="sky">
        <div className="planetBody">
          <div className="planet"></div>
          <div className="mountains">
            <div className="firstMountain"></div>
            <div className="secondMountain"></div>
          </div>
        </div>
      </div>
    </>
  );
}
