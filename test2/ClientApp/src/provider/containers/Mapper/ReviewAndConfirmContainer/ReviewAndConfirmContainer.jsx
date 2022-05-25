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

const ReviewAndConfirmContainer = (props) => {
  const { history } = props;
  const initialValues = {
    cloneProfileName: "",
  };
  const { state, dispatch } = useContext(manageMapperStore);
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
    // onUpdateStatus({ ...data, isActive: isActive })
    //   .then((res) => {
    //     if (!isEmpty(res)) {
    //       history.push(`${ROUTES.MAPPER_HOME}`);
    //     }
    //   })
    //   .catch((err) => err);

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
          <ManageMapperLayout
            buttons={buttons}
            layoutHeader={"Review & Confirm"}
          >
            {/* <pre>{JSON.stringify(configJson, null, 2)}</pre> */}

            <div
              // style={{ marginTop: "3.125rem" }}
              className="mapper-raccontainer-grid2"
            >
              <RACTile
                profileId={profileId}
                tileRoute={`${MANAGE_MAPPER_ROUTES.SOURCE}`}
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
                <div style={{ fontSize: "12px" }}>{hasHeader}</div>
                <div style={{ fontSize: "14px" }}>{data.fileName}</div>
              </RACTile>

              <RACTile
                profileId={profileId}
                tileRoute={`${MANAGE_MAPPER_ROUTES.BASIC_INFORMATION}`}
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
                tileRoute={`${MANAGE_MAPPER_ROUTES.FILTER}`}
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
                  tileRoute={`${MANAGE_MAPPER_ROUTES.AGGREGATE}`}
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
                  tileRoute={`${MANAGE_MAPPER_ROUTES.AGGREGATE}`}
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
                tileRoute={`${MANAGE_MAPPER_ROUTES.TARGET}`}
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
                tileRoute={`${MANAGE_MAPPER_ROUTES.MAP_AND_TRANSFORM}`}
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
                tileRoute={`${MANAGE_MAPPER_ROUTES.RULESET}`}
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
                tileRoute={`${MANAGE_MAPPER_ROUTES.SCHEDULER}`}
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

export default ReviewAndConfirmContainer;
