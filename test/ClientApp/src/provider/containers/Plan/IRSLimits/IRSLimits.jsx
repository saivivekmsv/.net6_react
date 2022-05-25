import React, { useContext, useEffect, useState } from "react";
import {
  ManagePlanLayout,
  CsplTable as Table,
  AddPlans,
  LoaderWrapper,
  Select,
} from "../../../components";
import { isEmpty, get } from "lodash";
import { Link } from "react-router-dom";
import {
  getPathWithParam,
  MANAGE_PLAN_ROUTES,
  FLOW_TYPES,
  toOptionValuesFromMapper,
} from "../../../utils";
import { IRSCategory } from "../../../utils/constants/common";
import { Field } from "formik";
import { useRequest, useRouterParams } from "../../../abstracts";
import { createPlanStore } from "../../../contexts";
import AddToolTip from "../../../components/AddToolTip";
import moment from "moment";
import { getIRSLimits } from "../../../services";

const columns = [
  {
    label: "IRSLimit",
    className: "column-custodianName",
    columnName: "trusteeCompanyName",
  },
  {
    label: "Year 1",
    className: "column-custodianMail",
    columnName: "email",
  },
  {
    label: "Year 2",
    className: "column-custodianPhone",
    columnName: "mobilePhoneNumber",
  },
  {
    label: "custom",
    className: "column-custodianPhone",
    columnName: "mobilePhoneNumber",
  },
];

const IRSLimits = (props) => {
  const { planId } = useRouterParams();
  const [customYear, setCustomYear] = useState(moment().year() - 2);
  const [year, setYear] = useState({});
  const [response, setResponse] = useState([]);
  const { state } = useContext(createPlanStore);
  const planType = get(state, "api.data.planType", 1);
  useEffect(() => {
    var y = {};
    for (var i = moment().year() - 2; i > 2011; i--) {
      y[i] = i;
    }
    console.log(y);
    setYear(y);
    getIRSLimits(planType).then((response) => {
      setResponse(response);
    });
  }, []);
  // const { response: response, loading: load } = useRequest({
  //   method: getIRSLimits,
  //   defaultResponse: [],
  //   payload: planType
  // });
  const buttons = [];

  const handleChange = (e) => {
    setCustomYear(e.target.value);
  };
  return (
    <ManagePlanLayout buttons={buttons}>
      {!isEmpty(response) && (
        <LoaderWrapper>
          <div className="w-100">
            <div className="d-flex w-100 align-items-center justify-content-between mb-4">
              <div className="m-0 plan-heading"></div>
            </div>
            <Table>
              <Table.Thead>
                <Table.Tr>
                  {columns.map((item, index) => {
                    if (item.label == "custom")
                      return (
                        <Table.Th key={index} className={item.className}>
                          <Select
                            label="Select"
                            title={customYear}
                            optionsList={toOptionValuesFromMapper(year)}
                            onClick={handleChange}
                            value={customYear}
                            isNotTypeAhead
                            isRadio
                            size={{ width: "50%" }}
                          />
                        </Table.Th>
                      );
                    if (item.label != "IRSLimit")
                      return (
                        <Table.Th key={index} className={item.className}>
                          {moment().year() - index + 1}
                        </Table.Th>
                      );
                    else
                      return (
                        <Table.Th key={index} className={item.className}>
                          {item.label}
                        </Table.Th>
                      );
                  })}
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {response.map((category, index) => {
                  return (
                    <Table.Tr key={index}>
                      <Table.Td className="column-custodianName">
                        {IRSCategory[category.irsCategory]}
                      </Table.Td>

                      <Table.Td
                        className="column-custodianMail"
                        style={{ textAlign: "right" }}
                      >
                        {category.limits[0].irsLimit}
                      </Table.Td>
                      <Table.Td
                        className="column-custodianMail"
                        style={{ textAlign: "right" }}
                      >
                        {category.limits[1].irsLimit}
                      </Table.Td>
                      <Table.Td
                        className="column-custodianMail"
                        style={{ textAlign: "right" }}
                      >
                        {category.limits[moment().year() - customYear].irsLimit}
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

export default IRSLimits;
