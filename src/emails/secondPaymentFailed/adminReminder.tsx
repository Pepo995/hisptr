import { Body, Container, Head, Html, Preview, Row, Section, Text } from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";

import * as React from "react";

type MailProps = {
  eventId: number;
  name: string;
  eventDateAsString: string;
  daysPastDue: number;
  email: string;
};

export const AdminReminder = ({
  eventId,
  name,
  eventDateAsString,
  daysPastDue,
  email,
}: MailProps) => (
  <Html>
    <Head>
      <title>Ups! We found an error with a client&apos;s payment</title>
    </Head>

    <Preview>Second Payment Failed</Preview>

    <Tailwind>
      <Body className="bg-white font-sans">
        <Container>
          <Section>
            <Row className="mb-2">
              <Text>
                <b>Client Name:</b> {name}
              </Text>
            </Row>
            <Row className="mb-2">
              <Text>
                <b>Event ID:</b> {eventId}
              </Text>
            </Row>
            <Row className="mb-2">
              <Text>
                <b>Event Date:</b> {eventDateAsString}
              </Text>
            </Row>
            <Row className="mb-2">
              <Text>
                <b>Days Past Due:</b> {daysPastDue}
              </Text>
            </Row>
            <Row className="mb-2">
              <Text>
                <b>Email:</b> {email}
              </Text>
            </Row>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export default AdminReminder;
