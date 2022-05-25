import React, { useState, useEffect } from "react";
import { Row, Col, Form, OverlayTrigger, Tooltip } from "react-bootstrap";
import {
  formFields,
  managePayrollFormNames,
  required,
} from "../../../../../shared/utils";
import { get, isEmpty, map } from "lodash";
import { Field, FieldArray, useFormikContext } from "formik";
import {
  DropdownWithImage,
  SliderPanel,
  FieldDropSide,
  LoaderWrapper,
} from "../../../../../shared/components";
import PayrollForfeiture from "./PayrollForfeiture";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/pro-light-svg-icons";
import PayrollTransactionDetails from "./PayrollTransactionDetails";
import { useDeepEffect, useRequest } from "../../../../../shared/abstracts";
import {
  getFundingDetailsByFile,
  getForfeitureDetails,
} from "../../../../services";
import plan from "../../../../../shared/mocks/bankName.json";

const DisplayFileLevel = ({ payrollId }) => {
  const { values, setFieldValue } = useFormikContext();
  const [isModalOpen, setModalOpen] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [forfeitureData, setForfeitureData] = useState([]);
  const [loadForfeiture, setLoad] = useState(true);
  const fields = formFields[managePayrollFormNames.FORFEITURE_FUNDING];
  //const payrollFundingFileLevel = get(values, fields.fundingFileLevel, []);
  const [selectedList, setSelectedList] = useState({
    transactionDetails: [],
  });

  const { response: payrollFile, loading: isLoading } = useRequest({
    method: getFundingDetailsByFile,
    payload: payrollId,
    defaultResponse: {},
  });

  useEffect(() => {
    !isEmpty(forfeitureData) ? setLoad(false) : setLoad(true);
  }, [forfeitureData]);
  const payrollLocation = !isEmpty(payrollFile) ? [payrollFile] : {};

  console.log("payrollFile", payrollLocation);

  const handleToggle = (id) => {
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

  const showPopup = (id) => {
    setModalOpen(true);
  };

  // useDeepEffect(() => {
  //   setFieldValue(fields.fundingFileLevel, data);
  // }, [data]);

  return (
    <>
      <FieldArray name={fields.fundingFileLevel}>
        {() => (
          <div>
            {!isEmpty(payrollLocation) ? (
              payrollLocation.map((data, index) => (
                <div className="payroll-file-table-view">
                  <div className="d-flex justify-content-between">
                    <div>
                      <p className="ft-12 grey-text mb-15">Plan name</p>
                      {data.planName && data.planName.length > 30 ? (
                        <OverlayTrigger
                          overlay={<Tooltip>{data.planName}</Tooltip>}
                        >
                          <p className="ft-14 black-text">
                            {(data.planName || "").slice(0, 30)}...
                          </p>
                        </OverlayTrigger>
                      ) : (
                        <p className="ft-14 black-text">{data.planName}</p>
                      )}
                    </div>
                    <div>
                      <p className="ft-12 grey-text mb-15">Plan ID</p>
                      <p className="ft-14 black-text">{data.rkPlanNumber}</p>
                    </div>
                    <div>
                      <p className="ft-12 grey-text mb-15">Employees</p>
                      <p className="ft-14 black-text">{data.employeesCount}</p>
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
                          id={`custom-switch-${index}`}
                          label=" "
                          onChange={() => handleToggle(84)}
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
                        onClick={() => showPopup(data.id)}
                      >
                        view
                      </p>
                    </div>

                    <div>
                      <p className="ft-12 grey-text mb-10">
                        Select bank for funding
                      </p>
                      <p className="ft-14 black-text">
                        <Field
                          isRequired
                          size="smd"
                          name={fields.bankName}
                          value={values[fields.bankName]}
                          noLabelTransform
                          direction="bottom"
                          options={plan.data}
                          popupContent={
                            <DropdownWithImage
                              label="Select Bank"
                              options={plan.data}
                              onSelect={(value) =>
                                setFieldValue(fields.bankName, value)
                              }
                              selectedValue={values[fields.bankName]}
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
                            $ {forfeitureData.totalEmployeerContributions}
                          </p>
                        </Col>
                        <Col md="8">
                          {forfeitureData && (
                            <PayrollForfeiture
                              fields={fields}
                              data={forfeitureData}
                              parentIndex={index}
                              parentFieldName={fields.fundingFileLevel}
                            />
                          )}
                        </Col>
                      </Row>
                    </LoaderWrapper>
                  ) : (
                    ""
                  )}
                </div>
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
        <PayrollTransactionDetails data={selectedList[0]} />
      </SliderPanel>
    </>
  );
};

export default DisplayFileLevel;
