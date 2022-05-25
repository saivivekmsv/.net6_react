import React from "react";
import { Formik } from "formik";
import { Form } from "react-bootstrap";
import { ManageMapperLayout } from "../../../components";
import { ROUTES } from "../../../utils";

const FixedLengthContainer = () => {
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
    },
  ];
  return (
    <Formik>
      {({ values, setValues, handleChange, setFieldValue, handleSubmit }) => {
        return (
          <Form>
            <ManageMapperLayout
              buttons={buttons}
              layoutHeader="File Specification"
            ></ManageMapperLayout>
          </Form>
        );
      }}
    </Formik>
  );
};

export default FixedLengthContainer;
