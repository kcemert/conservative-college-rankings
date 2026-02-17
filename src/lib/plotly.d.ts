declare module "react-plotly.js" {
  import { Component } from "react";

  interface PlotParams {
    data: object[];
    layout?: object;
    config?: object;
    style?: React.CSSProperties;
    className?: string;
    useResizeHandler?: boolean;
    onInitialized?: (figure: object, graphDiv: HTMLElement) => void;
    onUpdate?: (figure: object, graphDiv: HTMLElement) => void;
  }

  class Plot extends Component<PlotParams> {}
  export default Plot;
}
