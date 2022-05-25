import React, { useState } from "react";
import { Button, Dropdown, Form, InputGroup } from "react-bootstrap";
import logo from "../../assets/netflix-logo-0.png";
import {
    Dropside,
    FormControlSearch,
    SearchableList,
    SearchDropdownWithAPI,
} from "../../components";
import SponsorCard from "../../components/SponsorCards/SponsorCard";
import SponsorFieldview from "../../components/SponsorClassificationCard/SponsorFieldview";
import SponsorEmployeeCard from "../../components/SponsorEmployeeCard/SponsorEmployeeCard";
import SponsorListingSearch from "../../components/SponsorListingSearch/SponsorListingSearch";
import { Doughnut, Bar } from "react-chartjs-2";
import "../../styles/containers/SponsorEmployeeContainer.scss";
import DoughnutChart from "../../mocks/doughnutChart";
import employee from "../../mocks/employee.json";
import { get, result } from "lodash-es";
import SponsorDropdownOption from "../../components/SponsorDropdownOptions/SponsorDropdownOption";
import DropdownMenu from "react-overlays/esm/DropdownMenu";
import SponsorPlanDropdown from "../../components/SponsorPlanDropdown/SponsorPlanDropdown";
import { useDeepEffect } from "../../abstracts";
const SponsorEmployeeContainer = (data) => {
    const [planName, setPlanName] = useState();
    const [searchEmployee, setSearchEmployee] = useState(0);
    const [searchString, setSearchString] = useState("");
    const [searchResult, setSearchResult] = useState(employee);
    const [searchValue, setSearchValue] = useState("");
    const [dropValue, setDropValue] = useState("");
    const bitFlags = {
        enrolled: 1,
        eligible: 2,
        ineligible: 4,
        optedout: 8,
        terminated: 16,
    };

    useDeepEffect(() => {
        var result = searchEmployee ? employee?.filter((e) => (searchEmployee & bitFlags[e.empStatus]) === bitFlags[e.empStatus]) : employee;
        result = searchString?.searchValue ? result?.filter((_) => _.EmpId.toLowerCase().includes(searchString?.searchValue.toLowerCase())
            || _.name.toLowerCase().includes(searchString?.searchValue.toLowerCase()) || _.SSN.toLowerCase().includes(searchString?.searchValue.toLowerCase())|| _.status.toLowerCase().includes(searchString?.dropValue.toLowerCase()) ): result;
        //result = searchString?.dropValue?result?.filter((_) => _.status.toLowerCase().includes(searchString?.dropValue.toLowerCase())): result;
        setSearchResult(result);
    }, [searchEmployee, searchString]);


    var enrolledCount = (employee || []).filter((_) => _.empStatus === "enrolled")
        .length;
    var eligibleCount = (employee || []).filter((_) => _.empStatus === "eligible")
        .length;
    var ineligibleCount = (employee || []).filter(
        (_) => _.empStatus === "ineligible"
    ).length;
    var optedoutCount = (employee || []).filter((_) => _.empStatus === "optedout")
        .length;
    var terminatedCount = (employee || []).filter(
        (_) => _.empStatus === "terminated"
    ).length;

    const plans = [
        { planId: "783KCIUUNF01", planName: "783K Core Amazon_01 off 828731892" },
        { planId: "401KCORENF01", planName: "401K Core Netflix_01 get 9831712988" },
        { planId: "239KAJHFAJK3", planName: "239K Core Njfhaks_01 in 82173918" },
        { planId: "838KKAJSHDK2", planName: "838K Core Netflix_01 at 93484092" },
    ];
    const sort = [
        { planName: 'Name(A-Z)' }, { planName: 'Recently Edited' }, { planName: 'Name(Z-A)' }
    ]
    const employeeStatus = [
        { planName: "Active" },
        { planName: "Deceased" },
        { planName: "Military leave" },
        { planName: "Leave" },
        { planName: "Terminated" },
    ];
    const getActiveClass = (tabName) => (bitFlags[tabName] & searchEmployee) === bitFlags[tabName] ? `active-${tabName}` : "";
    return (
        <div
            className="flex-row"
            style={{
                paddingTop: "110px",
                paddingBottom: "50px",
                border: "1px solid #e0e0e0",
                backgroundColor: "#e5e5e5",
            }}
        >
            <div
                className="flex-row"
                style={{
                    width: "345px",
                    height: "790px",
                    borderRadius: "0px 10px 0px 0px",
                    backgroundColor: "white",
                }}
            >
                <div
                    style={{
                        background: "#2F80ED",
                        width: "102px",
                        borderRadius: "0px 60px 0px 0px",
                    }}
                ></div>
                <div
                    className="checking"
                    
                >
                    <img
                        src={logo}
                        style={{
                            width: "112px",
                            height: "35px",
                            paddingLeft: "7px",
                            marginBottom: "20px",
                        }}
                    />
                    <span className="title">Plan ID & name</span>
                    <div style={{ width: "203px" }}>
                        <SponsorPlanDropdown
                            placeHolder="Select"
                            options={plans}
                            setPlanName={setPlanName}
                        />
                    </div>
                    <div className="selected-plan">{planName}</div>

                    <div
                        style={{
                            width: "164px",
                            height: "168px",
                            margin: "22px 0px 12px 20px",
                            textAlign: "center",
                        }}
                    >
                        <DoughnutChart />
                        <div className="doughnut-text">
                            <div className="doughnut-count">{employee.length}</div>
                            <br />
                            <div className="total">Total</div>
                        </div>
                    </div>
                    <div
                        className={`employee-status-tabs enrolled-tab ${getActiveClass(
                            "enrolled"
                        )}`}
                        onClick={() =>
                            setSearchEmployee(bitFlags["enrolled"] ^ searchEmployee)
                        }
                    >
                        <div className="dot enrolled"></div>
                        <div
                            className="tabs-text"
                            
                        >
                            Enrolled
                        </div>
                        <div className="tabs-count marg-left-5" >
                            {enrolledCount}
                        </div>
                    </div>
                    <div
                        className={`employee-status-tabs eligible-tab ${getActiveClass(
                            "eligible"
                        )}`}
                        onClick={() =>
                            setSearchEmployee(bitFlags["eligible"] ^ searchEmployee)
                        }
                    >
                        <div className="dot eligible"></div>
                        <div
                            className="tabs-text"
                            
                        >
                            Eligible
                        </div>
                        <div className="tabs-count marg-left-5" >
                            {eligibleCount}
                        </div>
                    </div>

                    <div
                        className={`employee-status-tabs ineligible-tab ${getActiveClass(
                            "ineligible"
                        )}`}
                        onClick={() =>
                            setSearchEmployee(bitFlags["ineligible"] ^ searchEmployee)
                        }
                    >
                        <div className="dot ineligible"></div>
                        <div
                            className="tabs-text"
                            
                        >
                            Ineligible
                        </div>
                        <div className="tabs-count marg-left-5" >
                            {ineligibleCount}
                        </div>
                    </div>

                    <div
                        className={`employee-status-tabs optedout-tab ${getActiveClass(
                            "optedout"
                        )}`}
                        onClick={() =>
                            setSearchEmployee(bitFlags["optedout"] ^ searchEmployee)
                        }
                    >
                        <div className="dot optedout"></div>
                        <div
                            className="tabs-text"
                           
                        >
                            Opted Out
                        </div>
                        <div className="tabs-count marg-left-5" >
                            {optedoutCount}
                        </div>
                    </div>

                    <div
                        className={`employee-status-tabs terminated-tab ${getActiveClass(
                            "terminated"
                        )}`}
                        onClick={() =>
                            setSearchEmployee(bitFlags["terminated"] ^ searchEmployee)
                        }
                    >
                        <div className="dot terminated"></div>
                        <div
                            className="tabs-text"
                           
                        >
                            Terminated
                        </div>
                        <div className="tabs-count marg-left-5" >
                            {terminatedCount}
                        </div>
                    </div>
                    <div className="marg-top-20">
                        <SponsorFieldview title1="Participation Rate" value1="53.23%" />
                        <SponsorFieldview
                            title1="New employees"
                            value1="18"
                            tag="in past 1 month"
                        />
                    </div>
                </div>
            </div>

            <div
                className="disp-flex-col"
                style={{ marginLeft: "20px", height: "790px" }}
            >
                <div
                    className="disp-flex-col"
                    style={{
                        backgroundColor: "white",
                        borderRadius: "10px",
                        padding: "30px",
                    }}
                >
                    <div className="flex-row space-between border-bottom marg-bottom-10">
                        <div className="ft-18 fw-500">Employees</div>
                        <div>
                            <Button className="add-employee-button">Add New Employee</Button>
                        </div>
                    </div>
                    <div className="flex-row marg-top-15">
                        <div className="disp-flex-col">
                            <span className="small-header">Search employee</span>
                            <Form>
                                <div className="flex-search" style={{ width: '380px', height: '40px' }}>
                                    <InputGroup>
                                        <InputGroup.Prepend>
                                            <div className="search-icon-postion">
                                                <i class="fal fa-search" aria-hidden="true"></i>
                                            </div>
                                        </InputGroup.Prepend>

                                        <FormControlSearch
                                            size="md"
                                            type="search"
                                            screen="sponsor-employee"
                                            placeholder="Search by Name, SSN, ID"
                                            className="pad-left-search"
                                            //onChange={(e) => setSearchString(e.target.value)}
                                            onChange={(e) => setSearchValue(e.target.value)} />
                                    </InputGroup>
                                </div>
                            </Form>

                        </div>
                        <div className="disp-flex-col" style={{ marginLeft: "20px" }}>
                            <span className="small-header">Employement Status</span>
                            <SponsorPlanDropdown options={employeeStatus} placeHolder="-Select-" setDropValue={setPlanName} />
                        </div>
                        <div><Button className="search-button-sponsor" onClick={() => { setSearchString({searchValue: searchValue, dropValue:dropValue})}}>Search</Button></div>
                    </div>
                </div>

                <div className="flex-row space-between border-bottom ">
                    <div
                        style={{
                            padding: "20px 0px 20px 20px",
                            backgroundColor: "#e5e5e5",
                        }}
                    >
                        <SponsorPlanDropdown options={sort} icon={<i class="fas fa-sort-amount-up" style={{ marginRight: '10px' }}></i>} setPlanName={setPlanName} />
                    </div>
                    <div
                        style={{
                            fontSize: "14px",
                            fontWeight: "500",
                            color: "#333333",
                            padding: "20px 20px 20px 0px",
                            backgroundColor: "#e5e5e5",
                        }}
                    >
                        Total {employee.length} Records
                    </div>
                </div>
                <div className="employee-card-wrappper">
                    {searchResult.map((data, index) => (
                        <SponsorEmployeeCard
                            name={data.name}
                            SSN={data.SSN}
                            EmpId={data.EmpId}
                            status={data.status}
                            empStatus={data.empStatus}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SponsorEmployeeContainer;
