import React, { FC } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

type Props = React.PropsWithChildren & {};

export const Canvas: FC<Props> = ({ children }) => {
  return (
    <TransformWrapper>
      <TransformComponent>{children}</TransformComponent>
    </TransformWrapper>
  );
};
