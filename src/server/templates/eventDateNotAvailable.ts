export const eventDateNotAvailableContent = (fisrtName: string) => {
  const text = `Hi <b>${fisrtName}</b>,

    It doesn&apos;t happen often, but unfortunately, we are fully booked for your event date 😭.

    BUT we would love to keep in touch. We're going to put you down on our wait list so that if anything opens up we will reach out and see if we can make this happen!

    Please let us know if you have any questions or if there is anything else we can do for you!


    Best,


    The Hipstr Team`;

  return { text, html: text.replace(/\n/g, "<br />") };
};
