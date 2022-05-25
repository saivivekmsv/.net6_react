import * as React from "react";
import {
  GridColumnMenuCheckboxFilter,
} from "@progress/kendo-react-grid";
import { DropDownFilterCell,FormControlSearch } from "../";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { Form, Button, InputGroup, Row, Modal } from "react-bootstrap";

const categories = [
  {
    value  : 1,
    label : "Sort Ascending Order" 
  },
  {
    value  : 2,
    label : "Sort Descending Order" 
  },
  {
    value  : 3,
    label : "Clear Sorting" 
  },
];

export const ColumnMenuCheckboxFilter = (props) => {
  return (
    <div>

      <div style={{padding : "20px"}}>
      <Row style={{margin : "5px"}}>Sort Ascending Order</Row>
      <Row style={{margin : "5px"}}>Sort Descending Order</Row>
      <Row style={{margin : "5px"}}>Clear Sorting</Row>
      </div>

      <div className="line-separator"></div>
      {/* <GridColumnMenuCheckboxFilter
        {...props}
        data={[]}
        expanded={true}
      /> */}
       <div className="search-bar w-453" style={{ width: "220px" }}>
          <Form>
            <InputGroup>
              <InputGroup.Prepend>
                <div className="search-icon-postion">
                  <i class="fal fa-search" aria-hidden="true"></i>
                </div>
              </InputGroup.Prepend>
              <FormControlSearch
                size="xs"
                type="search"
                className="plan-search-box pad-left-search"
                placeholder="Search"
                // onChange={(e) => setSearchSavedPlans(e.target.value)}
              />
            </InputGroup>
          </Form>
      </div>
      
    </div>
  );
};

export default ColumnMenuCheckboxFilter;
