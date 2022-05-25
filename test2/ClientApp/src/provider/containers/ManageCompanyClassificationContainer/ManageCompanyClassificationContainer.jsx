import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { isEmpty, get } from "lodash";
import {
  ManageCompanyLayout,
  CsplTable as Table,
  AddCompanyItemsLayout,
} from "../../components";
import { useRouterParams } from "../../abstracts";
import {
  MANAGE_COMPANY_ROUTES,
  FLOW_TYPES,
  getAdvancedPathWithParam,
  OPTIONS_DATA_MAPPER,
} from "../../utils";
import {
  clearMamangeCompanyLocalCacheByModel,
  manageCompanyStore,
} from "../../contexts";
// import exployeeClassificationsTypes from "../../mocks/exployeeClassificationsTypes.json";

const columns = [
  {
    label: "Classification Type",
    className: "column-classification-type",
    columnName: "classificationName",
    isSortable: true,
    orderBy: "",
    link: MANAGE_COMPANY_ROUTES.EMPLOYEE_CLASSIFICATIONS_TYPE,
  },
  {
    label: "Classification Type Required",
    className: "column-classification-type-required",
    columnName: "classificationTypeRequired",
    type: "boolean",
  },
  {
    label: "Client Eligibility",
    className: "column-client-eligibility",
    columnName: "clientEligibilityClassificationRequired",
    type: "boolean",
  },
  {
    label: "Codes",
    className: "column-codes",
    columnName: "employeeClassificationCodes",
  },
];

const EmployeeClassificationsContainer = (props) => {
  const { state, dispatch } = useContext(manageCompanyStore);
  const classifications = get(state, "api.data.classifications", []);
  // const classifications = get(state, "classifications", []);
  const { companyId, flow } = useRouterParams();

  useEffect(() => {
    // dispatch(setManageCompanySetClassificationData(classificationApiResponse));
    dispatch(clearMamangeCompanyLocalCacheByModel("classifications"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onAddClick = () => {
    const { history } = props;
    history.push(
      getAdvancedPathWithParam({
        path: MANAGE_COMPANY_ROUTES.EMPLOYEE_CLASSIFICATIONS_TYPE,
        pathParam: [FLOW_TYPES.ADD, companyId, classifications.length],
      })
    );
  };

  const buttons = [
    {
      label: "",
      variant: "secondary",
      type: "button",
      flow: [FLOW_TYPES.ADD, FLOW_TYPES.EDIT],
      isAddButton: true,
      onClick: onAddClick,
    },
  ];

  return (
    <ManageCompanyLayout buttons={buttons} pageFlow={FLOW_TYPES.ADD}>
      {isEmpty(classifications) && (
        <AddCompanyItemsLayout
          content={
            <>
              No employee classification
              <br />
              has been set for this company
            </>
          }
          buttonLabel="Add New Classification"
          link={getAdvancedPathWithParam({
            path: MANAGE_COMPANY_ROUTES.EMPLOYEE_CLASSIFICATIONS_TYPE,
            pathParam: [FLOW_TYPES.ADD, companyId],
          })}
          className="mt-5"
        />
      )}
      {!isEmpty(classifications) && (
        <Table>
          <Table.Thead>
            <Table.Tr>
              {columns.map((item, index) => {
                return (
                  <Table.Th key={index} className={item.className}>
                    {item.label}
                  </Table.Th>
                );
              })}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {classifications.map((classification, index) => {
              return (
                <Table.Tr key={index}>
                  {columns.map((item, cellIndex) => {
                    const getContent = () => {
                      if (item.columnName === "employeeClassificationCodes") {
                        return get(
                          classification,
                          "employeeClassificationCodes",
                          []
                        )
                          .map(({ code }) => code)
                          .join(", ");
                      }
                      if (item.link) {
                        return (
                          <Link
                            to={getAdvancedPathWithParam({
                              path: item.link,
                              pathParam: [FLOW_TYPES.EDIT, companyId, index],
                            })}
                          >
                            {classification[item.columnName]}
                          </Link>
                        );
                      }

                      if (item.type === "boolean") {
                        return classification[item.columnName] ? "Yes" : "No";
                      }
                      return classification[item.columnName];
                    };

                    return (
                      <Table.Td key={cellIndex} className={item.className}>
                        {getContent()}
                      </Table.Td>
                    );
                  })}
                </Table.Tr>
              );
            })}
          </Table.Tbody>
        </Table>
      )}
    </ManageCompanyLayout>
  );
};

export default EmployeeClassificationsContainer;
