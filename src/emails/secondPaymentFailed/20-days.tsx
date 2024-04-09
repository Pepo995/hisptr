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
import { env } from "~/env.mjs";

type MailProps = {
  eventId: number;
  name: string;
};

export const SecondPaymentFailed20Days = ({ name, eventId }: MailProps) => (
  <Html>
    <Head>
      <title>Ups! We found an error with your payment</title>
    </Head>

    <Preview>Second Payment Failed</Preview>

    <Tailwind>
      <Body className="bg-white font-sans">
        <Container>
          <Section>
            <Row className="mb-2">
              <Text>Hi {name},</Text>
            </Row>
            <Row className="mb-2">
              <Text>
                I hope this email finds you well. As of today, your final balance payment is&nbsp;
                <b>10 days past due</b>. We reached out to you last week and as of today we have
                still yet to receive the payment.
              </Text>
            </Row>
            <Row className="mb-2">
              <Text>
                To ensure we are able to move forward with your event, please click&nbsp;
                <a
                  href={`${env.NEXT_PUBLIC_VERCEL_URL}/book-now/personal/retry-payment?event-id=${eventId}`}
                >
                  here
                </a>
                &nbsp;to update your payment details to process the payment.
              </Text>
            </Row>
            <Row className="mb-2">
              <Text>
                If you are having an issues with the payment link above please email{" "}
                <Link href="mailto:admin@bookhipstr.com">admin@bookhipstr.com</Link>&nbsp;for
                assistance.
              </Text>
            </Row>
            <Row className="mb-2">
              <Text>
                Thank you,
                <br />
                <br />
                The Hipstr Team
              </Text>
            </Row>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export default SecondPaymentFailed20Days;
