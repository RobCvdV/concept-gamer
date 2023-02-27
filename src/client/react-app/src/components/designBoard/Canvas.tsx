import React, { FC, useState } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { BoardElement } from "./BoardElement";
import { Pos } from "../../hooks/useMousePosition";
import { useModelState } from "../../models/store";
import _ from "lodash";

type Props = React.PropsWithChildren & {};
export let globalMousePosition: Pos = { x: 0, y: 0 };

export const Canvas: FC<Props> = ({ children }) => {
  const { cards } = useModelState("boardModel");

  return (
    <TransformWrapper
      centerOnInit={false}
      centerZoomedOut={false}
      limitToBounds={false}
      wheel={{ step: 0.1 }}
      panning={{ excluded: ["panningDisabled"] }}
    >
      <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }}>
        <div
          onMouseMove={(ev) =>
            (globalMousePosition = { x: ev.clientX, y: ev.clientY })
          }
        >
          {_.values(cards).map((card) => (
            <BoardElement state={card}>
              <div
                className="panningDisabled"
                style={{
                  border: "1px solid white",
                  fontSize: "10px",
                  backgroundColor: "darkcyan",
                  borderRadius: "5px",
                  width: "50px",
                  height: "80px",
                  textAlign: "center",
                  margin: "auto 0",
                }}
              >
                Hi there what do you want?
              </div>
            </BoardElement>
          ))}
        </div>
      </TransformComponent>
    </TransformWrapper>
  );
};
