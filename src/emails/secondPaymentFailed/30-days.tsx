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
  eventId: number;
  name: string;
};
import { env } from "~/env.mjs";

export const SecondPaymentFailed30Days = ({ eventId, name }: MailProps) => (
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
                We&apos;re so excited... we&apos;re only 30 days from your event! We&apos;re
                reaching out because your final balance payment is due and we attempted to process
                it with your card on file but were unable to do so.
              </Text>
            </Row>
            <Row className="mb-2">
              <Text>
                Please click&nbsp;
                <a
                  href={`${env.NEXT_PUBLIC_VERCEL_URL}/book-now/personal/retry-payment?event-id=${eventId}`}
                >
                  here
                </a>
                &nbsp;to update your payment details to process the payment today to ensure your
                on-time payment.
              </Text>
            </Row>
            <Row className="mb-2">
              <Text>
                If you have any issues with the payment link above please email&nbsp;
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

export default SecondPaymentFailed30Days;
