import {
  ShimmerButton,
  ShimmerText,
  ShimmerThumbnail,
} from "react-shimmer-effects";
import { Col, Row } from "reactstrap";

const OffCanvas2Shimmer = () => {
  return (
    <div>
      <Row>
        <Col sm="11" className=" mx-2">
          <ShimmerText line={1} gap={10} variant="primary" />
          <br />
          <ShimmerThumbnail className={"mb-0"} height={30} rounded />
        </Col>

        <Col sm="11" className="mx-2">
          <ShimmerText line={1} gap={10} variant="primary" />
          <br />
          <ShimmerThumbnail className={"mb-0"} height={30} rounded />
        </Col>

        <Col sm="11" className="mx-2">
          <ShimmerText line={1} gap={10} variant="primary" />
          <br />
          <ShimmerThumbnail className={"mb-0"} height={30} rounded />
        </Col>

        <Col sm="11" className="mx-2">
          <ShimmerText line={1} gap={10} variant="primary" />
          <br />
          <ShimmerThumbnail className={"mb-0"} height={30} rounded />
        </Col>

        <Col sm="11" className="mx-2">
          <ShimmerText line={1} gap={10} variant="primary" />
          <br />
          <ShimmerThumbnail className={"mb-0"} height={30} rounded />
        </Col>

        <Col sm="11" className="mx-2">
          <ShimmerText line={1} gap={10} variant="primary" />
          <br />
          <ShimmerThumbnail className={"mb-0"} height={30} rounded />
        </Col>

        <Col sm="11" className="mx-2">
          <ShimmerText line={1} gap={10} variant="primary" />
          <br />
          <ShimmerThumbnail className={"mb-0"} height={30} rounded />
        </Col>

        <Col sm="11" className="mx-1">
          <ShimmerText line={1} gap={10} variant="primary" />
          <Row className="mt-1">
            <div className="d-flex">
              <Col sm="8">
                <ShimmerThumbnail className={"mb-0"} height={30} rounded />
              </Col>
              &nbsp;
              <Col sm="4">
                <ShimmerButton size="sm" />
              </Col>
            </div>
          </Row>
        </Col>
        <Col className="mx-1 mt-0">
          <ShimmerText line={1} gap={10} variant="primary" />
          <Row className="mt-1">
            <div className="d-flex">
              <Col sm="8">
                <ShimmerThumbnail className={"mb-0"} height={30} rounded />
              </Col>
              &nbsp;
              <Col sm="4">
                <ShimmerButton size="sm" />
              </Col>
            </div>
          </Row>
        </Col>

        <Col className="mx-1">
          <Row className="mt-1">
            <div className="d-flex">
              <Col sm="8">
                <ShimmerThumbnail className={"mb-0"} height={40} rounded />
              </Col>
              &nbsp;
              <Col sm="4">
                <ShimmerButton size="md" />
                &nbsp;
              </Col>
            </div>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default OffCanvas2Shimmer;
