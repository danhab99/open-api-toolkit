import React from "react";

export type GridProps = {
  // ...
};

export function Grid(props: React.PropsWithChildren<GridProps>) {
  return <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{props.children}</div>;
}
