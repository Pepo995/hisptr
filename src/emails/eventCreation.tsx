import { getBoothInfo } from "@components/Payment/utils";
import {
  Body,
  Container,
  Head,
  Html,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";

import * as React from "react";

type MailProps = {
  customerName: string | null;
  eventNumber: string | null;
  eventDate: string;
  city: string | null;
  state: string | null;
  clientEmail: string | null;
  phoneNumber: string | null;
  budget: number | null;
  message: string | null;
  receiveCommunications: boolean | null;
  packageId: number | null;
  isCorporate: boolean | null;
  price: number | null;
  eventType: string | null;
  corporateLink?: string;
};

export const EventCreation = ({
  customerName,
  eventDate,
  eventNumber,
  city,
  state,
  clientEmail,
  eventType,
  phoneNumber,
  budget,
  message,
  receiveCommunications,
  packageId,
  isCorporate,
  price,
  corporateLink,
}: MailProps) => {
  const { boothName } = getBoothInfo(packageId);

  return (
    <Html>
      <Head>
        <title>New Event Booked - {eventDate}</title>
      </Head>

      <Preview>New Event Booked</Preview>

      <Tailwind>
        <Body className="bg-white font-sans">
          <Container>
            <Section>
              {corporateLink && (
                <Row className="mb-2">
                  <Text>
                    To create a custom invoice, login as admin and click{" "}
                    <Link href={corporateLink}>here</Link>
                  </Text>
                </Row>
              )}
              <Row className="mb-2">
                <Text>New Event Booked</Text>
              </Row>
              <Row className="mb-2">
                <Text>
                  <b>Customer Name:</b> {customerName}
                </Text>
              </Row>
              <Row className="mb-2">
                <Text>
                  <b>Event Date:</b> {eventDate}
                </Text>
              </Row>

              <Row className="mb-2">
                <Text>
                  <b>Event ID:</b> {eventNumber}
                </Text>
              </Row>

              <Row className="mb-2">
                <Text>
                  <b>City:</b> {city}
                </Text>
              </Row>
              <Row className="mb-2">
                <Text>
                  <b>State:</b> {state}
                </Text>
              </Row>
              <Row className="mb-2">
                <Text>
                  <b>Client Email:</b> {clientEmail}
                </Text>
              </Row>
              <Row className="mb-2">
                <Text>
                  <b>Phone Number:</b> {phoneNumber}
                </Text>
              </Row>
              <Row className="mb-2">
                <Text>
                  <b>Budget:</b> {budget}
                </Text>
              </Row>
              <Row className="mb-2">
                <Text>
                  <b>Message:</b> {message}
                </Text>
              </Row>
              <Row className="mb-2">
                <Text>
                  <b>Receive Communications:</b> {receiveCommunications ? "true" : "false"}
                </Text>
              </Row>
              <Row className="mb-2">
                <Text>
                  <b>Package:</b> {boothName ?? "Not defined"}
                </Text>
              </Row>
              <Row className="mb-2">
                <Text>
                  <b>Event Type:</b> {eventType}
                </Text>
              </Row>
              <Row className="mb-2">
                <Text>
                  <b>Corporate:</b> {isCorporate ? "true" : "false"}
                </Text>
              </Row>
              <Row className="mb-2">
                <Text>
                  <b>Deal size:</b> {price}
                </Text>
              </Row>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default EventCreation;
