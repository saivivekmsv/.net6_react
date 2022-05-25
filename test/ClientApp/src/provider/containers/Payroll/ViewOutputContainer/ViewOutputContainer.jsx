import React, { useState, useContext, useEffect, useCallback } from "react";
import { isEmpty, get, isNull } from "lodash";
import SourceContainer from "./SourceContainer";
import { Container, Row, Col } from "react-bootstrap";
import { Field, Formik, ErrorMessage } from "formik";
import TargetContainer from "./TargetContainer";

import SampleData from "./SampleData";

function ViewOutputContainer(props) {
  const buttons = [
    {
      label: "Cancel",
      variant: "secondary",
      type: "button",
    },
    {
      label: "Next",
      variant: "primary",
      type: "submit",
      //   onClick: SaveMapping,
    },
  ];

  const [selectedFields, setselectedFields] = useState([]);
  const [FilterConditionFields, setFilterConditionFields] = useState(
    SampleData
  );

  return (
    <Formik
      initialValues={{}}
      enableReinitialize
      onSubmit={() => {}}
      // validationSchema={ValidationSchema}
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
          <Container className="mapper-container mt-4">
            <SourceContainer
              fields={FilterConditionFields}
              setfields={setFilterConditionFields}
              selectedFields={selectedFields}
              setselectedFields={setselectedFields}
            />
            <TargetContainer
              selectedFields={selectedFields}
              setselectedFields={setselectedFields}
            />
          </Container>
        );
      }}
    </Formik>
  );
}

export default ViewOutputContainer;
