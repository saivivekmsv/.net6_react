import React, { useState, useContext, useEffect } from "react";
import {
  ManageMapperLayout,
  FieldButtonGroup,
  NotificationPopUp,
} from "../../../components";
import CategorySelectionContainer from "./CategorySelectionContainer";
import { Form } from "react-bootstrap";
import { Formik, Field } from "formik";
import SelectFields from "./SelectFields";
import sampleData from "./sampleData";
import AggregateKeys from "./AggregateKeys";
import { isEmpty, get, isNull } from "lodash";
import {
  getPathWithParam,
  MANAGE_MAPPER_ROUTES,
  FLOW_TYPES,
  ROUTES,
} from "../../../utils";
import { useRouterParams } from "../../../abstracts";
import {
  manageMapperStore,
  setManageMapperToastInfo,
  setMapperPageLevelData,
  setManageMapperPageLevelData,
  setManageMapperFlow,
} from "../../../contexts";
import { onAggregateSave } from "../../../services";
import { faLessThan } from "@fortawesome/pro-light-svg-icons";
// import "./loadDef.css";

const initialValues = {};

const AggregateContainer = (props) => {
  // Getting the data from DB using the API
  const { state, dispatch } = useContext(manageMapperStore);
  const { flow, profileId } = useRouterParams();
  const isEdit = flow === FLOW_TYPES.EDIT;
  const data = get(state, "api.data", []);
  const AggregateData =
    isEdit &&
    !isEmpty(get(state, "EditedAggregateData", [])) &&
    get(state, "EditedAggregateData", []);

  const AggregateDataCreate =
    !isEdit &&
    !isEmpty(get(state, "EditedAggregateDataCreate", [])) &&
    get(state, "EditedAggregateDataCreate", []);

  const aggregateValues =
    !isEmpty(get(data, "aggregationModelJson", {})) &&
    JSON.parse(get(data, "aggregationModelJson", {}));

  const DetermineAggregateInitial = () => {
    if (isEdit) {
      if (isEmpty(get(state, "EditedAggregateData", []))) {
        const InitialData = {
          isAggregationModel: get(data, "isAggregationModel", false),
          aggregationStrategy: get(aggregateValues, "aggregationStrategy", "1"),
          aggregationEntites: get(aggregateValues, "aggregationEntites", []),
          aggregationOperationEntities: get(
            aggregateValues,
            "aggregationOperationEntities",
            []
          ),
        };
        return InitialData;
      }
      {
        const InitialData = {
          isAggregationModel: get(AggregateData, "isAggregationModel", false),
          aggregationStrategy: get(
            AggregateData,
            "aggregationModelJson.aggregationStrategy",
            "1"
          ),
          aggregationEntites: get(
            AggregateData,
            "aggregationModelJson.aggregationEntites",
            []
          ),
          aggregationOperationEntities: get(
            AggregateData,
            "aggregationModelJson.aggregationOperationEntities",
            []
          ),
        };
        return InitialData;
      }
    } else {
      if (isEmpty(get(state, "EditedAggregateDataCreate", []))) {
        const InitialData = {
          isAggregationModel: get(data, "isAggregationModel", false),
          aggregationStrategy: get(aggregateValues, "aggregationStrategy", "1"),
          aggregationEntites: get(aggregateValues, "aggregationEntites", []),
          aggregationOperationEntities: get(
            aggregateValues,
            "aggregationOperationEntities",
            []
          ),
        };
        return InitialData;
      }
      {
        const InitialData = {
          isAggregationModel: get(
            AggregateDataCreate,
            "isAggregationModel",
            false
          ),
          aggregationStrategy: get(
            AggregateDataCreate,
            "aggregationModelJson.aggregationStrategy",
            "1"
          ),
          aggregationEntites: get(
            AggregateDataCreate,
            "aggregationModelJson.aggregationEntites",
            []
          ),
          aggregationOperationEntities: get(
            AggregateDataCreate,
            "aggregationModelJson.aggregationOperationEntities",
            []
          ),
        };
        return InitialData;
      }
    }
  };

  let AggregateInitialLoadingData = DetermineAggregateInitial();

  // Getting the data from DB using the API
  const [characters, setCharacters] = useState([]);

  const fieldHeadersJson = get(state, "api.data.headerMapJson");
  useEffect(() => {
    setCharacters(
      JSON.parse(fieldHeadersJson) &&
        JSON.parse(fieldHeadersJson).map((item) => {
          return {
            ...item,
            path: item.fieldName,
          };
        })
    );
  }, [fieldHeadersJson]);

  const yesNoOptions = [
    {
      label: "Yes",
      value: true,
    },
    {
      label: "No",
      value: false,
    },
  ];
  const [selectFields, setselectFields] = useState(false);

  const buttons = [
    {
      label: "Cancel",
      variant: "secondary",
      type: "button",
      link: ROUTES.MAPPER_HOME,
    },
    {
      label: "Next",
      variant: "primary",
      type: "submit",
      onclick: onSubmit,
    },
  ];

  const [isToast, setToast] = useState(false);

  const onSubmit = (values) => {
    const aggregateTrue = get(values, "isAggregationModel");
    const aggregateInfo = get(values, "aggregationEntites", []);
    if (aggregateTrue && isEmpty(aggregateInfo)) {
      setShow(true);
    } else {
      setShow(false);
    }
    const { history } = props;
    const aggregrateModel =
      get(values, "aggregationStrategy") == "1" ||
      get(values, "aggregationStrategy") == "2"
        ? {
            aggregationEntites: get(values, "aggregationEntites", []),
            aggregationOperationEntities: [],
            aggregationStrategy: get(values, "aggregationStrategy"),
          }
        : {
            aggregationEntites: get(values, "aggregationEntites", []),
            aggregationOperationEntities: get(
              values,
              "aggregationOperationEntities",
              []
            ),
            aggregationStrategy: get(values, "aggregationStrategy"),
          };
    let aggregateModelValue = null;
    if (get(values, "isAggregationModel", false)) {
      aggregateModelValue = JSON.stringify(aggregrateModel);
    }
    if (aggregateModelValue == null) {
      aggregrateModel.aggregationEntites = [];
      aggregrateModel.aggregationOperationEntities = [];
      aggregrateModel.aggregationStrategy = 1;
      aggregateModelValue = JSON.stringify(aggregrateModel);
    }

    const AggregateUpdateData = {
      isAggregationModel: get(values, "isAggregationModel"),
      aggregationModelJson: aggregrateModel,
    };

    onAggregateSave({
      ...data,
      isAggregationModel: get(values, "isAggregationModel"),
      aggregationModelJson: aggregateModelValue,
    }).then((res) => {
      if (!isEmpty(res)) {
        if (isEdit) {
          history.push(
            getPathWithParam({
              path: MANAGE_MAPPER_ROUTES.TARGET,
              pathParam: [FLOW_TYPES.EDIT, profileId],
            })
          );
          dispatch(
            setMapperPageLevelData({
              formName: "EditedAggregateData",
              fieldData: AggregateUpdateData,
            })
          );
          dispatch(
            setManageMapperToastInfo({
              showToast: true,
              toastMessage: `Aggregate Save Succesfull`,
            })
          );
        } else {
          history.push(
            getPathWithParam({
              path: MANAGE_MAPPER_ROUTES.TARGET,
              pathParam: [profileId],
            })
          );
          dispatch(
            setMapperPageLevelData({
              formName: "EditedAggregateDataCreate",
              fieldData: AggregateUpdateData,
            })
          );
          dispatch(
            setManageMapperToastInfo({
              showToast: true,
              toastMessage: `Aggregate Save Succesfull`,
            })
          );
        }
        // history.push(`${MANAGE_MAPPER_ROUTES.TARGET}/${profileId}`);
      }
    });
  };

  const onClickOk = () => {
    setShow(false);
  };

  const [show, setShow] = useState(false);

  return (
    <Formik
      initialValues={{
        ...initialValues,
        isAggregationModel: AggregateInitialLoadingData.isAggregationModel,
        aggregationStrategy: AggregateInitialLoadingData.aggregationStrategy,
        aggregationEntites: AggregateInitialLoadingData.aggregationEntites,
        aggregationOperationEntities:
          AggregateInitialLoadingData.aggregationOperationEntities,
      }}
      enableReinitialize
      validateOnChange={false}
      validateOnBlur={false}
      onSubmit={onSubmit}
    >
      {(formProps) => {
        const {
          handleChange,
          setFieldValue,
          handleSubmit,
          setValues,
          setTouched,
          values,
          setSubmitting,
          ...rest
        } = formProps;
        return (
          <Form autoComplete="off" className="h-100" onSubmit={handleSubmit}>
            <ManageMapperLayout buttons={buttons}>
              {show && (
                <NotificationPopUp
                  msg={"Please add the fields to aggregate"}
                  onClickOk={onClickOk}
                />
              )}
              <div
                style={{
                  display: "block",
                  font: "Poppins",
                  fontSize: "18px",
                  fontWeight: "500",
                  alignItems: "center",
                  paddingBottom: "0",
                }}
              >
                <div
                  style={{
                    paddingBottom: "0.5rem",
                    color: "#494F5A",
                    fontSize: "18px",
                    fontWeight: "550",
                  }}
                >
                  Apply Aggregate
                </div>
                <div style={{ display: "flex" }}>
                  <Field
                    isRequired
                    name="isAggregationModel"
                    size="md"
                    className="bg-transparent p-0"
                    options={yesNoOptions}
                    selectedValue={values["isAggregationModel"]}
                    onChange={(value) => {
                      setFieldValue("isAggregationModel", value);
                    }}
                    component={FieldButtonGroup}
                  />
                </div>
              </div>

              {values["isAggregationModel"] ? (
                <div className="load-container">
                  <AggregateKeys
                    setselectFields={setselectFields}
                    values={values}
                    setValues={setValues}
                  />
                  <CategorySelectionContainer
                    fields={characters}
                    values={values}
                    setValues={setValues}
                    setFieldValue={setFieldValue}
                  />
                  <div
                    id="fade-in-aggcontainer"
                    className={
                      "border rounded px-3 bg-white " +
                      (() => (selectFields ? "show" : "box"))()
                    }
                  >
                    <SelectFields
                      setselectFields={setselectFields}
                      selectFields={selectFields}
                      fields={characters}
                      values={values}
                      setValues={setValues}
                      setFieldValue={setFieldValue}
                    />
                  </div>
                </div>
              ) : (
                <div className="FilterUnavailable"> Aggregate not applied</div>
              )}
            </ManageMapperLayout>
          </Form>
        );
      }}
    </Formik>
  );
};

export default AggregateContainer;
