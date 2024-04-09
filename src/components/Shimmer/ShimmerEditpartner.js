import { ShimmerButton, ShimmerTitle } from "react-shimmer-effects";
import { Row, Col, Label, Form } from "reactstrap";
function ShimmerEditparner() {
  return (
    <Form>
      <Row className="mb-1">
        <Label sm="3" for="name" className="add-form-header">
          Name
        </Label>
        <Col sm="9">
          <ShimmerTitle line={1}></ShimmerTitle>
        </Col>
      </Row>
      <Row className="mb-1">
        <Label sm="3" for="Email" disabled className="add-form-header">
          Email
        </Label>
        <Col sm="9">
          <ShimmerTitle line={1}></ShimmerTitle>
        </Col>
      </Row>
      <Row className="mb-1">
        <Label sm="3" for="address" className="add-form-header">
          Address
        </Label>
        <Col sm="9">
          <ShimmerTitle line={1}></ShimmerTitle>
        </Col>
      </Row>
      <Row className="mb-1">
        <Label sm="3" for="agreement" disabled className="add-form-header">
          Agreement
        </Label>
        <Col sm="9">
          <ShimmerTitle line={1}></ShimmerTitle>
        </Col>
      </Row>
      <Row className="mb-1">
        <Label sm="3" for="market" className="add-form-header">
          Market
        </Label>
        <Col sm="9">
          <ShimmerTitle line={1}></ShimmerTitle>
        </Col>
      </Row>
      <Row>
        <Col className="d-flex" md={{ size: 9, offset: 3 }}>
          <ShimmerButton />
        </Col>
      </Row>
    </Form>
  );
}
export default ShimmerEditparner;
