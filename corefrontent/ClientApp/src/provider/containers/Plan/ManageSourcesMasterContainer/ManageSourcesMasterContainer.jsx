import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { get, isEmpty } from "lodash";
import { Button, Form } from "react-bootstrap";
import { Formik } from "formik";
import {
  ManagePlanLayout,
  LoaderWrapper,
  CsplTable as Table,
} from "../../../components";
import {
  FLOW_TYPES,
  MANAGE_PLAN_ROUTES,
  getPathWithParam,
  OPTIONS_DATA_MAPPER,
  getNullTableItem,
} from "../../../utils";
import {
  useRouterParams,
  useRequest,
  useTableChecboxSelect,
} from "../../../abstracts";
import { getPlanSourcesMasterData } from "../../../services";
import {
  createPlanStore,
  savePlanDetailsAction,
  setManagePlanToastInfo,
} from "../../../contexts";

const columns = [
  {
    label: "",
    className: "",
    columnName: "",
  },
  {
    label: "Source Name",
    className: "column-source-name",
    columnName: "sourceName",
    link: MANAGE_PLAN_ROUTES.VIEW_SOURCES_MASTER,
  },
  {
    label: "Source Catergory",
    className: "column-source-catergory",
    columnName: "sourceCategory",
    dataMapper: OPTIONS_DATA_MAPPER.SOURCE_CATEGORY_TYPES,
  },
  {
    label: "",
    className: "column-source-status",
    columnName: "status",
    dataMapper: OPTIONS_DATA_MAPPER.SOURCES_ADDED_TOPLAN,
  },
];

const ManageSourcesMasterContainer = (props) => {
  const { history } = props;
  const { state, dispatch } = useContext(createPlanStore);
  const { flow, planId } = useRouterParams();
  const sourcesData = get(state, "api.data.sources", []);
  const { response, loading } = useRequest({
    method: getPlanSourcesMasterData,
    defaultResponse: [],
  });
  const {
    data,
    isAllChecked,
    selectedData,
    onHeaderCheckboxClick,
    onRowItemClick,
  } = useTableChecboxSelect({
    response: response,
  });

  const onCloseClick = () => {
    history.push(
      getPathWithParam({
        path: MANAGE_PLAN_ROUTES.MANAGE_SOURCES,
        pathParam: [planId],
      })
    );
  };

  const buttons = [
    {
      label: "Cancel",
      variant: "secondary",
      type: "button",
      flow: [FLOW_TYPES.ADD, FLOW_TYPES.EDIT],
      onClick: onCloseClick,
    },
    {
      label: "New Sources",
      type: "button",
      flow: [FLOW_TYPES.ADD, FLOW_TYPES.EDIT],
      link: getPathWithParam({
        path: MANAGE_PLAN_ROUTES.MANAGE_SOURCES_NEW,
        pathParam: [planId],
      }),
    },
  ];

  const onAddToPlanClick = ({ setFieldError, setFieldTouched }) => {
    savePlanDetailsAction(
      {
        sources: [...sourcesData, ...selectedData],
      },
      dispatch,
      state
    ).then((response) => {
      if (response.isSuccessful) {
        dispatch(
          setManagePlanToastInfo({
            showToast: true,
            toastMessage: `Sources(s) added successfully`,
          })
        );
        history.push(
          getPathWithParam({
            path: MANAGE_PLAN_ROUTES.MANAGE_SOURCES,
            pathParam: [planId],
          })
        );
      } else {
        for (var i = 0; i < response.errorMessages.length; i++) {
          var _ = response.errorMessages[i];
          setFieldTouched(_.controlName, true);
          setFieldError(_.controlName, `${_.errorCode} : ${_.message}`);
        }
      }
    });
  };

  const noOfSources = response.length ? `${response.length} Sources` : "";
  const noOfSelectedSources = response.length ? `2 Sources` : "";
  return (
    <Formik
      initialValues={{}}
      onSubmit={() => {}}
      validateOnChange={false}
      validateOnBlur={false}
    >
      {({ setFieldValue }) => {
        return (
          <ManagePlanLayout
            buttons={buttons}
            pageFlow={flow}
            blockNavigation={true}
          >
            <LoaderWrapper isLoading={loading} className="">
              {!loading && (
                <div className="w-100">
                  <div>
                    <p className="selected-title-head py-2">
                      Selected sources from master to add to plan
                    </p>
                    {selectedData &&
                      selectedData.map((item) => (
                        <span className="selected-table-value">
                          {item.sourceName}
                        </span>
                      ))}
                  </div>
                  <div className="d-flex w-100 align-items-center justify-content-between mb-4">
                    <div className="w-50 m-0 plan-heading">
                      Manage Sources From Master
                    </div>
                    <div className="">{noOfSources}</div>
                    <div className="">{noOfSelectedSources}</div>
                    <div className="">
                      <Button type="button" onClick={onAddToPlanClick}>
                        Add Selected To Plan
                      </Button>
                    </div>
                  </div>
                  <Table>
                    <Table.Thead>
                      <Table.Tr>
                        {columns.map((item, index) => {
                          if (index === 0) {
                            return (
                              <Table.Th key={index} className={item.className}>
                                <Form.Check
                                  custom
                                  name="master-sources-radio-head"
                                  type="checkbox"
                                  label=""
                                  id={`master-sources-radio-head`}
                                  onChange={onHeaderCheckboxClick}
                                  checked={isAllChecked}
                                />
                              </Table.Th>
                            );
                          }
                          return (
                            <Table.Th key={index} className={item.className}>
                              {item.label}
                            </Table.Th>
                          );
                        })}
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {data.map((source, index) => {
                        return (
                          <Table.Tr key={index}>
                            {columns.map((item, cellIndex) => {
                              if (cellIndex === 0) {
                                return (
                                  <Table.Td
                                    key={cellIndex}
                                    className={item.className}
                                  >
                                    <Form.Check
                                      custom
                                      name="master-sources-radio"
                                      type="checkbox"
                                      label=""
                                      id={`master-sources-radio-${index}`}
                                      checked={source.checked}
                                      onChange={() => {
                                        setFieldValue("dummy", true); // addition this to triggere dirty check flag
                                        onRowItemClick(source);
                                      }}
                                    />
                                  </Table.Td>
                                );
                              }
                              return (
                                <Table.Td
                                  key={cellIndex}
                                  className={item.className}
                                >
                                  {!isEmpty(item.link) ? (
                                    <Link
                                      to={getPathWithParam({
                                        path: item.link,
                                        pathParam: [planId, source.id],
                                      })}
                                    >
                                      {source[item.columnName]}
                                    </Link>
                                  ) : item.dataMapper ? (
                                    getNullTableItem(
                                      item.dataMapper[source[item.columnName]]
                                    )
                                  ) : (
                                    getNullTableItem(source[item.columnName])
                                  )}
                                </Table.Td>
                              );
                            })}
                          </Table.Tr>
                        );
                      })}
                    </Table.Tbody>
                  </Table>
                </div>
              )}
            </LoaderWrapper>
          </ManagePlanLayout>
        );
      }}
    </Formik>
  );
};

export default ManageSourcesMasterContainer;
