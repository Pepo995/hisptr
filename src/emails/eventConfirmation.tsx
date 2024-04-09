import {
  Body,
  Column,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";

import * as React from "react";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { PACKAGE_ID_ARRAY, PACKAGE_ID_HALO } from "@constants/packages";
import { getBoothInfo } from "@components/Payment/utils";
import { type event_payment_plan } from "@prisma/client";
import { env } from "~/env.mjs";

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

type MailProps = {
  firstName: string;
  date: Date;
  completedBeforeDate: Date;
  finalCheckInDate: Date;
  paymentPlan: event_payment_plan;
  packageId: number;
  eventNumber: string;
  signUpToken?: string | null;
};

dayjs.extend(utc);

const oneWeekSinceDate = (date: Date) => dayjs(date).subtract(1, "week").format("MMMM D, YYYY");

const halfWayDate = (first: Date, second: Date) => {
  const firstDate = dayjs(first);
  const secondDate = dayjs(second);

  const diff = secondDate.diff(firstDate, "day");

  const halfWay = firstDate.add(diff / 2, "day");

  return halfWay.format("MMMM D, YYYY");
};

const completeByMap = {
  other: (date: Date) =>
    `To ensure there are no delays in your event design or planning, please complete this ASAP as your event customizations will need to finalized by ${oneWeekSinceDate(
      date,
    )}`,
  lessThanTwoWeeks: (date: Date) =>
    `To ensure there are no delays in your event design or planning, please complete this ASAP as your event customizations will need to finalized by ${oneWeekSinceDate(
      date,
    )}`,
  lessThanOneWeek: (_date: Date) =>
    `To ensure there are no delays in your event design or planning, please complete this ASAP as we have limited time to finalize your event customizations. Please note, due to the last minute booking of this event we may be limited to how many design iterations we can complete. We'll do our best to capture and incorporate your feedback.`,
};

const emailResponseMap = {
  other: (date: Date) =>
    `You can expect to receive this email by ${halfWayDate(new Date(), date)}.`,
  lessThanTwoWeeks: (date: Date) =>
    `You can expect to receive this email by ${halfWayDate(new Date(), date)}.`,
  lessThanOneWeek: (_date: Date) =>
    `You can expect to receive this email within 48 hours once your Event Details Form has been completed.`,
};

const eventMessageKey = (date: Date) => {
  const daysUntilEvent = dayjs(date).diff(dayjs(), "day");

  if (daysUntilEvent < 7) {
    return "lessThanOneWeek";
  } else if (daysUntilEvent < 14) {
    return "lessThanTwoWeeks";
  } else {
    return "other";
  }
};

const eventEnsureCompleteByDate = (date: Date) => {
  const key = eventMessageKey(date);

  return completeByMap[key](date);
};

const eventExpectEmail = (date: Date) => {
  const key = eventMessageKey(date);

  return emailResponseMap[key](date);
};

export const EventConfirmation = ({
  firstName,
  date = dayjs("2024-02-05").toDate(),
  paymentPlan,
  packageId,
  eventNumber,
  signUpToken,
}: MailProps) => {
  const { boothName } = getBoothInfo(packageId);

  const paymentText = paymentPlan === "full" ? "full payment" : "deposit";

  const linkToForm =
    packageId === PACKAGE_ID_HALO
      ? "https://form.jotform.com/220204072702439"
      : packageId === PACKAGE_ID_ARRAY
      ? "https://form.jotform.com/221514868641459"
      : "https://form.jotform.com/222055650494152";

  return (
    <Html>
      <Head>
        <title>Hipstr Event Confirmation</title>
      </Head>

      <Preview>Hipstr Event Confirmation</Preview>

      <Tailwind>
        {env.NEXT_PUBLIC_INVOICES_ENABLED === "true" ? (
          <Body className="bg-white font-sans">
            <Container>
              <Section>
                <Row className="mb-2">
                  <Column>
                    <Text>
                      Hi <b>{firstName}</b>
                    </Text>
                  </Column>
                  <Column align="right">
                    <Img
                      src={`${baseUrl}/hipstr-logo.jpg`}
                      width={75}
                      height={75}
                      alt="Hipstr Logo"
                    />
                  </Column>
                </Row>
                <Row className="mb-2">
                  <Text>
                    Thank you so much for booking with Hipstr! This email is a confirmation that we
                    have received your <b>{paymentText}</b> for your <b>{boothName}</b> reservation
                    for your event on <b>{dayjs.utc(date).format("MMMM D, YYYY")}.</b>
                  </Text>
                </Row>

                <Row>
                  <Text>
                    For future reference, your Event ID is <b>{eventNumber}</b>. As an important
                    reminder, please save this Event ID for your records.
                  </Text>
                </Row>

                <Row>
                  <Text>
                    We&apos;re excited to start planning your event! To do so we&apos;ll need some
                    more information from you. For the next step, if you haven&apos;t yet, please{" "}
                    <Link href={`${baseUrl}/signup?token=${signUpToken}`}>click here</Link> to Sign
                    Up in the Hipstr Portal and share your event details with us.
                  </Text>
                </Row>

                <Row>
                  <Text>
                    The Hipstr Portal will be your go-to resource for all your event needs. After
                    submitting your event details this is where you can:
                    <ul>
                      <li className="text-sm">See your Event Countdown and Event Status</li>
                      <li className="text-sm">Finalize your Event Design</li>
                      <li className="text-sm">
                        Reach out to our client service team for assistance with your planning,
                        logistics, and design
                      </li>
                    </ul>
                  </Text>
                </Row>

                <Row>
                  <Text>
                    Please click <Link href={linkToForm}>here</Link> to fill out your Hipstr Event
                    Detail Form as soon as possible. {eventEnsureCompleteByDate(date)}. If not, your
                    reservation may be subject to certain restrictions around customization.
                  </Text>
                </Row>

                <Row>
                  <Text>What Else?</Text>
                </Row>

                <Row>
                  <Text>
                    Approximately two weeks before your event. We will send you and your venue
                    contact a What to Expect Check-In. An email recapping the important information
                    about your reservation as a final check-in before the event.{" "}
                    {eventExpectEmail(date)}
                  </Text>
                </Row>

                <Row>
                  <Text>
                    We&apos;re excited to be a part of your event! Don&apos;t forget to follow us on
                    Facebook and Instagram before your event to keep up with all of the fun!
                  </Text>
                </Row>

                <Row>
                  <Text>The Hipstr Team</Text>
                </Row>
              </Section>
            </Container>
          </Body>
        ) : (
          <Body className="bg-white font-sans">
            <Container>
              <Section>
                <Row className="mb-2">
                  <Column>
                    <Text>
                      Hi <b>{firstName}</b>
                    </Text>
                  </Column>
                  <Column align="right">
                    <Img
                      src={`${baseUrl}/hipstr-logo.jpg`}
                      width={75}
                      height={75}
                      alt="Hipstr Logo"
                    />
                  </Column>
                </Row>
                <Row className="mb-2">
                  <Text>
                    Thank you so much for booking with Hipstr! This email is a confirmation that we
                    have received your <b>{paymentText}</b> for your <b>{boothName}</b> reservation
                    for your event on <b>{dayjs.utc(date).format("MMMM D, YYYY")}.</b>
                  </Text>
                </Row>

                <Row>
                  <Text>
                    For future reference, your Event ID is <b>{eventNumber}</b>.
                  </Text>
                </Row>

                <Row>
                  <Text>
                    For all future correspondence, we&apos;ll contact you via{" "}
                    <Link href={`mailto:admin@bookhipstr.com`}>admin@bookhipstr.com</Link>.
                  </Text>
                </Row>

                <Row>
                  <Text>
                    Our client service team will be assisting you with planning, logistics, and
                    design. This is a shared email so that any of us can respond to the questions
                    you may have during the event preparation process.
                  </Text>
                </Row>

                <Row>
                  <Text>
                    <b>For the next step,</b> we will need some information about your event. Please
                    take a moment and read through the process below:
                  </Text>
                </Row>

                <Row>
                  <Text>
                    <b>What we need from you:</b>
                  </Text>
                </Row>

                <Row>
                  <Text>
                    Please click <Link href={linkToForm}>here</Link> to fill out your Hipstr Event
                    Detail Form as soon as possible.
                    <ul>
                      <li className="text-sm">
                        {eventEnsureCompleteByDate(date)}. If not your reservation may be subject to
                        certain restrictions around customization.
                      </li>
                    </ul>
                  </Text>
                </Row>

                <Row>
                  <Text>
                    <b>What to Expect Check-In:</b>
                    <ul>
                      <li className="text-sm">
                        Before your event date, we will send you and your venue an email recapping
                        the important information about your reservation as a final check-in.{" "}
                        {eventExpectEmail(date)}
                      </li>
                    </ul>
                  </Text>
                </Row>

                <Row>
                  <Text>
                    We&apos;re excited to be a part of your event! Don&apos;t forget to follow us on
                    Facebook and Instagram before your event to keep up with all of the fun!
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
        )}
      </Tailwind>
    </Html>
  );
};

export default EventConfirmation;
