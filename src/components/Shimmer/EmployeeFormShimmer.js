//imports from packages
import React from 'react'
import { ShimmerTitle, ShimmerButton } from 'react-shimmer-effects'
import { Col, Label, Row } from 'reactstrap'

const EmployeeFormShimmer = () => {
    return (
        <>
            <Row className="mb-1">
                <Label sm="3" for="name" className="add-form-header">
                    <ShimmerTitle line={1} className="w-70" />
                </Label>
                <Col sm="9">
                    <ShimmerTitle line={1} />
                </Col>
            </Row>
            <Row className="mb-1">
                <Label sm="3" for="name" className="add-form-header">
                    <ShimmerTitle line={1} className="w-70" />
                </Label>
                <Col sm="9">
                    <ShimmerTitle line={1} />
                </Col>
            </Row>

            <Row className="mb-1">
                <Label sm="3" for="name" className="add-form-header">
                    <ShimmerTitle line={1} className="w-70" />
                </Label>
                <Col sm="9">
                    <ShimmerTitle line={1} />
                </Col>
            </Row>
            <Row className="mb-1">
                <Label sm="3" for="name" className="add-form-header">
                    <ShimmerTitle line={1} className="w-70" />
                </Label>
                <Col sm="9">
                    <ShimmerTitle line={1} />
                </Col>
            </Row>

            <Row className="mb-1">
                <Label sm="3" for="designetion" className="add-form-header">
                    <ShimmerTitle line={1} className="w-70" />
                </Label>
                <Col sm="9" className="mt-1">
                    <ShimmerTitle line={1} />
                </Col>
            </Row>

            <Row>
                <Col className="d-flex" md={{ size: 9, offset: 3 }}>
                    <ShimmerButton size="md" />
                    <div className="mx-2">
                        <ShimmerButton size="md" />
                    </div>
                </Col>
            </Row>
        </>
    )
}

export default EmployeeFormShimmer
