import { ShimmerPostItem } from "react-shimmer-effects";
import { Col, Row } from "reactstrap";
export const ShimmerEventCard = () => {
  return (
    <div className="blog-card">
      <Row>
        <Col lg={6}>
          <ShimmerPostItem card title text />
        </Col>
        <Col lg={6}>
          <ShimmerPostItem card title text />
        </Col>
        <Col lg={6}>
          <ShimmerPostItem card title text />
        </Col>
      </Row>
      <Row className="mt-2">
        <Col lg={6}>
          <ShimmerPostItem card title text />
        </Col>
        <Col lg={6}>
          <ShimmerPostItem card title text />
        </Col>
        <Col lg={6}>
          <ShimmerPostItem card title text />
        </Col>
      </Row>
      <Row className="mt-2">
        <Col lg={6}>
          <ShimmerPostItem card title text />
        </Col>
        <Col lg={6}>
          <ShimmerPostItem card title text />
        </Col>
        <Col lg={6}>
          <ShimmerPostItem card title text />
        </Col>
      </Row>
    </div>
  );
};
