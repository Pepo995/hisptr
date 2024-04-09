import { PrismaClient } from "@prisma/client";
// import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

const main = async () => {
  // Creating addons:  Custom Backdrop, Idle Hour, Active Hour, Green Screen, Travel, Extra Host, Extra Photo Book, Extra Printing, and Holiday Fee with their respective descriptions and priceInCents.
  await prisma.addOn.deleteMany({});
  await prisma.addOn.createMany({
    data: [
      {
        name: "Custom Backdrop (Studio Booth)",
        description:
          "This Backdrop will be a custom design for your event with company logo, or designated print selection.",
        priceInCents: 797 * 100,
      },
      {
        name: "Idle Hour Fee",
        description: "Idle Hour that allows for the photo booth to be setup without guest usage.",
        priceInCents: 97 * 100,
      },
      {
        name: "Active Hour",
        description:
          "Additional Active Hour that enables guest to interact with the photo booth experience.",
        priceInCents: 147 * 100,
      },
      {
        name: "Green Screen Activation",
        description:
          "Includes Green Screen Backdrop + Software Capabilities for Green Screen Activation. Does not include images or videos for background material.",
        priceInCents: 697 * 100,
      },
      {
        name: "Travel Fee",
        description: "Additional travel fee per 50 miles.",
        priceInCents: 100 * 100,
      },
      {
        name: "Additional Host",
        description: "Additional Hipstr Host per 4 hours.",
        priceInCents: 597 * 100,
      },
      {
        name: "Scrapbook Add-On",
        description: "Additional Photo Album for Event.",
        priceInCents: 197 * 100,
      },
      {
        name: "Additional Printing",
        description: "Additional Printing for Photo booth experience.",
        priceInCents: 497 * 100,
      },
      {
        name: "Holiday Fee",
        description: "Holiday Event Fee.",
        priceInCents: 597 * 100,
      },
      {
        name: "Limited Time offer Promotional Rate Discount.",
        description: "Discount.",
        priceInCents: -500,
      },
    ],
  });
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
