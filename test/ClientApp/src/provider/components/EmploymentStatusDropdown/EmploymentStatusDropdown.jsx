import { find, get, isEmpty, toLower } from "lodash";
import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { Field, Formik } from "formik";
import * as Yup from "yup";
import { SearchableList, LoaderWrapper } from "../";
import { useDeepEffect, useRequest } from "../../abstracts";
import {
  addMasterEmploymentStatus,
  getMasterEmploymentStatuses,
} from "../../services";
import { FieldInput } from "../../components";
import { errors, tranformListToDropdownValues } from "../../utils";

const EmploymentStatusDropdown = ({
  data,
  onSelect,
  companyId,
  setData,
  value,
}) => {
  const [newEmploymentStatus, setNewEmploymentStatus] = useState();
  const [request, setRequest] = useState({
    method: getMasterEmploymentStatuses,
    payload: companyId,
    stopTrigger: !isEmpty(data),
  });
  const { response, loading } = useRequest(request);

  const schema = Yup.object().shape({
    newEmploymentStatusType: Yup.string()
      .required(errors.masterEmploymentStatus.required)
      .max(50, errors.masterEmploymentStatus.length)
      .test(
        "newEmploymentStatusType",
        errors.masterEmploymentStatus.characters,
        (val) => !checkSplChar(val)
      )
      .test(
        "newEmploymentStatusType",
        errors.masterEmploymentStatus.alreadyExist,
        (val) => !alreadyExist(val)
      ),
  });

  const checkSplChar = (val) => {
    const format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    if (format.test(val) === true) return true;
    else return false;
  };
  const alreadyExist = (val) => {
    const temp = data.map((item) => {
      if (toLower(item.label) === toLower(val)) return true;
      else return false;
    });
    return temp.includes(true);
  };

  useDeepEffect(
    () => {
      if (!loading) {
        if (newEmploymentStatus) {
          const filteredValue = find(
            response,
            (item) => toLower(item.name) === toLower(newEmploymentStatus)
          );
          onSelect(
            get(filteredValue, "id", ""),
            get(filteredValue, "name", "")
          );
        }
        setData(tranformListToDropdownValues(response || [], "name", "id"));
      }
    },
    [loading],
    true
  );
  const keyDown = (e) => {
    if (e.keyCode == 32) {
      e.preventDefault();
      e.target.value += " ";
    }
  };
  const onFormSubmit = (values) => {
    setNewEmploymentStatus(values["newEmploymentStatusType"]);
    setRequest({
      ...request,
      stopTrigger: false,
      method: addMasterEmploymentStatus,
      payload: {
        name: values["newEmploymentStatusType"],
        id: companyId,
      },
    });
  };

  return (
    <>
      <LoaderWrapper isLoading={loading} loaderText="">
        <Formik
          initialValues={{ newEmploymentStatusType: "" }}
          validationSchema={schema}
          validateOnChange={false}
          validateOnBlur={false}
          onSubmit={onFormSubmit}
        >
          {({ handleChange, handleSubmit, values }) => {
            return (
              <>
                <div className="dropdside-custom-dropdown">
                  <div>
                    <SearchableList
                      label="Select an Employment Status or create a new one"
                      options={data}
                      onSelect={onSelect}
                      selectedValue={value}
                    />
                  </div>
                  <div className="line-separator"></div>
                  <Form autoComplete="off" onSubmit={handleSubmit}>
                    <Field
                      label="Add a new Employment Status type :"
                      name={"newEmploymentStatusType"}
                      type="text"
                      value={values["newEmploymentStatusType"]}
                      onChange={handleChange}
                      autoComplete="nope"
                      component={FieldInput}
                      placeholder={"Employee status"}
                      onKeyDown={keyDown}
                    />
                    <Form.Group>
                      <Button type="submit">Add</Button>
                    </Form.Group>
                  </Form>
                </div>
              </>
            );
          }}
        </Formik>
      </LoaderWrapper>
    </>
  );
};

export default EmploymentStatusDropdown;
