import React from "react";
import { ShimmerText, ShimmerTitle } from "react-shimmer-effects";
import { Card, CardBody, Col, Row } from "reactstrap";

function FaqShimmer({ isSearching }) {
  return (
    <div>
      {!isSearching ? (
        <Row className="align-items-center">
          <Col lg={9}>
            <ShimmerTitle line={1} className="w-25" />
          </Col>
          <Col lg={3}>
            <ShimmerTitle line={1} />
          </Col>
        </Row>
      ) : null}
      <Card>
        <CardBody>
          {/* <ShimmerTitle line={1} className="w-25" /> */}
          <div className="faq-section mb-2">
            <ShimmerTitle line={1} />
            <ShimmerText line={2} />
            <ShimmerText line={2} />
          </div>
          {/* <ShimmerText line={1} className="w-25" /> */}
        </CardBody>
      </Card>
    </div>
  );
}

export default FaqShimmer;
