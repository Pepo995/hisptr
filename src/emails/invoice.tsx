import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Hr,
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
import { env } from "~/env.mjs";
import { getBoothInfo } from "@components/Payment/utils";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

const baseUrl = env.VERCEL_URL ? `https://${env.VERCEL_URL}` : "http://localhost:3000";

type MailProps = {
  firstName: string;
  lastName: string;
  state: string;
  city: string;
  eventDate: string;
  eventNumber: string;
  eventType: string;
  packageId: number;
  subtotal: number;
  retailPrice: number;
  total: number;
  paidBefore?: number;
  paidToDate: number;
  promotionalCodeDiscount?: number;
  specialDiscount: number;
  pending?: number;
  stripeFee: number;
  travelFee: number;
  receiptNumber: string | null;
  balanceStatusDescription: "Deposit" | "Final Balance";
  firstPaymentDateAsString?: string;
  dueDateAsString?: string;
  receiptDateAsString: string;
};

const numberFormatter = new Intl.NumberFormat("en-US", {
  style: "decimal",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const Invoice = ({
  firstName,
  lastName,
  state,
  city,
  eventDate,
  eventNumber,
  eventType,
  packageId,
  subtotal,
  retailPrice,
  total,
  paidBefore,
  paidToDate,
  promotionalCodeDiscount,
  specialDiscount,
  pending = 0,
  stripeFee,
  travelFee,
  receiptNumber,
  balanceStatusDescription,
  firstPaymentDateAsString,
  dueDateAsString,
  receiptDateAsString,
}: MailProps) => {
  const { boothName, imageSrc: packageImageSrc, invoiceDescription } = getBoothInfo(packageId);

  const supportEmail = env.SUPPORT_MAIL ?? "support@example.com";
  const receiptNumberToShow = receiptNumber ? receiptNumber : eventNumber;

  return (
    <Html>
      <Head>
        <title>Your Hipstr Booth Invoice - {eventDate}</title>
      </Head>

      <Preview>Your Hipstr Booth Invoice</Preview>

      <Tailwind>
        <Body className="bg-white font-sans">
          <Container>
            <Heading as="h1">Your Hipstr Invoice - {balanceStatusDescription}</Heading>
            <Section>
              <Row className="mb-2">
                <Column>
                  <Column width={160}>
                    <Img
                      src={`${baseUrl}/hipstr-logo.jpg`}
                      width={150}
                      height={150}
                      alt="Hipstr Logo"
                    />
                  </Column>
                </Column>
                <Column>
                  <Row>
                    <Text className="font-semibold mb-1 mt-0 text-gray-600 text-end">
                      Receipt number:
                    </Text>
                    <Text className="text-xl mt-0 text-end">#{receiptNumberToShow}</Text>
                  </Row>
                  <Row>
                    <Text className="font-semibold mb-1 mt-0 text-gray-600 text-end">
                      Event ID:
                    </Text>
                    <Text className="text-xl mt-0 text-end">#{eventNumber}</Text>
                  </Row>
                </Column>
              </Row>

              <Row>
                <Column>
                  <Row className="mb-0 mt-0">
                    <Column />
                    <Column>
                      <Text className="font-semibold mb-1 mt-0 text-gray-600 text-left">
                        Receipt date:
                      </Text>
                      <Text className="text-xl mt-0 text-left">{receiptDateAsString}</Text>
                    </Column>
                  </Row>
                  <Row className="mb-1 mt-0">
                    <Text className="font-semibold mb-1 mt-0 text-gray-600">Bill to:</Text>
                    <Text className="text-xl mt-0">
                      {firstName} {lastName}
                    </Text>
                  </Row>
                </Column>
              </Row>
              <Hr />
              <Row>
                <Container>
                  <Text className="text-xl font-semibold">Hipstr Booth for Event</Text>
                  <Row className="mt-2">
                    <Column width={100}>
                      <Img
                        src={`${baseUrl}${packageImageSrc}`}
                        width={packageImageSrc.includes("halo") ? 90 : 100}
                        height={packageImageSrc.includes("halo") ? 130 : 100}
                      />
                    </Column>
                    <Column>
                      <Text className="mb-0 ml-2">
                        1 x {boothName} - {eventDate}
                      </Text>
                      <Text className="text-gray-500 mt-0 ml-2">
                        {eventType}, {city}, {state}
                      </Text>
                      <Text className="text-start text-xs font-light text-gray-500 mt-0 ml-2">
                        {invoiceDescription}
                      </Text>
                    </Column>
                    <Column width={60} className="align-top">
                      <Text className="text-right mb-0 whitespace-nowrap">
                        $ {numberFormatter.format(retailPrice)}
                      </Text>
                    </Column>
                  </Row>

                  {retailPrice - subtotal > 0 && (
                    <Row className="mt-2">
                      <Column width={100} />
                      <Column />
                      <Column width={60}>
                        <Text className="text-right mb-0 mt-0 whitespace-nowrap">
                          Limited Time offer Promotional Rate Discount: -${" "}
                          {numberFormatter.format(retailPrice - subtotal)}
                        </Text>
                      </Column>
                    </Row>
                  )}

                  {!!firstPaymentDateAsString && !!paidBefore ? (
                    <Row className="mt-2">
                      <Column width={100} />
                      <Column />
                      <Column width={60}>
                        <Text className="text-right mb-0 mt-0 whitespace-nowrap">
                          Deposit of 50% paid on {firstPaymentDateAsString}: -${" "}
                          {numberFormatter.format(paidBefore)}
                        </Text>
                      </Column>
                    </Row>
                  ) : null}

                  {specialDiscount > 0 ? (
                    <Row className="mt-2">
                      <Column width={100} />
                      <Column />
                      <Column width={60}>
                        <Text className="text-right mb-0 mt-0 whitespace-nowrap">
                          5% Discount: -$ {numberFormatter.format(specialDiscount)}
                        </Text>
                      </Column>
                    </Row>
                  ) : null}

                  <Row className="mt-2">
                    <Column width={100} />
                    <Column />
                    <Column width={60}>
                      <Text className="text-right mb-0 mt-0 whitespace-nowrap">
                        Fees: $ {numberFormatter.format(stripeFee)}
                      </Text>
                      {travelFee ? (
                        <Text className="text-right mb-0 mt-0 whitespace-nowrap">
                          Travel: $ {numberFormatter.format(travelFee)}
                        </Text>
                      ) : null}
                    </Column>
                  </Row>
                  <Hr />
                  <Row className="mt-2">
                    <Column width={100} />
                    <Column />
                    <Column width={60}>
                      <Text className="text-right mb-0 mt-0 whitespace-nowrap">
                        Total:
                        <span className="mb-0 ml-2">$ {numberFormatter.format(total)}</span>
                      </Text>

                      {promotionalCodeDiscount ? (
                        <Text className="text-right mb-0 mt-0 whitespace-nowrap">
                          Promotional Code Discount:
                          <span className="mb-0 ml-2">
                            -$ {numberFormatter.format(promotionalCodeDiscount)}
                          </span>
                        </Text>
                      ) : null}

                      <Text className="text-right mb-0 mt-0 text-gray-500 whitespace-nowrap">
                        Paid to Date:
                        <span className="mb-0 ml-2">$ {numberFormatter.format(paidToDate)}</span>
                      </Text>

                      <Text className="text-right mb-0 mt-0 font-semibold whitespace-nowrap">
                        {pending ? `Due on ${dueDateAsString}` : "Amount Due"}:
                        <span className="font-semibold mb-0 ml-2">
                          $ {numberFormatter.format(pending)}
                        </span>
                      </Text>
                    </Column>
                  </Row>
                </Container>
              </Row>
              <Hr />
              <Row>
                <Text className="text-center text-sm font-light text-gray-500">
                  The usage of the Provider Equipment may be cancelled at any time by submitted
                  written notice of cancellation to{" "}
                  <Link href={`mailto:${supportEmail}`}>{supportEmail}</Link>. No refund will be
                  provided for any equipment reservation cancelled, for any reason including event
                  cancellation, less than six months prior to the date of Client’s scheduled
                  reservation and event.
                </Text>
              </Row>
              <Hr />
              <Row>
                <Column className="text-center text-gray-700">
                  <Text className="font-bold mb-0 mt-0">Hipstr, Inc</Text>
                  <Text className="mb-0 mt-0">244 5th Ave, M-292</Text>
                  <Text className="mb-0 mt-0">New York, NY 10001</Text>
                  <Text className="mb-0 mt-0">(844) 266-5447</Text>
                  <Text className="mb-0 mt-0 text-xs">http://www.bookhipstr.com</Text>
                </Column>
              </Row>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default Invoice;
