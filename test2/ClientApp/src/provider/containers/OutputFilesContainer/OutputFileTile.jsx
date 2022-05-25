import React, { useState } from "react";
import { Link } from "../../components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/pro-light-svg-icons";
import { faFileExcel, faFileCsv } from "@fortawesome/pro-solid-svg-icons";
function OutputFileTile({
  OutputFileName = "OutputFileName",
  FileType = "excel",
  DateAndTime = "11/11/2021 12:00:31",
  SFTPURL = "https://Sftp",
  Input = "sample input",
  Map = "Common Rem Profile 1",
  PlanNames = [
    "Hf Order Pension Plan ",
    "Hf Order Pension Plan  2",
    "Hf Order Pension Plan  3",
  ],
  Status = "Success",
  Description = "-",
  User = "Sample User",
  CanDownload = true,
}) {
  const [showToolTip, setshowToolTip] = useState(false);
  const toolTip = () => {
    return (
      <div
        style={{
          textAlign: "center",
          position: "absolute",
          bottom: "10px",
          width: "150px",
          left: "5px",
        }}
      >
        <div style={{ marginLeft: "-50%" }} className="w-100">
          <div
            style={{
              backgroundColor: "black",
              color: "white",
              borderRadius: "5px",
              maxHeight: "130px",
              overflowY: "scroll",
            }}
            className="p-2 w-100"
          >
            {PlanNames.map((item, ind) => {
              if (ind != 0) {
                return (
                  <div style={{ overflow: "hidden", textAlign: "left" }}>
                    {item}
                  </div>
                );
              }
            })}
          </div>
          <i class="fas fa-caret-down fa-2x" style={{ marginTop: "-20px" }}></i>
        </div>
      </div>
    );
  };

  return (
    // <Link
    //   to={`${MANAGE_MAPPER_ROUTES.OVERVIEW}/edit/${profileId}`}
    //   className="border rounded mr-3 p-3 mb-4 text-decoration-tile"
    //   style={{ display: "flex", marginTop: "5px", width: "100%" }}
    // >
    <div className="border rounded p-3">
      <div
        style={{
          display: "flex",
          width: "100%",
          alignItems: "start",
          justifyContent: "space-between",
          // gap: "70px",
          flexWrap: "nowrap",
          color: "black",
        }}
      >
        <div style={{ width: "130px", overflow: "visible" }}>
          <div
            className="font-weight-bold mb-1 d-flex"
            style={{ fontSize: "14px" }}
          >
            {FileType.toLowerCase() == "excel" ? (
              <FontAwesomeIcon
                style={{ color: "green" }}
                icon={faFileExcel}
                size="lg"
              />
            ) : (
              <FontAwesomeIcon
                style={{ color: "lightblue" }}
                icon={faFileCsv}
                size="lg"
              />
            )}
            <div className="ml-2">{OutputFileName}</div>
          </div>
          <div
            style={{ color: "grey", whiteSpace: "nowrap", fontSize: "14px" }}
          >
            {DateAndTime}
          </div>
          <div style={{ fontSize: "14px" }}>{SFTPURL}</div>
        </div>
        <div style={{ width: "70px" }}>
          <div
            style={{ fontSize: "14px", color: "grey", textDecoration: "none" }}
            className="mb-1"
          >
            Input
          </div>
          <div style={{ whiteSpace: "nowrap", fontSize: "14px" }}>{Input}</div>
        </div>

        <div style={{ width: "170px" }}>
          <div style={{ fontSize: "14px", color: "grey" }} className="mb-1">
            Map Name
          </div>
          <div style={{ fontSize: "14px", overflow: "visible" }}>{Map}</div>
        </div>
        <div style={{ width: "100px" }}>
          <div style={{ fontSize: "14px", color: "grey" }} className="mb-1">
            Map Type
          </div>
          {/* <div>{Description}</div> */}
          <div>input type</div>
        </div>

        <div style={{ width: "170px" }}>
          <div style={{ fontSize: "14px", color: "grey" }} className="mb-1">
            Plan Name
          </div>
          <div
            style={{ fontSize: "14px", overflow: "visible" }}
            className="d-flex"
          >
            <div>{PlanNames[0] + "+"} </div>
            <div>
              <div
                style={{ position: "relative" }}
                onMouseEnter={() => {
                  setshowToolTip(true);
                }}
                onMouseLeave={() => {
                  setshowToolTip(false);
                }}
              >
                {" "}
                {showToolTip && toolTip()} {(PlanNames.length - 1).toString()}
              </div>
            </div>
          </div>
        </div>

        <div style={{ width: "100px", marginTop: "10px" }}>
          {Status.toLowerCase() == "success" ||
          Status.toLowerCase() == "generated" ? (
            <div
              style={{
                background: "#5ACE9F40",
                color: "#3FAA7F",
                textAlign: "center",
              }}
              className="rounded p-1"
            >
              {Status}
            </div>
          ) : (
            <div
              style={{
                background: "#FF9F9F40",
                color: "#EB4E3D",
                textAlign: "center",
              }}
              className="rounded p-1"
            >
              {Status}
            </div>
          )}
        </div>

        <div style={{ width: "100px" }}>
          <div style={{ fontSize: "14px", color: "grey" }} className="mb-1">
            User
          </div>
          <div style={{ fontSize: "14px", overflow: "visible" }}>{User}</div>
        </div>

        <FontAwesomeIcon
          className={`text-${CanDownload ? "primary" : "secondary"}`}
          icon={faDownload}
          style={{ marginTop: "10px" }}
          size="lg"
          color="#828282"
        />
      </div>
    </div>
    // </Link>
  );
}

export default OutputFileTile;
