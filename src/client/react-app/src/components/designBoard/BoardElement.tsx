import { Position } from "../../types/Position";
import { CSSProperties, FC, ReactNode, useMemo } from "react";
import { Size } from "../../types/Size";

type Props = {
  position: Position;
  size: Size;
  scale: number;
  rotation: number;
  children?: ReactNode;
};

export type BeProps = Omit<Props, "children">;

export const BoardElement: FC<Props> = ({
  position,
  size,
  scale,
  rotation,
  children,
}) => {
  const containerStyle = useMemo<CSSProperties>(
    () => ({
      position: "absolute",
      transform: `translate(-50%, -50%) scale(${scale}) rotateZ(${rotation}deg)`,
      left: `${position.x}px`,
      top: position.y + "px",
      width: size.w + "px",
      height: size.h + "px",
    }),
    [position, size, scale, rotation]
  );

  return <div style={containerStyle}>{children}</div>;
};
