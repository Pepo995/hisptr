import {
  ShimmerTitle,
  ShimmerThumbnail,
  ShimmerText,
} from "react-shimmer-effects";
import { Row, Col, CardBody, Card } from "reactstrap";

function ShimmerPhotoOverlay() {
  return (
    <>
      <Row className="match-height">
        <Col lg={6}>
          <Card>
            <ShimmerTitle line={1} className="w-30 mx-2 mt-1" />
            <CardBody>
              <ShimmerText line={3} gap={10} />
              <br />
              <ShimmerThumbnail height={170} width={170} rounded />
            </CardBody>
          </Card>
        </Col>
        <Col lg={6}>
          <Card>
            <ShimmerTitle line={1} className="w-30 mx-2 mt-1" />
            <CardBody>
              <ShimmerText line={3} gap={10} />
              <br />
              <ShimmerThumbnail height={200} width={170} rounded />
            </CardBody>
          </Card>
        </Col>
        <Col lg={6}>
          <Card>
            <ShimmerTitle line={1} className="w-30 mx-2 mt-1" />
            <CardBody>
              <ShimmerText line={3} gap={10} />
              <br />
              <ShimmerThumbnail height={110} width={220} rounded />
            </CardBody>
          </Card>
        </Col>
        <Col lg={6}>
          <Card>
            <ShimmerTitle line={1} className="w-30 mx-2 mt-1" />
            <CardBody>
              <Row>
                <Col lg={6}>
                  <ShimmerText line={1} gap={10} />
                </Col>
                <Col lg={6}>
                  <ShimmerText line={1} gap={10} />
                </Col>
                <Col lg={6}>
                  <ShimmerText line={1} gap={10} />
                </Col>
                <Col lg={6}>
                  <ShimmerText line={1} gap={10} />
                </Col>
              </Row>
              <hr />
              <ShimmerTitle line={1} className="w-30  mt-1" />
              <br />
              <ShimmerThumbnail height={110} width={220} rounded />
            </CardBody>
          </Card>
        </Col>
        <Col lg={12}>
          <Card>
            <ShimmerTitle line={1} className="w-30 mx-2 mt-1" />
            <CardBody>
              <ShimmerText line={1} gap={10} />
              <br />
              <ShimmerThumbnail height={160} width={270} rounded />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
}
export default ShimmerPhotoOverlay;
