import { CSSProperties, FC } from "react";
import { Tools } from "./Tools";
import { Canvas } from "./Canvas";
import { column } from "../layoutStyles";

type Props = {};

export const Document: FC<Props> = ({}) => {
  return (
    <div style={{ ...column("flex-start", "stretch"), width: "80%" }}>
      <Tools />
      <Canvas />
    </div>
  );
};
