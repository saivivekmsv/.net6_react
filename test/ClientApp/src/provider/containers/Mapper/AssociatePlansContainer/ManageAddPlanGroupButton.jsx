import React, { useState } from "react";
import { ManageMapperLayout } from "../../../components";
import { Image, InputGroup, Button, Form, Row, Card } from "react-bootstrap";
import "../../../styles/containers/MapperAssociatePlans.scss";
import AddPlanButton from "./AddPlanButton";
import "../../../styles/containers/AddPlanGroupSlider.scss";
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
} from "../../../components";
import {
  FLOW_TYPES,
  OPTIONS_DATA_MAPPER,
  toOptionValuesFromMapper,
  toMultiSelectValueById,
  clearFieldValues,
} from "../../../utils";
import { isEmpty } from "lodash";
import {
  faTimes,
  faTrashAlt,
  faPencilAlt,
  faChevronDown,
  faExclamationTriangle,
} from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
import { useRouterParams, useRequest, useDeepEffect } from "../../../abstracts";

const ManageAddPlanGroupButton = (props) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [addedPlans, setAddedPlans] = useState([]);
  const [savedPlans, setSavedPlans] = useState([]);
  const [plans, setPlans] = useState([]);
  const [allPlans, setAllPlans] = useState([]);
  const [addedPlansFilter, setAddedPlansFilter] = useState([]);
  const [selectedInvestmentNames, setSelectedInvestmentNames] = useState([]);
  const [selectedInvestmentTypes, setSelectedInvestmentTypes] = useState([]);
  const [searchAddedPlans, setSearchAddedPlans] = useState("");
  const [planListFilter, setPlanListFilter] = useState([]);
  const [searchPlanList, setSearchPlanList] = useState("");
  const [selectedCustodians, setSelectedCustodians] = useState([]);
  const [custodians, setCustodians] = useState([]);
  const [investmentNames, setInvestmentNames] = useState([]);
  const [selectedTrustees, setSelectedTrustees] = useState([]);
  const [trustees, setTrustees] = useState([]);
  const [selectedAdvisors, setSelectedAdvisors] = useState([]);
  const [advisors, setAdvisors] = useState([]);
  const [selectedPlanTypes, setSelectedPlanTypes] = useState([]);
  const [selectedPlanStatus, setSelectedPlanStatus] = useState([]);
  const [tags, setTags] = useState([]);
  const { flow, planGroupId } = useRouterParams();
  const filters = [
    planStatus,
    planTypes,
    investmentTypes,
    advisors,
    trustees,
    investmentNames,
    custodians,
  ];

  const hideTags = () => {
    let x = document.getElementsByClassName("tags-filter");
    let y = x[0].style.display;
    if (y === "none") {
      x[0].style.display = "block";
    } else {
      x[0].style.display = "none";
    }
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

  const isEdit = flow === FLOW_TYPES.EDIT;
  const planTypes = toOptionValuesFromMapper(OPTIONS_DATA_MAPPER.PLAN_TYPES);

  const planStatus = toOptionValuesFromMapper(
    OPTIONS_DATA_MAPPER.PLAN_STATUS_LIST_0
  );
  const investmentTypes = toOptionValuesFromMapper(
    OPTIONS_DATA_MAPPER.INVESTMENT_TYPES
  );

  const handleFilters = (list, values) => {
    let data = filters[list - 1].filter((item) =>
      values.map((x) => x).includes(item.value)
    );
    setTags({ ...tags, [list]: [data] });
  };
  const addPlansToPlanGroup = (name) => {
    setAddedPlans((e) => [name, ...e]);
    var temp = plans.filter((e) => e.id !== name.id);
    setPlans(temp);
  };
  const addAllPlans = () => {
    setAddedPlans((e) => [...planListFilter, ...e]);
    setPlans([]);
  };

  const removePlansFromPlanGroup = (name) => {
    var temp = addedPlans.filter((e) => e.id !== name.id);
    setAddedPlans(temp);
    setPlans((e) => [name, ...e]);
  };

  const onViewButtonClick = () => {
    setModalOpen(true);
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
  const onSubmit = (plans) => {
    setSavedPlans(plans);
    setModalOpen(false);
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
  const removeAllPlans = () => {
    setAddedPlans([]);
    setPlans((e) => [...addedPlans, ...e]);
  };

  return (
    <div>
      <SliderPanel
        screen="plan-group"
        isOpen={isModalOpen}
        size="75"
        showCancel={false}
      >
        <div className="w-90 h-100 planGroupSliderContainer">
          <div className="PlanGroupsHeader">
            <div className="planGroupTitle">Add Plan Group Information</div>
            <div className="buttonsGroupContainer">
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

          <div className="addPlanGroupsContent">
            <div className="groupsCol"></div>
            <div className="AddCol">
              <div className="marg-left-13">
                <div className="GroupTitleCase marg-top-15 marg-bot-15">
                  Plan groups information
                </div>
                <div className="marg-bot-15 max-width-381">
                  <div className="search-bar group-search">
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
                            placeholder="Search plan group name"
                            className="pad-left-search"
                            onChange={(e) => setSearchPlanList(e.target.value)}
                          />
                        </InputGroup>
                      </div>

                      {/* </FormControlSearch> */}
                    </Form>
                  </div>
                </div>
              </div>
              <div className="small-options">
                <div className="smallText w-310">
                  {planListFilter.length} Plan groups
                </div>
                <div
                  className="smallText marg-right-18"
                  style={{ width: "3.125rem" }}
                >
                  <Link
                    className="link blue-small"
                    onClick={() => addAllPlans()}
                  >
                    Add all
                  </Link>
                </div>
              </div>

              <div className="AddPlanTiles marg-right-18">
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

            <div className="PlanGroupsRight">
              <div className="PlanGroupsRight-1">
                <div className="AddedPlansText-Slider ">Added plans</div>
                <div className="search-bar group-search2 ">
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
                        placeholder="Search plan group name"
                        onChange={(e) => setSearchAddedPlans(e.target.value)}
                        className="pad-left-search"
                      />
                    </InputGroup>
                  </Form>
                </div>
                <div className="planGroupRemoveCount">
                  <div className="plan-group-remove">
                    <Link
                      className="link red-small"
                      onClick={() => removeAllPlans()}
                    >
                      Remove all
                    </Link>
                  </div>
                  <div className="planGroupPlan">
                    {addedPlansFilter.length} Plans
                  </div>
                </div>

                {isEmpty(addedPlans) ? (
                  <div className="planGroupNoPlan">
                    <div className="planNoPlan">No plans added</div>
                    <div className="planAddPlan">
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

      <div style={{ width: "60px", marginLeft: "70px" }}>
        <AddPlanButton
          className="AddGroup"
          buttonLabel="Add Group"
          onPrimaryClick={onViewButtonClick}
          //   disabled={isEdit && !isSave}
        />
      </div>
    </div>
  );
};

export default ManageAddPlanGroupButton;
