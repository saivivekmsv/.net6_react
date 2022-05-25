import React, { useContext, useState, useEffect, useRef } from "react";
import { Field, useFormikContext, Formik } from "formik";
import { Button } from "react-bootstrap";
import {
  manageMaintenanceStore,
  setManagePageLevelData,
} from "../../../contexts";
import { useRouterParams, useRequest, useDeepEffect } from "../../../abstracts";
import {
  ManageMaintenanceLayout,
  LoaderWrapper,
  CsplTable as Table,
  FieldInput,
  Link,
} from "../../../components";
import {
  manageMaintenanceFormNames,
  managePlanFormNames,
  MANAGE_MAINTENANCE_ROUTES,
  getFlowBasedFormValues,
  FLOW_TYPES,
  toOptionValuesFromMapper,
  OPTIONS_DATA_MAPPER,
  getAdvancedPathWithParam,
  formFields,
  getPathWithParam,
} from "../../../utils";
import { Select, SearchDropdownWithAPI } from "../../../components";
import { Row, Col, Form } from "react-bootstrap";
import {
  getCompanyCount,
  postCompanyGridView,
  getPlanGroups,
} from "../../../services";
import { isEmpty } from "lodash";

const ManagePlanGroupContainer = (props) => {
  const { history } = props;
  const { flow } = useRouterParams();
  const { state, dispatch } = useContext(manageMaintenanceStore);
  const formName = manageMaintenanceFormNames.MANAGE_PLAN_GROUP;
  const fields1 = formFields[formName];
  const fields = { planTypes: "planTypes" };
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  //const [planGroupInfo, setplanGroupInfo] = useState([]);
  const [selectedPlanTypes, setSelectedPlanTypes] = useState([]);
  const [filteredResponse, setFilteredResponse] = useState([]);
  let searchChangeTimeout = null;
  const [searchValueDisplayed, setSearchValueDisplayed] = useState("");
  const [searchText, setSearchText] = useState("");
  const searchPayloadKey = "searchString";

  const { response, loading } = useRequest({
    method: postCompanyGridView,
    payload: {
      [searchPayloadKey]: searchText.trim(),
      from: 1,
      to: 100,
      showTerminated: true,
    },
    defaultResponse: [],
    triggerOnlyOnUpdate: true,
  });

  const buttons = [
    {
      label: "Create Plan Group",
      variant: "primary",
      type: "button",
      link: MANAGE_MAINTENANCE_ROUTES.ADD_PLAN_GROUP,
    },
  ];

  const handleSearchChange = (val) => {
    setSearchText(val);
  };
  const planGroupNames = [];

  const handleTypes = (e) => {
    setSelectedPlanTypes(e.target.value);
  };

  const defaultOption = [{ label: "All", value: null }];

  useEffect(() => {
    getPlanGroups().then((response) => {
      setFilteredResponse(response);
    });
  }, []);

  return (
    <ManageMaintenanceLayout buttons={buttons}>
      <Formik initialValues={{}} enableReinitialize>
        {(formProps) => {
          const {
            setFieldValue,
            values,
            handleChange,
            handleSubmit,
            setValues,
            setSubmitting,
            ...rest
          } = formProps;

          const searchByPlanName = () => {
            if (values[fields1.search]) {
              // console.log("if");
              // console.log(values[fields1.search].length);

              getPlanGroups(values[fields1.search]).then((response) => {
                setFilteredResponse(response);
              });
            } else {
              getPlanGroups().then((response) => {
                setFilteredResponse(response);
              });
            }
          };

          const onViewPlanGroupClick = (index) => {
            setSubmitting(true);
            window.setTimeout(() => {
              history.push(
                getPathWithParam({
                  path: MANAGE_MAINTENANCE_ROUTES.ADD_PLAN_GROUP,
                  pathParam: [FLOW_TYPES.EDIT, index],
                })
              );
            }, 10);
          };

          return (
            <LoaderWrapper isLoading={loading}>
              {!loading && (
                <div
                  className="w-100 maintenance-container"
                  style={{ paddingRight: "10px" }}
                >
                  <div className="d-flex">
                    <Field
                      label="Search"
                      name={fields1.search}
                      //   {...rest}
                      type="text"
                      size="md"
                      //isRequired
                      autoComplete="off"
                      placeholder="Search"
                      value={values[fields1.search]}
                      onBlur={handleChange}
                      // disabled={isEdit}
                      component={FieldInput}
                    />
                    <div
                      style={{
                        marginLeft: "2rem",
                      }}
                    >
                      <Button
                        variant="secondary"
                        className="plan-group-search"
                        type="button"
                        onClick={searchByPlanName}
                      >
                        Search
                      </Button>
                    </div>
                  </div>

                  {filteredResponse.map((data, index) => (
                    <div className="plan-group-tile w-100 ">
                      <Row>
                        <Col md="3">
                          <p className="plan-group-tile-header">Name</p>
                          <Link
                            onClick={() => {
                              onViewPlanGroupClick(data.id);
                            }}
                          >
                            <p className="plan-group-tile-content plan-group-blue">
                              {data.name}
                            </p>
                          </Link>
                        </Col>
                        <Col>
                          <Row>
                            <Col md="9">
                              <p className="plan-group-tile-header">
                                Description
                              </p>
                              <p className="plan-group-tile-content">
                                {data.description}
                              </p>
                            </Col>

                            {/* <Col md="5">
                              <p className="plan-group-tile-header">Type</p>
                              <p className="plan-group-tile-content">
                                {data.Type}
                              </p>
                            </Col> */}

                            <Col>
                              <p className="plan-group-added-tile-header">
                                Plans Added
                              </p>
                              <div className="float grey-bg d-flex mar-bot-4">
                                <i
                                  class="pad-left fal fa-file-invoice-dollar pad-right-13 pad-top-6"
                                  style={{ "font-size": "18px" }}
                                ></i>{" "}
                                <p className="plan-group-tile-content pad-right-6 pad-top-6">
                                  {data.count}
                                </p>
                              </div>
                              <div class="clearfix"></div>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </div>
                  ))}
                </div>
              )}
            </LoaderWrapper>
          );
        }}
      </Formik>
    </ManageMaintenanceLayout>
  );
};

export default ManagePlanGroupContainer;
