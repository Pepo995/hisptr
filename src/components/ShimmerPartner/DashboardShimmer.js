import React from "react";
import { ShimmerTable, ShimmerThumbnail } from "react-shimmer-effects";
import { Card, CardBody, Col, Row } from "reactstrap";

const DashboardShimmer = () => {
  return (
    <div>
      <Row>
        <Col lg="6" md="12">
          <Card>
            <CardBody className="p-1">
              <ShimmerThumbnail height={160} className="mb-0" rounded />
            </CardBody>
          </Card>
        </Col>
        <Col lg="6" md="12">
          <Card>
            <CardBody className="p-1">
              <Row>
                <Col sm={9}>
                  <ShimmerThumbnail height={160} className="mb-0" rounded />
                </Col>
                <Col sm={3}>
                  <ShimmerThumbnail height={160} className="mb-0" rounded />
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col lg="6" md="12">
          <Card>
            <ShimmerTable col={4} row={5} className="mb-0" />
          </Card>
        </Col>
        <Col lg="6" md="12">
          <Card>
            <ShimmerTable col={4} row={5} className="mb-0" />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardShimmer;
