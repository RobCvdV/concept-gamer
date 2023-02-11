import { useRef } from "react";
import { Constructor } from "../types/Constructor";

export function useUseCase<UC>(ctor: Constructor<UC>): UC {
  const ref = useRef<UC>(new ctor());
  return ref.current;
}
