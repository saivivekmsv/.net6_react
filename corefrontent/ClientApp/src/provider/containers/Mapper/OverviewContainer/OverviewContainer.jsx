import React, { useState, useContext, useEffect } from "react";
import {
  FieldInput,
  ManageMapperLayout,
  SliderPanel,
} from "../../../components";
import RACTile from "./RACTile";
import "./sample.css";
import { get, isEmpty } from "lodash";
import { MANAGE_MAPPER_ROUTES, ROUTES, getPathWithParam } from "../../../utils";
import {
  manageMapperStore,
  CloneMapperProfile,
  SubmitMapperProfileOverview,
} from "../../../contexts";
import { Form, Button } from "react-bootstrap";
import { onUpdateStatus, cloneProfile } from "../../../services";
import { Field, Formik, useFormikContext } from "formik";
import { Link } from "react-router-dom";
import { useRouterParams } from "../../../abstracts";

const OverviewContainer = (props) => {
  const { flow, profileIdURL } = useRouterParams();
  const { history } = props;
  const initialValues = {
    cloneProfileName: "",
  };
  const { state, dispatch } = useContext(manageMapperStore);
  // console.log("1234state", state);
  const data = get(state, "api.data", {});
  const fieldHeadersJson = get(data, "headerMapJson", []);
  const basicInformation = get(state, "basicInformation", []);
  const [isModalOpen, setModalOpen] = useState(false);
  const sourceLength =
    !isEmpty(fieldHeadersJson) && JSON.parse(fieldHeadersJson).length;
  const objectLength = !isEmpty(data) && get(data, "objectMaps").length;
  const [isActive, setisActive] = useState();
  const profileId = get(state, "api.data.id");
  const [aggregateInfoString, setAggregateInfoString] = useState();
  const [dupStrategy, setDupStrategy] = useState();
  const [customLogics, setCustomLogics] = useState();
  const [keyFields, setKeyFields] = useState();
  const [isAggregation, setAggregation] = useState(false);
  const objectMaps = !isEmpty(data) && get(data, "objectMaps", []);
  const [countTransforms, setCountTransforms] = useState(0);
  const [hasHeader, setHasHeader] = useState("-");
  const configJsonString = !isEmpty(data) && get(data, "configurationJson", []);
  const configJson = JSON.parse(configJsonString);
  const [isExcel, setExcel] = useState(true);

  useEffect(() => {
    setisActive(!isEmpty(data) && get(data, "isActive"));
    if (!isEmpty(data) && data.isAggregationModel) {
      let c = 0;
      setAggregation(true);
      const aggregateInfo = !isEmpty(data) && get(data, "aggregationModelJson");
      setAggregateInfoString(aggregateInfo);
      const aggregateInfoJson = JSON.parse(aggregateInfo);
      setDupStrategy(aggregateInfoJson.aggregationStrategy);
      aggregateInfoJson.aggregationOperationEntities.map((item) => {
        if (!isEmpty(item.operation)) {
          c = c + 1;
        }
      });
      setCustomLogics(c);
      setKeyFields(aggregateInfoJson.aggregationEntites.length);
    } else {
      setAggregation(false);
    }
    if (!isEmpty(data)) {
      let count = 0;
      objectMaps.map((item) => {
        if (!isEmpty(item.fieldOperations)) {
          count = count + 1;
        }
      });
      setCountTransforms(count);
    }

    if (!isEmpty(data) && data.format == 3) {
      setExcel(true);
      if (configJson.hasOwnProperty("hasHeader")) {
        setHasHeader("Yes");
      } else {
        setHasHeader("Not Available");
      }
    } else if (!isEmpty(data) && data.format == 1) {
      setExcel(false);
      if (configJson.hasOwnProperty("delimiter")) {
        setHasHeader(configJson.delimiter);
      } else {
        setHasHeader("-");
      }
    }
  }, [data]);

  const profileName = !isEmpty(data) && get(data, "name");
  const numPlans = !isEmpty(data) && get(data, "planProfiles");

  const onSubmit = () => {
    if (get(data, "isActive") !== isActive) {
      onUpdateStatus({ ...data, isActive: isActive })
        .then((res) => {
          if (!isEmpty(res)) {
            history.push(`${ROUTES.MAPPER_HOME}`);
          }
        })
        .catch((err) => err);
    }
    history.push(`${ROUTES.MAPPER_HOME}`);
  };

  const buttons = [
    {
      label: "Cancel",
      variant: "secondary",
      type: "button",
      link: ROUTES.MAPPER_HOME,
    },
    {
      label: "Confirm",
      variant: "primary",
      type: "button",
      onClick: onSubmit,
    },
  ];

  return (
    <Formik initialValues={initialValues}>
      {({ values, setFieldValue, setSubmitting }) => {
        const onCloneProfile = (id, name) => {
          setSubmitting(true);
          cloneProfile(id, name)
            .then(() => {
              history.push(`${ROUTES.MAPPER_HOME}`);
            })
            .catch((err) => {
              return err;
            });
        };
        return (
          <ManageMapperLayout buttons={buttons} layoutHeader={"Overview"}>
            <div className="d-flex">
              <div className="mr-5">
                <div style={{ fontSize: "14px" }}>Profile name</div>
                <div className="font-weight-bold" style={{ fontSize: "18px" }}>
                  {profileName}
                </div>
              </div>
              <div className="mx-5">
                <div style={{ fontSize: "14px" }}>Status</div>
                <div className="d-flex">
                  <Form.Check
                    type="switch"
                    id={`custom-switch-1`}
                    label=" "
                    checked={isActive}
                    style={{ height: "22px", width: "44px" }}
                    onChange={() => {
                      setisActive(!isActive);
                    }}
                  />
                  <div
                    style={{
                      fontSize: "14px",
                      width: "50px",
                      overflow: "visible",
                    }}
                    className="ml-3"
                  >
                    {isActive ? "Active" : "InActive"}
                  </div>
                </div>
              </div>
              <div className="ml-5">
                <div style={{ fontSize: "14px" }}>Clone</div>
                <i
                  style={{
                    color: "#307BF6",
                    height: "18px",
                    cursor: "pointer",
                  }}
                  className="far fa-copy"
                  onClick={() => setModalOpen(true)}
                ></i>
              </div>
            </div>

            <SliderPanel
              isOpen={isModalOpen}
              size="30"
              showCancel={false}
              backdropClicked={false}
            >
              <div className="d-flex justify-content-between align-baseline">
                <div>
                  <p className="investment-heading">Clone Profile</p>
                </div>
                <div>
                  <Button
                    variant="secondary"
                    onClick={() => setModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    className="ml-4"
                    onClick={() => {
                      //The sending of data to clone the profile to backend and navigate to the mapper profile summary page
                      onCloneProfile(profileId, values.cloneProfileName);
                    }}
                  >
                    Confirm
                  </Button>
                </div>
              </div>

              <Field
                name="cloneProfileName"
                label={"Profile Name"}
                component={FieldInput}
                noLabelTransform
                isRequired
              />
            </SliderPanel>

            <hr className="mt-4" style={{ color: "inherit" }} />
            {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}

            <div
              style={{ marginTop: "3.125rem" }}
              className="mapper-raccontainer-grid"
            >
              <RACTile
                profileId={profileId}
                tileRoute={getPathWithParam({
                  path: MANAGE_MAPPER_ROUTES.SOURCE,
                  pathParam: [flow, profileId],
                })}
                title="Source"
                height="9.188rem"
              >
                <div style={{ fontSize: "12px", color: "grey" }}>
                  Source Name
                </div>
                <div style={{ fontSize: "14px" }}>{data.name}</div>
                <div style={{ fontSize: "12px", color: "grey" }}>
                  Source Type
                </div>
                <div style={{ fontSize: "14px" }}>File</div>
                {isExcel ? (
                  <div style={{ fontSize: "12px", color: "grey" }}>
                    Has header
                  </div>
                ) : (
                  <div style={{ fontSize: "12px", color: "grey" }}>
                    Delimiter
                  </div>
                )}
                <div style={{ fontSize: "14px" }}>{hasHeader}</div>
                <div>{data.fileName}</div>
              </RACTile>

              <RACTile
                profileId={profileId}
                tileRoute={getPathWithParam({
                  path: MANAGE_MAPPER_ROUTES.BASIC_INFORMATION,
                  pathParam: [flow, profileId],
                })}
                title="Plan Association"
              >
                <div style={{ fontSize: "12px", color: "grey" }}>
                  Number of plans associated
                </div>
                <div style={{ fontSize: "14px", marginBottom: "1.563rem" }}>
                  {numPlans.length}
                </div>
              </RACTile>

              <RACTile
                profileId={profileId}
                tileRoute={getPathWithParam({
                  path: MANAGE_MAPPER_ROUTES.FILTER,
                  pathParam: [flow, profileId],
                })}
                title="Filter"
              >
                <div style={{ fontSize: "12px", color: "grey" }}>
                  Number of Filter conditions used
                </div>
                <div style={{ fontSize: "14px", marginBottom: "1.563rem" }}>
                  -
                </div>
              </RACTile>

              {isAggregation ? (
                <RACTile
                  profileId={profileId}
                  tileRoute={getPathWithParam({
                    path: MANAGE_MAPPER_ROUTES.AGGREGATE,
                    pathParam: [flow, profileId],
                  })}
                  title="Manage Duplicates"
                >
                  <div>
                    <div style={{ fontSize: "12px", color: "grey" }}>
                      Duplication Strategy used
                    </div>
                    <div style={{ fontSize: "14px" }}>{dupStrategy}</div>
                    <div style={{ fontSize: "12px", color: "grey" }}>
                      Number of fields with custom logics applied
                    </div>
                    <div style={{ fontSize: "14px" }}>{customLogics}</div>
                    <div style={{ fontSize: "12px", color: "grey" }}>
                      Number of key fields used
                    </div>
                    <div style={{ fontSize: "14px" }}>{keyFields}</div>
                  </div>
                </RACTile>
              ) : (
                <RACTile
                  profileId={profileId}
                  tileRoute={getPathWithParam({
                    path: MANAGE_MAPPER_ROUTES.AGGREGATE,
                    pathParam: [flow, profileId],
                  })}
                  title="Manage Duplicates"
                >
                  <div>
                    <div style={{ fontSize: "12px", color: "grey" }}>
                      Duplication Strategy used
                    </div>
                    <div style={{ fontSize: "14px" }}>-</div>
                    <div style={{ fontSize: "12px", color: "grey" }}>
                      Number of fields with custom logics applied
                    </div>
                    <div style={{ fontSize: "14px" }}>-</div>
                    <div style={{ fontSize: "12px", color: "grey" }}>
                      Number of key fields used
                    </div>
                    <div style={{ fontSize: "14px" }}>-</div>
                  </div>
                </RACTile>
              )}

              <RACTile
                profileId={profileId}
                tileRoute={getPathWithParam({
                  path: MANAGE_MAPPER_ROUTES.TARGET,
                  pathParam: [flow, profileId],
                })}
                title="Target"
              >
                <div style={{ fontSize: "12px", color: "grey" }}>
                  Target Type
                </div>
                <div style={{ fontSize: "14px" }}>-</div>
                <div style={{ fontSize: "12px", color: "grey" }}>File Type</div>
                <div style={{ fontSize: "14px" }}>-</div>
                <div style={{ fontSize: "12px", color: "grey" }}>FTP URL</div>
                <div style={{ fontSize: "14px" }}>-</div>
                <div style={{ fontSize: "12px", color: "grey" }}>FTP Path</div>
                <div style={{ fontSize: "14px" }}>-</div>
              </RACTile>

              <RACTile
                profileId={profileId}
                tileRoute={getPathWithParam({
                  path: MANAGE_MAPPER_ROUTES.MAP_AND_TRANSFORM,
                  pathParam: [flow, profileId],
                })}
                title="Map & Transform"
              >
                <div
                  style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}
                >
                  <div>
                    <div style={{ fontSize: "14px" }}>Source Fields</div>
                    <div
                      style={{
                        fontSize: "24px",
                        color: "orange",
                        marginBottom: "1.563rem",
                      }}
                    >
                      {sourceLength}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: "14px" }}>Mapped Fields</div>
                    <div style={{ fontSize: "24px", color: "green" }}>
                      {objectLength}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: "14px" }}>Transformed</div>
                    <div style={{ fontSize: "24px", color: "purple" }}>
                      {countTransforms}
                    </div>
                  </div>
                </div>
              </RACTile>

              <RACTile
                profileId={profileId}
                tileRoute={getPathWithParam({
                  path: MANAGE_MAPPER_ROUTES.RULESET,
                  pathParam: [flow, profileId],
                })}
                title="Ruleset"
              >
                <div style={{ fontSize: "12px", color: "grey" }}>
                  Ruleset Name
                </div>
                <div style={{ fontSize: "14px", marginBottom: "1.563rem" }}>
                  -
                </div>
                <div style={{ fontSize: "12px", color: "grey" }}>
                  Number of Rules Configured
                </div>
                <div style={{ fontSize: "14px" }}>-</div>
              </RACTile>

              <RACTile
                profileId={profileId}
                tileRoute={getPathWithParam({
                  path: MANAGE_MAPPER_ROUTES.SCHEDULER,
                  pathParam: [flow, profileId],
                })}
                title="Schedule"
              >
                <div style={{ fontSize: "12px", color: "grey" }}>
                  Import via
                </div>
                <div style={{ fontSize: "14px", marginBottom: "1.563rem" }}>
                  FTP-
                </div>
                <div style={{ fontSize: "12px", color: "grey" }}>Frequency</div>
                <div style={{ fontSize: "14px" }}>-</div>
              </RACTile>
            </div>
          </ManageMapperLayout>
        );
      }}
    </Formik>
  );
};

export default OverviewContainer;
