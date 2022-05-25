import React, { useState, useContext, useEffect, useCallback } from "react";
import { LoaderWrapper, ManageMapperLayout } from "../../../../components";
import { isEmpty, get, isNull } from "lodash";
import SourceContainer from "./SourceContainer";
import { Container, Row, Col } from "react-bootstrap";
import { manageMapperStore, setMapperMappingData } from "../../../../contexts";
import { Field, Formik, ErrorMessage } from "formik";
import { DataType } from "../../../../utils";
import TargetContainer from "./TargetContainer";

import SampleData from "../../MapperHomeContainer/SampleData";

function MapAndTransformF2F(props) {
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
  const columns = {
    source: {
      id: "source-container",
      title: "sorce",
      data: SampleData,
    },
  };

  const { state, dispatch } = useContext(manageMapperStore);
  const data = get(state, "api.data", []);
  const fieldHeadersJson = get(data, "headerMapJson", []);
  console.log("fieldHeadersJson121", fieldHeadersJson);
  const [characters, setCharacters] = useState([]);
  const [ct, setCT] = useState([]);
  const [selectedFields, setselectedFields] = useState([]);
  console.log("conf trans", ct);

  const setFieldOperations = (dataSource, operations, itemConfigures) => {
    const itemConfigure = itemConfigures.object;

    console.log("itemConfigure", itemConfigure);
    const transformations =
      !isEmpty(ct) && ct.length > 1
        ? !isEmpty(ct.find((e) => e.field == itemConfigure.field))
          ? ct.map((e, i) => {
              if (e.field == itemConfigure.field) {
                return {
                  id: e.id,
                  field: e.field,
                  isCollection: e.isCollection,
                  isCollectionStart: e.isCollectionStart,
                  isCollectionEnd: e.isCollectionEnd,
                  groupName: e.groupName,
                  displayName: e.displayName,
                  propertyName: e.propertyName,
                  dataType: e.dataType,
                  format: e.format,
                  fieldLength: e.fieldLength,
                  isRequired: e.isRequired,
                  childObjectMaps: e.childObjectMaps,
                  fieldOperations: operations,
                  isComplex: e.isComplex,
                  mappingConfigurationId: get(state, "api.data.id", 0),
                  parent: e.parent,
                  parentId: e.parentId,
                  path: e.path,
                  sortOrder: e.sortOrder,
                  index: e.index,
                  constantValue: e.constantValue,
                  dataSource: dataSource,
                };
              }
              return e;
            })
          : [
              ...ct,
              {
                id: itemConfigure.id,
                field: itemConfigure.field,
                isCollection: itemConfigure.isCollection,
                isCollectionStart: itemConfigure.isCollectionStart,
                isCollectionEnd: itemConfigure.isCollectionEnd,
                groupName: itemConfigure.groupName,
                displayName: itemConfigure.displayName,
                propertyName: itemConfigure.propertyName,
                dataType: itemConfigure.dataType,
                format: itemConfigure.format,
                fieldLength: itemConfigure.fieldLength,
                isRequired: itemConfigure.isRequired,
                childObjectMaps: itemConfigure.childObjectMaps,
                fieldOperations: operations,
                isComplex: itemConfigure.isComplex,
                mappingConfigurationId: get(state, "api.data.id", 0),
                parent: itemConfigure.parent,
                parentId: itemConfigure.parentId,
                path: itemConfigure.path,
                sortOrder: itemConfigure.sortOrder,
                index: itemConfigure.index,
                constantValue: itemConfigure.constantValue,
                dataSource: dataSource,
              },
            ]
        : isEmpty(ct)
        ? {
            id: itemConfigure.id,
            field: itemConfigure.field,
            isCollection: itemConfigure.isCollection,
            isCollectionStart: itemConfigure.isCollectionStart,
            isCollectionEnd: itemConfigure.isCollectionEnd,
            groupName: itemConfigure.groupName,
            displayName: itemConfigure.displayName,
            propertyName: itemConfigure.propertyName,
            dataType: itemConfigure.dataType,
            format: itemConfigure.format,
            fieldLength: itemConfigure.fieldLength,
            isRequired: itemConfigure.isRequired,
            childObjectMaps: itemConfigure.childObjectMaps,
            fieldOperations: operations,
            isComplex: itemConfigure.isComplex,
            mappingConfigurationId: get(state, "api.data.id", 0),
            parent: itemConfigure.parent,
            parentId: itemConfigure.parentId,
            path: itemConfigure.path,
            sortOrder: itemConfigure.sortOrder,
            index: itemConfigure.index,
            constantValue: itemConfigure.constantValue,
            dataSource: dataSource,
          }
        : ct.field == itemConfigure.field
        ? {
            id: itemConfigure.id,
            field: itemConfigure.field,
            isCollection: itemConfigure.isCollection,
            isCollectionStart: itemConfigure.isCollectionStart,
            isCollectionEnd: itemConfigure.isCollectionEnd,
            groupName: itemConfigure.groupName,
            displayName: itemConfigure.displayName,
            propertyName: itemConfigure.propertyName,
            dataType: itemConfigure.dataType,
            format: itemConfigure.format,
            fieldLength: itemConfigure.fieldLength,
            isRequired: itemConfigure.isRequired,
            childObjectMaps: itemConfigure.childObjectMaps,
            fieldOperations: operations,
            isComplex: itemConfigure.isComplex,
            mappingConfigurationId: get(state, "api.data.id", 0),
            parent: itemConfigure.parent,
            parentId: itemConfigure.parentId,
            path: itemConfigure.path,
            sortOrder: itemConfigure.sortOrder,
            index: itemConfigure.index,
            constantValue: itemConfigure.constantValue,
            dataSource: dataSource,
          }
        : [
            ct,
            {
              id: itemConfigure.id,
              field: itemConfigure.field,
              isCollection: itemConfigure.isCollection,
              isCollectionStart: itemConfigure.isCollectionStart,
              isCollectionEnd: itemConfigure.isCollectionEnd,
              groupName: itemConfigure.groupName,
              displayName: itemConfigure.displayName,
              propertyName: itemConfigure.propertyName,
              dataType: itemConfigure.dataType,
              format: itemConfigure.format,
              fieldLength: itemConfigure.fieldLength,
              isRequired: itemConfigure.isRequired,
              childObjectMaps: itemConfigure.childObjectMaps,
              fieldOperations: operations,
              isComplex: itemConfigure.isComplex,
              mappingConfigurationId: get(state, "api.data.id", 0),
              parent: itemConfigure.parent,
              parentId: itemConfigure.parentId,
              path: itemConfigure.path,
              sortOrder: itemConfigure.sortOrder,
              index: itemConfigure.index,
              constantValue: itemConfigure.constantValue,
              dataSource: dataSource,
            },
          ];

    setCT(transformations);
  };
  const [FilterConditionFields, setFilterConditionFields] = useState([]);
  useEffect(() => {
    setCharacters(JSON.parse(fieldHeadersJson));
  }, [fieldHeadersJson]);

  useEffect(() => {
    setFilterConditionFields(
      JSON.parse(fieldHeadersJson) &&
        JSON.parse(fieldHeadersJson).map((element, ind) => {
          return {
            order: element.order,
            field: element.fieldName.substring(1),
            id: element.order,
            dataType: element.type,
            selected: false,
            filterSelect: false,
            firstchoice: "",
            value: element.datum,
            selectedFilter: "",
          };
        })
    );
  }, [fieldHeadersJson]);

  console.log("FilterConditionFields123", FilterConditionFields);

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
          <Container className="mapper-container">
            <SourceContainer
              fields={FilterConditionFields}
              setfields={setFilterConditionFields}
              selectedFields={selectedFields}
              setselectedFields={setselectedFields}
            />
            <TargetContainer
              configurations={ct}
              setFieldOperations={setFieldOperations}
              selectedFields={selectedFields}
              setselectedFields={setselectedFields}
            />
          </Container>
        );
      }}
    </Formik>
  );
}

export default MapAndTransformF2F;
