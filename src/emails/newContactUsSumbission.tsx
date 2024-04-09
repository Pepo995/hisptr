import { type InProcessEvent } from "@prisma/client";
import { Body, Container, Head, Html, Preview, Row, Section, Text } from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

import * as React from "react";

export type InProcessEventToShow = Pick<
  InProcessEvent,
  | "firstName"
  | "lastName"
  | "phoneNumber"
  | "email"
  | "eventDate"
  | "city"
  | "approximateBudget"
  | "message"
  | "createdAt"
  | "updatedAt"
> & {
  states: { name: string } | null;
  packages?: { title: string } | null;
  type: { name: string } | null;
  receiveCommunications: boolean;
};

type MailProps = {
  inProcessEvent: InProcessEventToShow;
};

export const NewContactUsSubmission = ({ inProcessEvent }: MailProps) => {
  const getEventContent = (
    event: InProcessEventToShow = {
      firstName: "John",
      lastName: "Doe",
      phoneNumber: "12345",
      email: "john@doe.com",
      eventDate: new Date(),
      city: "Miami",
      approximateBudget: 200,
      message: "",
      createdAt: new Date(),
      updatedAt: new Date(),
      states: null,
      packages: null,
      type: null,
      receiveCommunications: false,
    },
  ) => (
    <Body className="bg-white font-sans">
      <Container style={container}>
        <Row>
          <Text style={tertiary} className="my-0">
            Name:&nbsp;
            <span style={secondary}>
              {event.firstName} {event.lastName}
            </span>
          </Text>
        </Row>
        <Row>
          <Text style={tertiary} className="my-0">
            Phone Number:&nbsp;<span style={secondary}>{event.phoneNumber}</span>
          </Text>
        </Row>
        <Row>
          <Text style={tertiary} className="my-0">
            Email:&nbsp;<span style={secondary}>{event.email}</span>
          </Text>
        </Row>
        <Row>
          <Text style={tertiary} className="my-0">
            Event Date:&nbsp;
            <span style={secondary}>{dayjs.utc(event.eventDate).format("MM/DD/YYYY")}</span>
          </Text>
        </Row>
        <Row>
          <Text style={tertiary} className="my-0">
            Event Type:&nbsp;
            <span style={secondary}>{event.type?.name ?? "Undefined"}</span>
          </Text>
        </Row>
        <Row>
          <Text style={tertiary} className="my-0">
            City:&nbsp;<span style={secondary}>{event.city}</span>
          </Text>
        </Row>
        <Row>
          <Text style={tertiary} className="my-0">
            State Name:&nbsp;<span style={secondary}>{event.states?.name ?? "Undefined"}</span>
          </Text>
        </Row>
        <Row>
          <Text style={tertiary} className="my-0">
            Approximate Budget:&nbsp;<span style={secondary}>{event.approximateBudget}</span>
          </Text>
        </Row>
        <Row>
          <Text style={tertiary} className="my-0">
            Package Name:&nbsp;<span style={secondary}>{event.packages?.title ?? "Undefined"}</span>
          </Text>
        </Row>
        <Row>
          <Text style={tertiary} className="my-0">
            Message:&nbsp;<span style={secondary}>{event.message}</span>
          </Text>
        </Row>
        <Row>
          <Text style={tertiary} className="my-0">
            Created At:&nbsp;
            <span style={secondary}>
              {dayjs.utc(event.createdAt).format("MM/DD/YYYY HH:mm:ss")}
            </span>
          </Text>
        </Row>
        <Row>
          <Text style={tertiary} className="my-0">
            Updated At:&nbsp;
            <span style={secondary}>
              {dayjs.utc(event.updatedAt).format("MM/DD/YYYY HH:mm:ss")}
            </span>
          </Text>
        </Row>
        <Row>
          <Text style={tertiary} className="my-0">
            Receive Communications:&nbsp;
            <span style={secondary}>{event.receiveCommunications ? "Yes" : "No"}</span>
          </Text>
        </Row>
      </Container>
    </Body>
  );

  return (
    <Html>
      <Head>
        <title>New Contact Us Submission</title>
      </Head>

      <Preview>New Contact Us Submission</Preview>

      <Tailwind>
        <Body className="bg-white font-sans">
          <Container>
            <Section>{getEventContent(inProcessEvent)}</Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default NewContactUsSubmission;

const container = {
  backgroundColor: "#ffffff",
  border: "1px solid #eee",
  borderRadius: "5px",
  boxShadow: "0 5px 10px rgba(20,50,70,.2)",
  marginTop: "20px",
  width: "1000px",
  padding: "8px",
};

const secondary = {
  color: "black",
  fontSize: "11px",
  fontWeight: 700,
  fontFamily: "HelveticaNeue,Helvetica,Arial,sans-serif",
};

const tertiary = {
  color: "#0a85ea",
  fontSize: "11px",
  fontWeight: 500,
  fontFamily: "HelveticaNeue,Helvetica,Arial,sans-serif",
};
