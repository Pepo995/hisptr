import { BASE_URL } from "@constants/url";
import { type CreateLeadPrices } from "@pages/api/crons/new-lead-announcer-cron";
import { type InProcessEvent } from "@prisma/client";
import { Body, Container, Head, Html, Preview, Row, Section, Text } from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

import * as React from "react";

export type InProcessEventToShow = Pick<
  InProcessEvent,
  | "id"
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
};

type MailProps = {
  inProcessEvent: InProcessEventToShow;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  utmId?: string;
  prices: CreateLeadPrices[];
};

export const NewEventLeads = ({
  inProcessEvent = {
    id: "-",
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
    states: { name: "Florida" },
    packages: { title: "Package 1" },
    type: { name: "Type 1" },
  },
  utmSource,
  utmMedium,
  utmCampaign,
  utmTerm,
  utmContent,
  utmId,
  prices: pricesProp,
}: MailProps) => {
  const getEventContent = (
    event: InProcessEventToShow = {
      id: "-",
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
      states: { name: "Florida" },
      packages: { title: "Package 1" },
      type: { name: "Type 1" },
    },
    prices: CreateLeadPrices[] = [
      {
        packageName: "Package 1",
        totalPriceForPartial: 400,
        retailPrice: 500,
        promotionalPrice: 350,
      },
      {
        packageName: "Package 2",
        totalPriceForPartial: 300,
        retailPrice: 500,
        promotionalPrice: 350,
      },
    ],
  ) => (
    <Container style={container}>
      <Row>
        <Text style={tertiary} className="text-center my-1">
          Id: <span style={secondary}>{event.id}</span>
        </Text>
      </Row>
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
          <span style={secondary}>{dayjs.utc(event.createdAt).format("MM/DD/YYYY HH:mm:ss")}</span>
        </Text>
      </Row>
      <Row>
        <Text style={tertiary} className="my-0">
          Updated At:&nbsp;
          <span style={secondary}>{dayjs.utc(event.updatedAt).format("MM/DD/YYYY HH:mm:ss")}</span>
        </Text>
      </Row>
      {prices.length === 0 && (
        <Row>
          <Text style={tertiary} className="my-0">
            Price unavailable
          </Text>
        </Row>
      )}
      {prices.length === 1 && (
        <Row>
          <Text style={tertiary} className="my-0">
            Package Name:&nbsp;<span style={secondary}>{prices[0].packageName}</span>
          </Text>
          <Text style={tertiary} className="my-0">
            Retail Price:&nbsp;<span style={secondary}>{prices[0].retailPrice}</span>
          </Text>
          <Text style={tertiary} className="my-0">
            Deal Size:&nbsp;<span style={secondary}>{prices[0].promotionalPrice}</span>
          </Text>
          <Text style={tertiary} className="my-0">
            Total Price:&nbsp;<span style={secondary}>{prices[0].totalPriceForPartial}</span>
          </Text>
        </Row>
      )}
      {prices.length > 1 && (
        <Row>
          <Text style={tertiary} className="my-0">
            Pricing:
          </Text>
          {prices.map((price) => (
            <Row key={price.packageName}>
              <Text style={secondary} className="ml-2 my-0">
                <span style={tertiary}>- {price.packageName}: </span>
                <span style={secondary}>Retail Price: {price.retailPrice}</span>
                &nbsp;|&nbsp;
                <span style={secondary}>Deal Size: {price.promotionalPrice}</span>
                &nbsp;|&nbsp;
                <span style={secondary}>Total Price: {price.totalPriceForPartial}</span>
              </Text>
            </Row>
          ))}
        </Row>
      )}
    </Container>
  );

  const source = utmSource ? `&utm_source=${utmSource.replace(/\s/g, "-")}` : "";
  const medium = utmMedium ? `&utm_medium=${utmMedium.replace(/\s/g, "-")}` : "";
  const campaign = utmCampaign ? `&utm_campaign=${utmCampaign.replace(/\s/g, "-")}` : "";
  const term = utmTerm ? `&utm_term=${utmTerm.replace(/\s/g, "-")}` : "";
  const content = utmContent ? `&utm_content=${utmContent.replace(/\s/g, "-")}` : "";
  const id = utmId ? `&utm_id=${utmId.replace(/\s/g, "-")}` : "";

  const utmLink = inProcessEvent?.id
    ? `${BASE_URL}/book-now/personal/step-1?event-id=${inProcessEvent.id}${source}${medium}${campaign}${term}${content}${id}`
    : "";

  return (
    <Html>
      <Head>
        <title>New Event Leads detected</title>
      </Head>

      <Preview>New Event Leads</Preview>

      <Tailwind>
        <Body className="bg-white font-sans">
          <Container>
            <Section>{getEventContent(inProcessEvent, pricesProp)}</Section>
            <Section>
              <Text className="text-center">Source: {utmSource ?? "none"}</Text>
            </Section>
            <Section>
              <Text className="text-center">Campaign: {utmCampaign ?? "none"}</Text>
            </Section>
            <Section>
              <Text>
                <a href={utmLink}>Click here to track the lead</a>
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default NewEventLeads;

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
