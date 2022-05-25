import React from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AddButton } from "../";

const InnerLayoutButtons = ({ buttonsList = [], flow, fields, dirty }) => {
  const buttons = buttonsList.map(
    ({ label, icon, isAddButton, isEmpty, ...item }, index) => {
      if (item.flow && !item.flow.includes(flow)) {
        return null;
      }
      const isLastButton = buttonsList.length - 1 === index;
      const getButton = () => {
        if (isEmpty) {
          return (
            <div key={`button-${index}`} className="px-5 mx-4">
              &nbsp;
            </div>
          );
        }
        if (isAddButton) {
          return (
            <AddButton key={`button-${index}`} onAddClick={item.onClick} />
          );
        }
        if (icon) {
          return (
            <Button
              key={`button-${index}`}
              {...item}
              variant="link"
              className="inner-layout-actions"
            >
              <FontAwesomeIcon
                icon={icon}
                color="#212529"
                style={{ fontSize: "1.5rem" }}
              />
            </Button>
          );
        }
        return (
          <Button key={`button-${index}`} {...item}>
            {label}
          </Button>
        );
      };
      if (item.link) {
        return [
          <Link key={`button-${index}`} to={item.link}>
            {getButton()}
          </Link>,
          !isLastButton && <>&nbsp;&nbsp;&nbsp;</>,
        ];
      }
      return [getButton(), !isLastButton && <>&nbsp;&nbsp;&nbsp;</>];
    }
  );
  return <div>{buttons}</div>;
};

export default InnerLayoutButtons;
