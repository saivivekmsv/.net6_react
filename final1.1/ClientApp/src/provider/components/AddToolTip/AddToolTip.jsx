import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

const AddToolTip = ({
  name,
  className,
  toolTipSafeHarbour,
  children = null,
  placement,
  width,
}) => {
  //const slicedName = (name || "").slice(0, length);
  return (
    <OverlayTrigger placement={placement} overlay={<Tooltip>{name}</Tooltip>}>
      <div
        className={className}
        style={{
          textOverflow: "ellipsis",
          maxWidth: "100%",
          overflow: "hidden",
          whiteSpace: "nowrap",
        }}
      >
        {children ? children : name}
      </div>
    </OverlayTrigger>
  );
};

export default AddToolTip;
