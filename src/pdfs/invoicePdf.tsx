import React from "react";
import { Document, Font, Image, Link, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

import { getBoothInfo } from "@components/Payment/utils";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

type InvoiceProps = {
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
  balanceStatusDescription: string;
  firstPaymentDateAsString?: string;
  dueDateAsString?: string;
};

Font.register({
  family: "Open Sans",
  fonts: [
    { src: "https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-regular.ttf" },
    {
      src: "https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-300.ttf",
      fontWeight: 300,
    },
    {
      src: "https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-600.ttf",
      fontWeight: 600,
    },
    {
      src: "https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-700.ttf",
      fontWeight: 700,
    },
    {
      src: "https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-800.ttf",
      fontWeight: 800,
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#FFF",
    width: "100%",
    height: "100%",
    color: "#000",
    fontFamily: "Open Sans",
  },
  title: {
    fontWeight: 800,
    fontSize: 20,
    marginTop: 18,
    marginBottom: 18,
  },
  subtitle: {
    marginTop: 0,
    marginBottom: 4,
    fontWeight: 600,
    color: "#4B5563",
    fontSize: 11,
  },
  content: {
    marginTop: 0,
    marginBottom: 10,
    fontWeight: 400,
    fontSize: 14,
  },
  noMargin: {
    marginTop: 0,
    marginBottom: 0,
  },
  columnContainer: {
    marginTop: 5,
    display: "flex",
    flexDirection: "column",
    color: "#000",
  },
  prices: {
    marginTop: 0,
    marginBottom: 0,
    textAlign: "right",
    fontSize: 11,
  },
});

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

const numberFormatter = new Intl.NumberFormat("en-US", {
  style: "decimal",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const InvoicePdf = ({
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
}: InvoiceProps) => {
  const { boothName, invoiceImg: packageImageSrc, invoiceDescription } = getBoothInfo(packageId);

  const supportEmail = process.env.SUPPORT_MAIL ?? "support@example.com";
  const receiptNumberToShow = receiptNumber ? receiptNumber : eventNumber;
  const receiptDateAsString = dayjs.utc().format("dddd MMMM D, YYYY");

  return (
    <Document title={`Your Hipstr Booth Invoice - ${eventDate}`}>
      <Page size="A4" style={styles.page}>
        <View
          style={{
            maxWidth: 500,
            marginLeft: "auto",
            marginRight: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Text style={styles.title}>Your Hipstr Invoice - {balanceStatusDescription}</Text>

          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <View
              style={{
                width: "40%",
              }}
            >
              {/* eslint-disable-next-line jsx-a11y/alt-text */}
              <Image src={`${baseUrl}/hipstr-logo.jpg`} style={{ height: 100, width: 100 }} />
            </View>

            <View
              style={{
                width: "40%",
                height: 100,
                display: "flex",
                flexDirection: "column",
                alignContent: "flex-end",
              }}
            >
              <Text style={[styles.subtitle, { textAlign: "right" }]}>Receipt number:</Text>
              <Text style={[styles.content, { textAlign: "right" }]}>#{receiptNumberToShow}</Text>
              <Text style={[styles.subtitle, { textAlign: "right" }]}>Event ID:</Text>
              <Text style={[styles.content, { textAlign: "right" }]}>#{eventNumber}</Text>
            </View>
          </View>

          <View style={{ width: "100%", display: "flex", flexDirection: "column" }}>
            <Text style={[styles.subtitle, { textAlign: "left" }]}>Receipt date:</Text>
            <Text style={[styles.content, { textAlign: "left" }]}>{receiptDateAsString}</Text>
            <Text style={[styles.subtitle, { textAlign: "left" }]}>Bill to:</Text>
            <Text style={[styles.content, { textAlign: "left" }]}>
              {firstName} {lastName}
            </Text>
          </View>

          <View
            style={{
              width: "100%",
              border: "none",
              borderTop: "1px solid #eaeaea",
              paddingTop: 12,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: 700,
                marginBottom: 12,
                color: "#000",
              }}
            >
              Hipstr Booth for Event
            </Text>

            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <View
                style={{
                  width: "15%",
                  marginRight: 8,
                }}
              >
                {/* eslint-disable-next-line jsx-a11y/alt-text */}
                <Image src={`${baseUrl}${packageImageSrc}`} style={{ width: 80, height: 80 }} />
              </View>

              <View
                style={{ display: "flex", flexDirection: "column", width: "60%", marginRight: 8 }}
              >
                <Text
                  style={{
                    marginBottom: 0,
                    marginLeft: 6,
                    marginTop: 14,
                    fontSize: 11,
                    color: "#000",
                  }}
                >
                  1 x {boothName} - {eventDate}
                </Text>

                <Text
                  style={{
                    marginTop: 0,
                    color: "#6B7280",
                    marginLeft: 6,
                    fontSize: 11,
                    marginBottom: 14,
                  }}
                >
                  {eventType}, {city}, {state}
                </Text>

                <Text
                  style={{
                    marginTop: 0,
                    marginLeft: 8,
                    fontSize: 9,
                    fontWeight: 300,
                    color: "#6B7280",
                    marginBottom: 14,
                  }}
                >
                  {invoiceDescription}
                </Text>
              </View>

              <View style={{ width: "22%", color: "#000" }}>
                <Text
                  style={{
                    marginBottom: 0,
                    width: "100%",
                    textAlign: "right",
                    fontSize: 11,
                  }}
                >
                  $ {numberFormatter.format(retailPrice)}
                </Text>
              </View>
            </View>
          </View>

          <View style={{ paddingBottom: 12, borderBottom: "1px solid #eaeaea" }}>
            {retailPrice - subtotal > 0 && (
              <View style={styles.columnContainer}>
                <Text style={styles.prices}>
                  Limited Time offer Promotional Rate Discount: -${" "}
                  {numberFormatter.format(retailPrice - subtotal)}
                </Text>
              </View>
            )}

            {!!firstPaymentDateAsString && !!paidBefore ? (
              <View style={styles.columnContainer}>
                <Text style={styles.prices}>
                  Deposit of 50% paid on {firstPaymentDateAsString}: -${" "}
                  {numberFormatter.format(paidBefore)}
                </Text>
              </View>
            ) : null}

            {specialDiscount > 0 ? (
              <View style={styles.columnContainer}>
                <Text style={styles.prices}>
                  5% Discount: -$ {numberFormatter.format(specialDiscount)}
                </Text>
              </View>
            ) : null}

            <View style={styles.columnContainer}>
              <Text style={styles.prices}>Fees: $ {numberFormatter.format(stripeFee)}</Text>

              {travelFee ? (
                <Text style={styles.prices}>Travel: $ {numberFormatter.format(travelFee)}</Text>
              ) : null}
            </View>
          </View>

          <View
            style={[
              styles.columnContainer,
              {
                width: "100%",
                paddingBottom: 12,
              },
            ]}
          >
            <View style={styles.columnContainer}>
              <Text style={styles.prices}>Total: $ {numberFormatter.format(total)}</Text>
            </View>

            {promotionalCodeDiscount ? (
              <View style={styles.columnContainer}>
                <Text style={styles.prices}>
                  Promotional Code Discount: -$ {numberFormatter.format(promotionalCodeDiscount)}
                </Text>
              </View>
            ) : null}

            <View style={styles.columnContainer}>
              <Text
                style={{
                  marginTop: 0,
                  marginBottom: 0,
                  textAlign: "right",
                  color: "#6B7280",
                  fontSize: 11,
                }}
              >
                Paid to Date: $ {numberFormatter.format(paidToDate)}
              </Text>
            </View>

            <View style={styles.columnContainer}>
              <Text
                style={[styles.noMargin, { textAlign: "right", fontWeight: 600, fontSize: 11 }]}
              >
                {pending ? `Due on ${dueDateAsString}` : "Amount Due"}: ${" "}
                {numberFormatter.format(pending)}
              </Text>
            </View>
          </View>

          <View
            style={{
              width: "100%",
              border: "none",
              borderTop: "1px solid #eaeaea",
              borderBottom: "1px solid #eaeaea",
              paddingTop: 12,
              paddingBottom: 12,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontSize: 10,
                fontWeight: 300,
                textAlign: "center",
                color: "#6B7280",
              }}
            >
              The usage of the Provider Equipment may be cancelled at any time by submitted written
              notice of cancellation to{" "}
              <Link
                src={`#mailto:${supportEmail}`}
                style={{ color: "#067df7", textDecoration: "none" }}
                debug
              >
                {supportEmail}
              </Link>
              . No refund will be provided for any equipment reservation cancelled, for any reason
              including event cancellation, less than six months prior to the date of Client&apos;s
              scheduled reservation and event.
            </Text>
          </View>

          <View
            style={{
              width: "100%",
              border: "none",
              display: "flex",
              paddingTop: 12,
              flexDirection: "column",
              justifyContent: "center",
              color: "#374151",
            }}
          >
            <Text
              style={[
                styles.noMargin,
                {
                  textAlign: "center",
                  fontWeight: 700,
                  fontSize: 12,
                },
              ]}
            >
              Hipstr, Inc
            </Text>
            <Text
              style={[
                styles.noMargin,
                {
                  textAlign: "center",
                  fontSize: 12,
                },
              ]}
            >
              244 5th Ave, M-292
            </Text>
            <Text
              style={[
                styles.noMargin,
                {
                  textAlign: "center",
                  fontSize: 12,
                },
              ]}
            >
              New York, NY 10001
            </Text>
            <Text
              style={[
                styles.noMargin,
                {
                  textAlign: "center",
                  fontSize: 12,
                },
              ]}
            >
              (844) 266-5447
            </Text>
            <Text
              style={[
                styles.noMargin,
                {
                  fontSize: 11,
                  textAlign: "center",
                },
              ]}
            >
              <Link
                src="http://www.bookhipstr.com"
                style={{ color: "#374151", textDecoration: "none" }}
                debug
              >
                http://www.bookhipstr.com
              </Link>
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};
export default InvoicePdf;
1;
