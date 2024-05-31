import { ComponentRefresh, RefreshableConstructor } from "../types";

function Refreshable<TBase extends RefreshableConstructor>(Base: TBase) {
  return class Refreshable extends Base {
    public componentRefresh: ComponentRefresh = {};

    public refreshComponent(): void {
      if (this.componentRefresh.setVal) {
        this.componentRefresh.setVal(!this.componentRefresh.val);
      }
    }
  };
}

export default Refreshable;
