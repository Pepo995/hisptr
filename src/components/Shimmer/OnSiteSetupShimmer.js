import { ShimmerTitle, ShimmerText } from "react-shimmer-effects";
import { Row, Col, CardBody, Card } from "reactstrap";
const OnSiteSetupShimmer = () => {
  return (
    <Card className="card-apply-job bg-white">
      <ShimmerTitle line={1} className="w-30 mx-2 mt-1" />
      <CardBody>
        <Row>
          <Col>
            <ShimmerText
              line={3}
              gap={10}
              variant="secondary"
              className={"p-0 mx-2  mb-75"}
            />
          </Col>
        </Row>
        <hr />
        <Row>
          <Col>
            <ShimmerText
              line={4}
              gap={10}
              variant="secondary"
              className={"p-0 mx-2  mb-75"}
            />
          </Col>
        </Row>
        <hr />
        <Row>
          <Col>
            <ShimmerText
              line={2}
              gap={15}
              variant="secondary"
              className={"p-0 mx-2 mt-2 mb-75"}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <ShimmerText
              line={2}
              gap={15}
              variant="secondary"
              className={"p-0 mx-2 mt-2  mb-75"}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <ShimmerText
              line={2}
              gap={15}
              variant="secondary"
              className={"p-0 mx-2 mt-2  mb-75"}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <ShimmerText
              line={2}
              gap={15}
              variant="secondary"
              className={"p-0 mx-2 mt-2  mb-75"}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <ShimmerText
              line={2}
              gap={15}
              variant="secondary"
              className={"p-0 mx-2 mt-2  mb-75"}
            />
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default OnSiteSetupShimmer;
