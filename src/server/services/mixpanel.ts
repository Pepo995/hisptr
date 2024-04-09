import mixpanel from "mixpanel";

import { env } from "~/env.mjs";

export type UserEvent = {
  type: string;
  distinctId: string;
  ip?: string;
  properties?: Record<string, unknown>;
  clientName?: string;
  email?: string;
};

export const trackEvent = (event: UserEvent) => {
  if (!env.MIXPANEL_TOKEN) return;

  const mixpanelInstance = mixpanel.init(env.MIXPANEL_TOKEN);

  const peopleData: Record<string, string | undefined> = {
    ip: event.ip,
    clientName: event.clientName,
    name: event.clientName,
    email: event.email,
  };

  // Delete undefined values
  Object.keys(peopleData).forEach((key) => peopleData[key] === undefined && delete peopleData[key]);

  mixpanelInstance.people.set(event.distinctId, peopleData);

  mixpanelInstance.track(event.type, {
    distinct_id: event.distinctId,
    ip: event.ip,
    ...event.properties,
  });
};
