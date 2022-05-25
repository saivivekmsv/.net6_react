import { InputGroup } from "react-bootstrap";
import { FormControlSearch } from "..";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { object } from "prop-types";

const SponsorListingSearch = ({ list, setResult, ...rest }) => {
  const search = (e) => {
    let searchString = e.target.value;
    setResult(
      list?.filter((item) => {
        if (typeof item == object) {
          let keys = Object.keys(item);
          if (keys?.includes(searchString)) return true;
          keys?.forEach((key) => {
            if (item[key].includes(searchString)) return true;
          });
          return false;
        } else return item.includes(searchString);
      })
    );
  };

  return (
    <div
      className="search-bar flex-search"
      style={{ width: "50%", marginTop: "1.25rem", marginBottom: "1.25rem" }}
    >
      <InputGroup>
        <InputGroup.Prepend>
          <div className="search-icon-postion">
            <i class="fal fa-search" aria-hidden="true"></i>
          </div>
        </InputGroup.Prepend>
        <FormControlSearch
          size="md"
          type="search"
          placeholder="Search"
          className="pad-left-search"
          onChange={search}
        />
      </InputGroup>
    </div>
  );
};

export default SponsorListingSearch;
