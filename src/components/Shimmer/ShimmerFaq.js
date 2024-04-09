import { ShimmerTitle } from "react-shimmer-effects";
import { Col, Row } from "reactstrap";

function ShimmerFaq() {
  return (
    <div className="mt-5 mb-5">
      <Row>
        <Col md={12}>
          <ShimmerTitle gap={10} variant="primary" />
        </Col>
        <Col md={12}>
          <ShimmerTitle gap={10} variant="primary" />
        </Col>
        <Col md={12}>
          <ShimmerTitle gap={10} variant="primary" />
        </Col>
        <Col md={12}>
          <ShimmerTitle gap={10} variant="primary" />
        </Col>
        <Col md={12}>
          <ShimmerTitle gap={10} variant="primary" />
        </Col>
        <Col md={12}>
          <ShimmerTitle gap={10} variant="primary" />
        </Col>
      </Row>
    </div>
  );
}
export default ShimmerFaq;
