import React, { useState } from "react";
import { Row, Col, Form } from "react-bootstrap";
import { formFields, managePayrollFormNames } from "../../../../../shared/utils"
import { get } from "lodash";
import { Field, useFormikContext, FieldArray } from "formik";
import { FieldDropSide, DropdownWithImage } from "../../../../../shared/components";
import PayrollForfeiture from "./PayrollForfeiture";
import plan from "../../../../../shared/mocks/bankName.json";
import { useDeepEffect } from "../../../../../shared/abstracts";

const FundingLocationComponent = ({ data }) => {
  const { values, setFieldValue } = useFormikContext();
  const fields = formFields[managePayrollFormNames.FORFEITURE_FUNDING];
  const payrollFundingLocations = get(values, fields.fundingLocations, []);

  const [list, setList] = useState(data);

  const handleToggle = (id) => {
    console.log(id, list.data, "iid");
    const updatedList = list.map((data) => {
      data.data.map((item) => {
        console.log(item, "item");
        if (id === item.id) {
          item.forfeitureCheck = !item.forfeitureCheck;
          return item;
        }
      });
      return data;
    });
    setList(updatedList);
  };

  // const {
  //   response: payrollClassificationTrans,
  //   loading: isLoading,
  // } = useRequest({
  //   method: getFundingTransactionDetailsByPlan,
  //   payload: { planId: 1, fileId: 1 },
  //   defaultResponse: {},
  // });

  // const payrollClassificationTrans1 = !isEmpty(payrollClassificationTrans)
  //   ? [payrollClassificationTrans]
  //   : {};
  //console.log("payrollPlanTrans", payrollClassificationTrans1);

  useDeepEffect(() => {
    setFieldValue(fields.fundingLocations, data);
  }, [data]);

  console.log("===values", payrollFundingLocations);
  return (
    <div>
      <FieldArray name={fields.fundingLocations}>
        {() => (
          <div>
            {data.map((data, index) => (
              <div className="payroll-file-table-view">
                <div className="d-flex justify-content-between">
                  <div>
                    <p className="ft-12 grey-text mb-15">Plan name</p>
                    <p className="ft-14 black-text">{data.planName}</p>
                  </div>
                  <div>
                    <p className="ft-12 grey-text mb-15">Plan ID</p>
                    <p className="ft-14 black-text">{data.planId}</p>
                  </div>
                  <div>
                    <p className="ft-12 grey-text mb-15">Pay date</p>
                    <p className="ft-14 black-text">{data.payDate}</p>
                  </div>
                  <div>
                    <p className="ft-12 grey-text mb-15">Total funding</p>
                    <p className="ft-14 black-text font-weight-500">
                      $ {data.totalFunding}
                    </p>
                  </div>
                  <div>
                    <p className="ft-12 grey-text mb-15">Forfeiture</p>
                    <p className="ft-14 black-text">
                      <Form.Check
                        type="switch"
                        id={`custom-switch${data.id}`}
                        label=""
                        onChange={() => handleToggle(data.id)}
                        value={data.forfeitureCheck}
                      />
                    </p>
                  </div>
                  <div>
                    <p className="ft-12 grey-text mb-15">Transaction details</p>
                    <p className="ft-14 link-text">view</p>
                  </div>
                  <div>
                    <p className="ft-12 grey-text">Funding bank</p>
                    <p className="ft-14 black-text">
                      <Field
                        isRequired
                        size="smd"
                        name={`${fields.fundingLocations}[${index}].${fields.bankName}`}
                        value={data[fields.bankName]}
                        noLabelTransform
                        direction="bottom"
                        options={plan.data}
                        popupContent={
                          <DropdownWithImage
                            label="Select Bank"
                            options={plan.data}
                            onSelect={(value) =>
                              setFieldValue(
                                `${fields.fundingLocations}[${index}].${fields.bankName}`,
                                value
                              )
                            }
                            selectedValue={data[fields.bankName]}
                          />
                        }
                        component={FieldDropSide}
                      />
                    </p>
                  </div>
                </div>
                {data.forfeitureCheck ? (
                  <Row>
                    <Col md="2">
                      <p className="black-text ft-12">
                        Total forfeiture
                        <br /> balance
                      </p>
                      <p className="font-weight-500">
                        $ {data.totalForfeitureBalance}
                      </p>
                    </Col>
                    <Col md="2">
                      <p className="black-text ft-12">
                        Total employeer
                        <br /> contributions
                      </p>
                      <p className="font-weight-500">
                        $ {data.totalEmployeerContributions}
                      </p>
                    </Col>
                    <Col md="8">
                      <PayrollForfeiture
                        fields={fields}
                        data={data.forfeiture}
                        parentIndex={index}
                        parentFieldName={fields.fundingLocation}
                      />
                    </Col>
                  </Row>
                ) : (
                  ""
                )}
              </div>
            ))}
          </div>
        )}
      </FieldArray>
    </div>
  );
};

export default FundingLocationComponent;
