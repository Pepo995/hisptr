import {
  ShimmerTitle,
  ShimmerButton,
  ShimmerBadge,
  ShimmerCircularImage,
} from "react-shimmer-effects";
import { Row, Col, CardBody, Card } from "reactstrap";

function ShimmerAddEvent() {
  return (
    <>
      <Card>
        <ShimmerTitle line={1} className="w-30 mx-2 mt-1" />

        <CardBody>
          <Row>
            <Col lg="3" md="6" xs="3" className="mb-1">
              <ShimmerBadge width={120} />
              <ShimmerTitle line={1} />
            </Col>

            <Col lg="3" md="6" xs="3" className="mb-1">
              <ShimmerBadge width={120} />
              <ShimmerTitle line={1} />
            </Col>

            <Col sm="6" className="mb-1">
              <ShimmerBadge width={120} />
              <ShimmerTitle line={1} />
            </Col>

            <Col sm="6" xs="3" className="mb-1">
              <ShimmerBadge width={120} />
              <ShimmerTitle line={1} />
            </Col>

            <Col sm="6" xs="3" className="mb-1">
              <ShimmerBadge width={120} />
              <ShimmerTitle line={1} />
            </Col>

            <Col sm="6" className="mb-1">
              <ShimmerBadge width={120} />
              <ShimmerTitle line={1} />
            </Col>

            <Col sm="6" xs="3" className="mb-1">
              <ShimmerBadge width={120} />
              <ShimmerTitle line={1} />
            </Col>

            <Col sm="6" xs="3" className="mb-1">
              <ShimmerBadge width={120} />
              <ShimmerTitle line={1} />
            </Col>

            <Col sm="6" className="mb-1">
              <ShimmerBadge width={120} />
              <ShimmerTitle line={1} />
            </Col>

            <Col sm="6" className="mb-1">
              <ShimmerBadge width={120} />
              <ShimmerTitle line={1} />
            </Col>
          </Row>

          <div className="sm:tw-block tw-hidden">
            <ShimmerTitle line={1} className="w-30 mb-1" variant="secondary" />
            <div className="d-flex">
              <ShimmerCircularImage size={30} />

              <ShimmerCircularImage size={30} className="mx-1" />
            </div>
            <ShimmerTitle line={1} className="w-30 mb-1" variant="secondary" />
            <div className="d-flex">
              <ShimmerCircularImage size={30} />

              <ShimmerCircularImage size={30} className="mx-1" />
            </div>
          </div>

          <div className="d-flex">
            <ShimmerButton size="md" />

            <div className="mx-1">
              <ShimmerButton size="md" />
            </div>
          </div>
        </CardBody>
      </Card>
    </>
  );
}
export default ShimmerAddEvent;
