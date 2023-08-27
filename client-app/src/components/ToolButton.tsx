import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FC } from "react";
import { Button } from "react-bootstrap";
import { ButtonProps } from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./ToolButton.css";

type Props = ButtonProps & {
  icon?: IconDefinition;
};

export const ToolButton: FC<Props> = ({ icon, children, ...props }) => {
  return (
    <Button {...props} className="ToolButton">
      {icon && <FontAwesomeIcon icon={icon} />}
      {children}
    </Button>
  );
};
