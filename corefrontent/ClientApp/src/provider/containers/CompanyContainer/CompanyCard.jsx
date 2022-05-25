import React, { useState } from "react";
import { isEmpty } from "lodash";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { GetInitials, EditActionSlider } from "../../components";
import { getCommaSeparatedValuesFromArr, getNullTableItem } from "../../utils";
import AddToolTip from "../../components/AddToolTip";
import { useDeepEffect } from "../../abstracts";
import { getCompanyLogo } from "../../services";

const CompanyCard = ({
  name,
  planIds,
  totalEmployees,
  participation,
  logo,
  id,
  editLink,
}) => {
  const availablePlans = planIds || [];
  const plansToShow = availablePlans.slice(0, 2);
  const plansForToolTip = availablePlans.slice(2);
  const companyLogo =logo;
  
  return (
    <div className="company-card-item">
      <div className="company-card-item-content">
        <AddToolTip
          name={name}
          className="ft-14 font-weight-500 pb-3 company-name"
        />
        <EditActionSlider editLink={editLink} />
        <div className="d-flex">
          <div className="company-icon-wrapper d-flex justify-content-center">
            {!isEmpty( companyLogo) ? (
              <img
                alt=""
                src={companyLogo}
                style={{ width: "90px", height: "74px" }}
                className="img-fluid"
              />
            ) : (
              <GetInitials name={name} />
            )}
          </div>
          <div className="d-flex flex-column plan-details-wrapper px-2">
            <div>
              <div className="grey-text">Plan ID</div>
              <div className="d-flex justify-content-between ft-12 pb-3">
                <div className="w-75 text-overflow-ellipsis">
                  <AddToolTip
                    name={getNullTableItem(
                      getCommaSeparatedValuesFromArr(plansToShow)
                    )}
                    className="ft-14 font-weight-500 pb-3 company-name"
                  />
                </div>
                {!isEmpty(plansForToolTip) && (
                  <div>
                    <OverlayTrigger
                      overlay={
                        <Tooltip>
                          {plansForToolTip.map((item, index) => (
                            <div key={index}>{item}</div>
                          ))}
                        </Tooltip>
                      }
                    >
                      <div className="grey-text">
                        {plansForToolTip.length} more
                      </div>
                    </OverlayTrigger>
                  </div>
                )}
              </div>
            </div>
            {/* <div className="d-flex w-100 justify-content-between">
              <div>
                <div className="font-weight-500">{totalEmployees}</div>
                <div className="planTitle-text">Employees</div>
              </div>
              <div>
                <div className="font-weight-500">{participation}</div>
                <div className="planTitle-text">Participated</div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyCard;
