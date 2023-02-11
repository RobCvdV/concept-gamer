import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
} from "react";
import { Button, Form, InputGroup } from "react-bootstrap";

type Props = {
  onSubmit: (text: string) => void;
  label?: string;
  placeholder?: string;
  multiline?: boolean;
  style?: React.CSSProperties;
  confirmButton?: string;
};

const formStyle: React.CSSProperties = {
  flex: 0,
  display: "flex",
  flexDirection: "row",
  justifyContent: "stretch",
};

export type InputRef = {
  focus: () => void;
  current: HTMLInputElement | null;
};

export const Input = forwardRef<InputRef, Props>(
  (
    { onSubmit, label, placeholder, style, multiline = false, confirmButton },
    ref?
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);
    useImperativeHandle(ref, () => ({
      focus: () => inputRef.current?.focus(),
      current: inputRef.current,
    }));

    const onSubmitInner = useCallback(
      (e: any) => {
        e.preventDefault();
        const input = inputRef.current;
        if (!input) return;
        onSubmit(input.value);
        if (confirmButton) {
          input.value = "";
        }
      },
      [inputRef, onSubmit, confirmButton]
    );

    return (
      <Form onSubmit={onSubmitInner}>
        <InputGroup className="mb-3">
          {label && <InputGroup.Text id="front">{label}</InputGroup.Text>}
          <Form.Control
            placeholder={placeholder}
            aria-label="Username"
            aria-describedby="front"
            onSubmit={onSubmitInner}
            ref={inputRef}
          />
          {confirmButton && (
            <Button variant="outline-secondary" onClick={onSubmitInner}>
              {confirmButton}
            </Button>
          )}
        </InputGroup>
      </Form>
    );
  }
);
