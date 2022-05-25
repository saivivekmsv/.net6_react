import React from "react";
import { Row, Col } from "react-bootstrap";
import { toLower, isEmpty } from "lodash";
import { CsplTable as Table } from "../../../components";
import {
  getNullTableItem,
  MANAGE_PLAN_ROUTES,
  OPTIONS_DATA_MAPPER,
} from "../../../utils";
import { EditActionSlider, GetInitials } from "../../../components";
import AddToolTip from "../../../components/AddToolTip";

const PlanCards = ({
  data = [],
  scrollEndCallBack,
  isLoading,
  totalRecords,
  history,
}) => {
  const scrollCallBack = (pageDetails) => {
    scrollEndCallBack(pageDetails, "generic");
  };

  const viewMode = (id) => {
    history.push(`${MANAGE_PLAN_ROUTES.BASIC_DETAILS}/edit/${id}`);
  };

  return (
    <>
      <Table isLoading={isLoading}>
        <Table.Tbody
          scrollEndCallBack={scrollCallBack}
          totalRecords={totalRecords}
        >
          <Row>
            {!isEmpty(data) ? (
              data.map((data, index) => {
                const planStatus =
                  OPTIONS_DATA_MAPPER.PLAN_STATUS_LIST[data.planStatus];
                return (
                  <Col md="3" key={index}>
                    <EditActionSlider
                      editLink={`${MANAGE_PLAN_ROUTES.BASIC_DETAILS}/save/${data.id}`}
                    />
                    <div
                      className="plan-card"
                      onClick={() => viewMode(data.id)}
                    >
                      <div className="planName-text" style={{ color: "#000" }}>
                        <AddToolTip name={data.planName} />
                      </div>
                      <div className="d-flex justify-content-between">
                        <div>
                          <p className="planTitle-text">ID</p>
                          <p>{data.planId}</p>
                        </div>
                        <div className="plan-left-border-tile">
                          <p className="planTitle-text">Category</p>
                          <p>
                            {getNullTableItem(
                              OPTIONS_DATA_MAPPER.PLAN_CATERGORY[
                                data.planCategory
                              ]
                            )}
                          </p>
                        </div>
                        <div className="plan-left-border-tile">
                          <p className="planTitle-text">Type</p>
                          <p>
                            {getNullTableItem(
                              OPTIONS_DATA_MAPPER.PLAN_TYPES[data.planType]
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="d-flex justify-content-between">
                        <div className={`${toLower(planStatus)} border-status`}>
                          <p className="planTitle-text ml-10">Status</p>
                          <p className="mb-0 ml-10">
                            {getNullTableItem(planStatus)}
                          </p>
                        </div>
                        <div>
                          {data.companyLogo != null ? (
                            <img
                              src={data.companyLogo}
                              style={{ width: "auto", height: "45px" }}
                              className="img-fluid"
                            />
                          ) : (
                            <GetInitials
                              name={data.planName}
                              className={"plan-name-tile"}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </Col>
                );
              })
            ) : (
              <span style={{ margin: "auto", fontSize: "18px" }}>
                No Records Found
              </span>
            )}
          </Row>
        </Table.Tbody>
      </Table>
    </>
  );
};

export default PlanCards;
