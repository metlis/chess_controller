import React from "react";

export type ComponentRefresh = {
  val?: boolean;
  setVal?: React.Dispatch<React.SetStateAction<boolean>>;
};

export type RefreshableConstructor = new (...args: any[]) => {};
