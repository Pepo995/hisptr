import React from "react";
import {
  ShimmerButton,
  ShimmerText,
  ShimmerTitle,
} from "react-shimmer-effects";
import { ModalBody } from "reactstrap";

const AvailabilityModalShimmer = () => {
  return (
    <div>
      <ModalBody>
        <ShimmerTitle line={2} gap={10} variant="secondary" />
        <ShimmerText line={7} gap={10} className="mt-3" />
        <div className="mt-2 d-flex">
          <ShimmerButton size="md" />
          &nbsp;
          <ShimmerButton size="md" />
        </div>
      </ModalBody>
    </div>
  );
};

export default AvailabilityModalShimmer;
