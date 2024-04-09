import React from 'react'
import { ShimmerCircularImage, ShimmerTable, ShimmerText, ShimmerThumbnail, ShimmerTitle } from 'react-shimmer-effects'
import { Card, CardBody, CardTitle, Col, Row } from 'reactstrap'

function HomeShimmer() {
    return (
        <div>
            <Row className="match-height">
                <Col lg={6} md={12}>
                    <Card>
                        <CardBody>
                            <ShimmerTitle line={1} className="w-50" />
                            <div className="all-count-box pt-2">
                                <Card className="w-100 bg-transparent">
                                    <CardBody className="mx-auto px-50 py-0 w-100">
                                        <ShimmerThumbnail height={110} className="border rounded-5 mb-0" />
                                    </CardBody>
                                </Card>

                                <Card className="w-100 bg-transparent">
                                    <CardBody className="mx-auto px-50 py-0 w-100 h-100">
                                        <ShimmerThumbnail height={110} className="border rounded-5 mb-0" />
                                    </CardBody>
                                </Card>

                                <Card className="w-100 bg-transparent">
                                    <CardBody className="mx-auto px-50 py-0 w-100">
                                        <ShimmerThumbnail height={110} className="border rounded-5 mb-0" />
                                    </CardBody>
                                </Card>

                                <Card className="w-100 bg-transparent">
                                    <CardBody className="mx-auto px-50 py-0  w-100">
                                        <ShimmerThumbnail height={110} className="border rounded-5 mb-0" />
                                    </CardBody>
                                </Card>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
                <Col lg={6} md={12}>
                    <Card>
                        <CardBody>
                            <ShimmerTitle line={1} className="w-50" />
                        </CardBody>
                        <div className="">
                            <Card>
                                <CardBody className="py-0 d-flex gap-1">
                                    <div>
                                        <ShimmerCircularImage size={100} />
                                        <ShimmerText line={1} />
                                    </div>
                                    <div>
                                        <ShimmerCircularImage size={100} />
                                        <ShimmerText line={1} />
                                    </div>
                                    <div>
                                        <ShimmerCircularImage size={100} />
                                        <ShimmerText line={1} />
                                    </div>
                                    <div>
                                        <ShimmerCircularImage size={100} />
                                        <ShimmerText line={1} />
                                    </div>
                                </CardBody>
                            </Card>
                        </div>
                    </Card>
                </Col>
            </Row>

            <Row className="match-height">
                <Col lg={6} md={6}>
                    <Card className="action-card">
                        <CardBody>
                            <ShimmerTitle line={1} className="w-50" />
                            <ol className="action-list ">
                                <ShimmerText className="mb-5" line={2} />
                                <ShimmerText className="mb-5" line={2} />
                                <ShimmerText className="mb-5" line={2} />
                                <ShimmerText className="mb-5" line={2} />
                                <ShimmerText className="mb-5" line={2} />
                            </ol>
                        </CardBody>
                    </Card>
                </Col>
                <Col lg={6} md={6}>
                    <Card className="package-card">
                        <CardBody className="pb-0">
                            <ShimmerTitle line={1} />
                            <ShimmerThumbnail height={150} />
                        </CardBody>
                        <CardBody>
                            <ShimmerTitle line={1} />
                            <ShimmerText line={3} />
                            <div className="w-25">
                                <ShimmerText line={1} />
                            </div>
                        </CardBody>
                    </Card>
                </Col>
                {/* <Col lg={4} md={6}>
                    <Card className="awaiting-card">
                        <CardBody>
                            <ShimmerTitle line={1} className="w-50" />
                            <ShimmerTitle line={1} />
                        </CardBody>
                    </Card>
                </Col> */}
            </Row>

            <Card>
                <CardBody>
                    <ShimmerTitle line={1} className="w-25" />
                </CardBody>
                <div className="react-dataTable request-dashboard-table mb-1">
                    <ShimmerTable row={5} col={5} />;
                </div>
            </Card>
        </div>
    )
}

export default HomeShimmer
