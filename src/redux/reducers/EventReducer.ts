import { type PayloadAction } from "@reduxjs/toolkit";
import {
  EVENT,
  EVENT_HISTORY_LIST,
  EVENT_HISTORY_TOTAL,
  EVENT_LIST,
  EVENT_TOTAL,
} from "@constants/ReducerConstants";
import { type EventFromPhp } from "@types";

export type EventReducerType = {
  event?: EventFromPhp[];
  eventList: EventFromPhp[];
  totalEvent: number;
  historyEvent: EventFromPhp[];
  totalHistoryEvent: number;
};

const initialState: EventReducerType = {
  event: undefined,
  eventList: [],
  totalEvent: 0,
  historyEvent: [],
  totalHistoryEvent: 0,
};
// reducer for shop listing
const EventReducer = (state = initialState, action: PayloadAction<EventFromPhp[] | number>) => {
  switch (action.type) {
    case EVENT:
      return { ...state, event: action.payload };
    case EVENT_LIST:
      return { ...state, eventList: action.payload };
    case EVENT_TOTAL:
      return { ...state, totalEvent: action.payload };
    case EVENT_HISTORY_LIST:
      return { ...state, historyEvent: action.payload };
    case EVENT_HISTORY_TOTAL:
      return { ...state, totalHistoryEvent: action.payload };
    default: {
      return state;
    }
  }
};
export default EventReducer;
