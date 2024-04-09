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

export const SecondPaymentFailed10Days = ({ eventId, name }: MailProps) => (
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
                <b>20 days past due</b>. We&apos;ve reached out to you a few times and as of today
                we have still yet to receive the payment.
              </Text>
            </Row>
            <Row className="mb-2">
              <Text>
                If you do not click&nbsp;
                <a
                  href={`${env.NEXT_PUBLIC_VERCEL_URL}/book-now/personal/retry-payment?event-id=${eventId}`}
                >
                  here
                </a>
                &nbsp;to update your payment details as soon as possible to process the payment or
                reach out to us via email&nbsp;
                <Link href="mailto:admin@bookhipstr.com">admin@bookhipstr.com</Link>&nbsp;for
                assistance, your event may be canceled.
              </Text>
            </Row>
            <Row className="mb-2">
              <Text>Please reach out to us immediately to resolve this.</Text>
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

export default SecondPaymentFailed10Days;
