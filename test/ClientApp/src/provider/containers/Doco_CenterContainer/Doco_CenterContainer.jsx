import React, { useState } from "react";
import { get } from "lodash";
import { Row, Col } from "react-bootstrap";

import { HomeWidgetCard, LoaderWrapper } from "../../components";
import { getHomePageDetails, getAllCounts } from "../../services";
import { useComponentDidUpdate, useRequest } from "../../abstracts";
import DocoCard from "./Doco_Card";

const sample_data = [
  {
    tileName: "Payroll",
    isEnabled: true,
    order: 1,
  },
  {
    tileName: "Company",
    routeToNavigateOnClick: "/companys",
    isEnabled: true,
    order: 2,
  },
  {
    tileName: "Employees",
    routeToNavigateOnClick: "/employees",
    isEnabled: true,
    order: 3,
  },
  {
    tileName: "Eligibility",
    routeToNavigateOnClick: "/eligibility",
    isEnabled: true,
    order: 4,
  },
  {
    tileName: "Enrollment",
    routeToNavigateOnClick: "/enrollment",
    isEnabled: true,
    order: 5,
  },
  {
    tileName: "Mapper",
    routeToNavigateOnClick: "/doco",
    isEnabled: true,
    order: 6,
  },
];

const Doco_CenterContainer = (props) => {
  const { history } = props;
  const [fetchCounts, setFetchCounts] = useState(true);

  const { response, loading } = useRequest({
    method: getHomePageDetails,
  });
  const { response: countsResponse, loading: isCountsLoading } = useRequest({
    method: getAllCounts,
    payload: response,
    stopTrigger: fetchCounts,
  });

  const onAddClick = (e, item) => {
    e.preventDefault();
    history.push(item.routeToAdd);
  };

  const onDidUpdate = () => {
    if (!loading) {
      setFetchCounts(false);
    }
  };

  useComponentDidUpdate(onDidUpdate, [loading]);
  return (
    <Row md={3} className="home-container">
      {(sample_data || []).map((item, index) => (
        <Col key={index}>
          <DocoCard
            name={item.tileName}
            // count={get(countsResponse, item.tileName, "")}
            onAddClick={(e) => onAddClick(e, item)}
            isDisabled={!item.isEnabled}
            // showAdd={item.hasAddIcon}
            // imgUrl={item.imageUrl}
            link={item.routeToNavigateOnClick}
            isLoading={
              (item.tileName == "Plan" ||
                item.tileName == "Company" ||
                item.tileName == "Employees") &&
              isCountsLoading
            }
          />
        </Col>
      ))}
    </Row>
  );
};

export default Doco_CenterContainer;
