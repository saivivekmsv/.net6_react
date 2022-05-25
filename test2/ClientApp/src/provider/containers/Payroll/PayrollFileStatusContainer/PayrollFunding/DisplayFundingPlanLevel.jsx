import React, { useState } from "react";
import { Row, Col, Form } from "react-bootstrap";
import {
  formFields,
  managePayrollFormNames,
  required,
  usDateFormat,
} from "../../../../utils";
import { get, isEmpty, map } from "lodash";
import { FieldArray, Field, useFormikContext } from "formik";
import {
  FieldDropSide,
  SliderPanel,
  DropdownWithImage,
  LoaderWrapper,
} from "../../../../components";
import PayrollForfeiture from "./PayrollForfeiture";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/pro-light-svg-icons";
import PayrollTransactionDetails from "./PayrollTransactionDetails";
import plan from "../../../../mocks/bankName.json";
import { useDeepEffect, useRequest } from "../../../../abstracts";
import {
  getFundingTransactionDetailsByPlan,
  getFundingDetailByPlan,
  getForfeitureDetails,
  retrieveBankDetails,
  getFundingDetailsByClassification,
} from "../../../../services";
import { useEffect } from "react";

const DisplayFundingPlanLevel = ({ payrollId }) => {
  const [data, setData] = useState();
  const [toggle, setToggle] = useState(false);
  const [loadForfeiture, setLoad] = useState(true);
  const { values, setFieldValue } = useFormikContext();
  const fields = formFields[managePayrollFormNames.FORFEITURE_FUNDING];
  const payrollFundingPlanLevel = get(values, fields.fundingPlanLevel, []);
  const [list, setList] = useState(!isEmpty(data) ? data : null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedList, setSelectedList] = useState([]);
  const [forfeitureData, setForfeitureData] = useState([]);
  const [classification, setClassification] = useState(null);
  const { response: payrollPlan, loading: load } = useRequest({
    method: getFundingDetailByPlan,
    payload: payrollId,
    defaultResponse: {},
  });
  useEffect(() => {
    getFundingDetailsByClassification(payrollId).then((response) => {
      response.map((_) => {
        setClassification(_.classificationCode);
      });
    });
    if (!isEmpty(payrollPlan) && classification != null) {
      setData(payrollPlan);
    }
  }, [load]);

  //retrieveBankDetails(81).then((res) => console.log("aaa", res));

  const handleToggle = (id) => {
    console.log(id);
    setToggle(!toggle);
    if (id) {
      getForfeitureDetails({ planId: id, fileId: payrollId })
        .then((res) => {
          setForfeitureData(res);
        })
        .catch((err) => {
          return err;
        });
    }
  };
  useEffect(() => {
    !isEmpty(forfeitureData) ? setLoad(false) : setLoad(true);
  }, [forfeitureData]);
  const showPopup = (id) => {
    getFundingTransactionDetailsByPlan({ planId: id, fileId: payrollId })
      .then((res) => {
        setSelectedList(res);
      })
      .catch((err) => {
        return err;
      });
    setModalOpen(true);
  };

  useDeepEffect(() => {
    setFieldValue(fields.fundingPlanLevel, data);
  }, [data]);

  return (
    <div>
      <FieldArray name={fields.fundingPlanLevel}>
        {() => (
          <div>
            {!isEmpty(data) ? (
              data.map((data, index) => (
                <>
                  <p className="ft-14 black-text mt-20 mb-10">
                    {data.planName}
                  </p>
                  <div className="payroll-file-table-view">
                    <div className="d-flex justify-content-between">
                      <div>
                        <p className="ft-12 grey-text mb-15">Plan ID</p>
                        <p className="ft-14 black-text">{data.planId}</p>
                      </div>
                      <div>
                        <p className="ft-12 grey-text mb-15">Pay date</p>
                        <p className="ft-14 black-text">
                          {usDateFormat(data.payDate)}
                        </p>
                      </div>
                      <div>
                        <p className="ft-12 grey-text mb-15">Classification</p>
                        <p className="ft-14 black-text">{`Location - ${classification}`}</p>
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
                          onClick={() => showPopup(data.planId)}
                        >
                          view
                        </p>
                      </div>
                      <div>
                        <p className="ft-12 grey-text mb-10">Funding bank</p>
                        <p className="ft-14 black-text">
                          <Field
                            isRequired
                            size="smd"
                            name={`${fields.fundingPlanLevel}[${index}].${fields.bankName}`}
                            value={
                              !isEmpty(values.fundingPlanLevel)
                                ? values.fundingPlanLevel[index].bankName
                                : null
                            }
                            noLabelTransform
                            direction="bottom"
                            options={plan.data}
                            popupContent={
                              <DropdownWithImage
                                label="Select Bank"
                                options={plan.data}
                                onSelect={(value) =>
                                  setFieldValue(
                                    `${fields.fundingPlanLevel}[${index}].${fields.bankName}`,
                                    value
                                  )
                                }
                                selectedValue={
                                  !isEmpty(values.fundingPlanLevel)
                                    ? values.fundingPlanLevel[index].bankName
                                    : null
                                }
                              />
                            }
                            component={FieldDropSide}
                            validate={required}
                          />
                        </p>
                      </div>
                    </div>
                    {toggle && forfeitureData ? (
                      <LoaderWrapper isLoading={loadForfeiture}>
                        <Row>
                          <Col md="2">
                            <p className="black-text ft-12">
                              Total forfeiture
                              <br /> balance
                            </p>
                            <p className="font-weight-500">
                              $ {forfeitureData.totalForfeitureBalance}
                            </p>
                          </Col>
                          <Col md="2">
                            <p className="black-text ft-12">
                              Total employeer
                              <br /> contributions
                            </p>
                            <p className="font-weight-500">
                              $ {forfeitureData.totalEmployerContributions}
                            </p>
                          </Col>
                          <Col md="8">
                            {forfeitureData && (
                              <PayrollForfeiture
                                fields={fields}
                                data={forfeitureData}
                                parentIndex={index}
                                parentFieldName={fields.fundingPlanLevel}
                              />
                            )}
                          </Col>
                        </Row>
                      </LoaderWrapper>
                    ) : (
                      ""
                    )}
                  </div>
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
        {selectedList && <PayrollTransactionDetails data={selectedList} />}
      </SliderPanel>
    </div>
  );
};

export default DisplayFundingPlanLevel;
