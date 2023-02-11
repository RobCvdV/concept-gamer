import { CSSProperties, FC } from "react";
import { Button, Container, Nav, Navbar, NavDropdown } from "react-bootstrap";

type Props = {};

const containerStyle: CSSProperties = {
  backgroundColor: "transparent",
  color: "#bbbbbb",
  fontSize: "12px",
};

export const Tools: FC<Props> = ({}) => {
  return (
    <Navbar bg="dark" expand="sm" variant="dark">
      <Container style={containerStyle}>
        <Button variant="outeline-dark">X</Button>
        <Button variant="warn">X</Button>
        <Button variant="outeline-secondary">X</Button>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#link">Link</Nav.Link>
            <NavDropdown title="Dropdown" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                Another action
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Separated link
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
