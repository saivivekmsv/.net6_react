import React, { useState, useContext, useEffect, useCallback } from "react";
import { LoaderWrapper, ManageMapperLayout } from "../../../components";
import { isEmpty, get, isNull } from "lodash";
import SourceContainer from "./SourceContainer";
import TargetContainer from "./TargetContainer";
import { DragDropContext } from "react-beautiful-dnd";
import { Container, Row, Col } from "react-bootstrap";
import {
  manageMapperStore,
  setMapperMappingData,
  setManageMapperPageLevelData,
  setManageMapperToastInfo,
} from "../../../contexts";
import MapAndTransformF2F from "./MapAndTransformFileToFile";
import { Field, Formik, ErrorMessage } from "formik";

import SampleData from "../MapperHomeContainer/SampleData";
import {
  getPathWithParam,
  MANAGE_MAPPER_ROUTES,
  CensusAndPayroll,
  FLOW_TYPES,
  ROUTES,
} from "../../../utils";
import { onMappingChange } from "../../../services";
import { useRouterParams } from "../../../abstracts";
import { default as uuid } from "uuid";
const columns = {
  source: {
    id: "source container",
    title: "source",
    data: SampleData,
  },
};

const MapperContainer = (props) => {
  const [junkPleaseRemoveWhenDone, setjunkPleaseRemoveWhenDone] = useState(
    true
  );
  const { state, dispatch } = useContext(manageMapperStore);
  const { flow, profileId } = useRouterParams();
  const isEdit = flow === FLOW_TYPES.EDIT;
  const fieldHeadersJson = get(state, "api.data.headerMapJson");
  const [characters, setCharacters] = useState(JSON.parse(fieldHeadersJson));
  const [dragStart, setDrag] = useState(false);
  const [addConfigureSlider, setConfigureSlider] = useState(false);
  const [dest, setDestination] = useState("");
  const [mapped, setMapped] = useState("");
  const mappingData = get(state, "api.data", []);
  const [ssnExist, setSsnExist] = useState(true);
  const [rkPlanNumberExist, setRkPlanNumberExist] = useState(true);
  const data = isEdit
    ? get(mappingData, "objectMaps", []).filter((e) => isEmpty(e.parent))
    : get(mappingData, "objectMaps", []);

  // const requiredFieldOperations = !isEmpty(data)
  //   ? data.filter((e) => !isEmpty(e.fieldOperations))
  //   : [];
  const [ct, setCT] = useState([]);
  const nonCollections = !isEmpty(data)
    ? data.filter((f) => !f.isCollection)
    : [];
  const requiredObjects = CensusAndPayroll.map((e) => {
    const d = nonCollections.find((g) => g.propertyName == e.propertyName);
    if (!isEmpty(d)) {
      return {
        ...d,
        tId: uuid.v4(),
        groupName: e.groupName,
        displayName: e.displayName,
      };
    }
    return e;
  });
  // : [];
  const collections = !isEmpty(data) ? data.filter((f) => f.isCollection) : [];

  const requiredCollections = !isEmpty(collections)
    ? collections.map((e) => {
        const childs = !isEmpty(e.childObjectMaps)
          ? e.childObjectMaps.map((f) => ({
              ...f,
              tId: uuid.v4(),
            }))
          : [];
        const existingChilds = CensusAndPayroll.find(
          (g) => g.propertyName == e.propertyName
        );
        const c = !isEmpty(get(existingChilds, "childObjectMaps"))
          ? get(existingChilds, "childObjectMaps").map((f) => {
              const d = childs.find((g) => g.propertyName == f.propertyName);
              if (!isEmpty(d)) {
                return {
                  ...d,
                  displayName: f.displayName,
                };
              }
              return f;
            })
          : [];
        return {
          ...e,
          tId: uuid.v4(),
          groupName: get(existingChilds, "groupName"),
          childObjectMaps: c,
        };
      })
    : [];

  const wholeObject = requiredObjects.filter((e) =>
    isEmpty(requiredCollections.find((g) => g.propertyName == e.propertyName))
  );

  // const requiredData = !isEmpty(data)
  // ? CensusAndPayroll.map((e) => {
  //   const ex = data.find((f) => f.propertyName == e.propertyName);
  //   if(!isEmpty(ex) && ex.isCollection)
  //   {
  //     const childs = !isEmpty(ex.childObjectMaps) && ex.childObjectMaps.filter(f => !isEmpty(f.path));
  //     return {
  //       ...e,
  //       id:ex.id,
  //       mappingConfigurationId: ex.id,

  //     }
  //   }
  // })

  // const requiredData = !isEmpty(data)
  //   ? TargetFields.map((e) => {
  //       const ex = data.find((f) => f.propertyName == e.propertyName);
  //       console.log(ex, "ex");
  //       if (!isEmpty(ex) && ex.propertyName == e.propertyName) {
  //         return {
  //           id: ex.id,
  //           isCollection: ex.isCollection,
  //           isCollectionStart: ex.isCollectionStart,
  //           isCollectionEnd: ex.isCollectionEnd,
  //           groupName: e.groupName,
  //           displayName: e.displayName,
  //           propertyName: ex.propertyName,
  //           dataType: ex.dataType,
  //           format: e.format,
  //           fieldLength: e.fieldLength,
  //           isRequired: e.isRequired,
  //           childObjectMaps: ex.childObjectMaps,
  //           fieldOperations: ex.fieldOperations,
  //           isComplex: ex.isComplex,
  //           mappingConfigurationId: get(state, "api.data.id", 0),
  //           parent: ex.parent,
  //           parentId: ex.parentId,
  //           path: ex.path,
  //           sortOrder: ex.sortOrder,
  //           index: ex.index,
  //           constantValue: ex.constantValue,
  //           dataSource: ex.dataSource,
  //         };
  //       }
  //       return {
  //         id: 0,
  //         isCollection: e.isCollection,
  //         isCollectionStart: e.isCollectionStart,
  //         isCollectionEnd: e.isCollectionEnd,
  //         groupName: e.groupName,
  //         displayName: e.displayName,
  //         propertyName: e.propertyName,
  //         dataType: e.dataType,
  //         format: e.format,
  //         fieldLength: e.fieldLength,
  //         isRequired: e.isRequired,
  //         childObjectMaps: [],
  //         fieldOperations: [],
  //         isComplex: false,
  //         mappingConfigurationId: get(state, "api.data.id", 0),
  //         parent: "",
  //         parentId: 0,
  //         path: null,
  //         sortOrder: null,
  //         index: null,
  //         constantValue: null,
  //         dataSource: null,
  //       };
  //     })
  //   : TargetFields.map((e) => ({
  //       id: 0,
  //       isCollection: e.isCollection,
  //       isCollectionStart: e.isCollectionStart,
  //       isCollectionEnd: e.isCollectionEnd,
  //       groupName: e.groupName,
  //       displayName: e.displayName,
  //       propertyName: e.propertyName,
  //       dataType: e.dataType,
  //       format: e.format,
  //       fieldLength: e.fieldLength,
  //       isRequired: e.isRequired,
  //       childObjectMaps: [],
  //       fieldOperations: [],
  //       isComplex: false,
  //       mappingConfigurationId: get(state, "api.data.id", 0),
  //       parent: "",
  //       parentId: 0,
  //       path: null,
  //       sortOrder: null,
  //       index: null,
  //       constantValue: null,
  //       dataSource: null,
  //     }));

  const [targetField, setTargetField] = useState(
    !isEmpty(wholeObject)
      ? [...wholeObject, ...requiredCollections]
      : CensusAndPayroll
  );

  const SaveMapping = () => {
    const { history } = props;
    const groupItems = targetField.filter((e) => e.isCollection);
    const groups = groupItems
      .map((e) => {
        if (!isEmpty(e.childObjectMaps)) {
          return {
            id: get(e, "id", 0),
            constantValue: get(e, "constantValue", ""),
            dataSource: get(e, "dataSource", 1),
            fieldOperations: [],
            isCollection: e.isCollection,
            isCollectionEnd: e.isCollectionEnd,
            isCollectionStart: e.isCollectionStart,
            isComplex: get(e, "isComplex", false),
            propertyName: e.propertyName,
            sortOrder: e.sortOrder,
            childObjectMaps: e.childObjectMaps
              .filter((f) => !isEmpty(f.path))
              .map((e) => ({
                id: get(e, "id", 0),
                constantValue: get(e, "constantValue", ""),
                childObjectMaps: get(e, "childObjectMaps", []),
                dataType: e.dataType,
                dataSource: get(e, "dataSource", 1),
                fieldOperations:
                  get(e, "dataSource", 1) == 3 ||
                  (get(e, "fieldOperations", []).length == 1 &&
                    get(e, "fieldOperations", [])[0].transformation == "")
                    ? []
                    : get(e, "fieldOperations", []),
                isCollection: get(e, "isCollection", false),
                isCollectionEnd: get(e, "isCollectionEnd", false),
                isCollectionStart: get(e, "isCollectionStart", false),
                isComplex: get(e, "isComplex", false),
                path: get(e, "path", null),
                propertyName: e.propertyName,
                sortOrder: e.sortOrder,
              })),
          };
        }
      })
      .filter((f) => !isEmpty(f.childObjectMaps));
    const requiredFields =
      !isEmpty(targetField) &&
      targetField
        .filter((e) => !isEmpty(e.path))
        .map((e) => ({
          id: get(e, "id", 0),
          constantValue: get(e, "constantValue", ""),
          childObjectMaps: get(e, "childObjectMaps", []),
          dataType: e.dataType,
          dataSource: get(e, "dataSource", 1),
          fieldOperations:
            get(e, "dataSource", 1) == 3 ||
            (get(e, "fieldOperations", []).length == 1 &&
              get(e, "fieldOperations", [])[0].transformation == "")
              ? []
              : get(e, "fieldOperations", []),
          isCollection: e.isCollection,
          isCollectionEnd: get(e, "isCollectionEnd", false),
          isCollectionStart: get(e, "isCollectionStart", false),
          isComplex: get(e, "isComplex", false),
          path: get(e, "path", null),
          propertyName: e.propertyName,
          sortOrder: e.sortOrder,
        }));

    const payload = {
      ...get(state, "api.data"),
      objectMaps: [...requiredFields, ...groups],
    };

    let isSsnExists = !isEmpty(
      payload?.objectMaps?.filter(
        (item) => item?.propertyName == "UniquePersonalIdentification"
      )
    );
    let isRkPlanNumberExists = !isEmpty(
      payload?.objectMaps?.filter(
        (item) => item?.propertyName == "RKPlanNumber"
      )
    );

    if (isSsnExists && isRkPlanNumberExists) {
      onMappingChange(payload)
        .then((res) => {
          if (!isEmpty(res)) {
            // history.push(
            //   getPathWithParam({
            //     path: MANAGE_MAPPER_ROUTES.VERIFY_MAP,
            //     pathParam: [flow, profileId],
            //   })
            // );
            history.push(`${MANAGE_MAPPER_ROUTES.VERIFY_MAP}/${profileId}`);
            dispatch(
              setManageMapperPageLevelData({
                formName: "objectMaps",
                fieldData: [...requiredFields, ...groups],
              })
            );
            dispatch(
              setManageMapperToastInfo({
                showToast: true,
                toastMessage: `Mappings save Succesfull`,
              })
            );

            // history.push(`${MANAGE_MAPPER_ROUTES.VERIFY_MAP}/${profileId}`);

            return null;
          }
        })
        .catch((err) => err);
    } else {
      setSsnExist(false);
      setRkPlanNumberExist(false);
    }
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
      onClick: SaveMapping,
    },
  ];

  const onCancelConfigure = () => {
    setConfigureSlider(false);
  };

  const setConfigure = () => {
    //setConfigureSlider(!addConfigureSlider);
  };

  const handleOnDragStart = () => {
    setDrag(true);
  };
  const handleOnDragUpdate = (update) => {
    const { destination } = update;
    if (!isNull(destination)) {
      setDestination(destination.droppableId);
    }
  };

  const handleOnDragEnd = (result) => {
    setDrag(false);
    setDestination(null);
    const { source, destination } = result;
    // const foundTargetField = !isEmpty(result.destination)
    //   ? targetField.find((e) => e.displayName == destination.droppableId) ||
    //     (targetField.find(
    //       (e) => e.id == parseInt(destination.droppableId.split("-")[0])
    //     ) &&
    //       destination.droppableId.includes("-"))
    //   : null;

    if (isEmpty(result.destination)) {
      setDestination("");
      return;
    }

    const draggedData = destination.droppableId.includes(",", 35)
      ? targetField.map((e, i) => {
          if (destination.droppableId.includes(",", 35)) {
            const Tids = destination.droppableId.split(",");
            if (e.tId == Tids[1]) {
              const childMaps = e.childObjectMaps.map((f) =>
                f.tId == Tids[0]
                  ? {
                      ...f,
                      path: characters.find(
                        (g) => g.fieldName == result.draggableId
                      ).fieldName,
                    }
                  : f
              );
              return {
                ...e,
                childObjectMaps: childMaps,
              };
            }
            return e;
          }
          return e;
        })
      : targetField.map((e, i) => {
          if (e.tId == destination.droppableId) {
            return {
              ...e,
              path: characters.find((f) => f.fieldName == result.draggableId)
                .fieldName,
            };
          }
          return e;
        });
    setTargetField(draggedData);
    // if (
    //   !isEmpty(get(result, "destination")) &&
    //   foundTargetField &&
    //   isEmpty(foundTargetField.path)
    // ) {
    //   console.log("1234dropableid", destination.droppableId);
    //   if (destination.droppableId && destination.droppableId.includes("-")) {
    //     let targetFieldTempData = [...targetField];
    //     for (let i in targetFieldTempData) {
    //       let el = targetFieldTempData[i];
    //       if (
    //         el.isCollection &&
    //         el.childObjectMaps.length > 0 &&
    //         el.id == parseInt(destination.droppableId.split("-")[0])
    //       ) {
    //         targetFieldTempData[i].childObjectMaps = el.childObjectMaps.map(
    //           (e, index1) => {
    //             if (e.displayName == destination.droppableId.split("-")[1]) {
    //               setMapped(result.draggableId);
    //               return {
    //                 id: e.id,
    //                 isCollection: e.isCollection,
    //                 isCollectionStart: e.isCollectionStart,
    //                 isCollectionEnd: e.isCollectionEnd,
    //                 groupName: e.groupName,
    //                 displayName: e.displayName,
    //                 propertyName: e.propertyName,
    //                 dataType: e.dataType,
    //                 format: e.format,
    //                 fieldLength: e.fieldLength,
    //                 isRequired: e.isRequired,
    //                 childObjectMaps: [],
    //                 fieldOperations: [],
    //                 isComplex: false,
    //                 mappingConfigurationId: get(state, "api.data.id", 0),
    //                 parent: "",
    //                 parentId: 0,
    //                 path: characters.find(
    //                   (g) => g.fieldName == result.draggableId
    //                 ).fieldName,
    //                 sortOrder: null,
    //                 index: null,
    //                 constantValue: null,
    //                 dataSource: 1,
    //               };
    //             }
    //             return {
    //               id: e.id,
    //               isCollection: e.isCollection,
    //               isCollectionStart: e.isCollectionStart,
    //               isCollectionEnd: e.isCollectionEnd,
    //               groupName: e.groupName,
    //               displayName: e.displayName,
    //               propertyName: e.propertyName,
    //               dataType: e.dataType,
    //               format: e.format,
    //               fieldLength: e.fieldLength,
    //               isRequired: e.isRequired,
    //               childObjectMaps: e.childObjectMaps,
    //               fieldOperations: e.fieldOperations,
    //               isComplex: e.isComplex,
    //               mappingConfigurationId: get(state, "api.data.id", 0),
    //               parent: e.parent,
    //               parentId: e.parentId,
    //               path: e.path,
    //               sortOrder: e.sortOrder,
    //               index: e.index,
    //               constantValue: e.constantValue,
    //               dataSource: e.dataSource,
    //             };
    //           }
    //         );
    //       }
    //     }
    //     setTargetField(targetFieldTempData);
    //   } else {
    //     const draggedData = targetField.map((e) => {
    //       if (e.displayName == destination.droppableId) {
    //         setMapped(result.draggableId);

    //         return {
    //           id: e.id,
    //           isCollection: e.isCollection,
    //           isCollectionStart: e.isCollectionStart,
    //           isCollectionEnd: e.isCollectionEnd,
    //           groupName: e.groupName,
    //           displayName: e.displayName,
    //           propertyName: e.propertyName,
    //           dataType: e.dataType,
    //           format: e.format,
    //           fieldLength: e.fieldLength,
    //           isRequired: e.isRequired,
    //           childObjectMaps: [],
    //           fieldOperations: [],
    //           isComplex: false,
    //           mappingConfigurationId: get(state, "api.data.id", 0),
    //           parent: "",
    //           parentId: 0,
    //           path: characters.find((g) => g.fieldName == result.draggableId)
    //             .fieldName,
    //           sortOrder: null,
    //           index: null,
    //           constantValue: null,
    //           dataSource: 1,
    //         };
    //       }
    //       return {
    //         id: e.id,
    //         isCollection: e.isCollection,
    //         isCollectionStart: e.isCollectionStart,
    //         isCollectionEnd: e.isCollectionEnd,
    //         groupName: e.groupName,
    //         displayName: e.displayName,
    //         propertyName: e.propertyName,
    //         dataType: e.dataType,
    //         format: e.format,
    //         fieldLength: e.fieldLength,
    //         isRequired: e.isRequired,
    //         childObjectMaps: e.childObjectMaps,
    //         fieldOperations: e.fieldOperations,
    //         isComplex: e.isComplex,
    //         mappingConfigurationId: get(state, "api.data.id", 0),
    //         parent: e.parent,
    //         parentId: e.parentId,
    //         path: e.path,
    //         sortOrder: e.sortOrder,
    //         index: e.index,
    //         constantValue: e.constantValue,
    //         dataSource: e.dataSource,
    //       };
    //     });

    //     setTargetField(draggedData);
    //   }
    // }
  };

  const setFieldOperations = (dataSource, operations, itemConfigures) => {
    const itemConfigure = itemConfigures.object;

    const transformations =
      !isEmpty(ct) && ct.length > 1
        ? !isEmpty(ct.find((e) => e.propertyName == itemConfigure.propertyName))
          ? ct.map((e, i) => {
              if (e.propertyName == itemConfigure.propertyName) {
                return {
                  id: e.id,
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
        ? [
            {
              id: itemConfigure.id,
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
        : ct.find((e) => e.propertyName == itemConfigure.propertyName)
        ? [
            {
              id: itemConfigure.id,
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
        : [
            ...ct,
            {
              id: itemConfigure.id,
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

  return (
    <ManageMapperLayout buttons={buttons}>
      {/* Remove this when done */}
      {/* <input
        type="checkbox"
        id="vehicle1"
        name="vehicle1"
        onClick={() => {
          setjunkPleaseRemoveWhenDone(!junkPleaseRemoveWhenDone);
        }}
      />
      <label for="vehicle1"> File to file</label>
      <br></br> */}
      {/* end */}

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
            <DragDropContext
              onDragStart={handleOnDragStart}
              onDragUpdate={handleOnDragUpdate}
              onDragEnd={handleOnDragEnd}
            >
              <Container className="mapper-container">
                <Row>
                  <Col sm={4} xs={4} md={4} lg={4}>
                    <SourceContainer
                      column={get(columns, "source.id")}
                      setCharacters={setCharacters}
                      mapped={mapped}
                      characters={characters.map((e) => {
                        const filtered = targetField.filter(
                          (f) => f.path == e.fieldName
                        );
                        const groups = targetField
                          .filter((f) => f.isCollection)
                          .map((g) => {
                            const c = g.childObjectMaps.filter(
                              (f) => f.path == e.fieldName
                            );
                            if (!isEmpty(c)) {
                              return true;
                            }
                            return false;
                          });
                        if (!isEmpty(filtered) || groups.includes(true)) {
                          return {
                            ...e,
                            mapped: true,
                          };
                        }
                        return e;
                      })}
                      data={mappingData}
                    />
                  </Col>
                  <Col sm={8} xs={8} md={8} lg={8}>
                    {!isEmpty(targetField) && (
                      <TargetContainer
                        configurations={ct} //
                        destination={dest}
                        requiredData={targetField}
                        setFieldOperations={setFieldOperations} //
                        addConfigureSlider={addConfigureSlider}
                        onCancelConfigure={onCancelConfigure}
                        setConfigure={setConfigure}
                        deleteCT={setCT}
                        setTargetField={setTargetField}
                        ssnExist={ssnExist}
                        rkPlanNumberExist={rkPlanNumberExist}
                        state={state}
                        dispatch={dispatch}
                        dragStart={dragStart}
                        characters={characters}
                        handleOnDragEnd={handleOnDragEnd}
                      />
                    )}
                  </Col>
                </Row>
              </Container>
            </DragDropContext>
          );
        }}
      </Formik>
    </ManageMapperLayout>
  );
};

export default MapperContainer;
