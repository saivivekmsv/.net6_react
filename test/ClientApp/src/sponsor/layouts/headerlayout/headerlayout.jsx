import React from "react";
import { Link } from "react-router-dom";
import {ROUTES} from "../../../shared/utils";
import { get } from "lodash";
import {
    Container,
    Navbar,
    Nav,
    Image,
    Row,
    Col,
    Dropdown,
} from "react-bootstrap";
// import { ROUTES } from "../../utils";
// import { IconDropDown, HeaderPopover } from "../";
// import { ReactComponent as UserIcon } from "./user-icon.svg";
// import { ReactComponent as VerticalTripleDots } from "./vertical-triple-dots.svg";
// import { LoginMenu } from "../api-authorization/LoginMenu";

import logo from "https://storageaccountcore2ad3a.blob.core.windows.net/logoimg/Ascensus.png";
import user from "https://storageaccountcore2ad3a.blob.core.windows.net/logoimg/user.png";
const HeaderLayout = (props) => {
    return (
        <header>
            <Row>
                <Col>
                    <Link to={ROUTES.HOME}>
                        <Image src={logo} fluid />
                    </Link>
                </Col>
                <Col>
                    <Image src={user} fluid />
                </Col>
                <Col>

                </Col>
            </Row>
        </header>
    );
};

export default HeaderLayout;
