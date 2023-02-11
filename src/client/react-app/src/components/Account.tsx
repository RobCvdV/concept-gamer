import React, { FC, RefObject, useCallback, useMemo } from "react";
import { Input, InputRef } from "./Input";
import { ManageUser } from "../useCases/ManageUser";
import { useModelState } from "../models/store";
import { Dropdown } from "react-bootstrap";
import { useUseCase } from "../hooks/useUseCase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  solid,
  regular,
  brands,
  icon,
} from "@fortawesome/fontawesome-svg-core/import.macro";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { Icon } from "./Icon";
import { DateTime } from "luxon";

const accountStyle: React.CSSProperties = {
  justifySelf: "flex-start",
  flex: 0,
  display: "flex",
  flexDirection: "column",
  fontSize: "14pt",
  justifyContent: "stretch",
};

type Props = {
  nextFocusRef?: RefObject<InputRef>;
};

export const Account: FC<Props> = ({ nextFocusRef }) => {
  const uc = useUseCase(ManageUser);

  const { userNames, user, lastActivity } = useModelState("userModel");
  const name = user.name;
  const isUnknown = !user.id;
  const isActive = !!(DateTime.fromISO("lastActivity")?.diffNow().minutes < 1);

  const onSubmitName = useCallback(
    (editedName: string) => {
      console.log("ui edit name", name, editedName);
      if (!editedName && name) uc.register(name);
      else if (name) uc.changeName(editedName);
      else uc.register(editedName);
      nextFocusRef?.current?.focus();
    },
    [uc, nextFocusRef, name]
  );

  const left = useMemo(() => {
    // const icon: IconProp = isUnkown ? "user" : "";
    return <Icon icon={regular("user")} />;
  }, [isUnknown, isActive]);

  const rightElement = useMemo(() => {
    return (
      <Dropdown>
        <Dropdown.Toggle variant="success" id="dropdown-basic">
          Select other user
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {userNames
            .filter((un) => un !== name)
            .map((un) => (
              <Dropdown.Item href="#">{un}</Dropdown.Item>
            ))}
        </Dropdown.Menu>
      </Dropdown>
    );
  }, [userNames, user, name]);

  return (
    <div style={accountStyle}>
      <Input
        key="name"
        leftElement={left}
        placeholder={name}
        onSubmit={onSubmitName}
        rightElement={rightElement}
        style={{ justifySelf: "flex-start" }}
      />
      <Dropdown>{userNames}</Dropdown>
    </div>
  );
};
