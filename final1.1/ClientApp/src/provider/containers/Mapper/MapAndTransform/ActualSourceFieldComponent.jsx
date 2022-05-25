import React, { useState } from "react";
import { faEllipsisV, faCheckCircle } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { DataType } from "../../../utils";
import { Image, InputGroup, Button, Form, Card } from "react-bootstrap";
import EditSourceField from "./EditSourceField";

function ActualSourceFieldComponent({
  item,
  index,
  mapped,
  characters,
  setCharacters,
}) {
  const [isOpen, setisOpen] = useState(false);
  return (
    <>
      <Draggable
        key={item.fieldName}
        draggableId={item.fieldName}
        index={index}
      >
        {(provided, snapshot) => (
          <li
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            <Card
              className="cardCss"
              style={{
                background: "#F7F7F7",
              }}
            >
              <div className="ellipsis">
                <FontAwesomeIcon icon={faEllipsisV} size="2x" color="#828282" />
                <FontAwesomeIcon icon={faEllipsisV} size="2x" color="#828282" />
              </div>
              <div className="fieldTitle">
                <span className="fieldText">
                  {item.fieldName.replace("/", "")}
                </span>

                {item.mapped ? (
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    size="1x"
                    color="#3bb54a"
                  />
                ) : null}
              </div>
              <div className="columnTitle">
                <span className="columnText">{item.order}</span>
              </div>
              <div className="sampleData">
                <span className="sampleDataText">
                  Value : <span className="sampleValueText">{item.datum}</span>
                </span>
              </div>
              <div className="dataType">
                <span className="dataTypeText">
                  {DataType[item.type]}
                  <i
                    onClick={() => {
                      setisOpen(true);
                    }}
                    style={{ color: "#307BF6", cursor: "pointer" }}
                    className="far fa-edit ml-2"
                  ></i>
                </span>
              </div>
            </Card>

            <EditSourceField
              fieldHeader={item.fieldName.replace("/", "")}
              dataType={item.type}
              isOpen={isOpen}
              setisOpen={setisOpen}
              characters={characters}
              setCharacters={setCharacters}
              index={item.order}
            />
          </li>
        )}
      </Draggable>
    </>
  );
}

export default ActualSourceFieldComponent;
