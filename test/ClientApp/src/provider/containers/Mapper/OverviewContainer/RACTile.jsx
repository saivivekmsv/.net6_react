import React from "react";
import { Link } from "react-router-dom";
import "./sample.css";
import { getPathWithParam } from "../../../utils";

function RACTile(props) {
  const tileheight = props.height ? props.height : "auto";
  return (
    <div
      style={{ height: tileheight }}
      className="border mapper-ractile mapper-raccontainer-griditem h-100"
    >
      <div className="d-flex" style={{ marginBottom: "1.563rem" }}>
        <p
          style={{ color: "grey", fontSize: "14px" }}
          className="p-0 m-0 bg-inherit"
        >
          {props.title ? props.title : "Title not found"}
        </p>
        {props.title != "Source" && props.title != "Target" ? (
          <Link to={props.tileRoute} className="ml-auto">
            {" "}
            <i
              style={{ color: "lightblue", height: "16px" }}
              className="fas fa-edit"
            ></i>
          </Link>
        ) : (
          <></>
        )}
      </div>
      <div className="mapper-ractile-children">{props.children}</div>
    </div>
  );
}

export default RACTile;
