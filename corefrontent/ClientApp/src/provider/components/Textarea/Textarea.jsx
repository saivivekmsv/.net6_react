import React from "react";
import { Form } from "react-bootstrap";

const Textarea = ({ name, value, className }) => {
  return (
    <Form.Group className={`${className}`}>
      <textarea name={name} rows="3">
        {value}
      </textarea>
    </Form.Group>
  );
};

export default Textarea;
