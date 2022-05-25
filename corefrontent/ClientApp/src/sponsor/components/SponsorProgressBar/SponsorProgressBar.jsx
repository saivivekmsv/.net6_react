import React from "react";
import { ProgressBar } from "react-bootstrap";
import upload from "../../../shared/styles/upload.png";
import { usDateFormat } from "../../../shared/utils";
import moment from "moment";

const SponsorProgressBar = (props) => {
  const { completed } = props;
  return (
    <>
      <div className="progress-bar justify-content-between">
        <img src={upload} />
        <div className="ft-14 fw-500 dark-text marg-t-10 marg-b-10">
          <span>{props.filename}</span>
          <span className="ft-10 gray-text">.xls</span>
        </div>
        <div className="ft-12 gray-text marg-t-10 marg-b-10">{props.time}</div>
        <div className="ft-12 gray-text marg-t-10 marg-b-10">
          {" "}
          {usDateFormat(props.date).replaceAll("-", "/")}
        </div>
        <div className="ft-12 gray-text fw-500 marg-t-10 marg-b-10">
          {moment(new Date(props.date)).fromNow()}{" "}
        </div>
        <div className="outer-border marg-t-10 marg-b-10">
          <div
            style={{
              borderRadius: "0.313rem",
              backgroundColor: "#219653",
              width: `${completed}%`,
              height: "0.375rem",
            }}
          ></div>
        </div>
        <div className="ft-10 fw-500 dark-text marg-t-10 marg-b-10">
          {`${completed}%`} Processed
        </div>
      </div>
    </>
  );
};

export default SponsorProgressBar;
