import {
  ShimmerButton,
  ShimmerThumbnail,
  ShimmerTitle,
} from "react-shimmer-effects";
import { CardBody, Col, Row } from "reactstrap";

function ShimmerCreateTicket() {
  return (
    <>
      <CardBody>
        <Row>
          <Col lg={6}>
            <ShimmerTitle line={1} gap={10} variant="primary" />
          </Col>
          <Col lg={6}>
            <ShimmerTitle line={1} gap={10} variant="primary" />
          </Col>
        </Row>
        <Row>
          <Col lg={12}>
            <ShimmerTitle line={1} gap={10} variant="primary" />
          </Col>
        </Row>
        <Row className="mt-2">
          <Col lg={12}>
            <ShimmerThumbnail height={250} rounded />
          </Col>
        </Row>

        <div className="d-flex">
          <div className="me-1">
            <ShimmerButton />
          </div>
          <ShimmerButton />
        </div>
      </CardBody>
    </>
  );
}

export default ShimmerCreateTicket;
