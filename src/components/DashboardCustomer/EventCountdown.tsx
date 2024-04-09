import { type DashboardInformationEvent } from "@server/api/routers/customer/events";
import dayjs from "dayjs";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Card, CardBody, CardTitle } from "reactstrap";

const EventCountdown = ({ event }: { event: DashboardInformationEvent }) => {
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      const currentDate = new Date();
      if (!event) {
        clearInterval(countdownInterval);
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      const dateInUTC = dayjs(event?.eventDate).format();
      const eventStartHour = dayjs(event?.startTime).hour();
      const eventStartMinute = dayjs(event?.startTime).minute();
      const newTime = dayjs(dateInUTC).add(eventStartHour, "hour").add(eventStartMinute, "minute");
      if (newTime.isValid() === false) {
        clearInterval(countdownInterval);
        return;
      } else {
        const remainingTime = newTime.toDate().getTime() - currentDate?.getTime();
        if (remainingTime < 0) {
          clearInterval(countdownInterval);
          return;
        }
        const seconds = Math.floor(remainingTime / 1000) % 60;
        const minutes = Math.floor(remainingTime / 1000 / 60) % 60;
        const hours = Math.floor(remainingTime / 1000 / 60 / 60) % 24;
        const days = Math.floor(remainingTime / 1000 / 60 / 60 / 24);
        setCountdown({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => {
      clearInterval(countdownInterval);
    };
  }, [event]);

  const countDownCards: (keyof typeof countdown)[] = ["days", "hours", "minutes", "seconds"];

  return (
    <Card className="bg-white">
      <Link
        href={{
          pathname: event
            ? `/customer/event-management/upcoming-event/edit-event-detail/${event?.id}`
            : "/customer/dashboard",
        }}
      >
        <CardBody>
          <CardTitle className="sy-tx-modal f-600 font2024 ">Your Event Countdown</CardTitle>
          {!event && (
            <p className="sy-tx-modal font-small-4">
              Start scheduling your next Hipster event by contacting Hipster admin
            </p>
          )}
          <div className="all-count-box">
            {countDownCards.map((key) => (
              <Card className="each-box" key={key}>
                <CardBody className="mx-auto px-50">
                  <p className="count f-700 mb-0">
                    {Object.values(countdown).every((val) => val === 0) ? (
                      "--"
                    ) : (
                      <>
                        {event && countdown?.[key]?.toString()?.length >= 2
                          ? countdown?.[key]
                          : !event && countdown?.[key]?.toString()?.length !== 2
                          ? "00"
                          : `0${countdown?.[key]}`}
                      </>
                    )}
                  </p>
                  <p className="sy-tx-black font1624 text-center mb-0">{key}</p>
                </CardBody>
              </Card>
            ))}
          </div>
        </CardBody>
      </Link>
    </Card>
  );
};

export default EventCountdown;
