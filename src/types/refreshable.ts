export type ComponentRefresh = {
  val?: boolean;
  setVal?: (val: boolean) => void;
};

export type RefreshableConstructor = new (...args: any[]) => {};
