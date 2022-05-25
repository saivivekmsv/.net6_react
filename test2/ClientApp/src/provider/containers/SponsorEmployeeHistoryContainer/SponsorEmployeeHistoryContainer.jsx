import React, { useState } from "react";
//import { LoaderWrapper } from "../../components";
import {
  Button,
  Row,
  Col,
  ButtonToolbar,
  ButtonGroup,
  InputGroup,
  Container,
  Collapse,
  ListGroup,
  Tab,
} from "react-bootstrap";
import {
  getAdvancedPathWithParam,
  getPathWithParam,
  PAYROLL_RECORDS_TO_FETCH,
  usDateFormat,
} from "../../utils";
import SponsorPayrollFilterCard from "../../components/SponsorPayrollFilterCard/SponsorPayrollFilterCard";
import EmployeeHistoryCard from "./EmployeeHistoryCard";
import "../../styles/containers/EmployeeHistoryContainer.scss";
import SponsorCard from "../../components/SponsorCards/SponsorCard";

const today = new Date();
const toDate = new Date(today.setDate(today.getDate()));
const fromDate = new Date(today.setDate(today.getDate() - 7));

const SponsorEmployeeHistoryContainer = () => {
  const [Value, setValue] = useState("");
  const [setPayrollFilterLoading] = useState(false);
  const [setFieldValues] = useState({
    companyId: 0,
    planId: 0,
    fileStatus: 0,
    toDate: toDate,
    fromDate: fromDate,
    itemsAlreadyFetched: 0,
    recordsToFetch: PAYROLL_RECORDS_TO_FETCH,
  });
  const data = [
    {
      date: "09/21/21",
      time: "14:29",
      status: "Multiple Fields were updated by Arun through UI Editor.",
    },
    {
      date: "09/20/21",
      time: "12:22",
      status: "Phone number was updated by Arun through UI Editor.",
    },
    {
      date: "09/19/21",
      time: "17:22",
      status: "Profile was updated by Arun through UI Editor.",
    },
    {
      date: "09/18/21",
      time: "09:23",
      status:
        "Multiple employee classification fields were updated by Arun through UI Editor.",
    },
    {
      date: "09/17/21",
      time: "23:34",
      status: "Multiple fields were updated by Arun through UI Editor.",
    },
    {
      date: "09/16/21",
      time: "22:34",
      status: "Email was updated by Arun through UI Editor.",
    },
  ];

  return (
    <>
      <Row
        style={{
          paddingTop: "6.875rem",
          paddingLeft: "80px",
          marginTop: "12.5rem",
          border: "0.063rem solid #e5e5e5",
          backgroundColor: "#e5e5e5",
        }}
      >
        <Col
          md={3}
          style={{
            borderRadius: "0px 10px 10px 0px",
            backgroundColor: "#FFFFFF",
          }}
        >
          Sarika
        </Col>

        <Col md={9}>
          <Row>
            <Col
              style={{
                margin: "0px 20px 20px",
                borderRadius: "10px",
                backgroundColor: "#FFFFFF",
                padding: "30px",
              }}
            >
              <div
                style={{
                  width: "100%",
                  borderBottom: "0.063rem solid #BDBDBD",
                  paddingBottom: "30px",
                }}
              >
                <Button
                  style={{
                    color: "#2F80ED",
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #2F80ED",
                    boxSizing: "border-box",
                    borderRadius: "5px",
                    fontSize: "16px",
                    lineHeight: "24px",
                    marginRight: "30px",
                  }}
                >
                  Back
                </Button>
                <span
                  style={{
                    fontWeight: "600",
                    fontSize: "18px",
                    lineHeight: "27px",
                    color: "#000000",
                  }}
                >
                  History
                </span>
              </div>

              <div style={{ margin: "27px 0px 30px" }}>
                <SponsorPayrollFilterCard
                  setFieldValues={setFieldValues}
                  setLoading={setPayrollFilterLoading}
                ></SponsorPayrollFilterCard>
              </div>
              <div>
                <div>
                  {data.map((item, index) => (
                    <Row>
                      <Col
                        md={12}
                        style={{ display: "flex", marginBottom: "24px" }}
                      >
                        <span
                          style={{
                            fontSize: "12px",
                            lineHeight: "18px",
                            color: "#333333",
                            marginRight: "24px",
                          }}
                        >
                          <div>
                            {usDateFormat(item.date).replaceAll("-", "/")}
                          </div>
                          <div style={{ marginTop: "11px" }}>{item.time}</div>
                        </span>
                        <div style={{ display: "flex", flexDirection: "row" }}>
                          <Tab.Container>
                            <ListGroup className="icon">
                              <ListGroup.Item
                                action
                                href="#1"
                                className="icon-button"
                              >
                                <i
                                  class="fas fa-chevron-right"
                                  style={{ justifyContent: "flex-start" }}
                                  aria-hidden="true"
                                ></i>
                              </ListGroup.Item>
                            </ListGroup>
                            <div>
                              <Tab.Content>
                                <div className="status">{item.status}</div>
                                <Tab.Pane eventKey="#1">
                                  <div style={{ marginLeft: "31px" }}>
                                    {<EmployeeHistoryCard />}
                                  </div>
                                </Tab.Pane>
                              </Tab.Content>
                            </div>
                          </Tab.Container>
                        </div>
                      </Col>
                    </Row>
                  ))}
                </div>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
};

export default SponsorEmployeeHistoryContainer;
