import React, { useState, useRef } from "react";
import {SideBarContent} from "../../components";

const SidebarApp = (props) => {
  const { children } = props;
  const [expandSidebar, setExpandSidebar] = useState(false);

  const sidebarMouseoverHandler = () => {
    setExpandSidebar(!expandSidebar);
  };

  const expandedClassName = expandSidebar ? "expanded" : "";
  return (
    <aside className={`sidebar-container ${expandedClassName}`} onClick={sidebarMouseoverHandler}>    
        <SideBarContent
          onClickLeft={sidebarMouseoverHandler}
          onClickRight={sidebarMouseoverHandler}/>     
    </aside>
  );
};
export default SidebarApp;
