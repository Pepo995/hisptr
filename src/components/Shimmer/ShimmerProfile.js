import {
  ShimmerTitle,
  ShimmerButton,
  ShimmerThumbnail,
  ShimmerBadge,
} from "react-shimmer-effects";
import { Row, Col } from "reactstrap";

function ShimmerProfile() {
  return (
    <>
      <Row>
        <Col sm="6">
          <div className="d-flex">
            <div className="me-25">
              <ShimmerThumbnail height={100} width={100} />
            </div>
            <div className=" align-items-end mt-75 ms-1">
              <ShimmerButton />
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col sm="6" className="mb-1">
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

        <Col sm="6" className="mb-1">
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
        <Col sm="6" className="mb-1">
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
        <Col className="mt-2" sm="12">
          <ShimmerButton />
        </Col>
      </Row>
    </>
  );
}
export default ShimmerProfile;
