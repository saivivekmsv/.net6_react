import React from "react";
import {Row,Col,Container} from "react-bootstrap"
const Footer = () => {
  return (
    <footer className="footer">      
        
        <Container fluid>
          <Row>
            <Col>
              <span>footer content</span>
            </Col>
          </Row>
        </Container>
        
       
    </footer>
  );
};
export default Footer;
