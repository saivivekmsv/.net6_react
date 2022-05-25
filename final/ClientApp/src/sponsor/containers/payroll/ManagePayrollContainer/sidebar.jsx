import React from "react";
import { Tabs, Tab } from "react-bootstrap";
import { Image } from "react-bootstrap";
import moment from "moment";
const Sidebar = (props) => {

    const { content,companyDetails } = props;
    console.log(content);
    return (

        <div className="d-flex flex-column w-100 h-100 justify-space-between tile-with-border side-panel-container">
            <div>
                <Image src={content.sponsorLogo} height={100} />
            </div>
            <div className="d-flex flex-row justify-content-between tile-with-thick-borders align-items-center">
                <span className="title">Active Files</span>
                <span>25</span>
            </div>
            <div className="d-flex flex-column justify-content-between tile-with-thick-borders">
                <span className="title">Upcoming Payroll</span>
                <span>{moment(content.upComingPayoll).format('MM/DD/yyyy')}</span>
            </div>
            <div className="tile-alt-with-border">
                <span className="title">Frequently Occuring</span>
                <Tabs defaultActiveKey="errors" id="uncontrolled-tab-example" className="mb-3">

                    <Tab eventKey="errors" title="Errors">
                        <ul>
                            {
                                content.errors.map(_ =>
                                    <li className="error" key={_}>{_}</li>)
                            }
                        </ul>
                    </Tab>
                    <Tab eventKey="warnings" title="Warnings">
                        <ul>
                            {

                                content.warnings.map(_ =>
                                    <li className="warnings" key={_}>{_}</li>)

                            }
                        </ul>
                    </Tab>

                </Tabs>
            </div>
        </div>

    );
}

export default Sidebar;