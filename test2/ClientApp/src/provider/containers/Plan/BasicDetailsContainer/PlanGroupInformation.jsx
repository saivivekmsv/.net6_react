import React, { useState, useEffect } from "react";
import { Form, Toast, Button, Row, InputGroup, Image } from "react-bootstrap";
import { faTimes } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { isEmpty } from "lodash";
import {
  AddPlans,
  LoaderWrapper,
  SliderPanel,
  Link,
  FormControlSearch,
} from "../../../components";
import { useDeepEffect, useRequest } from "../../../abstracts";
import { getPlanGroups } from "../../../services";

export const PlanGroupInformation = (props) => {
  const {
    planGroupMappings,
    isSave,
    isEdit,
    savedPlanGroups,
    setsavedPlanGroups,
  } = props;

  const [isModalOpen, setModalOpen] = useState(false);
  const [isSliderOpen, setSliderOpen] = useState(false);
  const [addedPlanGroups, setaddedPlanGroups] = useState([]);
  const [searchaddedPlanGroups, setSearchaddedPlanGroups] = useState("");
  const [searchSavedPlanGroups, setsearchSavedPlanGroups] = useState("");
  const [searchPlanGroupList, setsearchPlanGroupList] = useState("");
  const [addedPlanGroupsFilter, setaddedPlanGroupsFilter] = useState([]);
  const [savedPlanGroupsFilter, setsavedPlanGroupsFilter] = useState([]);
  const [planGroupListFilter, setplanGroupListFilter] = useState([]);
  const [planGroups, setPlanGroups] = useState([]);
  const { response: planGroupList, loading } = useRequest(
    {
      method: getPlanGroups,
      defaultResponse: [],
    },
    []
  );
  const addPlansToPlanGroup = (name) => {
    setaddedPlanGroups((e) => [name, ...e]);
    var temp = planGroups.filter((e) => e.id !== name.id);
    setPlanGroups(temp);
  };

  useDeepEffect(
    () => {
      let apiPlans = planGroupList.filter((planGroup) =>
        planGroupMappings.map((item) => item.planGroupId).includes(planGroup.id)
      );
      const apiPlans1 = apiPlans.map((item) => {
        planGroupMappings.map((mapping) => {
          if (item.id === mapping.planGroupId) {
            item["mapId"] = mapping.id;
          }
        });
        return item;
      });
      setsavedPlanGroups(apiPlans1);
      setaddedPlanGroups(apiPlans1);

      if (!isEmpty(planGroupMappings)) {
        setPlanGroups(
          planGroupList.filter(
            (planGroup) =>
              !planGroupMappings
                .map((item) => item.planGroupId)
                .includes(planGroup.id)
          )
        );
      } else {
        setPlanGroups(planGroupList);
      }
    },
    [planGroupMappings],
    [planGroupList]
  );

  const onViewButtonClick = () => {
    setModalOpen(true);
  };

  const onViewPlanCountClick = () => {
    setSliderOpen(true);
  };

  const onSubmit = (plans) => {
    setsavedPlanGroups(plans);
    setModalOpen(false);
  };

  const onCancel = () => {
    setaddedPlanGroups(savedPlanGroups);
    setPlanGroups(
      planGroupList.filter(
        (plan) =>
          !savedPlanGroups.map((planGroup) => planGroup.id).includes(plan.id)
      )
    );
    setModalOpen(false);
  };

  const addAllPlans = () => {
    setaddedPlanGroups((e) => [...planGroupListFilter, ...e]);
    setPlanGroups([]);
  };

  const removeAllPlans = () => {
    setaddedPlanGroups([]);
    setPlanGroups((e) => [...addedPlanGroups, ...e]);
  };

  useDeepEffect(() => {
    setsavedPlanGroupsFilter(savedPlanGroups);
  }, [savedPlanGroups]);

  useDeepEffect(() => {
    setplanGroupListFilter(planGroups);
  }, [planGroups]);

  useDeepEffect(() => {
    setaddedPlanGroupsFilter(addedPlanGroups);
  }, [addedPlanGroups]);

  useDeepEffect(() => {
    setaddedPlanGroupsFilter(
      addedPlanGroups.filter((team) => {
        return team.name
          .toLowerCase()
          .includes(searchaddedPlanGroups.toLowerCase());
      })
    );
  }, [searchaddedPlanGroups]);

  useDeepEffect(() => {
    setsavedPlanGroupsFilter(
      savedPlanGroups.filter((team) => {
        return (
          team.name
            .toLowerCase()
            .includes(searchSavedPlanGroups.toLowerCase()) ||
          team.description
            .toLowerCase()
            .includes(searchSavedPlanGroups.toLowerCase())
        );
      })
    );
  }, [searchSavedPlanGroups]);

  useDeepEffect(
    () => {
      setplanGroupListFilter(
        planGroups.filter((team) => {
          return team.name
            .toLowerCase()
            .includes(searchPlanGroupList.toLowerCase());
        })
      );
    },
    [searchPlanGroupList],
    [planGroups]
  );

  const removePlansFromPlanGroup = (name) => {
    var temp = addedPlanGroups.filter((e) => e.id !== name.id);
    setaddedPlanGroups(temp);
    setPlanGroups((e) => [name, ...e]);
  };

  const savedPlanGroupsLength = () => {
    if (savedPlanGroups.length < 2) {
      return `0${savedPlanGroups.length}`;
    } else {
      return savedPlanGroups.length;
    }
  };

  return (
    <div>
      {isEmpty(savedPlanGroups) ? (
        <div>
          <LoaderWrapper>
            <AddPlans
              content="No plan group have been setup for this plan"
              buttonLabel="Add Plan Groups"
              onPrimaryClick={onViewButtonClick}
              disabled={isEdit && !isSave}
            />
          </LoaderWrapper>
        </div>
      ) : (
        <div>
          <LoaderWrapper>
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
                    {savedPlanGroupsLength()}
                  </Link>{" "}
                  plan groups mapped
                </div>
              }
              buttonLabel="Add / Remove Plan Groups"
              onPrimaryClick={onViewButtonClick}
              disabled={isEdit && !isSave}
            />
          </LoaderWrapper>
        </div>
      )}

      <SliderPanel isOpen={isSliderOpen} size="35" showCancel={false}>
        <div className="d-flex justify-content-between align-baseline">
          <div>
            <p className="plan-group-plan-add">Added plan groups</p>
            <p className="plan-count-sub-heading">
              {savedPlanGroups.length} Plan groups found
            </p>
          </div>
          <Link>
            <FontAwesomeIcon
              icon={faTimes}
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
                className="pad-left-search"
                placeholder="Search plan group name & description"
                onChange={(e) => setsearchSavedPlanGroups(e.target.value)}
              />
            </InputGroup>
          </Form>
        </div>

        <div className="Added-plan-basic-tiles">
          {savedPlanGroupsFilter.map((data, index) => (
            <Row>
              <div className="tile-plan-group w-453 marg-left-20">
                <div className="tile-text" style={{ marginLeft: "20px" }}>
                  <div className="tile-title w-269">{data.name}</div>
                  <div className="tile-number">{data.description}</div>
                </div>
              </div>
            </Row>
          ))}
        </div>
      </SliderPanel>

      <SliderPanel
        screen="plan-group"
        isOpen={isModalOpen}
        size="70"
        showCancel={false}
      >
        <div className="w-100 maintenance-container">
          <div className="Add-plans-header-basic">
            <div className="ft-18 plan-group-title">
              Add Plan Group Information
            </div>
            <div>
              <Button variant="secondary" onClick={() => onCancel()}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() => onSubmit(addedPlanGroups)}
                className="ml-4"
              >
                Save
              </Button>
            </div>
          </div>

          <div className="add-plans-content">
            <div className="left-basic-plan height-max-500">
              <div className="left-2-basic-plan">
                <div className="marg-left-13">
                  <div className="plan-group-plan-add">
                    Plan groups information
                  </div>
                  <div className="marg-bot-15 max-width-381">
                    <div className="search-bar w-400 " style = {{width:"453px" }}>
                      <Form>
                        <InputGroup>
                          <div className="search-icon-postion">
                            <i class="fal fa-search" aria-hidden="true"></i>
                          </div>
                          <FormControlSearch
                            size="md"
                            type="search"
                            placeholder="Search plan group name"
                            className="pad-left-search"
                            onChange={(e) =>
                              setsearchPlanGroupList(e.target.value)
                            }
                          />
                        </InputGroup>
                      </Form>
                    </div>
                  </div>
                </div>
                <div className="small-options">
                  <div className="small-text w-310">
                    {planGroupListFilter.length} Plan groups
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

                <div className="Add-plan-tiles">
                  {planGroupListFilter.map((data, index) => (
                    <Row>
                      <div className="tile-plan-group marg-left-20 marg-right-20">
                        <div className="tile-text pad-left-15">
                          <div className="tile-title w-342">{data.name}</div>
                          <div className="tile-number">{data.description}</div>
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

            <div className="basic-plan-details-right height-max-500">
              <div className="basic-plan-details-right-1">
                <div className="plan-group-plan-add">Added plan groups</div>
                <div className="search-bar w-381 " style = {{width:"453px" }}>
                  <Form>
                    <InputGroup>
                      <div className="search-icon-postion">
                        <i class="fal fa-search" aria-hidden="true"></i>
                      </div>
                      <FormControlSearch
                        size="md"
                        type="search"
                        placeholder="Search plan group name"
                        className="pad-left-search"
                        onChange={(e) =>
                          setSearchaddedPlanGroups(e.target.value)
                        }
                      />
                    </InputGroup>
                  </Form>
                </div>
                <div className="plan-group-remove-count ">
                  <div className="plan-group-remove">
                    <Link
                      className="link red-small"
                      onClick={() => removeAllPlans()}
                    >
                      Remove all
                    </Link>
                  </div>
                  <div className="plan-group-plan">
                    {addedPlanGroupsFilter.length} plan group
                  </div>
                </div>

                {isEmpty(addedPlanGroups) ? (
                  <div className="plan-group-no-plan">
                    <div className="plan-no-plan">No plan groups added</div>
                    <div className="plan-add-plan">
                      Please add plan groups here by clicking on the arrow
                    </div>
                  </div>
                ) : (
                  <div
                    className="basic-added-plan marg-right-20"
                    style={{ paddingRight: "20px" }}
                  >
                    {addedPlanGroupsFilter.map((data, index) => (
                      <Row>
                        <div className="tile-added-plan-group marg-left-15">
                          <Link>
                            <div className="Arrow-left-basic-plan">
                              <i
                                className="fa fa-long-arrow-left"
                                aria-hidden="true"
                                onClick={() => removePlansFromPlanGroup(data)}
                              ></i>
                            </div>
                          </Link>
                          <div className="tile-text-added w-342">
                            <div className="tile-title">{data.name}</div>
                            <div className="tile-number">
                              {data.description}
                            </div>
                          </div>
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

export default PlanGroupInformation;
