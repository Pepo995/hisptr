export const getGaClientid = (): string => {
  const cookie: Record<string, string> = {};

  document.cookie.split(";").forEach(function (el) {
    const splitCookie = el.split("=");
    const key = splitCookie[0].trim();
    const value = splitCookie[1];
    cookie[key] = value;
  });

  return cookie._ga?.substring(6) ?? "";
};
