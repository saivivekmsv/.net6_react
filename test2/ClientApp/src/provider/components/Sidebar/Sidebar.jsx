import React, { useState, useRef } from "react";
import SideBarContent from "../SideBarContent";

const SidebarApp = (props) => {
  const { children } = props;
  const [expandSidebar, setExpandSidebar] = useState(false);

  const sidebarMouseoverHandler = () => {
    setExpandSidebar(!expandSidebar);
  };

  const expandedClassName = expandSidebar ? "expanded" : "";
  return (
    <div className={`sidebar-container ${expandedClassName}`}>
      <div className="sidebar-placeholder" />
      <div
        className="sidebar-overlay"
        onClick={() => setExpandSidebar(false)}
      />
      <div className="sidebar">
        <SideBarContent
          onClickLeft={sidebarMouseoverHandler}
          onClickRight={sidebarMouseoverHandler}
        />
      </div>
      <div className="sidebar-app">{children}</div>
    </div>
  );
};
export default SidebarApp;
