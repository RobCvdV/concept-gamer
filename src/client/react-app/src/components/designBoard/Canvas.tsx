import React, { FC, useState } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { BeProps, BoardElement } from "./BoardElement";

type Props = React.PropsWithChildren & {};

export const Canvas: FC<Props> = ({ children }) => {
  const [cards, setCards] = useState<BeProps[]>(
    [0, 1, 2, 3, 4, 5].map((c) => ({
      position: { x: 100 + c * 20, y: 200 + Math.abs(c - 2.5) * 7 },
      size: { w: 30, h: 100 },
      rotation: -25 + c * 10,
      scale: 1,
    }))
  );

  return (
    <TransformWrapper
      centerOnInit={false}
      centerZoomedOut={false}
      limitToBounds={false}
      wheel={{ step: 0.1 }}
    >
      <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }}>
        {/*<span style={{ color: "green" }}>Can I see this?</span>*/}
        {cards.map((card) => (
          <BoardElement {...card}>
            <div
              style={{
                border: "1px solid white",
                fontSize: "10px",
                backgroundColor: "darkcyan",
              }}
            >
              Hi there what do ou want?
            </div>
          </BoardElement>
        ))}
      </TransformComponent>
    </TransformWrapper>
  );
};
