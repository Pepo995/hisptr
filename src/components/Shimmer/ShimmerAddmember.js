import { ShimmerButton, ShimmerTitle } from "react-shimmer-effects";
import { Col, Input, Label, Row, Form } from "reactstrap";

function ShimmerAddmember() {
  return (
    <Form>
      <Row className="mb-1">
        <Label sm="3" for="name">
          First Name
        </Label>
        <Col sm="9">
          <ShimmerTitle line={1}>
            <Input
              type="text"
              name="firstName"
              id="firstName"
              placeholder="Enter first Name"
            />
          </ShimmerTitle>
        </Col>
      </Row>
      <Row className="mb-1">
        <Label sm="3" for="name">
          Last Name
        </Label>
        <Col sm="9">
          <ShimmerTitle line={1}>
            <Input
              type="text"
              name="lastName"
              id="lastName"
              placeholder="Enter last Name"
            />
          </ShimmerTitle>
        </Col>
      </Row>
      <Row className="mb-1">
        <Label sm="3" for="Email">
          Email
        </Label>
        <Col sm="9">
          <ShimmerTitle line={1}>
            <Input
              type="text"
              name="email"
              id="email"
              placeholder="Enter email"
            />
          </ShimmerTitle>
        </Col>
      </Row>

      <Row className="mb-1">
        <Label sm="3" for="password">
          Role
        </Label>
        <Col sm="9">
          <ShimmerTitle line={1}></ShimmerTitle>
        </Col>
      </Row>

      <Row>
        <Col className="d-flex" md={{ size: 9, offset: 3 }}>
          <ShimmerButton /> &nbsp;
          <ShimmerButton />
        </Col>
      </Row>
    </Form>
  );
}
export default ShimmerAddmember;
