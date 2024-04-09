import React, { Fragment } from "react";
import { Card, CardBody, CardTitle } from "reactstrap";

import checkIcon from "@images/pages/chekIcon.png";
import currentIcon from "@images/pages/currentProgress.png";
import Link from "next/link";
import { type events_admin_status } from "@prisma/client";
import { EVENT_ADMIN_STATUS_LABEL } from "@constants/CommonConstants";
import Image from "next/image";
import { type DashboardInformationEvent } from "@server/api/routers/customer/events";
const trackerArray: { id: events_admin_status }[] = [
  { id: "awaiting" },
  { id: "detail_recieved" },
  { id: "in_planning" },
  { id: "ready_to_execute" },
  { id: "serviced" },
];

const PlanningTracker = ({ event }: { event: DashboardInformationEvent }) => {
  const check = trackerArray.findIndex(
    (x) => x.id.toLowerCase() === event?.adminStatus?.toLowerCase(),
  );
  const allTracker = trackerArray.map((tracker, index) => {
    return {
      ...tracker,
      checked: check === 0 ? index === check : index <= check,
      prevChecked: check === 0 ? index < check : index <= check,
    };
  });

  return (
    <Link
      href={{
        pathname: event
          ? `/customer/event-management/upcoming-event/edit-event-detail/${event?.id}`
          : "/customer/dashboard",
        // state: {
        //     id: event?.id
        // }
      }}
    >
      <Card className="bg-white">
        <CardBody>
          <CardTitle className="sy-tx-modal f-600 font2024 ">Event Planning Tracker</CardTitle>
          {!event && (
            <p className="sy-tx-modal font-small-4 mb-0">
              After you schedule an Event follow it’s progress here
            </p>
          )}
        </CardBody>
        <div className="event-tracker">
          <div className={`${!event ? "opacity-4" : ""} tracker-status tracker-cover-img`}>
            {allTracker &&
              allTracker.length > 0 &&
              allTracker?.map((tracker, index) => {
                return (
                  <Fragment key={index}>
                    <Card className="each-step mb-0" key={index}>
                      <CardBody className="p-0 ">
                        <div className="step-icon">
                          <Image
                            className={`${!tracker?.prevChecked ? "opacity-4" : ""
                              } item-center w-100`}
                            src={!tracker?.checked ? currentIcon.src : checkIcon.src}
                            alt="step-icon"
                            width={300}
                            height={200}
                          />
                        </div>
                      </CardBody>
                    </Card>
                    {index !== allTracker.length - 1 && (
                      <div
                        className={`${tracker?.checked ? "tracker-line-active" : "tracker-line"}  `}
                      ></div>
                    )}
                  </Fragment>
                );
              })}
          </div>
          <div className="tracker-status align-items-start bottom-status-text">
            {allTracker?.map((tracker, index) => (
              <Card className="each-step" key={index}>
                <CardBody className="p-0 ">
                  <p className="tracker-event-title  sy-tx-modal font-small-4 f-500 text-center mb-0 pt-50">
                    {EVENT_ADMIN_STATUS_LABEL.get(tracker.id)}
                  </p>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default PlanningTracker;
