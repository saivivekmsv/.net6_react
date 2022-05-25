/* eslint-disable array-callback-return */
import React, { useContext, useState } from "react";
// import { Link } from "react-router-dom";
import {
  savePlanGroupsAction,
  setManageMaintenanceToastInfo,
  manageMaintenanceStore,
  setManagePageLevelData,
} from "../../../contexts";
import { isEmpty } from "lodash";
import { Form, Button, InputGroup, Row, Modal, Col } from "react-bootstrap";
import {
  faTimes,
  faTrashAlt,
  faPencilAlt,
  faChevronDown,
  faExclamationTriangle,
} from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  ManageMaintenanceLayout,
  FieldInput,
  AddPlans,
  LoaderWrapper,
  SliderPanel,
  FieldTextarea,
  Link,
  Dropside,
  MultiSelectDropdown,
  FormControlSearch,
  ManagePayrollMenu,
} from "../../../components";
import {
  manageMaintenanceFormNames,
  MANAGE_MAINTENANCE_ROUTES,
  getPathWithParam,
  formFields,
  FLOW_TYPES,
  getAdvancedPathWithParam,
  OPTIONS_DATA_MAPPER,
  toOptionValuesFromMapper,
  toMultiSelectValueById,
  clearFieldValues,
} from "../../../utils";
import { useRouterParams, useRequest, useDeepEffect } from "../../../abstracts";
import { Formik, Field } from "formik";
import {
  getAdvisorsList,
  getCustodiansList,
  getInvestmentNamesList,
  getTrusteesList,
  getPlansBySearchCriteria,
  getPlansBySearch,
  getPlanGroupInfo,
  deletePlanGroup,
} from "../../../services";
import CompensationTableRow from "../../../components/CompensationTable/CompensationTableRow";
import EditContribution from "../../Payroll/CreatePayrollListingContainer/EditContribution";

