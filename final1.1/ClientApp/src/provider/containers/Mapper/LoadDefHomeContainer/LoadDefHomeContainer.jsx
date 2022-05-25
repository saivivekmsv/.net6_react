import React, { useContext, useEffect, useState } from "react";
import { useRouterParams } from "../../../abstracts";
import {
  FieldInput,
  ManageMapperLayout,
  Select,
  FieldDropSide,
  SearchableList,
} from "../../../components";
import { Form } from "react-bootstrap";
import { Field, Formik, ErrorMessage } from "formik";
import { Card } from "react-bootstrap";
import ManageAddPlanButton from "./ManageAddPlanButton";
import {
  manageMapperStore,
  setBasicInformation,
  setManageMapperToastInfo,
} from "../../../contexts";
import { get, isEmpty } from "lodash-es";
import { onProfileNameChange, checkProfileNameExists } from "../../../services";
import {
  getPathWithParam,
  MANAGE_MAPPER_ROUTES,
  manageMapperFormNames,
  mapperFormFields,
  FLOW_TYPES,
  ROUTES,
} from "../../../utils";
import * as Yup from "yup";

const initialValues = {};

const typeOptions = [
  { value: 0, label: "Input Map" },
  { value: 1, label: "Output Map" },
];

const LoadDefHomeContainer = (props) => {
  const { flow, profileId } = useRouterParams();
  const formNameSource = manageMapperFormNames.SOURCE;

  const { state, dispatch } = useContext(manageMapperStore);

  const isEdit = flow === FLOW_TYPES.EDIT;
  const formName = manageMapperFormNames.BASIC_INFORMATION;
  const fields = mapperFormFields[formName];
  const mapName = get(state, "api.data.name", "");
  const planProfiles = get(state, "api.data.planProfiles", []);
  const [savedPlans, setSavedPlans] = useState([]);

  useEffect(() => {
    if (!isEmpty(planProfiles)) {
      setSavedPlans(planProfiles);
    }
  }, [planProfiles, isEdit]);

  const style = {
    dropdownIndicator: (provided) => ({
      ...provided,
      svg: {
        fill: "black",
      },
    }),
    menu: (base) => ({
      ...base,
      zIndex: 100,
    }),
  };
  const [nameExists, setNameExists] = useState("");

  const ValidationSchema = Yup.object().shape({
    name: Yup.string()
      .required("Required : Profile Name")
      .max(100, "Must be less than 100 character"),
    // .test(
    //   "name",
    //   "Map name already exists",
    //   (val) => ifNameExists(val)
    // ),
  });

  const ifNameExists = (val) => {
    const idName = 0;
    checkProfileNameExists(idName, val)
      .then((response) => {
        setNameExists(response);

        return response;
      })
      .catch((err) => {
        alert("api error");
      });
  };

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
      //link: isEdit ? `${MANAGE_MAPPER_ROUTES.SOURCE}/edit/${profileId}`: `${MANAGE_MAPPER_ROUTES.SOURCE}/${profileId}`
      //onClick: SaveProfileNameChanges,
    },
  ];
  const [errorMsg, setErrorMsg] = useState("");

  const onFormSubmit = (
    values,
    { setSubmitting, setFieldError, setFieldTouched }
  ) => {
    const { history } = props;
    setSubmitting(true);
    const data = get(state, "api.data", {});
    const idName = 0;
    checkProfileNameExists(idName, values[fields.mapName])
      .then((response) => {
        setNameExists(response);
        if (response && !isEdit) {
          setErrorMsg("Map name already exists");
        } else if (
          isEdit &&
          response &&
          values[fields.mapName] !== get(state, "api.data.name", "")
        ) {
          setErrorMsg("Map name already exists");
        } else {
          setErrorMsg("");
          if (
            !isEmpty(data) &&
            values[fields.mapName] !== get(state, "api.data.name", "")
          ) {
            onProfileNameChange({ ...data, name: get(values, "name") })
              .then((res) => {
                if (!res.isSuccessful) {
                  for (var i = 0; i < res.errorMessages.length; i++) {
                    var _ = res.errorMessages[i];
                    setFieldTouched(_.controlName, true);
                    setFieldError(
                      _.controlName,
                      `${_.errorCode} : ${_.message}`
                    );
                  }
                }
                if (!isEmpty(res) && res.isSuccessful) {
                  dispatch(
                    setManageMapperToastInfo({
                      showToast: true,
                      toastMessage: `Update Profile Name Succesfull`,
                    })
                  );
                  history.push(
                    getPathWithParam({
                      path: MANAGE_MAPPER_ROUTES.SOURCE,
                      pathParam: [flow, profileId],
                    })
                  );
                }
              })
              .catch((err) => {
                console.log("1234err", err);
              });
          }
          // if (!isEmpty(values[fields.mapName]) && !isEdit) {
          if (!isEmpty(values[fields.mapName])) {
            const plans = savedPlans.map((e) => e.planId.toString());
            !isEmpty(plans)
              ? dispatch(
                  setBasicInformation({ ...values, planProfileMappings: plans })
                )
              : dispatch(setBasicInformation({ ...values }));
            history.push(
              getPathWithParam({
                path: MANAGE_MAPPER_ROUTES.SOURCE,
                pathParam: [flow, profileId],
              })
            );
          }
          if (isEdit) {
            history.push(
              getPathWithParam({
                path: MANAGE_MAPPER_ROUTES.SOURCE,
                pathParam: [flow, profileId],
              })
            );
          }
        }
      })
      .catch((err) => {
        // alert("api error");
        console.log("api error");
      });
  };

  return (
    <Formik
      initialValues={{
        ...initialValues,
        [fields.mapName]: !isEmpty(get(state, "basicInformation", []))
          ? state.basicInformation.name
          : !isEmpty(mapName)
          ? mapName
          : "",
        [fields.mapType]: 0,
      }}
      enableReinitialize
      onSubmit={onFormSubmit}
      validationSchema={ValidationSchema}
      validateOnChange={false}
      validateOnBlur={false}
    >
      {({
        errors,
        values,
        touched,
        setValues,
        handleChange,
        setFieldValue,
        handleSubmit,
      }) => {
        return (
          <Form
            autoComplete="off"
            className="h-100"
            onSubmit={handleSubmit}
            validated={!isEmpty(errors)}
          >
            <ManageMapperLayout buttons={buttons} planProfiles={planProfiles}>
              <div>
                <Field
                  type="text"
                  name={fields.mapName}
                  placeholder={"Enter the Map name"}
                  label={"Map Name"}
                  component={FieldInput}
                  disabled={isEdit || !isEmpty(get(state, formNameSource, []))}
                  isRequired
                  // validate={(value)=>ifNameExists(value)}
                />
                <div
                  style={{
                    fontSize: "0.75rem",
                    marginTop: "-0.75rem",
                    paddingTop: "0rem",
                    // border:"1px solid blue",
                    color: "#ff5050",
                    // height:"1rem"
                  }}
                >
                  {errorMsg}
                </div>
              </div>

              <div
                style={{
                  width: "20rem",
                  fontSize: "12px",
                  font: "Poppins",
                  fontWeight: "400",
                  paddingBottom: "1rem",
                  paddingTop: "1rem",
                  // border:"1px solid pink"
                }}
              >
                <Field
                  name={fields.mapType}
                  label={"Map Type"}
                  value={values[fields.mapType]}
                  options={typeOptions}
                  isRequired
                  direction={"bottom"}
                  disabled={isEdit || !isEmpty(get(state, formNameSource, []))}
                  popupContent={
                    <SearchableList
                      label="Map Type"
                      isNotTypeAhead
                      options={typeOptions}
                      onSelect={(value) => setFieldValue(fields.mapType, value)}
                      selectedValue={values[fields.mapType]}
                    />
                  }
                  component={FieldDropSide}
                />
              </div>
              {/* <pre>{JSON.stringify(nameExists, null, 2)}</pre> */}
              <div>
                <div style={{ fontWeight: "400", marginBottom: "1rem" }}>
                  Associate Plans
                </div>
                <Card className="PlansAssociatedCard">
                  <div style={{ fontSize: "16px", fontWeight: "400" }}>
                    Plans Associated
                  </div>
                  <div>
                    {/* <div className="NumOfPlans" id="NumberOfPlansAdded"> */}
                    {/* {!isEmpty(savedPlans) && savedPlans.length } */}
                    {isEmpty(savedPlans) ? (
                      <div className="NumOfPlans" id="NumberOfPlansAdded">
                        0
                      </div>
                    ) : (
                      <div className="NumOfPlans" id="NumberOfPlansAdded">
                        {savedPlans.length}
                      </div>
                    )}

                    <div style={{ display: "flex", marginTop: "0px" }}>
                      <div
                        className="AddedPlansText"
                        style={{ marginTop: "10px", width: "100px" }}
                      >
                        Added Plans
                      </div>
                      {!isEdit ? (
                        <ManageAddPlanButton
                          savedPlans={savedPlans}
                          setSavedPlans={setSavedPlans}
                          planProfiles={planProfiles}
                          dispatch={dispatch}
                          mappingConfigurationId={profileId}
                          isEdit={isEdit}
                        />
                      ) : (
                        <ManageAddPlanButton
                          savedPlans={savedPlans}
                          setSavedPlans={setSavedPlans}
                          planProfiles={planProfiles}
                          dispatch={dispatch}
                          mappingConfigurationId={get(state, "api.data.id")}
                          isEdit={isEdit}
                        />
                      )}
                    </div>
                  </div>
                </Card>
              </div>
            </ManageMapperLayout>
          </Form>
        );
      }}
    </Formik>
  );
};

export default LoadDefHomeContainer;
