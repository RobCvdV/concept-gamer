import { useEffect, useState } from "react";

export type Pos = { x: number; y: number };

export let globalMousePosition: Pos = { x: 0, y: 0 };

export function useMousePosition(): Pos {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    window.onmousemove = (e) => {
      globalMousePosition = { x: e.clientX, y: e.clientY };
      setPos(globalMousePosition);
    };
  }, []);
  return pos;
}

export function useMouseUp(onMouseUp: (pos: Pos) => void): void {
  useEffect(() => {
    window.onmouseup = (e) => {
      const pos = { x: e.clientX, y: e.clientY };
      onMouseUp(pos);
    };
  }, [onMouseUp]);
}
