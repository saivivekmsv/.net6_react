import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { find, get, isEmpty } from "lodash";
import {
  ManagePlanLayout,
  AddPlans,
  CsplTable as Table,
} from "../../../components";
import {
  FLOW_TYPES,
  MANAGE_PLAN_ROUTES,
  getPathWithParam,
  getAdvancedPathWithParam,
  OPTIONS_DATA_MAPPER,
  toMultiSelectValueById,
  tranformListToDropdownValues,
} from "../../../utils";
import { useRouterParams } from "../../../abstracts";
import { clearLocalCacheByModel, createPlanStore } from "../../../contexts";
import AddToolTip from "../../../components/AddToolTip";

const columns = [
  {
    label: "Eligibility Name",
    className: "column-eligibilityName",
    columnName: "name",
    link: `${MANAGE_PLAN_ROUTES.ADD_ELIGIBILITY}`,
  },
  {
    label: "Eligibility For",
    className: "column-eligibilityFor",
    columnName: "eligibilityRuleFor",
    dataMapper: OPTIONS_DATA_MAPPER.ELIGIBILITY_TYPE,
  },
];

const Eligibility = (props) => {
  const { flow, planId } = useRouterParams();
  const { state, dispatch } = useContext(createPlanStore);
  const eligibilityData = get(state, "api.data.eligibilityRules", []);
  const sourcesList = tranformListToDropdownValues(
    get(state, "api.data.sources", []),
    "sourceName",
    "id"
  );

  useEffect(() => {
    dispatch(clearLocalCacheByModel("eligibilityRules"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onAddClick = () => {
    const { history } = props;

    history.push(
      getAdvancedPathWithParam({
        path: MANAGE_PLAN_ROUTES.ADD_ELIGIBILITY,
        pathParam: [FLOW_TYPES.ADD, planId, (eligibilityData || []).length],
      })
    );
  };

  const buttons = [
    {
      label: "",
      variant: "secondary",
      type: "button",
      flow: [FLOW_TYPES.ADD, FLOW_TYPES.EDIT, FLOW_TYPES.SAVE],
      isAddButton: true,
      onClick: onAddClick,
    },
  ];

  return (
    <ManagePlanLayout buttons={buttons} pageFlow={flow}>
      {isEmpty(eligibilityData) && (
        <AddPlans
          content="No eligibility rules."
          buttonLabel="Add Eligibility Rule"
          link={getAdvancedPathWithParam({
            path: MANAGE_PLAN_ROUTES.ADD_ELIGIBILITY,
            pathParam: [
              FLOW_TYPES.SAVE,
              planId,
              (eligibilityData || []).length,
            ],
          })}
        />
      )}
      {!isEmpty(eligibilityData) && (
        <div className="w-100">
          <div className="d-flex w-100 align-items-center justify-content-between mb-4">
            <div className="m-0 plan-heading font-weight-500">
              Manage Eligibility
            </div>
          </div>
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
              {eligibilityData.map((source, index) => {
                return (
                  <Table.Tr key={index}>
                    {columns.map((item, cellIndex) => {
                      return (
                        <Table.Td key={cellIndex} className={item.className}>
                          {!isEmpty(item.link) ? (
                            <Link
                              to={getAdvancedPathWithParam({
                                path: item.link,
                                pathParam: [FLOW_TYPES.EDIT, planId, index],
                              })}
                            >
                              {source[item.columnName]}
                            </Link>
                          ) : item.dataMapper[source[item.columnName]] ===
                            "Source" ? (
                            <AddToolTip
                              name={
                                item.dataMapper[source[item.columnName]] +
                                " - " +
                                get(source, "sourceEligibilities", [])
                                  .map(
                                    (val) =>
                                      find(sourcesList, { value: val.sourceId })
                                        .label
                                  )
                                  .join(", ")
                              }
                            />
                          ) : (
                            item.dataMapper[source[item.columnName]] +
                            " - " +
                            get(state, "api.data.planName", "")
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
    </ManagePlanLayout>
  );
};

export default Eligibility;
