import React, { useState } from "react";
import { Image, InputGroup, Button, Form } from "react-bootstrap";
import FilterComponent from "./FilterButtons";
import { Droppable } from "react-beautiful-dnd";
import ActualSourceFieldComponent from "./ActualSourceFieldComponent";
import { isEmpty } from "lodash-es";
import { FormControlSearch } from "../../../components";

const SourceContainer = (props) => {
  const { characters, setCharacters, column, setDrag, mapped, data } = props;
  const [searchBar, showSearchBar] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  // const [isOpen, setisOpen] = useState({ isOpen: false, id: null });

  const numberOfFields = () =>
    characters.filter((e) => {
      if (Filter == "All") {
        return e;
      } else if (Filter == "Mapped") {
        return e.mapped;
      } else {
        return !e.mapped;
      }
    }).length;

  const [Filter, setFilter] = useState("All");
  const [list, setList] = useState(characters);
  const [showClear, setShowClear] = useState(false);

  const handleChange = (e) => {
    //    e.preventDefault();
    setShowClear(true);
    // handleChange(e);
    setSearchTerm(e.target.value);
    setList(
      characters.filter((c) =>
        c.fieldName.toLowerCase().includes(e.target.value.toLowerCase())
      )
    );
  };

  return (
    <div className="SourceContainer">
      <div className="SourceSearchButtonContainer">
        <div className="SourceTextContainer">
          <p className="SourceText">Source</p>
        </div>
        <div className="searchIconContainer">
          <Button
            variant="link"
            className="search-with-api-button"
            onClick={() => showSearchBar(!searchBar)}
          >
            <Image className="searchIcon" src="/assets/icons/svg/search.svg" />
          </Button>
        </div>
      </div>

      <div className="FileNameContainer">
        <div className="FileNameText w-100" id="MappingFileName">
          {data.fileName}
        </div>
        <div className="NumberOfFieldsText w-100" id="NumberOfFields">
          {numberOfFields()} Fields available in source file
        </div>
      </div>

      {searchBar && (
        <div className="SearchBarContainer">
          {/* <Form>
            <InputGroup> */}
          <div className="mapper-source-search-text">
            <FormControlSearch
              size="sm"
              id="source-search-box"
              type="text"
              className="source-search-box"
              placeholder="Search source fields here"
              onChange={handleChange}
              autoComplete="off"
              onKeyPress={(e) => {
                e.key === "Enter" && handleChange(e);
              }}
            />
          </div>
          {/* </InputGroup>
          </Form> */}
        </div>
      )}

      <FilterComponent
        Filter={Filter}
        setFilter={setFilter}
        setList={setList}
        characters={characters}
      />
      <Droppable droppableId={column}>
        {(provided) => (
          <ul
            className="fieldContainer"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {characters
              .filter((c) =>
                c.fieldName.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((item, index) => {
                return (
                  <ActualSourceFieldComponent
                    item={item}
                    index={index}
                    mapped={mapped}
                    characters={characters}
                    setCharacters={setCharacters}
                  />
                );
              })}
            {isEmpty(list) && <div className="ft-12">No fields found</div>}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
    </div>
  );
};

export default SourceContainer;
