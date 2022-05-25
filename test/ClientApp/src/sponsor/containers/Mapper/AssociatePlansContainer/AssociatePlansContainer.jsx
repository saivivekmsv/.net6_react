import React, { useState } from "react";
import { ManageMapperLayout } from "../../../../shared/components";
import { Image, InputGroup, Button, Form, Row, Card } from "react-bootstrap";
import "../../../../shared/styles/containers/MapperAssociatePlans.scss";
import ManageAddPlanButton from "./ManageAddPlanButton";
import ManageAddPlanGroupButton from "./ManageAddPlanGroupButton";
import "../../../../shared/styles/containers/AddPlanSlider.scss";

const AssociatePlansContainer = (props) => {
  const buttons = [
    {
      label: "Cancel",
      variant: "secondary",
      type: "button",
    },
    {
      label: "Next",
      variant: "primary",
      type: "submit",
    },
  ];

  return (
    <ManageMapperLayout buttons={buttons}>
      <div>
        <div>
          <Card className="PlansAssociatedCard">
            <div style={{ fontSize: "16px", fontWeight: "400" }}>
              Plans Associated
            </div>
            <div>
              <div className="NumOfPlans" id="NumberOfPlansAdded">
                0
              </div>
              <div style={{ display: "flex", marginTop: "0px" }}>
                <div
                  className="AddedPlansText"
                  style={{ marginTop: "10px", width: "100px" }}
                >
                  Added Plans
                </div>

                <ManageAddPlanButton></ManageAddPlanButton>
              </div>
            </div>
          </Card>
        </div>

        <div className="planGroupTextContainer">
          <div>
            <div className="PlanGroupText">
              {" "}
              <p>Plan Group</p>{" "}
            </div>
            <div className="NumOfPlanGroupsText">
              <p>0 Found</p>
            </div>
          </div>
          <ManageAddPlanGroupButton></ManageAddPlanGroupButton>

          {/* <div style={{ width:"60px",marginLeft:"70px"}}>
                                    
                        <AddPlanButton
                        className="AddGroup"
                        buttonLabel="Add Group"
                        onPrimaryClick={onViewButtonClick}
                        //   disabled={isEdit && !isSave}
                        />
                    </div>                */}
        </div>
        <div
          style={{
            border: "0.5px solid #D1D1D1",
            bottom: "3%",
            marginTop: "10px",
          }}
        ></div>
      </div>
    </ManageMapperLayout>
  );
};

export default AssociatePlansContainer;
