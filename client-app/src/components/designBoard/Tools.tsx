import { CSSProperties, FC } from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { justifyEnd } from "../layoutStyles";
import { ToolButton } from "../ToolButton";
import { regular, solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import { Icon } from "../Icon";
import { ToolSet } from "../ToolSet";

type Props = {};

const containerStyle: CSSProperties = {
  backgroundColor: "transparent",
  color: "#bbbbbb",
  fontSize: "20px",
  justifyContent: "flex-start",
  border: "solid 1px gray",
  padding: "0",
};

export const Tools: FC<Props> = ({}) => {
  return (
    <Navbar bg="dark" variant="dark" style={containerStyle}>
      <ToolSet topic={regular("file")}>
        <ToolButton icon={solid("plus")}></ToolButton>
        <ToolButton icon={solid("plus")}>5</ToolButton>
        <ToolButton icon={regular("square-plus")}></ToolButton>
      </ToolSet>
      <ToolSet topic={solid("dice-five")}>
        <ToolButton icon={solid("plus")}></ToolButton>
        <ToolButton icon={regular("square-plus")}></ToolButton>
        <ToolButton icon={regular("square-plus")}></ToolButton>
      </ToolSet>
    </Navbar>
  );
};
