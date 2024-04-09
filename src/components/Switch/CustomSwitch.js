const CustomeSwitch = ({ hour }) => {
  return (
    <>
      <div className="outer-border">
        <label class="switch">
          <input
            type="checkbox"
            id="toggle_vat"
            class="toggle_vat"
            checked={hour === "PM"}
          />
          <div class="slider round">
            <span class="slider_text">
              <span class="off">AM</span>
              <span class="on">PM</span>
            </span>
          </div>
        </label>
      </div>
    </>
  );
};

export default CustomeSwitch;
