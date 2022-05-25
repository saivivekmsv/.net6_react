import { find, get, isEmpty, toLower } from "lodash";
import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { Field, Formik } from "formik";
import * as Yup from "yup";
import { SearchableList, LoaderWrapper } from "../";
import { useDeepEffect, useRequest } from "../../abstracts";
import {
  getPlanSponsoringOrganisationList,
  postPlanSponsoringOrganisationList,
} from "../../services";
import { errors } from "../../utils";
import { FieldInput } from "../../components";

const SponsoringOrgDropdown = ({ data, onSelect, refreshData }) => {
  const [newSponsoringOrg, setNewSponsoringOrg] = useState();
  const [request, setRequest] = useState({
    method: getPlanSponsoringOrganisationList,
    stopTrigger: !isEmpty(data),
  });
  const { response, loading } = useRequest(request);

  const schema = Yup.object().shape({
    newSponsoringOrg: Yup.string()
      .required(errors.sponsoringOrganizationId.required)
      .max(50, errors.sponsoringOrganizationId.lengthExceeded)
      // .test(
      //   "newSponsoringOrg",
      //   errors.sponsoringOrganizationId.characters,
      //   (val) => !checkSplChar(val)
      // )
      .test(
        "newSponsoringOrg",
        errors.sponsoringOrganizationId.alreadyExist,
        (val) => !alreadyExist(val)
      ),
  });

  // const checkSplChar = (val) => {
  //   const format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
  //   if (format.test(val) === true) return true;
  //   else return false;
  // };

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
        if (newSponsoringOrg) {
          const filteredValue = find(
            response,
            (item) => toLower(item.name) === toLower(newSponsoringOrg)
          );
          onSelect(
            get(filteredValue, "id", ""),
            get(filteredValue, "name", "")
          );
        }
        refreshData(response);
        // setNewSponsoringOrg("");
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
    setNewSponsoringOrg(values["newSponsoringOrg"]);
    setRequest({
      ...request,
      stopTrigger: false,
      method: postPlanSponsoringOrganisationList,
      payload: {
        name: values["newSponsoringOrg"],
        id: 0,
      },
    });
  };

  return (
    <>
      <LoaderWrapper
        isLoading={loading}
        loaderText=""
        className="dropdside-custom-dropdown sponsoringorg-dropdown flex-column"
      >
        <Formik
          initialValues={{ newSponsoringOrg: "" }}
          validationSchema={schema}
          validateOnChange={false}
          validateOnBlur={false}
          onSubmit={onFormSubmit}
        >
          {({ handleChange, handleSubmit, values }) => {
            return (
              <>
                <div>
                  <SearchableList
                    label="Select an Sponsoring Organisation"
                    options={data}
                    onSelect={onSelect}
                  />
                </div>
                <div className="line-separator"></div>
                <Form autoComplete="off" onSubmit={handleSubmit}>
                  <Field
                    label="Add a new Sponsoring Organisation"
                    name={"newSponsoringOrg"}
                    type="text"
                    value={values["newSponsoringOrg"]}
                    onChange={handleChange}
                    autoComplete="nope"
                    component={FieldInput}
                    placeholder={"Sponsoring Organisation"}
                    onKeyDown={keyDown}
                  />
                  <Form.Group>
                    <Button type="submit">Add</Button>
                  </Form.Group>
                </Form>
              </>
            );
          }}
        </Formik>
      </LoaderWrapper>
    </>
  );
};

export default SponsoringOrgDropdown;
