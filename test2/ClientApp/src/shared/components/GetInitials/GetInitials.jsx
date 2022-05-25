import { toUpper } from "lodash";
import React from "react";

const GetInitials = ({ name, className }) => {
  const slicedName = (name || "").slice(0, 2);
  return (
    <div className={`name-initials ${className}`}>{toUpper(slicedName)}</div>
  );
};

export default GetInitials;
