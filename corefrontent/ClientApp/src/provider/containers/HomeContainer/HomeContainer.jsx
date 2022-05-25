import React, { useState } from "react";
import { get } from "lodash";
import { Row, Col } from "react-bootstrap";

import { HomeWidgetCard, LoaderWrapper } from "../../components";
import { getHomePageDetails, getAllCounts } from "../../services";
import { useComponentDidUpdate, useRequest } from "../../abstracts";

const HomeContainer = (props) => {
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
    <LoaderWrapper isLoading={loading}>
      <Row className="home-container">
        {(response || []).map((item, index) => (
          <div key={index}>
            <HomeWidgetCard
              name={item.tileName}
              count={get(countsResponse, item.tileName, "")}
              onAddClick={(e) => onAddClick(e, item)}
              isDisabled={!item.isEnabled}
              showAdd={item.hasAddIcon}
              link={item.routeToNavigateOnClick}
              imgUrl={item.imageUrl}
              isLoading={
                (item.tileName == "Plan" ||
                  item.tileName == "Company" ||
                  item.tileName == "Employees") &&
                isCountsLoading
              }
            />
          </div>
        ))}
      </Row>
    </LoaderWrapper>
  );
};

export default HomeContainer;
