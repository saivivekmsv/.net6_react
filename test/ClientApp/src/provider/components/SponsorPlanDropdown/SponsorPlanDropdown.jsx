import React, { useState } from "react";
import { Button, Dropdown } from "react-bootstrap";
import "../../styles/containers/SponsorEmployeeContainer.scss";
import { Link } from "react-router-dom";
import empPhoto from "../../assets/employeePhoto.jpeg";
import SponsorDropdownOption from "../SponsorDropdownOptions/SponsorDropdownOption";

const SponsorPlanDropdown = (props) => {

    const [selectedPlanId, setSelectedPlanId] = useState(props.placeHolder)
    const [selectedPlanName, setSelectedPlanName] = useState("")
    const optionClick = (item) => {
        setSelectedPlanId(item.planId);
        setSelectedPlanName(item.planName);
        props.setPlanName(item.planName);
    }

    return (
        <div>
            <Dropdown style={{ width: "100%" }}>
                <Dropdown.Toggle
                    className="sponsor-dropdown-toggle"
                >
                    <div className="value dropdown-placeholder">{props.icon ? props.icon : ''}{selectedPlanId ? selectedPlanId : selectedPlanName}</div>
                </Dropdown.Toggle>

                <Dropdown.Menu
                    className="dropdown-menu"
                >
                    <div
                        className="flex-row space-between marg-bot-20"
                    >
                        <div className="title">Select</div>
                        {/* <div className="cross-icon">
              <i class="fa fa-times" aria-hidden="true"></i>
            </div> */}
                    </div>

                    {props.options?.map((data, index) => (
                        <div><Dropdown.Item className="dropdown-item" onClick={() => { optionClick(data) }}>
                            <SponsorDropdownOption value={data.planId} title={data.planName} />
                        </Dropdown.Item>
                            <Dropdown.Divider /> </div>))}
                </Dropdown.Menu>
            </Dropdown>
        </div>
    );
};

export default SponsorPlanDropdown;
