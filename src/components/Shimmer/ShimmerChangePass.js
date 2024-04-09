import { ShimmerTitle, ShimmerButton } from "react-shimmer-effects";
import { Row, Col, Form, Label } from "reactstrap";

function ShimmerChangePass() {
  return (
    <Form className="auth-register-form mt-2">
      <Row>
        <Col xl={6}>
          <div className="mb-1">
            <Label className="form-label" for="register-password">
              Old Password
            </Label>
            <ShimmerTitle line={1}></ShimmerTitle>
          </div>
        </Col>
      </Row>
      <Row>
        <Col xl={6}>
          <div className="mb-1">
            <Label className="form-label" for="register-password">
              New Password
            </Label>
            <ShimmerTitle line={1}></ShimmerTitle>
          </div>
        </Col>
        <Col xl={6}>
          <div className="mb-1">
            <Label className="form-label" for="register-password">
              Retype New Password
            </Label>
            <ShimmerTitle line={1}></ShimmerTitle>
          </div>
        </Col>
      </Row>
      <ShimmerButton />
    </Form>
  );
}
export default ShimmerChangePass;
