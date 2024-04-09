import { render } from "@react-email/render";

import { env } from "~/env.mjs";
import { getTransport } from "./mailTransport";

type SendEmailProps<T> = {
  from?: string;
  to: string | string[];
  subject: string;
  bcc?: string;
  Email: (props: T) => JSX.Element;
  emailProps: T;
};

export const sendReactEmail = async <T>({
  from = env.EMAIL_FROM,
  to,
  subject,
  Email,
  bcc = env.EMAIL_BCC,
  emailProps,
}: SendEmailProps<T>) => {
  const transport = getTransport();

  const renderEmail = render(Email(emailProps));

  await transport.sendMail({
    from,
    to,
    bcc,
    subject,
    html: renderEmail,
  });

  return true;
};
