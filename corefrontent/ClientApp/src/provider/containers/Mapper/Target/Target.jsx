import React, { useState, useContext } from "react";
import { Field, Formik } from "formik";
import { get, isEmpty } from "lodash";
import { Form } from "react-bootstrap";
import {
  FieldButtonGroup,
  FieldDropSide,
  FieldInput,
  FieldInputPassword,
  FieldInputSSN,
  SearchableList,
  ManageMapperLayout,
} from "../../../components";
import {
  getPathWithParam,
  MANAGE_MAPPER_ROUTES,
  FLOW_TYPES,
  ROUTES,
} from "../../../utils";
import { useRouterParams } from "../../../abstracts";
import {
  manageMapperStore,
  setBasicInformation,
  setManageMapperToastInfo,
  setMapperPageLevelData,
} from "../../../contexts";
import { onSaveTarget } from "../../../services";

const Target = (props) => {
  const initialValues = {
    FileFormat: "",
    FURL: "",
    FPath: "",
    FUserName: "",
    FPassword: "",
  };

  const { flow, profileId } = useRouterParams();
  const { state, dispatch } = useContext(manageMapperStore);
  const isEdit = flow === FLOW_TYPES.EDIT;
  const data = get(state, "api.data", {});

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
      // link: isEdit
      //   ? `${MANAGE_MAPPER_ROUTES.MAP_AND_TRANSFORM}/edit/${profileId}`
      //   : profileId
      //   ? `${MANAGE_MAPPER_ROUTES.MAP_AND_TRANSFORM}/${profileId}`
      //   : `${MANAGE_MAPPER_ROUTES.MAP_AND_TRANSFORM}`,
    },
  ];

  const [requireFTP, setRequireFTP] = useState(true);

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

  const typeOptions = [
    { value: 0, label: "CORE" },
    { value: 1, label: "File" },
  ];

  const DCFormatoptions = [
    { value: 3, label: "DC - Payroll & Census" },
    { value: 2, label: "DC - Payroll" },
    { value: 1, label: "DC - Census" },
  ];

  const FileFormOptions = [
    { value: 0, label: "Excel" },
    { value: 1, label: "CSV" },
    { value: 2, label: "JSON" },
    { value: 3, label: "XML" },
    { value: 4, label: "Fixed Width" },
  ];

  function onSubmit(values) {
    const { history } = props;
    if (!isEdit) {
      onSaveTarget({
        ...data,
        isCOREDCProfile: false,
        uploadedFileType: get(values, "uploadedFileType", 3),
      })
        .then((res) => {
          if (!isEmpty(res)) {
            dispatch(
              setMapperPageLevelData({
                formName: "EditedTargetDataCreate",
                fieldData: {
                  uploadedFileType: get(values, "uploadedFileType", 3),
                },
              })
            );

            history.push(
              `${MANAGE_MAPPER_ROUTES.MAP_AND_TRANSFORM}/${profileId}`
            );
          }
        })
        .catch((err) => err);
    }

    if (isEdit) {
      history.push(
        `${MANAGE_MAPPER_ROUTES.MAP_AND_TRANSFORM}/edit/${profileId}`
      );
    }
  }

  return (
    <Formik
      initialValues={{
        ...initialValues,
        isCOREDCProfile: get(data, "isCOREDCProfile", false)
          ? get(data, "isCOREDCProfile")
          : 0,
        uploadedFileType: !isEmpty(get(state, "EditedTargetDataCreate", []))
          ? get(state, "EditedTargetDataCreate", []).uploadedFileType
          : get(data, "uploadedFileType", 3) !== 0
          ? get(data, "uploadedFileType", 3)
          : 3,
      }}
      enableReinitialize
      onSubmit={onSubmit}
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
          <Form autoComplete="off" className="h-100" onSubmit={handleSubmit}>
            <ManageMapperLayout buttons={buttons}>
              <div>
                <Field
                  name="isCOREDCProfile"
                  label={"Type"}
                  value={values["isCOREDCProfile"]}
                  options={typeOptions}
                  isRequired
                  direction={"bottom"}
                  disabled={isEdit}
                  popupContent={
                    <SearchableList
                      label="Type"
                      isNotTypeAhead
                      options={typeOptions}
                      onSelect={(value) =>
                        setFieldValue("isCOREDCProfile", value)
                      }
                      selectedValue={values["isCOREDCProfile"]}
                    />
                  }
                  component={FieldDropSide}
                />

                {values.isCOREDCProfile === 1 ? (
                  <div>
                    <div
                      style={{
                        width: "20rem",
                        fontSize: "14px",
                        font: "Poppins",
                        fontWeight: "400",
                      }}
                    >
                      <Field
                        name={"DCFormat"}
                        label={"File Format"}
                        value={values["DCFormat"]}
                        options={FileFormOptions}
                        isRequired
                        direction={"bottom"}
                        popupContent={
                          <SearchableList
                            label="File Format"
                            isNotTypeAhead
                            options={FileFormOptions}
                            onSelect={(value) =>
                              setFieldValue("DCFormat", value)
                            }
                            selectedValue={values["DCFormat"]}
                          />
                        }
                        component={FieldDropSide}
                      />
                      <div>
                        <div
                          className="FTPDetailsText"
                          style={{
                            paddingTop: "1.5rem",
                            paddingBottom: "0.5rem",
                          }}
                        >
                          FTP Details
                        </div>

                        <div className="FTPFieldsText">Requires FTP</div>
                        <Field
                          isRequired
                          name="FTP require"
                          size="md"
                          className="bg-transparent p-0"
                          options={yesNoOptions}
                          selectedValue={requireFTP}
                          onChange={(value) => {
                            setRequireFTP(value);
                            values.FURL = "";
                            values.FPath = "";
                            values.FUserName = "";
                            values.FPassword = "";
                          }}
                          component={FieldButtonGroup}
                        />

                        {requireFTP && (
                          <div style={{ width: "20rem", paddingTop: "0.5rem" }}>
                            <Field
                              name="FURL"
                              placeholder={"eg : ftp://yourname@host.dom/"}
                              label={"FTP URL"}
                              noLabelTransform
                              component={FieldInput}
                              isRequired
                            />

                            <Field
                              name="FPath"
                              placeholder={
                                "eg : ftp.yourname@host.dom/batchfile"
                              }
                              label={"FTP path"}
                              noLabelTransform
                              component={FieldInput}
                              isRequired
                            />

                            <Field
                              name="FUserName"
                              placeholder={"Enter UserName"}
                              label={"UserName"}
                              noLabelTransform
                              component={FieldInput}
                              isRequired
                            />
                            <Field
                              name="FPassword"
                              placeholder={"Enter Password"}
                              label={"Password"}
                              noLabelTransform
                              component={FieldInputPassword}
                              isRequired
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <Field
                      name="uploadedFileType"
                      label={"Data Model"}
                      // value={values["uploadedFileType"]}
                      options={DCFormatoptions}
                      isRequired
                      disabled={isEdit}
                      direction={"bottom"}
                      popupContent={
                        <SearchableList
                          isNotTypeAhead
                          options={DCFormatoptions}
                          onSelect={(value) =>
                            setFieldValue("uploadedFileType", value)
                          }
                          selectedValue={values["uploadedFileType"]}
                        />
                      }
                      component={FieldDropSide}
                    />
                  </div>
                )}

                {/* <pre>{JSON.stringify(values, null, 2)}</pre> */}
              </div>
            </ManageMapperLayout>
          </Form>
        );
      }}
    </Formik>
  );
};

export default Target;
