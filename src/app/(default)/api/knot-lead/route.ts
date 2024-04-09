import { prisma } from "@server/db";
import dayjs from "dayjs";
import { type NextRequest } from "next/server";
import { z } from "zod";
import { env } from "~/env.mjs";

const createInProgressEventSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  city: z.string(),
  state: z.string(),
  eventDate: z.string().optional(),
});

const WEDDING_EVENT_TYPE_ID = 40;

type StateAbbr =
  | "AL"
  | "AK"
  | "AS"
  | "AZ"
  | "AR"
  | "CA"
  | "CO"
  | "CT"
  | "DE"
  | "DC"
  | "FL"
  | "GA"
  | "GU"
  | "HI"
  | "ID"
  | "IL"
  | "IN"
  | "IA"
  | "KS"
  | "KY"
  | "LA"
  | "ME"
  | "MD"
  | "MA"
  | "MI"
  | "MN"
  | "MS"
  | "MO"
  | "MT"
  | "NE"
  | "NV"
  | "NH"
  | "NJ"
  | "NM"
  | "NY"
  | "NC"
  | "ND"
  | "OH"
  | "OK"
  | "OR"
  | "PA"
  | "PR"
  | "RI"
  | "SC"
  | "SD"
  | "TN"
  | "TX"
  | "UT"
  | "VT"
  | "VI"
  | "VA"
  | "WA"
  | "WV"
  | "WI"
  | "WY";

const states: Record<StateAbbr, string> = {
  AL: "Alabama",
  AK: "Alaska",
  AS: "American Samoa",
  AZ: "Arizona",
  AR: "Arkansas",
  CA: "California",
  CO: "Colorado",
  CT: "Connecticut",
  DE: "Delaware",
  DC: "District of Columbia",
  FL: "Florida",
  GA: "Georgia",
  GU: "Guam",
  HI: "Hawaii",
  ID: "Idaho",
  IL: "Illinois",
  IN: "Indiana",
  IA: "Iowa",
  KS: "Kansas",
  KY: "Kentucky",
  LA: "Louisiana",
  ME: "Maine",
  MD: "Maryland",
  MA: "Massachusetts",
  MI: "Michigan",
  MN: "Minnesota",
  MS: "Mississippi",
  MO: "Missouri",
  MT: "Montana",
  NE: "Nebraska",
  NV: "Nevada",
  NH: "New Hampshire",
  NJ: "New Jersey",
  NM: "New Mexico",
  NY: "New York",
  NC: "North Carolina",
  ND: "North Dakota",
  OH: "Ohio",
  OK: "Oklahoma",
  OR: "Oregon",
  PA: "Pennsylvania",
  PR: "Puerto Rico",
  RI: "Rhode Island",
  SC: "South Carolina",
  SD: "South Dakota",
  TN: "Tennessee",
  TX: "Texas",
  UT: "Utah",
  VT: "Vermont",
  VI: "Virgin Islands",
  VA: "Virginia",
  WA: "Washington",
  WV: "West Virginia",
  WI: "Wisconsin",
  WY: "Wyoming",
};

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }
  const body = createInProgressEventSchema.safeParse(await request.json());
  if (!body.success) {
    return new Response(body.error.message, { status: 400 });
  }
  const { firstName, lastName, email, city, state, eventDate } = body.data;
  const trimmedState = state.trim();
  const stateName =
    trimmedState.length === 2 ? states[trimmedState.toUpperCase() as StateAbbr] : trimmedState;
  let stateId: number;
  try {
    const stateData = await prisma.state.findFirst({
      where: {
        name: stateName,
      },
      select: {
        id: true,
      },
    });
    if (!stateData) {
      return new Response("State not found", { status: 400 });
    }
    stateId = stateData.id;
  } catch (error) {
    console.error(error);
    return new Response("Error finding state", { status: 500 });
  }

  const utmSource = "knot";
  const utmMedium = null;
  const utmCampaign = null;
  const utmTerm = null;
  const utmContent = null;
  const utmId = null;

  let utmParamsId: number;
  try {
    utmParamsId = await prisma.utmParams
      .create({
        data: {
          utmSource,
          utmMedium,
          utmCampaign,
          utmTerm,
          utmContent,
          utmId,
        },
      })
      .then((res) => res.id);
  } catch (error) {
    console.error(error);
    return new Response("Error creating utmParams", { status: 500 });
  }
  try {
    let date = null;
    if (eventDate) {
      let tmp = dayjs(eventDate, "YYYY-MM-DD");
      if (tmp.isValid()) {
        date = tmp.toDate();
      } else {
        tmp = dayjs(eventDate);
        date = tmp.isValid() ? tmp.toDate() : null;
      }
    }
    const event = await prisma.inProcessEvent.create({
      data: {
        firstName,
        lastName,
        email,
        typeId: WEDDING_EVENT_TYPE_ID,
        city,
        stateId,
        receiveCommunicationsAccepted: false,
        utmParamsId,
        eventDate: date,
        hasBeenAnnounced: true,
      },
    });
    return new Response(JSON.stringify(event.id), { status: 201 });
  } catch (error) {
    console.error(error);
    await prisma.utmParams.delete({
      where: {
        id: utmParamsId,
      },
    });
    return new Response("Error creating inProcessEvent", { status: 500 });
  }
}
