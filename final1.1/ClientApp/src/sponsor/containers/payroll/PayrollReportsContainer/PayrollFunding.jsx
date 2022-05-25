import React from "react";
import { Row, Col, Image } from "react-bootstrap";
import { ExcelNameExport } from "../../../../shared/components";
import { maskedBankAccountNumberNormalizer } from "../../../../shared/utils";
import { getDateTimeAMPM } from "../../../../shared/utils";
import { getDateWithSlash } from "../../../../shared/utils";
import { get } from "lodash";
import { useRequest } from "../../../../shared/abstracts";
import {
  getPayrollFundingInformationById,
  getDownloadFundingReport,
} from "../../../services";
import ExcelImage from "../../../../shared/styles/file-spreadsheet.png";
import * as fileSaver from "file-saver";
// import axios from "axios";
// import { apiDetails } from "sponsor/services/helpers";

const PayrollFunding = ({ data }) => {
  const { response: fundingInfo, loading: isLoading } = useRequest({
    method: getPayrollFundingInformationById,
    payload: { fileId: 1, from: 1, count: 1 },
    defaultResponse: [],
  });

  const exportReportFile = (data) => {
    getDownloadFundingReport({
      fileId: 1,
    })
      .then((response) => {
        var blob = new Blob([response], {
          type:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        fileSaver.saveAs(blob, "PayrollFunding.xlsx");
      })
      .catch((error) => {
        console.log("Error while retrieving error validation");
      });
  };

  // function exportReportFile() {
  //   axios.get(apiDetails.baseUrl.trim() + '/api/v1/Report/DownloadPayrollFundingInformation/1', { responseType: 'arraybuffer' })
  //     .then((response) => {
  //       var blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  //       fileSaver.saveAs(blob, 'PayrollFunding.xlsx');
  //     });
  // }

  console.log(fundingInfo, "SEE", isLoading);
  console.log(fundingInfo.length, "SEE", isLoading);

  return (
    <div>
      <div className="d-flex justify-content-between align-center">
        <div className="ft-12 grey-text font-weight-500">
          Payroll Funding in {fundingInfo.length} Records
        </div>
        {/* <div>
          <ExcelNameExport
            data={contributionDetails}
            fileName={"payroll_funding_contribution.xls"}
            name="Payroll Funding Report"
          />
        </div> */}
        <p
          className="excel-text"
          onClick={() =>
            exportReportFile({
              fileId: 1,
            })
          }
        >
          Payroll Funding Report
          <Image src={ExcelImage} width="14px" />
        </p>
      </div>
      {fundingInfo &&
        fundingInfo.map((item) => (
          <div>
            <div className="contribution-detail">
              <div className="filename">Contribution Details</div>
              <Row className="mb-20">
                <Col md="2">
                  <p className="ft-12 grey-text font-weight-500">Plan ID</p>
                  <p className="ft-12 black-text font-weight-500">
                    {item.contributionDetails.planId}
                  </p>
                </Col>
                <Col md="2">
                  <p className="ft-12 grey-text font-weight-500">Pay date</p>
                  <p className="ft-12 black-text font-weight-500">
                    {/* {item.contributionDetails.payDate} */}
                    {getDateWithSlash(item.contributionDetails.payDate)}
                  </p>
                </Col>
                <Col md="8" className="text-right">
                  <p className="ft-12 grey-text font-weight-500">
                    Total amount
                  </p>
                  <p className="ft-18 black-text font-weight-500">
                    $ {item.contributionDetails.total}
                  </p>
                </Col>
              </Row>
              <div className="d-flex justify-content-between">
                {item.contributionDetails.sourceTransactionDetails.map(
                  (data, index) => (
                    <>
                      <div>
                        <p className="ft-12 grey-text font-weight-500">
                          {data.name}
                        </p>
                        <p className="ft-12 black-text font-weight-500">
                          $ {data.amount}
                        </p>
                      </div>
                    </>
                  )
                )}
                <div>
                  <p className="ft-12 grey-text font-weight-500">
                    Loan repayment
                  </p>
                  <p className="ft-12 black-text font-weight-500">
                    ${" "}
                    {item.contributionDetails.loanTransactionDetails.reduce(
                      (a, v) => (a = a + v.amount),
                      0
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="funding-detail">
              <div className="filename">Funding Details</div>
              <Row className="mb-40">
                <Col md="3">
                  <p className="ft-12 grey-text font-weight-500">
                    File load rate
                  </p>
                  <p className="ft-12 black-text font-weight-500">
                    {getDateTimeAMPM(item.fundingDetails.fileLoadDate)}
                  </p>
                </Col>
                <Col md="3">
                  <p className="ft-12 grey-text font-weight-500">
                    Funding date
                  </p>
                  <p className="ft-12 black-text font-weight-500">
                    {getDateTimeAMPM(item.fundingDetails.fundingDate)}
                  </p>
                </Col>
                <Col md="3">
                  <p className="ft-12 grey-text font-weight-500">Plan ID</p>
                  <p className="ft-12 black-text font-weight-500">
                    {item.fundingDetails.planId}
                  </p>
                </Col>
                <Col md="3">
                  <p className="ft-12 grey-text font-weight-500">Pay date</p>
                  <p className="ft-12 black-text font-weight-500">
                    {getDateWithSlash(item.fundingDetails.payDate)}
                  </p>
                </Col>
              </Row>
              <Row className="mb-20">
                <Col md="3">
                  <p className="ft-12 grey-text font-weight-500">
                    Bank details
                  </p>
                  <p className="ft-12 black-text font-weight-500">
                    {item.fundingDetails.bankName}
                  </p>
                </Col>
                <Col md="3">
                  <p className="ft-12 grey-text font-weight-500">
                    Bank account number
                  </p>
                  <p className="ft-12 black-text font-weight-500">
                    {maskedBankAccountNumberNormalizer(
                      item.fundingDetails.bankAccountNumber
                    )}
                  </p>
                </Col>
                <Col md="2">
                  <p className="ft-12 grey-text font-weight-500">
                    Forfeiture Type
                  </p>
                  {item.fundingDetails.forfeitureDetails.map((data, index) => (
                    <>
                      <p className="ft-12 black-text font-weight-500">
                        <div> {data.forfeitureType}</div>
                      </p>
                    </>
                  ))}
                </Col>
                <Col md="2">
                  <p className="ft-12 grey-text font-weight-500">
                    Forfeiture Amount
                  </p>
                  {item.fundingDetails.forfeitureDetails.map((data, index) => (
                    <>
                      <p className="ft-12 black-text font-weight-500">
                        <div> ${data.forfeitureAmount}</div>
                      </p>
                    </>
                  ))}
                </Col>
                <Col md="2">
                  <p className="ft-12 grey-text font-weight-500">
                    Funding amount
                  </p>
                  <p className="ft-12 black-text font-weight-500">
                    $ {item.fundingDetails.fundingAmount}
                  </p>
                </Col>
              </Row>
            </div>
          </div>
        ))}
      ;
    </div>
  );
};

export default PayrollFunding;
