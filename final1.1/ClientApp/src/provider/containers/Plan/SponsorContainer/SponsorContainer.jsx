import React, { useContext } from "react";
import {
  ManagePlanLayout,
  CsplTable as Table,
  AddPlans,
  LoaderWrapper,
} from "../../../components";
import { isEmpty, get } from "lodash";
import { Link } from "react-router-dom";
import {
  getPathWithParam,
  getAdvancedPathWithParam,
  MANAGE_PLAN_ROUTES,
  FLOW_TYPES,
} from "../../../utils";
import { useRouterParams } from "../../../abstracts";
import { createPlanStore } from "../../../contexts";
import AddToolTip from "../../../components/AddToolTip";

const columns = [
  {
    label: "Sponsor Company Name",
    className: "column-custodianName",
    columnName: "trusteeCompanyName",
  },
  {
    label: "Email",
    className: "column-custodianMail",
    columnName: "email",
  },
  {
    label: "Phone Number",
    className: "column-custodianPhone",
    columnName: "mobilePhoneNumber",
  },
];

const SponsorInformationContainer = (props) => {
  const { state } = useContext(createPlanStore);
  const { planId } = useRouterParams();
  const sponsorData = get(state, "api.data.sponsors", []);
  const onAddClick = () => {
    const { history } = props;

    history.push(
      getAdvancedPathWithParam({
        path: MANAGE_PLAN_ROUTES.ADD_SPONSOR,
        pathParam: [FLOW_TYPES.ADD, planId],
      })
    );
  };
  const buttons = [
    {
      label: "Add Sponsor",
      variant: "primary",
      type: "button",
      onClick: onAddClick,
    },
  ];

  return (
    <ManagePlanLayout buttons={buttons}>
      {isEmpty(sponsorData) && (
        <LoaderWrapper>
          <AddPlans
            content={
              <>
                No sponsors have been
                <br />
                created for this plan.
              </>
            }
            buttonLabel="Add Sponsor"
            link={getPathWithParam({
              path: MANAGE_PLAN_ROUTES.ADD_SPONSOR,
              pathParam: [planId],
            })}
          />
        </LoaderWrapper>
      )}
      {!isEmpty(sponsorData) && (
        <LoaderWrapper>
          <div className="w-100">
            <div className="d-flex w-100 align-items-center justify-content-between mb-4">
              <div className="m-0 plan-heading">Sponsor Information</div>
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
                {sponsorData.map((sponsor, index) => {
                  return (
                    <Table.Tr key={index}>
                      <Table.Td className="column-custodianName">
                        <Link
                          to={getPathWithParam({
                            path: MANAGE_PLAN_ROUTES.ADD_SPONSOR,
                            pathParam: [FLOW_TYPES.EDIT, planId, sponsor.id],
                          })}
                          style={{ width: "100%" }}
                        >
                          <AddToolTip
                            name={`${sponsor.name.firstName}  ${sponsor.name.lastName}`}
                          />
                        </Link>
                      </Table.Td>
                      <Table.Td className="column-custodianMail">
                        <AddToolTip name={sponsor.contactDetails.email} />
                      </Table.Td>
                      <Table.Td className="column-custodianPhone">
                        {sponsor.contactDetails.mobilePhoneNumber}
                      </Table.Td>
                    </Table.Tr>
                  );
                })}
              </Table.Tbody>
            </Table>
          </div>
        </LoaderWrapper>
      )}
    </ManagePlanLayout>
  );
};

export default SponsorInformationContainer;
