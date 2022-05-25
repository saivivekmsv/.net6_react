import React from "react";
import { Link } from "react-router-dom";

const CsplLink = (props) => {
  const { disabled, children, className, to } = props;
  if (disabled || !to) {
    return (
      // eslint-disable-next-line jsx-a11y/anchor-is-valid
      <a
        {...props}
        // eslint-disable-next-line no-script-url
        href="javascript:void()"
        className={`${className} disabled`}
      >
        {children}
      </a>
    );
  }
  return <Link {...props}>{children}</Link>;
};

export default CsplLink;
