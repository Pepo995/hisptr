import { Row, Col, Form, Card, Label, CardBody } from "reactstrap";

function Event(props) {
  return (
    <div>
      <Card className="event-card">
        <CardBody>
          <Form>
            <Row>
              <Label sm="3" for="name" className="add-form-header">
                Event Type
              </Label>
              <Col sm="9" className="mt-sm-1">
                <p>{props.eventname}</p>
              </Col>
            </Row>
            <Row>
              <Label sm="3" for="name" className="add-form-header">
                Event Date
              </Label>
              <Col sm="9" className="mt-sm-1">
                <p>{props.eventdate}</p>
              </Col>
            </Row>
            <Row>
              <Label sm="3" for="name" className="add-form-header">
                Package
              </Label>
              <Col sm="9" className="mt-sm-1">
                <p>{props.eventpackage}</p>
              </Col>
            </Row>
            <Row>
              <Label sm="3" for="name" className="add-form-header">
                Venue
              </Label>
              <Col sm="9" className="mt-sm-1">
                <p>{props.eventvenue}</p>
              </Col>
            </Row>
            <Row>
              <Label sm="3" for="name" className="add-form-header">
                Status
              </Label>
              <Col sm="9" className="mt-sm-1">
                <p>{props.eventstatus}</p>
              </Col>
            </Row>
          </Form>
        </CardBody>
      </Card>
    </div>
  );
}
export default Event;
