export const stripeCheckoutAppearance = {
  theme: "stripe" as const,
  rules: {
    ".Label": {
      fontFamily: "Montserrat, sans-serif",
      fontSize: "18px",
      fontWeight: "600",
      lineHeight: "22px",
      letterSpacing: "0em",
      textAlign: "left",
    },
    ".TermsText": {
      fontFamily: "Montserrat, sans-serif",
      fontWeight: "500",
      color: "#000",
      opacity: "1",
      fontSize: "14px",
    },
  },
};

export const stripeCheckoutFonts = [
  {
    cssSrc: "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600&display=swap",
  },
];
