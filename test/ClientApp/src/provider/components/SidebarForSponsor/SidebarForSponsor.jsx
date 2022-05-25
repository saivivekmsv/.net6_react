import React, { useState, useRef } from "react";
import SideBarContent from "../SideBarContentForSponsor";

const SidebarAppForSponsor = (props) => {
  const [expandedClassName, setExpandedClassName] = useState("");

  return (
    <div className={`sidebar-container ${expandedClassName}`}>
      <div className="sidebar-placeholder" />

      <div
        className="sidebar"
        onMouseOver={() => {
          setExpandedClassName("expanded");
        }}
        onMouseOut={() => {
          setExpandedClassName("");
        }}
        style={{ "background-color": "#2F80ED", borderTopRightRadius: "50px" }}
      >
        <SideBarContent />
      </div>
    </div>
  );
};
export default SidebarAppForSponsor;
