import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import { useSocket } from "../Providers/SocketContext";
import { Button, Form, InputGroup } from "react-bootstrap";

type Props = {
  onSubmit: (text: string) => void;
  label?: string;
  placeholder?: string;
  multiline?: boolean;
  style?: React.CSSProperties;
  showButton?: boolean;
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
    {
      onSubmit,
      label,
      placeholder,
      style,
      multiline = false,
      showButton = false,
    },
    ref?
  ) => {
    const socket = useSocket();
    const inputRef = useRef<HTMLInputElement>(null);
    useImperativeHandle(ref, () => ({
      focus: () => inputRef.current?.focus(),
      current: inputRef.current,
    }));

    useEffect(() => {
      // inputRef.current = ref?.current || null
    });

    const onSubmitInner = useCallback(
      (e: any) => {
        e.preventDefault();
        const input = inputRef.current;
        if (!input) return;
        onSubmit(input.value);
        if (showButton) {
          input.value = "";
        }
      },
      [inputRef, socket]
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
          {showButton && (
            <Button variant="outline-secondary" onClick={onSubmitInner}>
              {">"}
            </Button>
          )}
        </InputGroup>
      </Form>
    );
  }
);
