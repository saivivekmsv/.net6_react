import React from "react";
import { render } from "@testing-library/react";
import { Form } from "react-bootstrap";
import FormControl from "./FormControl";
import { FormButtonGroup } from "../";
import { yesNoOptions } from "../../utils";

describe("FormControl", () => {
  test("to match snapshot", () => {
    const { baseElement } = render(
      <FormControl>
        <FormButtonGroup options={yesNoOptions} />
      </FormControl>
    );
    expect(baseElement).toMatchSnapshot();
  });

  test("to match snapshot with suggestion loading", () => {
    const { baseElement } = render(
      <FormControl hasSuggestion isSuggestionLoading>
        <Form.Control
          type="text"
          name={"field1"}
          autoComplete="none"
          value={"1234"}
        />
      </FormControl>
    );
    expect(baseElement).toMatchSnapshot();
  });

  test("to match snapshot with suggestion default text", () => {
    const wrapper = render(
      <FormControl
        hasSuggestion
        isSuggestionLoading={false}
        suggestionDefaultText="test"
        value=""
      >
        <Form.Control
          type="text"
          name={"field1"}
          autoComplete="none"
          value={"1234"}
        />
      </FormControl>
    );
    expect(wrapper.baseElement).toMatchSnapshot();
    expect(wrapper.container.querySelectorAll(".suggest-text").length).toBe(1);
  });

  test("to match snapshot with suggestion is valid", () => {
    const control = ({ isSuggestionLoading, isValidSuggestion }) => (
      <FormControl
        hasSuggestion={true}
        isSuggestionLoading={isSuggestionLoading}
        isValidSuggestion={isValidSuggestion}
        suggestionDefaultText="test"
      >
        <Form.Control
          type="text"
          name={"field1"}
          autoComplete="none"
          value={"1234"}
        />
      </FormControl>
    );
    const wrapper = render(
      control({ isSuggestionLoading: false, isValidSuggestion: false })
    );

    wrapper.rerender(
      control({ isSuggestionLoading: true, isValidSuggestion: false })
    );

    wrapper.rerender(
      control({ isSuggestionLoading: false, isValidSuggestion: true })
    );

    expect(wrapper.baseElement).toMatchSnapshot();
    expect(
      wrapper.container.querySelectorAll(".check-cirle.valid").length
    ).toBe(1);
  });

  test("to match snapshot with suggestion is invalid", () => {
    const control = ({ isSuggestionLoading, isValidSuggestion }) => (
      <FormControl
        hasSuggestion={true}
        isSuggestionLoading={isSuggestionLoading}
        isValidSuggestion={isValidSuggestion}
        suggestionDefaultText="test"
      >
        <Form.Control
          type="text"
          name={"field1"}
          autoComplete="none"
          value={"1234"}
        />
      </FormControl>
    );
    const wrapper = render(
      control({ isSuggestionLoading: false, isValidSuggestion: false })
    );

    wrapper.rerender(
      control({ isSuggestionLoading: true, isValidSuggestion: false })
    );

    wrapper.rerender(
      control({ isSuggestionLoading: false, isValidSuggestion: false })
    );
    expect(wrapper.baseElement).toMatchSnapshot();
    expect(
      wrapper.container.querySelectorAll(".check-cirle.invalid").length
    ).toBe(1);
  });
});
