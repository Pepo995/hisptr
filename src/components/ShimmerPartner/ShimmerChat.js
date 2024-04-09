import {
  ShimmerTitle,
  ShimmerButton,
  ShimmerText,
  ShimmerCircularImage,
} from "react-shimmer-effects";
import {
  Row,
  Col,
  Form,
  Label,
  Button,
  CardBody,
  CardHeader,
  Card,
  CardFooter,
  InputGroup,
  InputGroupText,
} from "reactstrap";
import React from "react";

function ShimmerChat() {
  return (
    <>
      <Card>
        <CardHeader className="ticket-header justify-content-start">
          <ShimmerTitle line={1} gap={10} variant="primary" />
        </CardHeader>
        <CardBody className="chat-card mt-2">
          <div id="chat-scroll">
            <div className="chat-box p-2 w-75 mb-1 ml-auto">
              <ShimmerText line={5} gap={10} />
            </div>
          </div>
          <div id="chat-scroll">
            <div className="chat-box p-2 w-75 mb-1">
              <ShimmerText line={5} gap={10} />
            </div>
          </div>
        </CardBody>
        <CardFooter className="p-0">
          <InputGroup className="chat-box-footer justify-content-between">
            <InputGroupText className="chat-input-group">
              <ShimmerCircularImage size={50} className="mb-0" />
            </InputGroupText>
            <InputGroupText className="chat-input-group">
              <ShimmerButton size="lg" className="mb-0" />
            </InputGroupText>
          </InputGroup>
        </CardFooter>
      </Card>
    </>
  );
}
export default ShimmerChat;
