import React from "react";
import { Button } from "react-bootstrap";

const SponsorSecondaryButton = (props) => {
  return (
    <Button className={`edit-button ${props.className}`}>
      {props.children}
    </Button>
  );
};

export default SponsorSecondaryButton;
