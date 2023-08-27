import { CSSProperties, FC } from "react";
import { Tools } from "./Tools";
import { Canvas } from "./Canvas";
import { column, flex1 } from "../layoutStyles";

type Props = {};

export const Document: FC<Props> = ({}) => {
  return (
    <div style={{ ...column("flex-start", "stretch"), ...flex1 }}>
      <Tools />
      <Canvas />
    </div>
  );
};
