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
      className={`home-widget-card ${disabled}`}
    >
      <div className="widget-icon">
        <Image src={imgUrl} alt={name} />
      </div>
      <div className="widget-content">
        <div className="widget-label">{name}</div>
        {isLoading && <Loader size="sm" />}
        {!isLoading && <div className="widget-count">{count}</div>}
      </div>
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
    </Link>
  );
};

export default HomeWidgetCard;
