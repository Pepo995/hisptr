import { ShimmerPostItem } from "react-shimmer-effects";
import { Col, Row } from "reactstrap";

function ShimmerBlogCard() {
  return (
    <>
      <div className="main-role-ui">
        <div className="blog-card">
          <Row>
            <Col lg={4}>
              <ShimmerPostItem card title text />
            </Col>
            <Col lg={4}>
              <ShimmerPostItem card title text />
            </Col>
            <Col lg={4}>
              <ShimmerPostItem card title text />
            </Col>
          </Row>
          <Row className="mt-2">
            <Col lg={4}>
              <ShimmerPostItem card title text />
            </Col>
            <Col lg={4}>
              <ShimmerPostItem card title text />
            </Col>
            <Col lg={4}>
              <ShimmerPostItem card title text />
            </Col>
          </Row>
          <Row className="mt-2">
            <Col lg={4}>
              <ShimmerPostItem card title text />
            </Col>
            <Col lg={4}>
              <ShimmerPostItem card title text />
            </Col>
            <Col lg={4}>
              <ShimmerPostItem card title text />
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
}

export default ShimmerBlogCard;
