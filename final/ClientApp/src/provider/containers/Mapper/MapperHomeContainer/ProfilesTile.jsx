import React from "react";
import { Link } from "../../../components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactComponent as CoreLogo } from "./core.svg";
import { MANAGE_MAPPER_ROUTES } from "../../../utils";
import {
  faBracketsCurly,
  faFileSpreadsheet,
} from "@fortawesome/pro-light-svg-icons";
const coreIconSource = "./core.ico";
function ProfilesTile({
  mapperProfileName = "Mapper Profile Name",
  description = "Description goes here",
  sourceType = "File",
  targetType = "CORE",
  category = "Census And Payroll",
  level = "Global",
  profileType = "Input Map",
  associatedPlans,
  isActive = true,
  profileId,
}) {
  return (
    <Link
      to={`${MANAGE_MAPPER_ROUTES.OVERVIEW}/edit/${profileId}`}
      className="border rounded mr-3 p-3 mb-4 text-decoration-tile"
      style={{ display: "flex", marginTop: "5px", width: "100%" }}
    >
      <div
        style={{
          display: "flex",
          width: "100%",
          alignItems: "start",
          gap: "70px",
          flexWrap: "nowrap",
          color: "black",
        }}
      >
        <div
          style={{ width: "170px", overflow: "visible", marginRight: "130px" }}
        >
          <div className="font-weight-bold mb-1" style={{ fontSize: "16px" }}>
            {mapperProfileName}
          </div>
          <div style={{ color: "grey", whiteSpace: "nowrap" }}>
            {description}
          </div>
        </div>
        <div style={{ width: "90px" }}>
          <div
            style={{ fontSize: "14px", color: "grey", textDecoration: "none" }}
            className="mb-1"
          >
            Map Type
          </div>
          <div style={{ whiteSpace: "nowrap" }}>{profileType}</div>
        </div>

        <div style={{ width: "90px" }}>
          <div style={{ fontSize: "14px", color: "grey" }} className="mb-1">
            Source type
          </div>
          <div className="d-flex">
            <div>
              {sourceType == "CORE" ? (
                <CoreLogo />
              ) : sourceType == "Json" ? (
                <FontAwesomeIcon
                  icon={faBracketsCurly}
                  color="#1C59A5"
                  style={{ fontSize: "18px" }}
                />
              ) : sourceType == "File" ? (
                <FontAwesomeIcon
                  icon={faFileSpreadsheet}
                  color="#219653"
                  style={{ fontSize: "18px" }}
                />
              ) : (
                <></>
              )}
            </div>
            <div className="ml-2" style={{ fontSize: "14px" }}>
              {sourceType}
            </div>
          </div>
        </div>

        <div style={{ width: "100px" }}>
          <div style={{ fontSize: "14px", color: "grey" }} className="mb-1">
            Target type
          </div>
          <div className="d-flex">
            <div>
              {targetType == "CORE" ? (
                <CoreLogo />
              ) : targetType == "Json" ? (
                <FontAwesomeIcon
                  icon={faBracketsCurly}
                  color="#1C59A5"
                  style={{ fontSize: "18px" }}
                />
              ) : targetType == "File" ? (
                <FontAwesomeIcon
                  icon={faFileSpreadsheet}
                  color="#219653"
                  style={{ fontSize: "18px" }}
                />
              ) : (
                <></>
              )}
            </div>
            <div className="ml-2" style={{ fontSize: "14px" }}>
              {targetType}
            </div>
          </div>
        </div>

        <div style={{ width: "80px" }}>
          <div style={{ fontSize: "14px", color: "grey" }} className="mb-1">
            Category
          </div>
          <div>{category}</div>
        </div>

        <div style={{ width: "70px" }}>
          <div style={{ fontSize: "14px", color: "grey" }} className="mb-1">
            Level
          </div>
          <div>{level}</div>
        </div>

        {associatedPlans ? (
          <div style={{ width: "100px" }}>
            <div
              style={{ fontSize: "14px", color: "grey", whiteSpace: "nowrap" }}
              className="mb-1"
            >
              Associated Plans
            </div>
            {associatedPlans}
          </div>
        ) : (
          <div></div>
        )}
      </div>

      {isActive ? (
        <div
          className="border border-success rounded py-1 ml-auto"
          style={{
            fontSize: "12px",
            height: "28px",
            width: "58px",
            textAlign: "center",
            alignSelf: "center",
            backgroundColor: "rgba(51, 170, 51, .3)",
            color: "green",
          }}
        >
          Active
        </div>
      ) : (
        <div
          className="border border-danger rounded py-1 ml-auto"
          style={{
            fontSize: "12px",
            height: "28px",
            width: "58px",
            textAlign: "center",
            alignSelf: "center",
            backgroundColor: "#f1697330",
            color: "red",
          }}
        >
          InActive
        </div>
      )}
    </Link>
  );
}

export default ProfilesTile;
