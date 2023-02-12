import { CSSProperties, FC, ReactNode, useMemo } from "react";
import { Container, InputGroup, ListGroup, Stack } from "react-bootstrap";
import { Icon } from "./Icon";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";

type Props = {
  topic: string | IconDefinition;
  children: ReactNode;
};

const containerStyle: CSSProperties = {
  backgroundColor: "#444",
  color: "white",
  fontSize: "20px",
  justifyContent: "flex-start",
  alignItems: "stretch",
  borderRight: "solid 2px gray",
  padding: "0",
};

const toolsStyle: CSSProperties = {
  backgroundColor: "#000",
  justifyContent: "flex-start",
  alignItems: "stretch", // borderRight: "solid spx gray",
  padding: "5px",
};

export const ToolSet: FC<Props> = ({ topic, children }) => {
  const prefix = useMemo(
    () => (
      <div style={{ margin: "auto 10px" }}>
        {typeof topic === "string" ? (
          <InputGroup.Text>{topic}</InputGroup.Text>
        ) : (
          <Icon icon={topic} size={"lg"} />
        )}
      </div>
    ),
    [topic]
  );

  return (
    <Stack direction="horizontal" style={containerStyle}>
      {prefix}
      <Stack direction="horizontal" style={toolsStyle}>
        {children}
      </Stack>
    </Stack>
  );
};
