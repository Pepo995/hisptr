import {
  Body,
  Column,
  Container,
  Head,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";

import * as React from "react";

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

type MailProps = {
  firstName: string;
};

export const ConfirmAvailability = ({ firstName = "John" }: MailProps) => (
  <Html>
    <Head>
      <title>Hipstr Reservation Pending - Confirming Availability</title>
    </Head>

    <Preview>Hipstr Reservation Pending - Confirming Availability</Preview>

    <Tailwind>
      <Body className="bg-white font-sans">
        <Container>
          <Section>
            <Row>
              <Column>
                <Text>
                  Hi <b>{firstName}</b>
                </Text>
              </Column>
              <Column align="right">
                <Img src={`${baseUrl}/hipstr-logo.jpg`} width={75} height={75} alt="Hipstr Logo" />
              </Column>
            </Row>

            <Row className="mb-2">
              <Text>Thank you so much for your interest in booking with Hipstr!</Text>
            </Row>

            <Row>
              <Text>
                We are so excited that you&apos;d like to work together! This email is to notify you
                that we have received your reservation request. Due to your event date being within
                60 days of booking, please allow us up to 48 hours to confirm your reservation.
              </Text>
            </Row>

            <Row>
              <Text>
                There will be a temporary hold on your credit card that represents a 50% deposit of
                your total reservation fee.
              </Text>
            </Row>

            <Row>
              <Text>
                If we are available for your event date, then the temporary hold of 50% will be
                processed as a charge and be considered your deposit payment.
              </Text>
            </Row>

            <Row>
              <Text>
                If we are unable to confirm your event date within 48 hours, then the pending hold
                on your credit card will be released in full.
              </Text>
            </Row>

            <Row>
              <Text>
                We&apos;re already working to confirm your reservation as soon as possible, so
                please be on the lookout for an email from us soon!
              </Text>
            </Row>

            <Row>
              <Text>Best,</Text>
            </Row>

            <Row>
              <Text>The Hipstr Team</Text>
            </Row>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export default ConfirmAvailability;
