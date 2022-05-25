import React, { useState, useContext, useEffect } from "react";
import { ManageMapperLayout } from "../../../components";
import { Image, InputGroup, Button, Form, Row, Card } from "react-bootstrap";
import "../../../styles/containers/MapperAssociatePlans.scss";
import AddPlanButton from "./AddPlanButton";
import SearchBar from "./SearchBar";
import "../../../styles/containers/AddPlanSlider.scss";
import { Formik, Field } from "formik";
import CompensationTableRow from "../../../components/CompensationTable/CompensationTableRow";
import {
  savePlanGroupsAction,
  setManageMaintenanceToastInfo,
  manageMaintenanceStore,
  setManagePageLevelData,
} from "../../../contexts";

import FiltersDropDown from "./FiltersDropDown";
import {
  ManageMaintenanceLayout,
  FieldInput,
  AddPlans,
  LoaderWrapper,
  SliderPanel,
  FieldTextarea,
  Link,
  CsplTable as Table,
  Dropside,
  FormControlSearch,
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
import { isEmpty } from "lodash";
import {
  faTimes,
  faTrashAlt,
  faPencilAlt,
  faChevronDown,
  faExclamationTriangle,
} from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getActivePlans, onUpdatePlans } from "../../../services";
import { useRouterParams, useRequest, useDeepEffect } from "../../../abstracts";
import { setManageMapperToastInfo } from "../../../contexts";

