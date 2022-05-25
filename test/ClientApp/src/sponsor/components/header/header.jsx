import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/pro-regular-svg-icons";
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
import { ROUTES } from "../../../shared/utils";
import {ColorSchemeToggle} from "../../../shared/components"
import {BackgroundFilledImage} from "../../../shared/components"
const Header = ({ onMenuChange, seletedRoute }) => {
  return (
    <header>
      
        <Container fluid>
          <Row>
            <Col>
            <Image src={`/assets/icons/svg/core.svg`} height="31" />
            </Col>
            <Col md={2}>
                <ColorSchemeToggle />
            
               <BackgroundFilledImage  pct={0}></BackgroundFilledImage>             
            
            
               <FontAwesomeIcon
                  icon={faEllipsisV}
                                   
                />
            </Col>
          </Row>
        </Container>
        
       
    </header>
  );
};

export default Header;
