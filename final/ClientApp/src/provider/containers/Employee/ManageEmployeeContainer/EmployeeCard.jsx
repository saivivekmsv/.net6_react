import React from "react";
import { isEmpty } from "lodash";
import { OverlayTrigger, Tooltip, Row, Col } from "react-bootstrap";
import { GetInitials, EditActionSlider } from "../../../components";
import {
  getCommaSeparatedValuesFromArr,
  getFormattedSsn,
  getNullTableItem,
  ssnMasking,
} from "../../../utils";
import AddToolTip from "../../../components/AddToolTip";
// import employeeImage from "../../../assets/sample_image.png";

import { EmployeeStatus } from "../../../layouts";
import { useRequest } from "../../../abstracts";
import { getEmployeeImage, getCompanyLogo } from "../../../services";

const EmployeeCard = ({
  employeeName,
  id,
  employeeId,
  ssn,
  employmentStatus,
  planNames,
  logo,
  imageURL,
  companyName,
  editLink,
}) => {
  const availablePlans = planNames || [];
  const plansToShow = availablePlans.slice(0, 2);
  const plansForToolTip = availablePlans.slice(2);
  // const logo = "";

  return (
    <div className="employee-card-item">
      <div
        className="employee-card-item-content"
        style={{ height: "fit-content" }}
      >
        <div className="d-flex">
          <div className="employee-icon-wrapper d-flex justify-content-center">
            {!isEmpty(imageURL) ? (
              <img
                alt=""
                src={imageURL}
                style={{ width: "96px", height: "96px", borderRadius: "50%" }}
                className="img-fluid"
              />
            ) : (
              <div style={{ marginTop: "10%" }}>
                <GetInitials name={employeeName} />
              </div>
            )}
          </div>
          <div className="d-flex flex-column plan-details-wrapper employee-card-tile-text px-2">
            <Row>
              <Col>
                <div
                  className="ft-14 font-weight-500 marg-bot-4"
                  style={{
                    width: "150px",
                    height: "20px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {employeeName}
                </div>
              </Col>
            </Row>

            <Row>
              <div className="d-flex ft-12 marg-bot-4">
                <Col mdOffset="10" md="2">
                  <div className="grey-text">SSN</div>
                </Col>

                <Col md="2">
                  <div
                    style={{ whiteSpace: "nowrap" }}
                    className="font-weight-500"
                  >
                    {ssnMasking(ssn)}
                  </div>
                  {/* ssnMasking(ssn) */}
                </Col>
              </div>
            </Row>

            <Row>
              <div className="d-flex ft-12 marg-bot-4">
                <Col md="2">
                  <div className="grey-text">ID</div>
                </Col>
                {employeeId && employeeId.length >= 15 ? (
                  <Col md="2">
                    <OverlayTrigger overlay={<Tooltip>{employeeId}</Tooltip>}>
                      <div className="font-weight-500">
                        {employeeId.slice(0, 15) + "..."}
                      </div>
                    </OverlayTrigger>
                  </Col>
                ) : (
                  <Col md="2">
                    <div className="font-weight-500">{employeeId}</div>
                  </Col>
                )}
              </div>
            </Row>

            {employmentStatus == "Active" ? (
              <div className="active-status">
                <Row style={{ justifyContent: "flex-start" }}>
                  <Col md="2">
                    <i className="fas fa-check-circle"></i>
                  </Col>
                  <Col md="2">
                    {" "}
                    <div className="margin-6">{employmentStatus}</div>
                  </Col>
                </Row>
              </div>
            ) : (
              <div className="inactive-status">
                <Row>
                  <Col md="2">
                    <i className="fas fa-times"></i>
                  </Col>
                  <Col md="2">
                    {" "}
                    <div className="margin-6">{employmentStatus}</div>
                  </Col>
                </Row>
              </div>
            )}
          </div>
        </div>
        <div className="card-line-separator"></div>

        <div
          style={{
            marginTop: "50px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            height: "fit-content",
          }}
        >
          <div
            className="plan-text"
            style={{
              width: "90px",
              height: "42px",
            }}
          >
            {!isEmpty(logo) ? (
              <img
                alt=""
                src={logo}
                style={{ width: "56px", height: "40px", paddingLeft: "20px" }}
                className="img-fluid"
              />
            ) : (
              <div>
                <GetInitials name={companyName} className="company-initials" />
              </div>
            )}
          </div>

          <div className="d-flex flex-column justify-content-center">
            <div style={{ width: "150px" }}>
              <span
                className="grey-text width-48 planTitle-text"
                style={{ marginRight: "5px" }}
              >
                Plan ID
              </span>
              <span className="plan-text">
                {planNames.reduce((a, b) => {
                  return a + "," + b;
                })}
              </span>
            </div>
          </div>
          {/* <Col>
              <div className="plan-text">{planNames}</div>
            </Col> */}
        </div>
      </div>
    </div>
  );
};

export default EmployeeCard;
