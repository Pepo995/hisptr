import { type AnyAction } from "@reduxjs/toolkit";
import { type EventFromPhp } from "./event";
import { type UserFromPhp } from "./user";

export type BaseAction<T = object> = AnyAction &
  Promise<{
    data: {
      data: T;
      message: string;
    };
    message?: string;
    status: number;
  }>;

export type GetEventsAction = BaseAction<{
  events: EventFromPhp[];
  count: number;
}>;

type MenuOption = { display_order: null | number; code: number };

export type Module = MenuOption & { module?: MenuOption };

export type LoginAction = BaseAction<{
  token: string;
  user: UserFromPhp;
}>;

export type GetCustomerAction = BaseAction<{
  user: UserFromPhp;
}>;

export type GetUsersAction = BaseAction<{
  users: UserFromPhp[];
  count: number;
}>;

export type Faq = {
  title: string;
  description: string;
};

export type FaqListAction = BaseAction<{
  faqs: Faq[];
  count: number;
}>;

export type Video = {
  title: string;
  description: string;
  media: string;
};

export type VideoListAction = BaseAction<{
  videos: Video[];
  count: number;
}>;

export type Content = { id: number; media: string; title: string; description: string };

export type ContentListAction = BaseAction<{
  content: Content[];
  count: number;
}>;

export type Resource = { id: number; media: string; title: string; description: string };

export type ResourceListAction = BaseAction<{
  resources: Resource[];
  count: number;
}>;

export type GetModulesAction = BaseAction<{
  modules: Module[];
  count: number;
}>;

export type GetEventsDetailsAction = BaseAction<{
  event: EventFromPhp;
}>;

export type Preference = { name: string; id: number };

export type GetPreferencesAction = BaseAction<{
  preferences: Preference[];
}>;
