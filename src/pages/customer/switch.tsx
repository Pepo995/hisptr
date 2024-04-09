import React from "react";

const CustomeSwitch = ({ hour }) => {
  return (
    <>
      <div className="outer-border">
        <label className="switch">
          <input type="checkbox" id="toggle_vat" className="toggle_vat" checked={hour === "PM"} />
          <div className="slider round">
            <span className="slider_text">
              <span className="off">AM</span>
              <span className="on">PM</span>
            </span>
          </div>
        </label>
      </div>
    </>
  );
};

export default CustomeSwitch;
