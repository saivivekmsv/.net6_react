import React, { useState } from "react";
//import { SidebarForSponsor } from "../../components";
import {
  getAdvancedPathWithParam,
  getPathWithParam,
  PAYROLL_RECORDS_TO_FETCH,
} from "../../utils";
import { Button } from "react-bootstrap";
import SponsorPayrollLeftPanel from "./SponsorPayrollLeftPanel";
import SponsorPayrollCard from "../../components/SponsorPayrollCard/SponsorPayrollCard";
import SponsorPayrollFilterCard from "../../components/SponsorPayrollFilterCard/SponsorPayrollFilterCard";
import "../../styles/containers/SponsorPayrollListingContainer.scss";
import SponsorProgressBar from "../../components/SponsorProgressBar/SponsorProgressBar";
import { deleteUploadedFile } from "../../contexts";

const today = new Date();
const toDate = new Date(today.setDate(today.getDate()));
const fromDate = new Date(today.setDate(today.getDate() - 7));

const SponsorPayrollListingContainer = () => {
  const deleteFile = (id) => {
    deleteUploadedFile(id);
  };
  const carddata = [
    {
      fileStatus: "ErrorCorrectionRequired",
      fileName:
        "Gregarious Simulation Systems File with errors V2_12112020_201504784_12232020_114108435",
      uploadedOn: "02-01-2020 ",
      payDate: "Multiple dates",
      totalNumberOfRecords: "105",
      payrollTotals: "163,240.00",
      progress: "2",
      totalNumberOfWarnings: "0",
      totalNumberOfErrors: "0",
      totalDuplicateRecordsCount: "0",
      id: "1",
    },
    {
      fileStatus: "AwaitingFunding",
      fileName: "Netflix_Payroll_W2Oct21",
      uploadedOn: "02/01/2020 ",
      payDate: "09/21/2022",
      totalNumberOfRecords: "30",
      payrollTotals: "163,240.00",
      progress: "1",
      totalNumberOfWarnings: "0",
      totalNumberOfErrors: "0",
      totalDuplicateRecordsCount: "0",
      id: "2",
    },
    {
      fileStatus: "CreationInProgress",
      fileName: "Netflix_Payroll_Aprl26",
      uploadedOn: "05/01/2020 ",
      payDate: "26/04/2022",
      totalNumberOfRecords: "80",
      payrollTotals: "163,240.00",
      progress: "2",
      totalNumberOfWarnings: "0",
      totalNumberOfErrors: "0",
      totalDuplicateRecordsCount: "0",
      id: "3",
    },
  ];
  const data1 = {
    filename: "ABC-CA 2020FEBA",
    time: "17:59",
    date: "02/01/2021",
    completed: "75",
    filecount: "3",
    payrolldate: "11-22-2021",
    EC001: "EC001 : Contribution received for ineligible source",
    EC002: "EC002 : Contribution received prior to Employee Hire",
    EC003: "EC003 : Contribution received for ineligible source",
    WC001: " WC001 : The source contribution received is negative",
    WC002: " WC002 : IRS 402(g) contribution limit exceeded",
    WC003:
      " WC003 : Pay period recevied is greater than 56 for daily frequency",
  };

  const [setPayrollFilterLoading] = useState(false);
  const [setFieldValues] = useState({
    companyId: 0,
    planId: 0,
    fileStatus: 0,
    toDate: toDate,
    fromDate: fromDate,
    itemsAlreadyFetched: 0,
    recordsToFetch: PAYROLL_RECORDS_TO_FETCH,
  });

  return (
    <>
      {/* <SidebarForSponsor /> */}
      <div className="flex-row payroll-listing-outline">
        <SponsorPayrollLeftPanel
          filecount={data1.filecount}
          payrolldate={data1.payrolldate}
          EC001={data1.EC001}
          EC002={data1.EC002}
          EC003={data1.EC003}
          WC001={data1.WC001}
          WC002={data1.WC002}
          WC003={data1.WC003}
        />
        <div className="payroll-listing-container">
          <div className="payroll-filter">
            <div className="ft-18 fw-500 header">Payroll</div>
            <div className="sponsor-payroll-container justify-content-between align-item-center">
              <SponsorPayrollFilterCard
                setFieldValues={setFieldValues}
                setLoading={setPayrollFilterLoading}
              />
              <Button className="payroll-button">NEWPAYROLL</Button>
            </div>
          </div>

          <SponsorProgressBar
            filename={data1.filename}
            time={data1.time}
            date={data1.date}
            completed={data1.completed}
          />

          <div className="file-list payroll-listing-card">
            {carddata.map((data, index) => (
              <SponsorPayrollCard
                fileStatus={data.fileStatus}
                fileName={data.fileName}
                uploadedOn={data.uploadedOn}
                payDate={data.payDate}
                totalNumberOfRecords={data.totalNumberOfRecords}
                payrollTotals={data.payrollTotals}
                progress={data.progress}
                totalNumberOfWarnings={data.totalNumberOfWarnings}
                totalNumberOfErrors={data.totalNumberOfErrors}
                totalDuplicateRecordsCount={data.totalDuplicateRecordsCount}
                id={data.id}
                deleteUploadFile={() => deleteFile(data.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default SponsorPayrollListingContainer;
