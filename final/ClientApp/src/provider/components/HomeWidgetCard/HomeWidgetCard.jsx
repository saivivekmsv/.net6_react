import React from "react";
import { Link } from "react-router-dom";
import { OverlayTrigger, Tooltip, Image } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusSquare } from "@fortawesome/pro-light-svg-icons";

import { Loader } from "../";

const HomeWidgetCard = ({
  isDisabled,
  name,
  count,
  onAddClick,
  isLoading,
  link,
  showAdd,
  imgUrl,
}) => {
  const disabled = isDisabled ? "disabled" : "";
  return (
    <Link
      href="javascrip:void(0)"
      to={link}
      className={`home-widget-card d-flex flex-column justify-content-between align-items-center p-1 ${disabled}`}
    >
      <div className={`img-box ${name}`}></div>
      <div className="d-flex flex-column w-100 content-container">
        <div>
          <div className="widget-label">{name}</div>
          {isLoading && <Loader size="sm" />}
          {!isLoading && <div className="widget-count">{count}</div>}
        </div>
        <div>
          {showAdd && (
            <OverlayTrigger
              placement="bottom"
              overlay={<Tooltip>Add {name}</Tooltip>}
            >
              <button className="add-icon" onClick={onAddClick}>
                <FontAwesomeIcon icon={faPlusSquare} size="lg" />
              </button>
            </OverlayTrigger>
          )}
        </div>
      </div>
    </Link>
  );
};

export default HomeWidgetCard;
