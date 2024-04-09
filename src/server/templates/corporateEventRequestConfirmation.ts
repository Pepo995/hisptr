export const corporateEventRequestConfirmationContent = (fisrtName: string) => {
  const text = `Hi ${fisrtName},


    Thank you so much for your interest in working with us! We're more than happy to help. With your event being right around the corner, We'd love to get some initial information first. Can you let us know a bit more about the event you're having by answering the questions below:
    What's the start time/end time of your event?
    What does success look like for your photo booth experience?
    Attached to this email is our Hipstr Capabilities Deck. Is there any specific offering that's resonating with you for this event?
    Do you have some time today or tomorrow for a quick 15-minute chat? If so, click here to schedule some time!


    In case you need some ideas for your event, we're sharing a few links below so you may see some of our past work:
    Hipstr x Google
    Hipstr x MLB
    Hipstr x Coach & Disney
    Hipstr x The Grammys
    Hipstr Highlight Reel


    Thanks so much! Looking forward to working together.


    Sincerely,

    The Hipstr Team`;

  const linkToCalendly =
    "https://streaklinks.com/BwzrK3H4eEskKtBC8QNf_o6X/https%3A%2F%2Fcalendly.com%2Fbookhipstr%2Flet-s-chat-about-your-corporate-event?email=info%40bookhipstr.com";

  const linkToGoogleDrive =
    "https://streaklinks.com/BwzrK3fd3ZjWfLz6Mw4RKLLz/https%3A%2F%2Fdrive.google.com%2Ffile%2Fd%2F1y8B87hqmsLEmVpCmO5s_8ITBFq_eeLHf%2Fview?email=info%40bookhipstr.com";

  const linkToMLB =
    "https://streaklinks.com/BwzrK3j3d13OEchYhgu-TDvn/https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DM9qwpC627_c%26t%3D2s?email=info%40bookhipstr.com";

  const linkToCoachAndDisney =
    "https://streaklinks.com/BwzrK3jbG8OVoeEgJwheFz7y/https%3A%2F%2Fdrive.google.com%2Ffile%2Fd%2F1o1mRnkiZeJc4er2_XJyXW5Wd916AevNi%2Fview%3Fpli%3D1?email=info%40bookhipstr.com";

  const linkToTheGrammys =
    "https://streaklinks.com/BwzrK4AtLUFKrNdrVQJ03yOK/https%3A%2F%2Fdrive.google.com%2Ffile%2Fd%2F1BVHw2zGIa25bh8mwmtHC-tukxQZJs2vF%2Fview?email=info%40bookhipstr.com";

  const linkToHighlightReel =
    "https://streaklinks.com/BwzrK3vrq810HfgqiQRTzRLO/https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3Dt7ZdH6mz_CE?email=info%40bookhipstr.com";

  const linkToPdf = `${process.env.NEXT_PUBLIC_BASENAME_URL}/files/Hipstr Capabilities Deck 2023.pdf`;

  const html = `Hi <b>${fisrtName}</b>,<br />
    <br />
    <br />
    Thank you so much for your interest in working with us! We're more than happy to help. With your event being right around the corner, We'd love to get some initial information first. Can you let us know a bit more about the event you're having by answering the questions below:
    <ul>
      <li>What's the start time/end time of your event?</li>
      <li>What does success look like for your photo booth experience?</li>
      <li><a href="${linkToPdf}">Here</a> you can find Hipstr Capabilities Deck. Is there any specific offering that's resonating with you for this event?</li>
      <li>Do you have some time today or tomorrow for a quick 15-minute chat? If so, <a href="${linkToCalendly}">click here</a> to schedule some time!</li>
    </ul>
    <br />
    <br />
    In case you need some ideas for your event, we're sharing a few links below so you may see some of our past work:
    <ul>
      <li><a href="${linkToGoogleDrive}">Hipstr x Google</a></li>
      <li><a href="${linkToMLB}">Hipstr x MLB</a></li>
      <li><a href="${linkToCoachAndDisney}">Hipstr x Coach & Disney</a></li>
      <li><a href="${linkToTheGrammys}">Hipstr x The Grammys</a></li>
      <li><a href="${linkToHighlightReel}">Hipstr Highlight Reel</a></li>
    </ul>
    <br />
    Thanks so much! Looking forward to working together.<br />
    <br />
    <br />
    Sincerely,<br />
    <br />
    The Hipstr Team`;

  return { text, html };
};
