import React, { useState } from "react";

// todo: replace icon span with button or a tag for accessibility
const IconDropdown = (props) => {
  const { children, icon } = props;
  const [showPopover, setShowPopover] = useState(false);

  function iconMouseOverHandler() {
    setShowPopover(true);
  }

  function iconMouseLeaveHandler() {
    setShowPopover(false);
  }

  const popoverUI = showPopover ? (
    <div className="icon-popover">{children}</div>
  ) : null;

  return (
    <span
      onMouseOver={iconMouseOverHandler}
      onMouseLeave={iconMouseLeaveHandler}
      className="icon-container"
    >
      {popoverUI}
      <span className="icon">{icon}</span>
    </span>
  );
};

export default IconDropdown;
