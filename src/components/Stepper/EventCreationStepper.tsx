import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import React from "react";
import { styled } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import StepConnector, { stepConnectorClasses } from "@mui/material/StepConnector";
import type { StepIconProps } from "@mui/material/StepIcon";

import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "tailwind.config";

const { theme } = resolveConfig<typeof tailwindConfig>(tailwindConfig);
const inactiveColor = theme.colors.slate.inactive;
const primaryColor = theme.colors.primary;

const Connector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 10,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: primaryColor,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: primaryColor,
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: inactiveColor,
    borderTopWidth: 6,
    borderRadius: 40,
    [theme.breakpoints.between("xs", "sm")]: {
      borderTopWidth: 1,
    },
  },
}));

const StepIconRoot = styled("div")<{ ownerState: { active?: boolean } }>(() => ({
  color: inactiveColor,
  display: "flex",
  height: 22,
  alignItems: "center",
  "& .QontoStepIcon-completedIcon": {
    color: "red",
    zIndex: 1,
    fontSize: 18,
  },
  "& .QontoStepIcon-circle": {
    width: 27,
    height: 27,
    borderRadius: "50%",
  },
}));

const StepIcon = ({ tabIndex, active, completed, className }: StepIconProps) => (
  <StepIconRoot ownerState={{ active }} className={className}>
    {completed ? (
      <div className="QontoStepIcon-circle tw-bg-primary">
        <p className="tw-text-white tw-text-center tw-font-montserrat tw-font-bold tw-text-xs tw-h-full tw-pt-[6px]">
          {tabIndex}
        </p>
      </div>
    ) : active ? (
      <div className="QontoStepIcon-circle tw-bg-white tw-border-primary min-[600px]:tw-border-4 tw-border-2">
        <p className="tw-text-black tw-text-center tw-font-montserrat tw-font-bold tw-text-xs tw-h-full min-[600px]:tw-pt-[3px] tw-pt-[5px]">
          {tabIndex}
        </p>
      </div>
    ) : (
      <div className="QontoStepIcon-circle tw-bg-white tw-border-slate-inactive min-[600px]:tw-border-4 tw-border-2">
        <p className="tw-text-black tw-text-center tw-font-montserrat tw-font-bold tw-text-xs tw-h-full min-[600px]:tw-pt-[3px] tw-pt-[5px]">
          {tabIndex}
        </p>
      </div>
    )}
  </StepIconRoot>
);

type EventCreationStepper = {
  activeStep: number;
};

const EventCreationStepper = ({ activeStep }: EventCreationStepper) => {
  const steps = [
    { number: 1 },
    { number: 2, name: "Event Details" },
    { number: 3, name: "Pricing" },
    { number: 4, name: "Instant Booking ⚡" },
  ];

  return (
    <div className="md:tw-m-0 tw-mt-5">
      <Stack sx={{ width: "100%" }} spacing={4}>
        <Stepper
          alternativeLabel
          activeStep={activeStep}
          connector={<Connector className="sm:tw-mx-2 tw-mx-0 left-0" />}
        >
          {steps.map((step, index) => (
            <Step key={step.number} className="tw-w-1/2 sm:tw-p-x-2 tw-p-0">
              <StepLabel StepIconComponent={StepIcon} StepIconProps={{ tabIndex: step.number }}>
                {index > activeStep && (
                  <p className="tw-flex tw-items-center tw-font-bold min-[600px]:tw-text-base tw-text-xs tw-justify-center tw-uppercase tw-text-slate-inactive">
                    {step.name}
                  </p>
                )}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Stack>
    </div>
  );
};

export default EventCreationStepper;
