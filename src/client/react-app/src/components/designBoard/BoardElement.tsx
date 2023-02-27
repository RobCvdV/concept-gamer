import { Position } from "../../types/Position";
import React, {
  CSSProperties,
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Size } from "../../types/Size";
import { TransformComponent, useTransformContext } from "react-zoom-pan-pinch";
import { useMousePosition } from "../../hooks/useMousePosition";
import { globalMousePosition } from "./Canvas";
import { useDispatch } from "react-redux";
import { store } from "../../models/store";
import { CardState } from "../../models/boardModel";
//
// export type ElBase = {
//   position: Position;
//   size?: Size;
//   scale?: number;
//   rotation?: number;
// };

type Props = {
  state: CardState;
  children?: ReactNode;
};

export const BoardElement: FC<Props> = ({ state, children }) => {
  const {
    state: { positionX, positionY, scale },
  } = useTransformContext();
  const [dragging, setDragging] = useState(false);
  const [startPosition, setStartPosition] = useState(globalMousePosition);
  const [dragPosition, setDragPosition] = useState(globalMousePosition);

  const d = store.dispatch.boardModel;

  const containerStyle = useMemo<CSSProperties>(() => {
    const { position, scale = 1, rotation = 0 } = state;
    const x = position.x + (dragPosition.x - startPosition.x);
    const y = position.y + (dragPosition.y - startPosition.y);

    return {
      position: "absolute",
      transform: `translate(-50%, -50%) scale(${scale}) rotateZ(${rotation}deg)`,
      left: `${x}px`,
      top: `${y}px`,
    };
  }, [state, startPosition, dragPosition]);

  const onMouseDown = useCallback(() => {
    setStartPosition({
      x: globalMousePosition.x,
      y: globalMousePosition.y,
    });
    setDragPosition({
      x: globalMousePosition.x,
      y: globalMousePosition.y,
    });
    setDragging(true);
  }, [setStartPosition, setDragPosition, setDragging]);

  useEffect(() => {
    const handleWindowMouseMove = () => {
      const { position, scale = 1, rotation = 0 } = state;
      const x = position.x + (globalMousePosition.x - startPosition.x);
      const y = position.y + (globalMousePosition.y - startPosition.y);

      d.moveCard({
        id: state.id,
        position: { x, y },
      });
    };
    if (dragging) {
      window.addEventListener("mousemove", handleWindowMouseMove);
    } else window.removeEventListener("mousemove", handleWindowMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleWindowMouseMove);
    };
  }, [setDragPosition, dragging]);

  //style={containerStyle}
  return (
    <div
      className="panningDisabled"
      style={containerStyle}
      onMouseDown={onMouseDown}
      onMouseUp={() => setDragging(false)}
      onMouseOut={() => setDragging(false)}
      onMouseLeave={() => setDragging(false)}
      onBlur={() => setDragging(false)}
    >
      {children}
    </div>
  );
};