const ManageAddPlanButton = (props) => {
  const {
    savedPlans,
    setSavedPlans,
    planProfiles,
    mappingConfigurationId,
    isEdit,
    dispatch,
  } = props;
  const [isPopupOpen, setisPopupOpen] = useState(0);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isEditSliderOpen, setEditSliderOpen] = useState(false);
  const [searchAddedPlans, setSearchAddedPlans] = useState("");
  const [searchSavedPlans, setSearchSavedPlans] = useState("");
  const [searchPlanList, setSearchPlanList] = useState("");
  const [isSliderOpen, setSliderOpen] = useState(false);
  const [tags, setTags] = useState([]);
  const [addedPlans, setAddedPlans] = useState([]);
  const [addedPlansFilter, setAddedPlansFilter] = useState([]);
  const [savedPlansFilter, setSavedPlansFilter] = useState([]);
  const [loader, setLoader] = useState(true);
  const [planListFilter, setPlanListFilter] = useState([]);
  const [plans, setPlans] = useState([]);
  const [selectedPlanTypes, setSelectedPlanTypes] = useState([]);
  const [selectedCompanyNames, setSelectedCompanyNames] = useState([]);

  const [allPlans, setAllPlans] = useState([]);

  const [selectedCount, setSelectedCount] = useState(0);
  const planTypes = toOptionValuesFromMapper(OPTIONS_DATA_MAPPER.PLAN_TYPES);

  const clearFilterValues = () => {
    setSelectedPlanTypes([]);
    setSelectedCompanyNames([]);
    setTags([]);
    setLoader(true);
    getActivePlans({
      planType: [],
      companyId: [],
    }).then((response) => {
      setLoader(false);
      setAllPlans(response);
      // setPlanListFilter(response);
    });

    // setLoader(true);
  };

  useEffect(() => {
    if (!isEmpty(savedPlans)) {
      setAddedPlansFilter(savedPlans);
      setAddedPlans(savedPlans);
    }
  }, [savedPlans]);

  const [plansForOptions, setplansForOptions] = useState([]);

  useEffect(() => {
    getActivePlans({
      planType: [],
      companyId: [],
    }).then((response) => {
      setLoader(false);
      setplansForOptions(response);
      // setAllPlans(response);
      // setPlanListFilter(response);
    });
  }, [isEditSliderOpen]);

  const applyFiltersClick = () => {
    setLoader(true);
    getActivePlans({
      planType: selectedPlanTypes,
      companyId: selectedCompanyNames,
    }).then((response) => {
      setLoader(false);
      setAllPlans(response);
      // setPlanListFilter(response);
    });
  };

  const companyNamesList = [];
  plansForOptions.map((item, i) => {
    if (!companyNamesList.includes(item.companyId)) {
      companyNamesList.push({ label: item.companyName, value: item.companyId });
    }
  });

  const companyOptions = companyNamesList.filter((obj, pos, arr) => {
    return arr.map((mapObj) => mapObj.value).indexOf(obj.value) == pos;
  });

  const onDeleteFilterClick = (index, itemIndex) => {
    let data = tags[index][0].filter((item) => item.value !== itemIndex);
    setTags({ ...tags, [index]: [data] });
    let ids = data.map((id) => id.value);
    switch (index) {
      case 1:
        setSelectedPlanTypes(ids);
        break;
      case 2:
        setSelectedCompanyNames(ids);
        break;
      default:
        break;
    }
  };

  const filters = [planTypes, companyOptions];

  const handleFilters = (list, values) => {
    let data = filters[list - 1].filter((item) =>
      values.map((x) => x).includes(item.value)
    );
    setTags({ ...tags, [list]: [data] });
  };

  const removeOne = () => {
    setisPopupOpen(true);
  };

  const addPlansToPlanGroup = (data) => {
    setAddedPlans((e) => [...e, data]);
    var temp = plans.filter((e) => e.planId !== data.planId);
    setPlans(temp);
  };

  const onViewButtonClick = () => {
    setModalOpen(true);
  };
  const onEditButtonClick = () => {
    setEditSliderOpen(true);
  };

  const onEditAddedPlansButtonClick = () => {
    setEditSliderOpen(false);
    setModalOpen(true);
  };
  const onCloseAddedPlansButtonClick = () => {
    setEditSliderOpen(false);
  };

  const onSubmit = (plans) => {
    if (plans.length !== planProfiles.length) {
      onUpdatePlans({
        mappingConfigurationId: mappingConfigurationId,
        planProfileMappings: plans,
      }).then((res) => {
        dispatch(
          setManageMapperToastInfo({
            showToast: true,
            toastMessage: `Update Profile Plans Succesfull`,
          })
        );
      });
    }
    setSavedPlans(plans);
    setModalOpen(false);

    document.getElementById("NumberOfPlansAdded").textContent =
      savedPlans.length;
  };

  const onCancel = () => {
    setAddedPlans(savedPlans);
    setPlans(
      allPlans.filter(
        (plan) => !savedPlans.map((item) => item.planId).includes(plan.planId)
      )
    );
    setModalOpen(false);
  };

  const addAllPlans = () => {
    setAddedPlans((e) => [
      ...e,
      ...planListFilter.filter((item) => item.planStatus == 3),
    ]);

    setPlans([]);
  };

  const removeAllPlans = () => {
    setAddedPlans([]);
    setPlans((e) => [...e, ...addedPlans]);
    // document.getElementById("NumberOfPlansAdded").textContent = "0";
  };

  useDeepEffect(() => {
    setSavedPlansFilter(savedPlans);
  }, [savedPlans]);
  useDeepEffect(() => {
    setPlanListFilter(plans);
  }, [plans]);
  useDeepEffect(() => {
    setAddedPlansFilter(addedPlans);
  }, [addedPlans]);
  // }, [savedPlans, addedPlans]);

  useDeepEffect(() => {
    applyFiltersClick();
    if (!isEmpty(addedPlans)) {
      setPlans(
        allPlans.filter(
          (plan) => !addedPlans.map((item) => item.planId).includes(plan.planId)
        )
      );
    } else {
      setPlans(allPlans);
    }
  }, [allPlans]);

  useDeepEffect(() => {
    // applyFiltersClick();
    if (!isEmpty(addedPlans)) {
      setPlans(
        allPlans.filter(
          (plan) => !addedPlans.map((item) => item.planId).includes(plan.planId)
        )
      );
    } else {
      setPlans(allPlans);
    }
  }, [addedPlans]);

  useDeepEffect(() => {
    setAddedPlansFilter(
      addedPlans.filter((team) => {
        return (
          team.planName
            .toLowerCase()
            .includes(searchAddedPlans.toLowerCase()) ||
          team.rkPlanNumber.includes(searchAddedPlans)
        );
      })
    );
  }, [searchAddedPlans]);

  useDeepEffect(() => {
    setSavedPlansFilter(
      savedPlans.filter((team) => {
        return (
          team.planName
            .toLowerCase()
            .includes(searchSavedPlans.toLowerCase()) ||
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
            team.planName
              .toLowerCase()
              .includes(searchPlanList.toLowerCase()) ||
            team.rkPlanNumber.includes(searchPlanList)
          );
        })
      );
    },
    [searchPlanList],
    [plans]
  );
  const removePlansFromPlanGroup = (data) => {
    var temp = addedPlans.filter((e) => e.planId !== data.planId);
    setAddedPlans(temp);
    setPlans((e) => [...e, data]);
    // setPlans((e) => [data,...e]);
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

  useEffect(() => {
    setSelectedCount(0);

    if (!isEmpty(tags)) {
      setSelectedCount(0);
      let arr = [];
      [1, 2, 3, 4, 5, 6, 7].map((filterIndex) => {
        (tags[filterIndex] || []).map((data, index) =>
          data.map((item, idx) => arr.push(item.label))
        );
      });
      setSelectedCount(arr.length);
    } else {
      setSelectedCount(0);
    }
  }, [tags]);

  return (
    <div>
      <SliderPanel
        screen="plan-group"
        isOpen={isModalOpen}
        size="90"
        showCancel={false}
      >
        <LoaderWrapper isLoading={loader}>
          <div className="w-90 h-100 planSliderContainer">
            <div className="PlansHeader">
              <div className="planTitle">Add plans Information</div>
              <div className="buttonsContainer">
                <Button variant="secondary" onClick={() => onCancel()}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    onSubmit(addedPlans);
                  }}
                  className="ml-4"
                >
                  Save
                </Button>
              </div>
            </div>

            <div className="addPlansContent">
              <div className="leftcol">
                <div className="col1">
                  <div className="left-title12">
                    <div className="planTitle">Filter</div>
                    <div className="resetApplyButtonsContainer">
                      <Link
                        className="planGroupReset"
                        onClick={() => clearFilterValues()}
                      >
                        Reset
                      </Link>
                      <Link
                        className="planGroupApply"
                        onClick={() => applyFiltersClick()}
                      >
                        Apply
                      </Link>
                    </div>
                  </div>
                  <div className="filtersCount d-flex flexD-col">
                    <div className="d-flex justify-content-space-between">
                      <div>
                        <span>{selectedCount}</span> Selected
                      </div>
                      <div className="Arrow-up">
                        <Link onClick={hideTags}>
                          <FontAwesomeIcon icon={faChevronDown} />
                        </Link>
                      </div>
                    </div>
                    <div className="tags-filter" style={{ display: "none" }}>
                      <div>
                        <div className="filterTags marg-top-5 pad-top-15">
                          {[1, 2, 3, 4, 5, 6, 7].map((filterIndex) => {
                            return (tags[filterIndex] || []).map(
                              (data, index) =>
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
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="filtersMapper">
                    <div className="filterTitleMapper">Plan Type</div>
                    <div
                      className=" marg-bot-15"
                      style={{ height: "auto", width: "360px" }}
                    >
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
                        // disabled={isEdit}
                        popupContent={
                          <div>
                            <FiltersDropDown
                              //label="Select Plan Types"
                              hideSelectedOptions="FALSE"
                              width="332px"
                              height={planTypes.length * 36}
                              maxHeight="238px"
                              options={planTypes}
                              onSelect={(value) => {
                                setSelectedPlanTypes(value);
                                handleFilters(1, value);
                              }}
                              name={"planTypes"}
                              value={selectedPlanTypes}
                              // disabled={isEdit}
                              // isTypeAhead={isEdit}
                            />
                          </div>
                        }
                      />
                    </div>

                    <div className="filterTitleMapper">Company Name</div>
                    <div
                      className=" marg-bot-15"
                      style={{ height: "auto", width: "360px" }}
                    >
                      <Dropside
                        size="xs"
                        direction="bottom"
                        name={"companyOptions"}
                        label={"Type"}
                        placeholder={"0 selected"}
                        options={companyOptions}
                        value={toMultiSelectValueById(
                          selectedCompanyNames,
                          companyOptions
                        )}
                        isMultiSelect
                        // disabled={isEdit}
                        popupContent={
                          <div>
                            <FiltersDropDown
                              //label="Select Plan Types"
                              hideSelectedOptions="FALSE"
                              width="332px"
                              height={companyOptions.length * 50}
                              maxHeight="238px"
                              options={companyOptions}
                              onSelect={(value) => {
                                setSelectedCompanyNames(value);
                                handleFilters(2, value);
                              }}
                              name={"companyOptions"}
                              value={selectedCompanyNames}
                              // disabled={isEdit}
                              // isTypeAhead={isEdit}
                            />
                          </div>
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="leftcol-2">
                  <div className="marg-left-13">
                    <div className="title-case marg-top-15 marg-bot-15">
                      Plans Information
                    </div>
                    <div className=" max-width-381">
                      <div className="search-bar" style={{ width: "410px" }}>
                        <Form>
                          <div className="flex-search">
                            <InputGroup>
                              <InputGroup.Prepend>
                                <div className="searchIconPostion">
                                  <i
                                    class="fal fa-search"
                                    aria-hidden="true"
                                  ></i>
                                </div>
                              </InputGroup.Prepend>

                              <SearchBar
                                size="md"
                                type="search"
                                placeholder="Search plan name & ID"
                                className="PadLeftSearch"
                                onChange={(e) =>
                                  setSearchPlanList(e.target.value)
                                }
                              />
                            </InputGroup>
                          </div>
                        </Form>
                      </div>
                    </div>
                  </div>
                  <div className="smallOptions">
                    <div className="small-text w-310">
                      {
                        planListFilter.filter((item) => item.planStatus == 3)
                          .length
                      }{" "}
                      plans
                    </div>
                    <div className="small-text w-45 marg-left-30">
                      <Link
                        className="link blue-small"
                        onClick={() => addAllPlans()}
                      >
                        Add all
                      </Link>
                    </div>
                  </div>

                  <div className="AddPlanTiles marg-right-18">
                    {planListFilter
                      .filter((item) => item.planStatus == 3)
                      .map((data, index) => (
                        <Row>
                          <div className="tile">
                            <div className="tile-line green"></div>
                            <div className="tile-text pad-left-15">
                              <div className="tile-title w-269">
                                {data.planName}
                                {/* {data.planStatus} */}
                              </div>
                              <div className="tile-number">
                                <div>
                                  {data.rkPlanNumber}
                                  <span className="tile-state-gray">
                                    {data.companyName}
                                  </span>

                                  {/* <span className="tile-state-red">
                                  {data.planStatus}
                                </span> */}
                                </div>
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

              <div className="maintenancePlanRight">
                <div className="maintenancePlanRight-1">
                  <div className="title-case marg-top-15 marg-bot-15  ">
                    Added plans
                  </div>
                  <div className="search-bar w-381 ">
                    <Form>
                      <InputGroup>
                        <InputGroup.Prepend>
                          <div className="search-icon-postion">
                            <i class="fal fa-search" aria-hidden="true"></i>
                          </div>
                        </InputGroup.Prepend>
                        <SearchBar
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
                  {/* <pre>{JSON.stringify(planListFilter,null,2)}</pre> */}
                  {isEmpty(addedPlans) ? (
                    <div className="plan-group-no-plan">
                      {/* <pre>{JSON.stringify(selectedCompanyNames,null,2)}</pre>
                    <pre>{JSON.stringify(selectedPlanTypes,null,2)}</pre> */}

                      <div className="plan-no-plan">No plans added</div>
                      {/* <pre>{JSON.stringify(allPlans,null,2)}</pre> */}

                      <div className="plan-add-plan">
                        Please add plans here by clicking on the arrow
                      </div>
                    </div>
                  ) : (
                    <div className="added-plans-list">
                      {/* <pre>{JSON.stringify(addedPlansFilter,null,2)}</pre> */}

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
                              <div className="tile-title">{data.planName}</div>
                              <div className="tile-number">
                                {data.rkPlanNumber}
                                <span className="tile-state-gray">
                                  {data.companyName}
                                </span>
                              </div>
                            </div>

                            <div className="tile-line-right green"></div>
                          </div>
                        </Row>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </LoaderWrapper>
      </SliderPanel>

      <SliderPanel
        screen="plan-group"
        isOpen={isEditSliderOpen}
        size="35"
        showCancel={false}
      >
        <div className="EditPlan">
          <div className="EditPlan-1">
            <div>
              <div className="plan-group-plan-add editSliderHeader-1">
                Added plans
              </div>
              <div className="editSliderHeader-2">
                <div className="plan-group-plan editSliderAddedPlans">
                  {addedPlansFilter.length} Plans
                </div>
                <div className="editSliderButtons">
                  <AddPlanButton
                    className="editSliderAddPlan"
                    buttonLabel="Edit"
                    onPrimaryClick={onEditAddedPlansButtonClick}
                    // disabled={isEdit && !isSave}
                  />
                  <button
                    className="closeIcon-size"
                    type="button"
                    onClick={onCloseAddedPlansButtonClick}
                  >
                    <FontAwesomeIcon icon={faTimes} size="lg" />
                  </button>
                </div>
              </div>
            </div>

            <div className="search-bar w-381 editSearchBar">
              <Form>
                <InputGroup>
                  <InputGroup.Prepend>
                    <div className="search-icon-postion">
                      <i class="fal fa-search" aria-hidden="true"></i>
                    </div>
                  </InputGroup.Prepend>
                  <SearchBar
                    size="md"
                    type="search"
                    placeholder="Search plan name & ID"
                    onChange={(e) => setSearchSavedPlans(e.target.value)}
                    className="pad-left-search"
                  />
                </InputGroup>
              </Form>
            </div>

            <div className="editSliderAddedPlansList">
              {addedPlansFilter.map((data, index) => (
                <Row>
                  <div className="ShowAddedPlanTile">
                    <div className="tile-line green"></div>
                    <div className="editSliderTileTitle  pad-left-15">
                      <div className="tile-title w-269">{data.planName}</div>
                      <div className="tile-number">
                        {data.rkPlanNumber}
                        <span className="tile-state-gray">
                          {data.companyName}
                        </span>
                      </div>
                    </div>
                  </div>
                </Row>
              ))}
            </div>
          </div>
        </div>
      </SliderPanel>

      {isEmpty(savedPlans) ? (
        <div style={{ width: "60px", marginLeft: "70px" }}>
          <AddPlanButton
            className="AddPlan"
            buttonLabel="Add"
            onPrimaryClick={onViewButtonClick}
            // disabled={isEdit && !isSave}
          />
        </div>
      ) : (
        <div style={{ width: "60px", marginLeft: "70px" }}>
          <AddPlanButton
            className="AddPlan"
            buttonLabel="View"
            onPrimaryClick={onEditButtonClick}
            // disabled={isEdit && !isSave}
          />
        </div>
      )}
    </div>
  );
};

export default ManageAddPlanButton;
