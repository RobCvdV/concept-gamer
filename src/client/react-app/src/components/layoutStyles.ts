import { CSSProperties } from "react";

type Justify = "flex-start" | "flex-end" | "stretch";
type Align = "flex-start" | "flex-end" | "stretch" | "center";

export const row = (
  justify: Justify = "flex-start",
  align: Align = "center"
): CSSProperties => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: justify,
  alignItems: align,
});

export const rowRight: CSSProperties = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-end",
};

export const column = (
  justify: Justify = "flex-start",
  align: Align = "center"
): CSSProperties => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: justify,
  alignItems: align,
});

export const columnBottom: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-end",
};

export const flex0: CSSProperties = {
  flex: 0,
};

export const flex1: CSSProperties = {
  flex: 1,
};
