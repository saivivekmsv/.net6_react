import React, { useState } from "react";
import { get } from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronRight,
} from "@fortawesome/pro-light-svg-icons";
import { CsplTable as Table } from "../../../../../shared/components";
import { OPTIONS_DATA_MAPPER, usDateFormat } from "../../../../../shared/utils"

const columns = [
  {
    label: "",
    className: "column-accordion-icon",
    columnName: "icon",
  },
  {
    label: "Eligibility Status",
    className: "column-accordion-eligiblityStatus",
    columnName: "eligiblityStatus",
    dataMapper: OPTIONS_DATA_MAPPER.ELIBILITY_STATUS,
  },
  {
    label: "Eligibility Requirement Met Date",
    className: "column-accordion-eligibilityRequirementMetDate",
    columnName: "eligibilityRequirementMetDate",
    type: "date",
  },
  {
    label: "Entry Date",
    className: "column-accordion-entryDate",
    columnName: "entryDate",
    type: "date",
  },
  {
    label: "Eligibility Run Date",
    className: "column-accordion-eligibilityRunDate",
    columnName: "eligibilityRunDate",
    type: "date",
  },
  {
    label: "Anchor Eligibility",
    className: "column-accordion-anchorEligibility",
    columnName: "anchorEligibility",
    type: "boolean",
  },
  {
    label: "Effective Start Date",
    className: "column-accordion-effectiveStartDate",
    columnName: "effectiveStartDate",
    type: "date",
  },
  {
    label: "Effective End Date",
    className: "column-accordion-effectiveEndDate",
    columnName: "effectiveEndDate",
    type: "date",
  },
];

const RowGroup = ({ index, eligibilityDetail }) => {
  const [showAccordion, setShowAccordion] = useState(false);
  const className = showAccordion ? "open" : "";
  return (
    <>
      <Table.Tr
        key={index}
        onClick={() => setShowAccordion(!showAccordion)}
        className={`parent-row ${className}`}
      >
        {columns.map((item, cellIndex) => {
          const getContent = () => {
            const columnName = item.columnName;
            if (item.dataMapper) {
              return item.dataMapper[eligibilityDetail[columnName]];
            }
            if (item.type === "boolean") {
              return eligibilityDetail[columnName] ? "Yes" : "No";
            }
            if (item.type === "date") {
              return usDateFormat(eligibilityDetail[item.columnName]);
            }
            if (item.columnName === "icon") {
              return (
                <FontAwesomeIcon
                  icon={!showAccordion ? faChevronRight : faChevronDown}
                />
              );
            }
            return eligibilityDetail[columnName];
          };
          return (
            <Table.Td key={cellIndex} className={item.className}>
              {getContent()}
            </Table.Td>
          );
        })}
      </Table.Tr>
      {showAccordion && (
        <Table.Tr key={index}>
          <Table.Td className="icon" />
          <Table.Td className="w-100 accordion-wrapper">
            <div className="d-flex justify-content-between w-100 py-3 pr-5">
              <div className="accordion-item">
                <div className="accordion-label">Payroll base eligibility</div>
                <div className="accordion-value">
                  {eligibilityDetail.payrollBasedEligibility ? "Yes" : "No"}
                </div>
              </div>
              <div className="accordion-item">
                <div className="accordion-label">Reason</div>
                <div className="accordion-value">
                  {eligibilityDetail.reason}
                </div>
              </div>
              <div className="accordion-item">
                <div className="accordion-label">Correction record</div>
                <div className="accordion-value">
                  {eligibilityDetail.correctionRecords}
                </div>
              </div>
              <div className="accordion-item">
                <div className="accordion-label">Updated through</div>
                <div className="accordion-value">
                  {eligibilityDetail.updatedThrough}
                </div>
              </div>
              <div className="accordion-item">
                <div className="accordion-label">Updated by</div>
                <div className="accordion-value">
                  {eligibilityDetail.updatedBy}
                </div>
              </div>
            </div>
          </Table.Td>
        </Table.Tr>
      )}
    </>
  );
};

const EligibilityOverrideSlideTable = ({ data }) => {
  console.log(data);
  return (
    <div className="eligibiliy-slider-table">
      <div className="plan-sub-heading">Eligibility History</div>
      <div className="header-details">
        <div className="label">Source Name</div>
        <div className="value">{get(data, "sourceName")}</div>
      </div>
      <br />
      <Table className="eligibility-override">
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
          {get(data, "history", []).map((eligibilityDetail, index) => {
            console.log(eligibilityDetail);
            return (
              <RowGroup
                key={index}
                eligibilityDetail={eligibilityDetail}
                index={index}
              />
            );
          })}
        </Table.Tbody>
      </Table>
    </div>
  );
};

export default EligibilityOverrideSlideTable;
