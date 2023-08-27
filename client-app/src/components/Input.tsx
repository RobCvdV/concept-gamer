import React, {
  forwardRef,
  SyntheticEvent,
  UIEventHandler,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import "./Input.css";

type Props = {
  initValue?: string;
  onSubmit: (text: string) => void;
  onInput?: (text: string) => void;
  leftElement?: string | JSX.Element;
  rightElement?: string | JSX.Element;
  placeholder?: string;
  multiline?: boolean;
  style?: React.CSSProperties;
};

const formStyle: React.CSSProperties = {
  backgroundColor: "var(--bs-dark)",
};

export type InputRef = {
  focus: () => void;
  current: HTMLInputElement | null;
};

export const Input = forwardRef<InputRef, Props>(
  (
    {
      onSubmit,
      onInput,
      initValue,
      leftElement,
      rightElement,
      placeholder,
      style,
      multiline = false,
    },
    ref?
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [editValue, setEditValue] = useState("");

    useImperativeHandle(ref, () => ({
      focus: () => inputRef.current?.focus(),
      current: inputRef.current,
    }));

    const onInputInner = useCallback(
      (e: SyntheticEvent) => {
        e.preventDefault();
        const edit = inputRef.current?.value || "";
        console.log("editing", edit);
        setEditValue(edit);
        onInput && onInput(edit);
      },
      [setEditValue, onInput]
    );

    const onSubmitInner = useCallback(
      (e: SyntheticEvent) => {
        e.preventDefault();
        const input = inputRef.current;
        if (!input) return;
        onSubmit(input.value);
        if (rightElement) {
          input.value = "";
        }
      },
      [inputRef, onSubmit, rightElement]
    );

    const left = useMemo(() => {
      if (typeof leftElement !== "undefined") {
        return <InputGroup.Text>{leftElement}</InputGroup.Text>;
      } else return null;
    }, [leftElement]);

    const right = useMemo(() => {
      if (typeof rightElement === "string") {
        return (
          <Button
            disabled={!editValue}
            variant="outline-secondary"
            onClick={(e: SyntheticEvent) => {
              onSubmitInner(e);
              inputRef.current?.focus();
            }}
          >
            {rightElement}
          </Button>
        );
      } else
        return (
          (
            <InputGroup.Text style={{ padding: "0 3px" }}>
              {rightElement}
            </InputGroup.Text>
          ) || null
        );
    }, [rightElement, onSubmitInner, editValue]);

    return (
      <Form onSubmit={onSubmitInner} style={formStyle} className="Input">
        <InputGroup>
          {left}
          <Form.Control
            placeholder={placeholder}
            aria-label="Username"
            aria-describedby="front"
            onSubmit={onSubmitInner}
            onInput={onInputInner}
            ref={inputRef}
          />
          {right}
        </InputGroup>
      </Form>
    );
  }
);
