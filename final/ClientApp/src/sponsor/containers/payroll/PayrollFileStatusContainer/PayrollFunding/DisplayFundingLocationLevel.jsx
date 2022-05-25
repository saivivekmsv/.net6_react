import React, { useEffect, useState } from "react";
import { Row, Col, Form } from "react-bootstrap";
import {
  formFields,
  managePayrollFormNames,
  required,
} from "../../../../../shared/utils";
import { get, isEmpty, pick, map, find } from "lodash";
import { FieldArray, Field, useFormikContext } from "formik";
import {
  FieldDropSide,
  SliderPanel,
  DropdownWithImage,
} from "../../../../../shared/components";
import PayrollForfeiture from "./PayrollForfeiture";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/pro-light-svg-icons";
import PayrollTransactionDetails from "./PayrollTransactionDetails";
import plan from "../../../../../shared/mocks/bankName.json";
import { useDeepEffect, useRequest } from "../../../../../shared/abstracts";
import {
  getFundingDetailsByClassification,
  getFundingTransactionDetailsByClassification,
  getForfeitureDetails,
} from "../../../../services";

const DisplayFundingLocation = ({ payrollId }) => {
  const [toggle, setToggle] = useState(false);
  const { values, setFieldValue } = useFormikContext();
  const [list, setList] = useState([]);
  const fields = formFields[managePayrollFormNames.FORFEITURE_FUNDING];
  const payrollFundingLocations = get(values, fields.fundingLocations, []);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedList, setSelectedList] = useState({
    transactionDetails: [],
  });

  useEffect(() => {
    getFundingDetailsByClassification(payrollId)
      .then((res) => {
        setList(res);
      })
      .catch((err) => {
        return err;
      });
    console.log(list);
  }, [payrollId]);

  const { response: payrollLocTrans, loading: isLoading1 } = useRequest({
    method: getFundingTransactionDetailsByClassification,
    payload: payrollId,
    defaultResponse: {},
  });

  const updateFundingDetails = (response, item) => {
    const updatedList = list.map((data) => {
      return {
        ...data,
        planDetailsForDivisions: data.planDetailsForDivisions.map((data) => {
          if (item.planId === data.planId) {
            data = {
              ...data,
              forfeitureCheck: true,
              forfeitureDetails: response,
            };
          }
          return data;
        }),
      };
    });
    setList(updatedList);
    console.log(list, "list");
  };

  const handleToggle = (id) => {
    const updatedList = list.map((data) => {
      return {
        ...data,
        planDetailsForDivisions: data.planDetailsForDivisions.map((item) => {
          if (id === item.planId) {
            if (item.forfeitureCheck === undefined) {
              getForfeitureDetails({ planId: id, fileId: payrollId })
                .then((response) => {
                  updateFundingDetails(response, item);
                })
                .catch((error) => {
                  return error;
                });
            } else {
              item = item.forfeitureCheck
                ? {
                    ...item,
                    forfeitureCheck: false,
                  }
                : {
                    ...item,
                    forfeitureCheck: true,
                  };
            }
          }
          return item;
        }),
      };
    });

    setList(updatedList);
    setToggle(!toggle);
  };

  const showPopup = (id) => {
    const selected = payrollLocTrans.filter((item) => {
      return id === item.id;
    });
    setSelectedList(selected);
    setModalOpen(true);
  };

  useDeepEffect(() => {
    setFieldValue(fields.fundingLocations, list);
  }, [list]);

  return (
    <div>
      <FieldArray name={fields.fundingLocations}>
        {() => (
          <div>
            {!isEmpty(list) ? (
              list &&
              list.map((division, index) => (
                <>
                  <p className="ft-14 black-text mt-20 mb-10">
                    {division.classificationCode}
                  </p>
                  {division.planDetailsForDivisions &&
                    division.planDetailsForDivisions.map((data, index) => (
                      <div
                        className="payroll-file-table-view last-css"
                        key={index}
                      >
                        <div className="d-flex justify-content-between">
                          <div>
                            <p className="ft-12 grey-text mb-15">Plan name</p>
                            <p className="ft-14 black-text">{data.planName}</p>
                          </div>
                          <div>
                            <p className="ft-12 grey-text mb-15">Plan ID</p>
                            <p className="ft-14 black-text">
                              {data.rkPlanNumber}
                            </p>
                          </div>
                          <div>
                            <p className="ft-12 grey-text mb-15">Pay date</p>
                            <p className="ft-14 black-text">{data.payDate}</p>
                          </div>
                          <div>
                            <p className="ft-12 grey-text mb-15">
                              Total funding
                            </p>
                            <p className="ft-14 black-text font-weight-500">
                              $ {data.totalFunding}
                            </p>
                          </div>
                          <div>
                            <p className="ft-12 grey-text mb-15">Forfeiture</p>
                            <p className="ft-14 black-text">
                              <Form.Check
                                type="switch"
                                name={`forfeitureCheck`}
                                id={`custom-switch${data.planId}`}
                                label=" "
                                onChange={() => handleToggle(data.planId)}
                                value={toggle}
                              />
                            </p>
                          </div>
                          <div>
                            <p className="ft-12 grey-text mb-15">
                              Transaction details
                            </p>
                            <p
                              className="ft-14 link-text"
                              onClick={() =>
                                showPopup(
                                  division.codeId,
                                  data.planId,
                                  payrollId
                                )
                              }
                            >
                              view
                            </p>
                          </div>
                          <div>
                            <p className="ft-12 grey-text mb-10">
                              Funding bank
                            </p>
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
                                validate={required}
                              />
                            </p>
                          </div>
                        </div>

                        {data.forfeitureCheck === true ? (
                          <Row>
                            <Col md="2">
                              <p className="black-text ft-12">
                                Total forfeiture
                                <br /> balance
                              </p>
                              <p className="font-weight-500">
                                ${" "}
                                {data.forfeitureDetails.totalForfeitureBalance}
                              </p>
                            </Col>
                            <Col md="2">
                              <p className="black-text ft-12">
                                Total employeer
                                <br /> contributions
                              </p>
                              <p className="font-weight-500">
                                ${" "}
                                {
                                  data.forfeitureDetails
                                    .totalEmployerContributions
                                }
                              </p>
                            </Col>
                            <Col md="8">
                              <PayrollForfeiture
                                fields={fields}
                                data={data.forfeitureDetails}
                                parentIndex={index}
                                parentFieldName={fields.fundingLocations}
                              />
                            </Col>
                          </Row>
                        ) : (
                          ""
                        )}
                      </div>
                    ))}
                  <div className="line-separator" />
                </>
              ))
            ) : (
              <span>No data</span>
            )}
          </div>
        )}
      </FieldArray>
      <SliderPanel isOpen={isModalOpen} size="30" showCancel={false}>
        <div className="d-flex justify-content-between">
          <div className="ft-14 font-weight-500">Transaction details</div>
          <div>
            <FontAwesomeIcon
              icon={faTimes}
              size="18px"
              color="#828282"
              onClick={() => setModalOpen(false)}
              className="pointer"
            />
          </div>
        </div>
        <div className="border-top" />
        <PayrollTransactionDetails data={payrollLocTrans} />
      </SliderPanel>
    </div>
  );
};

export default DisplayFundingLocation;
