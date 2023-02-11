import React, { FC, RefObject, useCallback } from "react";
import { Input, InputRef } from "./Input";
import { ManageUser } from "../useCases/ManageUser";
import { useModelState } from "../models/store";
import { Dropdown } from "react-bootstrap";
import { useUseCase } from "../hooks/useUseCase";

const accountStyle: React.CSSProperties = {
  justifySelf: "flex-end",
  flex: 1,
  display: "flex",
  flexDirection: "column",
  fontSize: "14pt",
  justifyContent: "flex-end",
  border: "gray solid 1px",
  padding: "5px",
};

type Props = {
  nextFocusRef?: RefObject<InputRef>;
};

export const Account: FC<Props> = ({ nextFocusRef }) => {
  const uc = useUseCase(ManageUser);

  const {
    userNames,
    user: { name },
  } = useModelState("userModel");

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

  return (
    <div style={accountStyle}>
      <Input
        key="name"
        label="Account naam"
        placeholder={name}
        onSubmit={onSubmitName}
        confirmButton={name ? `Click if you are ${name}?` : ""}
        style={{ justifySelf: "flex-start" }}
      />
      <Dropdown>{userNames}</Dropdown>
    </div>
  );
};
