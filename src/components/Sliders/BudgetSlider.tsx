import Slider from "@mui/material/Slider";
import { styled } from "@mui/material/styles";
import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "tailwind.config";
import { Skin } from "@types";
import { type Config } from "tailwindcss";

const { theme } = resolveConfig<Config>(tailwindConfig);
const primaryColor = theme?.colors?.primary as string;

const CustomSlider = styled(Slider)(({ theme }) => ({
  color: primaryColor,
  height: 8,
  padding: "0 0",
  "& .MuiSlider-thumb": {
    height: 20,
    width: 20,
    backgroundColor: primaryColor,
    border: "2px white solid",
  },
  "& .MuiSlider-valueLabel": {
    fontWeight: 500,
    fontSize: 18,
    lineHeight: "20px",
    top: 50,
    backgroundColor: "unset",
    color: "#0F172A",
    "&:before": {
      display: "none",
    },
    [theme.breakpoints.between("xs", "sm")]: {
      fontSize: 16,
    },
    "& *": {
      background: "transparent",
      color: theme.palette.mode === Skin.Dark ? "#fff" : "#000",
    },
  },
  "& .MuiSlider-track": {
    border: "none",
  },
  "& .MuiSlider-rail": {
    opacity: 0.5,
    backgroundColor: "#ebe9f1",
  },
  "& .MuiSlider-mark": {
    backgroundColor: "#bfbfbf",
    height: 8,
    width: 1,
    "&.MuiSlider-markActive": {
      opacity: 1,
      backgroundColor: "currentColor",
    },
  },
}));

type BudgetSliderProps = {
  defaultValue: number;
  onChange: (event: Event, value: number | number[]) => void;
};

function iOS() {
  if (typeof window?.navigator === "undefined") return false;

  const { navigator } = window;

  return (
    ["iPad Simulator", "iPhone Simulator", "iPod Simulator", "iPad", "iPhone", "iPod"].includes(
      navigator.platform,
    ) ||
    (navigator.userAgent.includes("Mac") && "ontouchend" in document) ||
    (navigator.userAgent.includes("Mac") && navigator.maxTouchPoints > 1 && !window.MSStream)
  );
}

const BudgetSlider = ({ defaultValue, onChange }: BudgetSliderProps) => {
  const isIOS = iOS();

  const handleChange = (event: Event, newValue: number | number[]) => {
    if (isIOS && event.type === "mousedown") {
      return;
    }

    onChange(event, newValue);
  };

  return (
    <CustomSlider
      aria-label="Approximate Budget"
      defaultValue={defaultValue}
      valueLabelFormat={(value: number) => `$${value.toLocaleString()}`}
      valueLabelDisplay="on"
      step={100}
      min={0}
      max={10000}
      className="tw-font-inter"
      onChange={handleChange}
    />
  );
};

export default BudgetSlider;
