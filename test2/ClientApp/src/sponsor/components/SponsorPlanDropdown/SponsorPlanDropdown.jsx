import React, { useState } from "react";
import { Button, Dropdown } from "react-bootstrap";
import { isEmpty } from "lodash";
import { Link } from "react-router-dom";
import empPhoto from "../../assets/employeePhoto.jpeg";
import {SponsorDropdownOption} from "../../components";
import { useDeepEffect } from "../../../shared/abstracts";

const SponsorPlanDropdown = (props) => {
    const [selectedPlanId, setSelectedPlanId] = useState()
    const [selectedPlanName, setSelectedPlanName] = useState();
    const optionClick = (item) => {
        setSelectedPlanId(item.planId);
        setSelectedPlanName(item.planName);
        props.setPlan(item);
    }

    useDeepEffect(() => {
        setSelectedPlanId(!isEmpty(props.options) ? props.options[0]?.planId : null);
        setSelectedPlanName(!isEmpty(props.options) ? props.options[0]?.planName : null)
    }, [props.options]);

    return (
        <div className="sponsor-organization-dropdown">
            <Dropdown style={{ width: "100%" }}>
                <Dropdown.Toggle
                    className="sponsor-dropdown-toggle"
                >
                    <div className="value dropdown-placeholder">{props.icon ? props.icon : ''}{selectedPlanName ? selectedPlanName : "Select"}</div>
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
                            <SponsorDropdownOption value={data.planId} title={data.planName} screen={data.screen} />
                        </Dropdown.Item>
                            <Dropdown.Divider /> </div>        
                    ))}
                </Dropdown.Menu>
            </Dropdown>
        </div>
    );
};

export default SponsorPlanDropdown;
