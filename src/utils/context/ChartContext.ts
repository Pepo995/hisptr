import React from "react";

const ChartContext = React.createContext({
  chartLoad: false,
  setChartLoad: () => false,
} as {
  chartLoad: boolean;
  setChartLoad?: React.Dispatch<React.SetStateAction<boolean>>;
});

export default ChartContext;
