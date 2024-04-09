"use client";

import Zendesk, { ZendeskAPI } from "react-zendesk";
import { env } from "~/env.mjs";

const ZendeskClient = () => (
  <Zendesk
    defer
    zendeskKey={env.NEXT_PUBLIC_ZENDESK_KEY}
    onLoaded={() => {
      ZendeskAPI("webWidget", "hide");

      setTimeout(() => {
        ZendeskAPI("webWidget", "show");
      }, 3000);
    }}
  />
);
export default ZendeskClient;