const AddPlanGroupContainer = (props) => {
  const { history } = props;
  // const [isModalOpen, setIsModalOpen] = useState(0);
  const { flow, planGroupId } = useRouterParams();
  const intPlanGroupId = parseInt(planGroupId);
  const [newFlow] = useState("");
  const formName = manageMaintenanceFormNames.ADD_PLAN_GROUP;
  const fields = formFields[formName];
  const [isPopupOpen, setisPopupOpen] = useState(0);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isSliderOpen, setSliderOpen] = useState(false);
  const [tags, setTags] = useState([]);
  const [addedPlans, setAddedPlans] = useState([]);
  const [savedPlans, setSavedPlans] = useState([]);
  const [searchAddedPlans, setSearchAddedPlans] = useState("");
  const [searchSavedPlans, setSearchSavedPlans] = useState("");
  const [searchPlanList, setSearchPlanList] = useState("");
  const [addedPlansFilter, setAddedPlansFilter] = useState([]);
  const [savedPlansFilter, setSavedPlansFilter] = useState([]);
  const [planListFilter, setPlanListFilter] = useState([]);
  const [plans, setPlans] = useState([]);
  const [selectedPlanTypes, setSelectedPlanTypes] = useState([]);
  const [selectedPlanStatus, setSelectedPlanStatus] = useState([]);
  const [selectedInvestmentTypes, setSelectedInvestmentTypes] = useState([]);
  const [selectedAdvisors, setSelectedAdvisors] = useState([]);
  const [selectedCustodians, setSelectedCustodians] = useState([]);
  const [selectedTrustees, setSelectedTrustees] = useState([]);
  const [selectedInvestmentNames, setSelectedInvestmentNames] = useState([]);
  const [allPlans, setAllPlans] = useState([]);
  const { state, dispatch } = useContext(manageMaintenanceStore);
  const [advisors, setAdvisors] = useState([]);
  const [trustees, setTrustees] = useState([]);
  const [custodians, setCustodians] = useState([]);
  const [reqId, setReqId] = useState({});
  const [investmentNames, setInvestmentNames] = useState([]);
  const planTypes = toOptionValuesFromMapper(OPTIONS_DATA_MAPPER.PLAN_TYPES);
  const planStatus = toOptionValuesFromMapper(
    OPTIONS_DATA_MAPPER.PLAN_STATUS_LIST_0
  );
  const investmentTypes = toOptionValuesFromMapper(
    OPTIONS_DATA_MAPPER.INVESTMENT_TYPES
  );

  const labels = [];

  //   const advisors = toOptionValuesFromMapper(
  //   OPTIONS_DATA_MAPPER.INVESTMENT_TYPES
  // );

  // const advisors = toOptionValuesFromMapper(
  //   OPTIONS_DATA_MAPPER.INVESTMENT_TYPES
  // );

  useDeepEffect(() => {
    getAdvisorsList().then((response) => {
      setAdvisors(
        response &&
          response.map((val, ind) => ({
            label: val.name,
            value: val.id,
          }))
      );
    });
    getTrusteesList().then((response) => {
      setTrustees(
        response &&
          response.map((val, ind) => ({
            label: val.name,
            value: val.id,
          }))
      );
    });
    getCustodiansList().then((response) => {
      setCustodians(
        response &&
          response.map((val, ind) => ({
            label: val.name,
            value: val.id,
          }))
      );
    });
    getInvestmentNamesList().then((response) => {
      setInvestmentNames(
        response &&
          response.map((val, ind) => ({
            label: val.name,
            value: val.id,
          }))
      );
    });
  }, []);
  // const trustees = toOptionValuesFromMapper(
  //   OPTIONS_DATA_MAPPER.INVESTMENT_TYPES
  // );

  // const investmentNames = toOptionValuesFromMapper(
  //   OPTIONS_DATA_MAPPER.INVESTMENT_TYPES
  //);

  // const custodians = toOptionValuesFromMapper(
  //   OPTIONS_DATA_MAPPER.INVESTMENT_TYPES
  // );

  const { response: formValues, loading } = useRequest({
    method: getPlanGroupInfo,
    payload: intPlanGroupId,
    defaultResponse: {},
  });

  const mappings = formValues.planMappings;

  const clearFilterValues = () => {
    setSelectedInvestmentTypes([]);
    setSelectedPlanStatus([]);
    setSelectedPlanTypes([]);
    setSelectedAdvisors([]);
    setSelectedCustodians([]);
    setSelectedInvestmentNames([]);
    setSelectedTrustees([]);
    setTags([]);
  };
  const applyFiltersClick = () => {
    getPlansBySearch({
      planstatus: selectedPlanStatus,
      planType: selectedPlanTypes,
      investmentType: selectedInvestmentTypes,
      advisorsId: selectedAdvisors,
      trusteesId: selectedTrustees,
      custodiansId: selectedCustodians,
      investmentsId: selectedInvestmentNames,
    }).then((response) => {
      setAllPlans(response);
    });
  };

  const onDeleteFilterClick = (index, itemIndex) => {
    let data = tags[index][0].filter((item) => item.value !== itemIndex);
    setTags({ ...tags, [index]: [data] });
    let ids = data.map((id) => id.value);
    switch (index) {
      case 1:
        setSelectedPlanStatus(ids);
        break;
      case 2:
        setSelectedPlanTypes(ids);
        break;
      case 3:
        setSelectedInvestmentTypes(ids);
        break;
      case 4:
        setSelectedAdvisors(ids);
        break;
      case 5:
        setSelectedTrustees(ids);
        break;
      case 6:
        setSelectedCustodians(ids);
        break;
      case 7:
        setSelectedInvestmentNames(ids);
        break;
    }
  };

  const filters = [
    planStatus,
    planTypes,
    investmentTypes,
    advisors,
    trustees,
    investmentNames,
    custodians,
  ];

  const handleFilters = (list, values) => {
    let data = filters[list - 1].filter((item) =>
      values.map((x) => x).includes(item.value)
    );
    setTags({ ...tags, [list]: [data] });
  };

  let savedPlansMapping = savedPlans.map((plan) => {
    let planMappings = {
      id: plan.mapId ? plan.mapId : 0,
      planGroupId: intPlanGroupId ? intPlanGroupId : 0,
      planId: plan.id,
    };
    return planMappings;
  });
  const removeOne = () => {
    setisPopupOpen(true);
    //setRecordToDelete(item);
  };
  const handleClose = () => {
    setisPopupOpen(false);
    // setRecordToDelete({});
  };

  const onFormSubmit = (
    values,
    { setFieldError, setFieldTouched, setSubmitting }
  ) => {
    savePlanGroupsAction(
      {
        id: intPlanGroupId ? intPlanGroupId : 0,
        Name: values[fields.planGroupName],
        Description: values[fields.planGroupDescription],
        planMappings: savedPlansMapping,
      },
      dispatch
    ).then((response) => {
      if (response.isSuccessfull) {
        history.push(
          getPathWithParam({
            path: MANAGE_MAINTENANCE_ROUTES.MANAGE_PLAN_GROUP,
            //pathParam: [FLOW_TYPES.ADD],
          })
        );
        //setShowToast(true);
        dispatch(
          setManagePageLevelData({
            formName: formName,
            fieldData: values,
          })
        );
        dispatch(
          setManageMaintenanceToastInfo({
            showToast: true,
            toastMessage: "Data saved successfully",
          })
        );
      } else {
        setSubmitting(false);
        for (var i = 0; i < response.errorMessages.length; i++) {
          var _ = response.errorMessages[i];
          setFieldTouched(_.controlName, true);
          setFieldError(_.controlName, _.errorCode + ": " + _.message);
        }
      }
    });
  };

  const onDeleteClick = () => {
    deletePlanGroup(intPlanGroupId).then((response) => {
      if (response) {
        // setShowToast(true);
        history.push(
          getPathWithParam({
            path: MANAGE_MAINTENANCE_ROUTES.MANAGE_PLAN_GROUP,
            // pathParam: [FLOW_TYPES.EDIT],
          })
        );
        dispatch(
          setManageMaintenanceToastInfo({
            showToast: true,
            toastMessage: "Plan Group deleted successfully",
          })
        );
      }
    });
  };

  const buttons = [
    {
      label: "Cancel",
      variant: "secondary",
      type: "button",
      flow: [FLOW_TYPES.ADD, FLOW_TYPES.SAVE],
      link: MANAGE_MAINTENANCE_ROUTES.MANAGE_PLAN_GROUP,
    },
    {
      label: "Save",
      variant: "primary",
      type: "submit",
      flow: [FLOW_TYPES.ADD],
    },
    {
      label: "",
      variant: "link",
      type: "button",
      flow: [FLOW_TYPES.EDIT],
      icon: faTrashAlt,
      // link: MANAGE_MAINTENANCE_ROUTES.MANAGE_PLAN_GROUP,
      //onClick: onDeleteClick,
      onClick: removeOne,
    },
    {
      label: "",
      variant: "link",
      type: "button",
      flow: [FLOW_TYPES.EDIT],
      icon: faTimes,
      link: MANAGE_MAINTENANCE_ROUTES.MANAGE_PLAN_GROUP,
    },
    {
      label: "Edit",
      variant: "link",
      type: "button",
      flow: [FLOW_TYPES.EDIT],
      icon: faPencilAlt,
      onClick: () =>
        history.push(
          getAdvancedPathWithParam({
            path: MANAGE_MAINTENANCE_ROUTES.ADD_PLAN_GROUP,
            pathParam: [FLOW_TYPES.SAVE, intPlanGroupId],
          })
        ),
    },
    {
      label: "Save",
      variant: "primary",
      type: "submit",
      flow: [FLOW_TYPES.SAVE],
    },
  ];

  const isEdit = flow === FLOW_TYPES.EDIT;
  const isSave = newFlow === FLOW_TYPES.SAVE;

  const addPlansToPlanGroup = (name) => {
    setAddedPlans((e) => [name, ...e]);
    var temp = plans.filter((e) => e.id !== name.id);
    setPlans(temp);
  };

  const onViewButtonClick = () => {
    setModalOpen(true);
  };

  const onViewPlanCountClick = () => {
    setSliderOpen(true);
  };

  const onSubmit = (plans) => {
    setSavedPlans(plans);
    setModalOpen(false);
  };

  const onCancel = () => {
    setAddedPlans(savedPlans);
    setPlans(
      allPlans.filter(
        (plan) => !savedPlans.map((item) => item.id).includes(plan.id)
      )
    );
    setModalOpen(false);
  };

  const addAllPlans = () => {
    setAddedPlans((e) => [...planListFilter, ...e]);
    setPlans([]);
  };

  const removeAllPlans = () => {
    setAddedPlans([]);
    setPlans((e) => [...addedPlans, ...e]);
  };

  useDeepEffect(() => {
    applyFiltersClick();
    if (!isEmpty(addedPlans)) {
      setPlans(
        allPlans.filter(
          (plan) => !addedPlans.map((item) => item.id).includes(plan.id)
        )
      );
    } else if (!isEmpty(mappings)) {
      setPlans(
        allPlans.filter(
          (plan) => !mappings.map((item) => item.planId).includes(plan.id)
        )
      );
    } else {
      setPlans(allPlans);
    }
  }, [mappings, allPlans]);

  useDeepEffect(() => {
    applyFiltersClick();
    let apiPlans = allPlans
      ?.filter((plan) => mappings?.map((item) => item.planId).includes(plan.id))
      ?.map((item) => {
        mappings?.map((mapping) => {
          if (item.id === mapping.planId) {
            item["mapId"] = mapping.id;
          }
        });
        return item;
      });
    setSavedPlans(apiPlans);
    setAddedPlans(apiPlans);
  }, [mappings]);

  useDeepEffect(() => {
    setSavedPlansFilter(savedPlans);
  }, [savedPlans]);

  useDeepEffect(() => {
    setPlanListFilter(plans);
  }, [plans]);

  useDeepEffect(() => {
    setAddedPlansFilter(addedPlans);
  }, [addedPlans]);

  useDeepEffect(() => {
    setAddedPlansFilter(
      addedPlans.filter((team) => {
        return (
          team.name.toLowerCase().includes(searchAddedPlans.toLowerCase()) ||
          team.rkPlanNumber.includes(searchAddedPlans)
        );
      })
    );
  }, [searchAddedPlans]);

  useDeepEffect(() => {
    setSavedPlansFilter(
      savedPlans.filter((team) => {
        return (
          team.name.toLowerCase().includes(searchSavedPlans.toLowerCase()) ||
          team.rkPlanNumber.includes(searchSavedPlans)
        );
      })
    );
  }, [searchSavedPlans]);

  useDeepEffect(
    () => {
      setPlanListFilter(
        plans.filter((team) => {
          return (
            team.name.toLowerCase().includes(searchPlanList.toLowerCase()) ||
            team.rkPlanNumber.includes(searchPlanList)
          );
        })
      );
    },
    [searchPlanList],
    [plans]
  );

  const removePlansFromPlanGroup = (name) => {
    var temp = addedPlans.filter((e) => e.id !== name.id);
    setAddedPlans(temp);
    setPlans((e) => [name, ...e]);
  };

  const savedPlansLength = () => {
    if (savedPlans.length < 2) {
      return `0${savedPlans.length}`;
    } else {
      return savedPlans.length;
    }
  };
  const hideTags = () => {
    let x = document.getElementsByClassName("tags-filter");
    let y = x[0].style.display;
    if (y === "none") {
      x[0].style.display = "block";
    } else {
      x[0].style.display = "none";
    }
  };

  const showSuccesstile = () => {
    let x = document.getElementsByClassName("success-tile");
    let y = addedPlansFilter.length;
    if (y == 0) {
      x[0].style.display = "none";
    } else {
      x[0].style.display = "";
    }
  };

  const closeToast = () => {
    let x = document.getElementsByClassName("success-tile");
    let y = x[0].style.display;
    if (y === "none") {
      x[0].style.display = "block";
    } else {
      x[0].style.display = "none";
    }
  };

  //   const ShowSecond=() => {
  //     let x = document.getElementByClassName("success-tile");
  //     let y=x[0].style.display;
  // }

  return (
    <div>
      <Formik
        initialValues={{ ...formValues }}
        onSubmit={onFormSubmit}
        enableReinitialize
        validateOnChange={false}
        validateOnBlur={false}
      >
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

          return (
            <div>
              <Form
                autoComplete="off"
                className="h-100"
                onSubmit={handleSubmit}
                validated={!isEdit}
              >
                <ManageMaintenanceLayout
                  buttons={buttons}
                  pageFlow={newFlow || flow}
                >
                  <div className="d-flex">
                    <p className="font-weight-500 text-black">
                      Create Plan Group
                    </p>
                    <div className="success-tile" style={{ display: "none" }}>
                      <div className="success-color"></div>
                      <div className="plans-added-success">
                        <div className="success-icon">
                          <i class="fas fa-check-circle"></i>
                        </div>
                        <div className="plans-added-texts">
                          <div className="ft-18 font-weight-500 line-27 marg-bot-2">
                            {" "}
                            Plans group added success
                          </div>
                          <p className="ft-14 plans-added-text">
                            {" "}
                            {addedPlansFilter.length} plans mapped
                          </p>
                        </div>
                        <div className="plans-added-cross">
                          <i
                            onClick={closeToast}
                            class="fal fa-times"
                            aria-hidden="true"
                          ></i>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Field
                    label="Plan group name"
                    name={fields.planGroupName}
                    type="text"
                    size="md"
                    isRequired
                    autoComplete="off"
                    value={values[fields.planGroupName]}
                    onChange={handleChange}
                    disabled={isEdit && !isSave}
                    component={FieldInput}
                  />

                  <Field
                    label="Plan group description"
                    name={fields.planGroupDescription}
                    type="text"
                    size="md"
                    //   className="plan-group-description"
                    isRequired
                    autoComplete="off"
                    value={values[fields.planGroupDescription]}
                    onChange={handleChange}
                    disabled={isEdit && !isSave}
                    component={FieldTextarea}
                    height="100px"
                  />
                  {isEmpty(savedPlans) ? (
                    <div>
                      <LoaderWrapper>
                        <AddPlans
                          content="No plans have been setup for this group"
                          buttonLabel="Add Plan"
                          onPrimaryClick={onViewButtonClick}
                          disabled={isEdit && !isSave}
                        />
                      </LoaderWrapper>
                    </div>
                  ) : (
                    <div>
                      <LoaderWrapper>
                        <p className="mt-20 plan-heading-plan">
                          Plan Information
                        </p>
                        <AddPlans
                          content={
                            <div>
                              {" "}
                              <i class="pad-left fal fa-file-invoice-dollar pad-right-13 pad-top-6 ft-18"></i>
                              <Link
                                onClick={() => {
                                  onViewPlanCountClick();
                                }}
                                style={{ color: "royalblue" }}
                              >
                                {" "}
                                {savedPlansLength()}
                              </Link>{" "}
                              plans mapped
                            </div>
                          }
                          buttonLabel="Add / Remove Plans"
                          onPrimaryClick={onViewButtonClick}
                          disabled={isEdit && !isSave}
                        />
                      </LoaderWrapper>
                    </div>
                  )}
                  <Modal show={isPopupOpen} onHide={handleClose}>
                    <Modal.Body style={{ borderTop: "5px solid #f94f50" }}>
                      <div className="text-right">
                        <FontAwesomeIcon
                          icon={faTimes}
                          color="#000"
                          onClick={handleClose}
                        />
                      </div>
                      <div className="d-flex">
                        <div className="pd-15">
                          <FontAwesomeIcon
                            icon={faExclamationTriangle}
                            color="#f94f50"
                            size="3x"
                          />
                        </div>
                        <div className="remove-text">
                          <h4>Delete PlanGroup ?</h4>
                          <p>
                            You are attempting a plan group. Do you wish to
                            Delete ?
                          </p>
                          <br />
                          <Button
                            className="remove-btn mr-4"
                            onClick={onDeleteClick}
                          >
                            Delete
                          </Button>
                          <Button className="cancel-btn" onClick={handleClose}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </Modal.Body>
                  </Modal>
                </ManageMaintenanceLayout>
              </Form>
            </div>
          );
        }}
      </Formik>
      <SliderPanel isOpen={isSliderOpen} size="35" showCancel={false}>
        <div className="d-flex justify-content-between align-baseline">
          <div>
            <p className="plan-group-plan-add b-15">Added plans</p>
            <p className="plan-count-sub-heading added-plans-style">
              {savedPlans.length} Plans
            </p>
          </div>
          <Link>
            <FontAwesomeIcon
              icon={faTimes}
              //   color="black"
              size="26px"
              onClick={() => setSliderOpen(false)}
            />
          </Link>
        </div>
        <div className="search-bar w-453" style={{ width: "453px" }}>
          <Form>
            <InputGroup>
              <InputGroup.Prepend>
                <div className="search-icon-postion">
                  <i class="fal fa-search" aria-hidden="true"></i>
                </div>
              </InputGroup.Prepend>
              <FormControlSearch
                size="md"
                type="search"
                className="plan-search-box pad-left-search"
                placeholder="Search plan name & ID"
                onChange={(e) => setSearchSavedPlans(e.target.value)}
              />
            </InputGroup>
          </Form>
        </div>

        <div className="Add-plan-basic-tiles">
          {savedPlansFilter.map((data, index) => (
            <Row>
              <div className="tile m-15">
                {data.planStatus === "InActive" ? (
                  <div className="tile-line gray"></div>
                ) : data.planStatus === "Active" ? (
                  <div className="tile-line green"></div>
                ) : data.planStatus === "Terminated" ? (
                  <div className="tile-line red"></div>
                ) : data.planStatus === "UnderConstruction" ? (
                  <div className="tile-line orange"></div>
                ) : data.planStatus === "Approved" ? (
                  <div className="tile-line green"></div>
                ) : data.planStatus === "ReadyFor" ? (
                  <div className="tile-line orange"></div>
                ) : null}
                <div className="tile-text pad-left-15">
                  <div className="tile-title w-269 m-17">{data.name}</div>
                  <div className="tile-number m-17">
                    {data.rkPlanNumber}

                    {data.planStatus === "InActive" ? (
                      <span className="tile-state-gray">{data.planStatus}</span>
                    ) : data.planStatus === "Active" ? (
                      <span className="tile-state-green">
                        {data.planStatus}
                      </span>
                    ) : data.planStatus === "Terminated" ? (
                      <span className="tile-state-red">{data.planStatus}</span>
                    ) : data.planStatus === "UnderConstruction" ? (
                      <span className="tile-state-orange">
                        {data.planStatus}
                      </span>
                    ) : data.planStatus === "ReadyFor" ? (
                      <span className="tile-state-orange">
                        {data.planStatus}
                      </span>
                    ) : data.planStatus === "Approved" ? (
                      <span className="tile-state-green">
                        {data.planStatus}
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>
            </Row>
          ))}
        </div>
      </SliderPanel>

      <SliderPanel
        screen="plan-group"
        isOpen={isModalOpen}
        size="90"
        showCancel={false}
      >
        <div className="w-100 maintenance-container">
          <div className="Add-plans-header">
            <div className="ft-18 plan-group-title">Add plans Information</div>
            <div>
              <Button variant="secondary" onClick={() => onCancel()}>
                Cancel
              </Button>
              <Button
                variant="primary"
                //onClick={()=> onSubmit(addedPlans)}
                onClick={() => {
                  onSubmit(addedPlans);
                  //ShowSecond();
                  showSuccesstile();
                }}
                className="ml-4"
              >
                Save
              </Button>
            </div>
          </div>

          <div className="add-plans-content">
            <div className="left height-max-500">
              <div className="left1">
                <div className="left-title1">
                  <div className="plan-group-title">Filter</div>
                  <div>
                    <Link
                      className="plan-group-reset"
                      onClick={clearFilterValues}
                    >
                      Reset
                    </Link>
                    <Link
                      className="plan-group-apply"
                      onClick={() => applyFiltersClick()}
                    >
                      Apply
                    </Link>
                  </div>
                </div>
                <div className="filters-count d-flex flexD-col">
                  <div className="d-flex justify-content-space-between">
                    <div>
                      <span>{tags.length}</span> Selected
                    </div>
                    <div className="Arrow-up">
                      <Link onClick={hideTags}>
                        {/* <i class="fas fa-chevron-down"></i> */}
                        <FontAwesomeIcon icon={faChevronDown} />
                      </Link>
                    </div>
                  </div>
                  <div className="tags-filter" style={{ display: "none" }}>
                    <div>
                      <div className="filter-tags marg-top-5 pad-top-15">
                        {[1, 2, 3, 4, 5, 6, 7].map((filterIndex) =>
                          (tags[filterIndex] || []).map((data, index) =>
                            data.map((item, idx) => (
                              <div className="flex-start">
                                <div className="tags">
                                  <div className="filter-text">
                                    {item.label}
                                  </div>
                                  <div className="filter-cross-icon">
                                    <Link
                                      onClick={() =>
                                        onDeleteFilterClick(
                                          filterIndex,
                                          item.value
                                        )
                                      }
                                    >
                                      <i
                                        class="fal fa-times"
                                        aria-hidden="true"
                                      ></i>
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            ))
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="filters">
                  <div className="filter-title">Plan status</div>
                  <div
                    className="w-380 marg-bot-15 marg-right-50"
                    style={{ height: "auto" }}
                  >
                    <Dropside
                      size="xs"
                      direction="bottom"
                      name={"planStatus"}
                      label={"Type"}
                      placeholder={"0 selected"}
                      options={planStatus}
                      value={toMultiSelectValueById(
                        selectedPlanStatus,
                        planStatus
                      )}
                      isMultiSelect
                      disabled={isEdit}
                      popupContent={
                        <MultiSelectDropdown
                          //label="Select Plan status"
                          hideSelectedOptions="FALSE"
                          width="378px"
                          height={planStatus.length * 36}
                          maxHeight="238px"
                          options={planStatus}
                          onSelect={(value) => {
                            setSelectedPlanStatus(value);
                            handleFilters(1, value);
                          }}
                          name={"planStatus"}
                          value={selectedPlanStatus}
                          disabled={isEdit}
                          isTypeAhead={isEdit}
                        />
                      }
                    />
                  </div>

                  <div className="filter-title">Plan Type</div>
                  <div className="w-380 marg-bot-15" style={{ height: "auto" }}>
                    <Dropside
                      size="xs"
                      direction="bottom"
                      name={"planTypes"}
                      label={"Type"}
                      placeholder={"0 selected"}
                      options={planTypes}
                      value={toMultiSelectValueById(
                        selectedPlanTypes,
                        planTypes
                      )}
                      isMultiSelect
                      disabled={isEdit}
                      popupContent={
                        <div>
                          <MultiSelectDropdown
                            //label="Select Plan Types"
                            hideSelectedOptions="FALSE"
                            width="378px"
                            height={planTypes.length * 36}
                            maxHeight="300px"
                            options={planTypes}
                            onSelect={(value) => {
                              setSelectedPlanTypes(value);
                              handleFilters(2, value);
                            }}
                            name={"planTypes"}
                            value={selectedPlanTypes}
                            disabled={isEdit}
                            isTypeAhead={isEdit}
                          />
                        </div>
                      }
                    />
                  </div>

                  <div className="filter-title">Investment Type</div>
                  <div className="w-380 marg-bot-15" style={{ height: "auto" }}>
                    <Dropside
                      size="xs"
                      direction="bottom"
                      name={"investmentTypes"}
                      label={"Type"}
                      placeholder={"0 selected"}
                      options={investmentTypes}
                      value={toMultiSelectValueById(
                        selectedInvestmentTypes,
                        investmentTypes
                      )}
                      isMultiSelect
                      disabled={isEdit}
                      popupContent={
                        <MultiSelectDropdown
                          hideSelectedOptions="FALSE"
                          width="378px"
                          height={investmentTypes.length * 36}
                          maxHeight="238px"
                          options={investmentTypes}
                          onSelect={(value) => {
                            setSelectedInvestmentTypes(value);
                            handleFilters(3, value);
                          }}
                          name={"investmentTypes"}
                          value={selectedInvestmentTypes}
                          disabled={isEdit}
                          isTypeAhead={isEdit}
                        />
                      }
                    />
                  </div>

                  <div className="filter-title">Advisor</div>
                  <div className="w-380 marg-bot-15" style={{ height: "auto" }}>
                    <Dropside
                      size="xs"
                      direction="bottom"
                      name={"advisors"}
                      label={"Type"}
                      placeholder={"0 selected"}
                      options={advisors}
                      value={toMultiSelectValueById(selectedAdvisors, advisors)}
                      isMultiSelect
                      disabled={isEdit}
                      popupContent={
                        <div>
                          <MultiSelectDropdown
                            hideSelectedOptions="FALSE"
                            width="378px"
                            height={advisors.length * 36}
                            maxHeight="238px"
                            options={advisors}
                            onSelect={(value) => {
                              setSelectedAdvisors(value);
                              handleFilters(4, value);
                            }}
                            name={"advisors"}
                            value={selectedAdvisors}
                            disabled={isEdit}
                            isTypeAhead={isEdit}
                          />
                        </div>
                      }
                    />
                  </div>
                  <div className="filter-title">Trustee</div>
                  <div className="w-380 marg-bot-15" style={{ height: "auto" }}>
                    <Dropside
                      size="xs"
                      direction="bottom"
                      name={"trustees"}
                      label={"Type"}
                      placeholder={"0 selected"}
                      options={trustees}
                      value={toMultiSelectValueById(selectedTrustees, trustees)}
                      isMultiSelect
                      disabled={isEdit}
                      popupContent={
                        <MultiSelectDropdown
                          width="378px"
                          height={trustees.length * 36}
                          maxHeight="238px"
                          options={trustees}
                          onSelect={(value) => {
                            setSelectedTrustees(value);
                            handleFilters(5, value);
                          }}
                          name={"trustees"}
                          value={selectedTrustees}
                          disabled={isEdit}
                          isTypeAhead={isEdit}
                        />
                      }
                    />
                  </div>

                  <div className="filter-title">Investment Name</div>
                  <div className="w-380 marg-bot-15" style={{ height: "auto" }}>
                    <Dropside
                      size="xs"
                      direction="bottom"
                      name={"investmentName"}
                      label={"Type"}
                      placeholder={"0 selected"}
                      options={investmentNames}
                      value={toMultiSelectValueById(
                        selectedInvestmentNames,
                        investmentNames
                      )}
                      isMultiSelect
                      disabled={isEdit}
                      popupContent={
                        <MultiSelectDropdown
                          hideSelectedOptions="FALSE"
                          width="378px"
                          height={investmentNames.length * 36}
                          maxHeight="238px"
                          options={investmentNames}
                          onSelect={(value) => {
                            setSelectedInvestmentNames(value);
                            handleFilters(6, value);
                          }}
                          name={"investmentNames"}
                          value={selectedInvestmentNames}
                          disabled={isEdit}
                          isTypeAhead={isEdit}
                        />
                      }
                    />
                  </div>

                  <div className="filter-title">Custodian</div>
                  <div className="w-380 marg-bot-15" style={{ height: "auto" }}>
                    <Dropside
                      size="xs"
                      direction="bottom"
                      name={"custodians"}
                      label={"Type"}
                      placeholder={"0 selected"}
                      options={custodians}
                      value={toMultiSelectValueById(
                        selectedCustodians,
                        custodians
                      )}
                      isMultiSelect
                      disabled={isEdit}
                      popupContent={
                        <MultiSelectDropdown
                          hideSelectedOptions="FALSE"
                          width="378px"
                          height={custodians.length * 36}
                          maxHeight="238px"
                          options={custodians}
                          onSelect={(value) => {
                            setSelectedCustodians(value);
                            handleFilters(7, value);
                          }}
                          name={"custodians"}
                          value={selectedCustodians}
                          disabled={isEdit}
                          isTypeAhead={isEdit}
                        />
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="left-2">
                <div className="marg-left-13">
                  <div className="title-case marg-top-15 marg-bot-15">
                    Plans Information
                  </div>
                  <div className="marg-bot-15 max-width-381">
                    <div className="search-bar w-381 ">
                      <Form>
                        {/* <InputGroup>
                                  <InputGroup.Prepend>
                                    <InputGroup.Text className="plan-search-button">
                                      <Image
                                        src="/assets/icons/svg/search.svg"
                                        width="14px"
                                      />
                                    </InputGroup.Text>
                                  </InputGroup.Prepend> */}
                        <div className="flex-search">
                          <InputGroup>
                            <InputGroup.Prepend>
                              <div className="search-icon-postion">
                                <i class="fal fa-search" aria-hidden="true"></i>
                              </div>
                            </InputGroup.Prepend>

                            <FormControlSearch
                              size="md"
                              type="search"
                              placeholder="Search plan name & ID"
                              className="pad-left-search"
                              onChange={(e) =>
                                setSearchPlanList(e.target.value)
                              }
                            />
                          </InputGroup>
                        </div>

                        {/* </FormControlSearch> */}
                      </Form>
                    </div>
                  </div>
                </div>
                <div className="small-options">
                  <div className="small-text w-310">
                    {planListFilter.length} plans
                  </div>
                  <div className="small-text w-45 marg-right-18">
                    <Link
                      className="link blue-small"
                      onClick={() => addAllPlans()}
                    >
                      Add all
                    </Link>
                  </div>
                </div>

                <div className="Add-plan-tiles marg-right-18">
                  {planListFilter.map((data, index) => (
                    <Row>
                      <div className="tile">
                        {data.planStatus == "InActive" ? (
                          <div className="tile-line gray"></div>
                        ) : data.planStatus == "Active" ? (
                          <div className="tile-line green"></div>
                        ) : data.planStatus == "Terminated" ? (
                          <div className="tile-line red"></div>
                        ) : data.planStatus == "UnderConstruction" ? (
                          <div className="tile-line orange"></div>
                        ) : data.planStatus == "ReadyFor" ? (
                          <div className="tile-line orange"></div>
                        ) : data.planStatus == "Approved" ? (
                          <div className="tile-line green"></div>
                        ) : null}
                        <div className="tile-text pad-left-15">
                          <div className="tile-title w-269">{data.name}</div>
                          <div className="tile-number">
                            {data.rkPlanNumber}

                            {data.planStatus == "InActive" ? (
                              <span className="tile-state-gray">
                                {data.planStatus}
                              </span>
                            ) : data.planStatus == "Active" ? (
                              <span className="tile-state-green">
                                {data.planStatus}
                              </span>
                            ) : data.planStatus == "Terminated" ? (
                              <span className="tile-state-red">
                                {data.planStatus}
                              </span>
                            ) : data.planStatus == "UnderConstruction" ? (
                              <span className="tile-state-orange">
                                {data.planStatus}
                              </span>
                            ) : data.planStatus == "ReadyFor" ? (
                              <span className="tile-state-orange">
                                {data.planStatus}
                              </span>
                            ) : data.planStatus == "Approved" ? (
                              <span className="tile-state-green">
                                {data.planStatus}
                              </span>
                            ) : null}
                          </div>
                        </div>
                        <Link>
                          <div className="Arrow">
                            <i
                              className="fa fa-long-arrow-right"
                              aria-hidden="true"
                              onClick={() => addPlansToPlanGroup(data)}
                            ></i>
                          </div>
                        </Link>
                      </div>
                    </Row>
                  ))}
                </div>
              </div>
            </div>

            <div className="maintenance-plan-right height-max-500">
              <div className="maintenance-plan-right-1">
                <div className="plan-group-plan-add">Added plans</div>
                <div className="search-bar w-381 ">
                  <Form>
                    {/* <InputGroup>
                              <InputGroup.Prepend>
                                <InputGroup.Text className="plan-search-button">
                                  <Image
                                    src="/assets/icons/svg/search.svg"
                                    width="14px"
                                  />
                                </InputGroup.Text>
                              </InputGroup.Prepend> */}
                    <InputGroup>
                      <InputGroup.Prepend>
                        <div className="search-icon-postion">
                          <i class="fal fa-search" aria-hidden="true"></i>
                        </div>
                      </InputGroup.Prepend>
                      <FormControlSearch
                        size="md"
                        type="search"
                        placeholder="Search plan name & ID"
                        onChange={(e) => setSearchAddedPlans(e.target.value)}
                        className="pad-left-search"
                      />
                    </InputGroup>
                  </Form>
                </div>
                <div className="plan-group-remove-count">
                  <div className="plan-group-remove">
                    <Link
                      className="link red-small"
                      onClick={() => removeAllPlans()}
                    >
                      Remove all
                    </Link>
                  </div>
                  <div className="plan-group-plan">
                    {addedPlansFilter.length} Plans
                  </div>
                </div>

                {isEmpty(addedPlans) ? (
                  <div className="plan-group-no-plan">
                    <div className="plan-no-plan">No plans added</div>
                    <div className="plan-add-plan">
                      Please add plans here by clicking on the arrow
                    </div>
                  </div>
                ) : (
                  <div className="added-plans-list">
                    {addedPlansFilter.map((data, index) => (
                      <Row>
                        <div className="tile-added">
                          <Link>
                            <div className="Arrow-left">
                              <i
                                className="fa fa-long-arrow-left"
                                aria-hidden="true"
                                onClick={() => removePlansFromPlanGroup(data)}
                              ></i>
                            </div>
                          </Link>
                          <div className="tile-text-added w-269">
                            <div className="tile-title">{data.name}</div>
                            <div className="tile-number">
                              {data.rkPlanNumber}

                              {data.planStatus === "InActive" ? (
                                <span className="tile-state-gray">
                                  {data.planStatus}
                                </span>
                              ) : data.planStatus === "Active" ? (
                                <span className="tile-state-green">
                                  {data.planStatus}
                                </span>
                              ) : data.planStatus === "Terminated" ? (
                                <span className="tile-state-red">
                                  {data.planStatus}
                                </span>
                              ) : data.planStatus === "UnderConstruction" ? (
                                <span className="tile-state-orange">
                                  {data.planStatus}
                                </span>
                              ) : data.planStatus == "Approved" ? (
                                <span className="tile-state-green">
                                  {data.planStatus}
                                </span>
                              ) : data.planStatus == "ReadyFor" ? (
                                <span className="tile-state-orange">
                                  {data.planStatus}
                                </span>
                              ) : null}
                            </div>
                          </div>
                          {data.planStatus === "InActive" ? (
                            <div className="tile-line-right gray"></div>
                          ) : data.planStatus === "Active" ? (
                            <div className="tile-line-right green"></div>
                          ) : data.planStatus === "Terminated" ? (
                            <div className="tile-line-right red"></div>
                          ) : data.planStatus === "UnderConstruction" ? (
                            <div className="tile-line-right orange"></div>
                          ) : data.planStatus == "Approved" ? (
                            <div className="tile-line-right green"></div>
                          ) : data.planStatus == "ReadyFor" ? (
                            <div className="tile-line-right orange"></div>
                          ) : null}
                        </div>
                      </Row>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </SliderPanel>
    </div>
  );
};

export default AddPlanGroupContainer;
