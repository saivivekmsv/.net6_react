import React from "react";
import { Link } from "react-router-dom";
import { Card } from "react-bootstrap";
// import "./loadDef.css";

function AggregateKeys({ fields, setfields, setselectFields }) {
  return (
    <div style={{ height: "31rem" }}>
      <p style={{ fontSize: "16px" }}>
        Aggregate Keys{" "}
        <span
          style={{ fontSize: "14px" }}
          className="text-info ml-5 click-to-select-aggkeys "
          onClick={() => {
            setselectFields(true);
          }}
        >
          {" "}
          Click to select{" "}
        </span>{" "}
      </p>
      <Card className="px-4 py-2 w-100 h-100 rounded">
        {fields
          .filter((item) => {
            if (item.selected) {
              return item;
            }
          })
          .map((element) => {
            return (
              <div className="border-bottom">
                <p style={{ fontSize: "12px" }} className="py-2 m-0">
                  {element.field}
                </p>
              </div>
            );
          })}
      </Card>
    </div>
  );
}

export default AggregateKeys;
