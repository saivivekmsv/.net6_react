
import React, { useState, useContext } from "react";
import { get } from "lodash";
import { Row, Col } from "react-bootstrap";

// import { HomeWidgetCard, LoaderWrapper } from "../../components";
import { LoaderWrapper } from "../../../shared/components"
import { getHomePageDetails, getAllCounts, getCompanyDetails } from "../../services";
import { useComponentDidUpdate, useRequest, useDeepEffect } from "../../../shared/abstracts";
import { setManageCompanyLocalCache, appLayoutStore, setCompanyDetails } from "../../../shared/contexts";
import { SponsorLoanInformationCard, SponsorCarouselCard, SponsorPerformanceIndicesCard } from "../../components";
import { SponsorTaskManagementCard } from "../../components";
import { SponsorFieldview } from "../../components";

const HomeContainer = (props) => {
  const { history } = props;
  const [fetchCounts, setFetchCounts] = useState(true);
  const { state, dispatch } = useContext(appLayoutStore);

  const { response, loading } = useRequest({
    method: getHomePageDetails,
  });

  const {response: companyDetails, loading: isCompanyDetailsLoading} = useRequest({
    method: getCompanyDetails,
    payload: 7, //companyId,
  });

  useDeepEffect(() => {
    dispatch(setCompanyDetails(companyDetails));
  }, [companyDetails]);

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
  console.log("Home conatiner");
  useComponentDidUpdate(onDidUpdate, [loading]);
  return (
    <LoaderWrapper isLoading={loading && isCompanyDetailsLoading} className="row">
      <div className="padding-left-90">
        <Row>
          <Col md={4}>
            <SponsorFieldview plans={companyDetails?.plans}/>
          </Col>
          <Col md={8}>
            <Row>
              <Col md={5}>
                <Row>
                  <Col>
                    <SponsorLoanInformationCard />
                  </Col>
                </Row>
                  <Row className="mt-2 mb-2">
                    <Col>
                      <SponsorCarouselCard />
                    </Col>
                  </Row>
              </Col>
              <Col md={7}>
                <SponsorTaskManagementCard/>
              </Col>
            </Row>
            <Row>
              <Col>
                <SponsorPerformanceIndicesCard />
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </LoaderWrapper>
  );
};

export default HomeContainer;
