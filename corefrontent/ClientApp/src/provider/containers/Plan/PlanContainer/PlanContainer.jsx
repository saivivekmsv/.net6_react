import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Form, Button } from "react-bootstrap";
import { Select, SearchDropdownWithAPI } from "../../../components";
import {
  MANAGE_PLAN_ROUTES,
  OPTIONS_DATA_MAPPER,
  toOptionValuesFromMapper,
} from "../../../utils";
import PlanCards from "./PlanCards";
// import plans from "../../../mocks/plans.json";
import { getPlanCount, postPlanGridDetails } from "../../../services";
import {
  useDeepEffect,
  useLazyLoadForTable,
  useRequest,
} from "../../../abstracts";

const PlanContainer = (props) => {
  const { history } = props;
  const [planCategory, setCategoryType] = useState();
  const [planType, setTypes] = useState();
  const [planStatus, setStatusType] = useState();
  const [showTerminated, setSshowTerminated] = useState(false);
  const defaultPageNumbers = {
    from: 1,
    to: 9,
  };
  const [planGridpayload, setPlanGridPayload] = useState({
    ...defaultPageNumbers,
    searchString: "",
    planType: planType,
    planCategory: planCategory,
    planStatus: planStatus,
    showTerminated: showTerminated,
  });

  const { response: planCount, loading: isLoadingPlanCount } = useRequest({
    method: getPlanCount,
    defaultResponse: 0,
  });

  const { response, loading } = useRequest({
    method: postPlanGridDetails,
    payload: planGridpayload,
    defaultResponse: [],
  });

  const handleCategory = (e) => {
    setCategoryType(e.target.value);
  };

  const handleTypes = (e) => {
    setTypes(e.target.value);
  };

  const handleStatusType = (e) => {
    setStatusType(e.target.value);
  };

  const onCheckboxClick = () => {
    setSshowTerminated(!showTerminated);
  };

  const handleSearchChange = (val) => {
    setPlanGridPayload({
      ...planGridpayload,
      searchString: val,
    });
  };

  const { tableData } = useLazyLoadForTable(response, {
    searchString: planGridpayload.searchString,
    planCategory: planGridpayload.planCategory,
    planType: planGridpayload.planType,
    planStatus: planGridpayload.planStatus,
    showTerminated: planGridpayload.showTerminated,
    orderDescending: planGridpayload.orderDescending,
  });

  useDeepEffect(
    () => {
      setPlanGridPayload({
        ...planGridpayload,
        ...defaultPageNumbers,
        planCategory,
        planType,
        planStatus,
        showTerminated,
      });
    },
    [planCategory, planType, planStatus, showTerminated],
    true
  );

  const scrollEndCallBack = (details) => {
    setPlanGridPayload({
      ...planGridpayload,
      from: details.from,
      to: details.to,
    });
  };

  // const handleSortForGenericTable = (detail) => {
  //   setPlanGridPayload({
  //     ...planGridpayload,
  //     ...defaultPageNumbers,
  //     sortOn: detail.column,
  //     orderDescending: detail.orderBy === "desc",
  //   });
  // };

  const countDetails = planCount && `Total ${planCount} Plans`;
  const defaultOption = [{ label: "All", value: null }];

  return (
    <div className="plan-container d-flex flex-column">
      <div className="layout-head d-flex justify-content-between">
        <div className="plan-heading-plan">
          Manage Plans <br />{" "}
          <span className="count-details">{countDetails}</span>
        </div>
        <div>
          <Link to={MANAGE_PLAN_ROUTES.CREATE_PLAN}>
            <Button variant="primary" className="mr-8">
              New Plan
            </Button>
          </Link>
        </div>
      </div>
      <div className="d-flex flex-column">
        <Row>
          <Col>
            <Form>
              <SearchDropdownWithAPI
                searchPayloadKey="searchString"
                labelKey="planName"
                handleSelect={handleSearchChange}
                method={postPlanGridDetails}
              />
            </Form>
          </Col>
        </Row>
        <Row className="align-items-center d-flex justify-content-start pdl-1">
          <div className="my-4 category-sort mr-4">
            <Select
              title={`Category: ${
                [undefined, null].includes(planCategory)
                  ? "All"
                  : OPTIONS_DATA_MAPPER.PLAN_CATERGORY[planCategory]
              }`}
              optionsList={[
                ...defaultOption,
                ...toOptionValuesFromMapper(OPTIONS_DATA_MAPPER.PLAN_CATERGORY),
              ]}
              className="bg-transparent p-0 no-caret"
              onClick={handleCategory}
              value={planCategory}
            />
          </div>
          <div className="my-4 category-sort mr-4">
            <Select
              title={`Type: ${
                [undefined, null].includes(planType)
                  ? "All"
                  : OPTIONS_DATA_MAPPER.PLAN_TYPES[planType]
              }`}
              optionsList={[
                ...defaultOption,
                ...toOptionValuesFromMapper(OPTIONS_DATA_MAPPER.PLAN_TYPES),
              ]}
              className="bg-transparent p-0 no-caret"
              onClick={handleTypes}
              value={planType}
            />
          </div>
          <div className="my-4 category-sort mr-4">
            <Select
              title={`Status: ${
                [undefined, null].includes(planStatus)
                  ? "All"
                  : OPTIONS_DATA_MAPPER.PLAN_STATUS_LIST[planStatus]
              }`}
              optionsList={[
                ...defaultOption,
                ...toOptionValuesFromMapper(
                  OPTIONS_DATA_MAPPER.PLAN_STATUS_LIST
                ),
              ]}
              className="bg-transparent p-0 no-caret"
              onClick={handleStatusType}
              value={planStatus}
            />
          </div>
          <div xs="3" className="my-4">
            <Form.Check
              custom
              id="showTerminated"
              name="showTerminated"
              type="switch"
              label="&nbsp;&nbsp;Show Terminated"
              autoFocus="off"
              onChange={onCheckboxClick}
              checked={showTerminated}
              className="medium"
            />
          </div>
        </Row>
      </div>
      {/* <GenericTable
        data={tableData}
        isLoading={isLoadingPlanCount || loading}
        handleSort={handleSortForGenericTable}
        totalRecords={planCount}
        scrollEndCallBack={scrollEndCallBack}
      /> */}
      <div className="plan-card-container">
        <PlanCards
          data={tableData}
          scrollEndCallBack={scrollEndCallBack}
          isLoading={isLoadingPlanCount || loading}
          totalRecords={planCount}
          history={history}
        />
      </div>
    </div>
  );
};

export default PlanContainer;
