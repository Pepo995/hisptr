import { Card, CardBody, CardHeader, CardTitle, Label } from "reactstrap";
import OnSiteSetupShimmer from "@components/Shimmer/OnSiteSetupShimmer";
import { FirstUpperCase } from "@utils/Utils";
import { type EventFromPhp } from "@types";

type OnSiteSetupProps = {
  event: EventFromPhp;
  isLoading: boolean;
};

const OnSiteSetup = ({ event, isLoading }: OnSiteSetupProps) => (
  <>
    {!isLoading ? (
      <Card className="card-apply-job bg-white">
        <CardHeader className="p-0 mx-2 mt-2 mb-75">
          <CardTitle className="sy-tx-primary">On Site Set Up Details</CardTitle>
        </CardHeader>

        <CardBody>
          <div className="d-flex justify-content-between flex-wrap">
            <div>
              <div className="d-flex">
                <Label className="me-25 cu-label">Onsite Point of Contact Name:</Label>
                <p className="sy-tx-modal f-500 f-14">{event?.setup?.contact_name || "--"}</p>
              </div>
              <div className="d-flex">
                <Label className="me-25 cu-label">Contact Number :</Label>
                <p className="sy-tx-modal f-500 f-14">{event?.setup?.phone_number || "--"}</p>
              </div>
            </div>
            <div>
              <div className="d-flex">
                <Label className="me-25 cu-label">Email address :</Label>
                <p className="sy-tx-modal f-500 f-14">{event?.setup?.email || "--"}</p>
              </div>
            </div>
          </div>
          <hr />
          <div>
            <Label className="cu-label">
              Where in the venue would you like the experience to be located?
            </Label>
            <p className="f-14">{event?.setup?.location || "--"}</p>
          </div>
          <hr />
          <div className="event-planer">
            <p tag="label" className="f-14">
              Is parking available at your venue? (I understand that I will either provide Hipstr
              with a parking voucher for my event or I may be subject to a $75 parking fee.)
            </p>

            {event?.setup?.is_parking_available ? (
              <div className="mb-1">
                <input
                  name="Insurance"
                  type="radio"
                  id="my-radio"
                  checked={true}
                  className="vertical-align"
                />
                <Label className="mb-0 mx-50 radio-label">
                  {FirstUpperCase(event?.setup?.is_parking_available)}
                </Label>
              </div>
            ) : (
              "--"
            )}
            <p tag="label" className="f-14">
              Will We Be Setting Up Outdoors?
            </p>
            {event?.setup?.setup_location ? (
              <div className="mb-1">
                <input
                  name="Insurance2"
                  type="radio"
                  id="my-radio"
                  checked={true}
                  className="vertical-align"
                />
                <Label className="mb-0 mx-50 radio-label">
                  {event?.setup?.setup_location === "indoor"
                    ? "No, you'll be inside"
                    : "Yes, you'll be outdoors"}
                </Label>
              </div>
            ) : (
              "--"
            )}
            <p tag="label" className="f-14">
              Please Select:
            </p>
            <p tag="label" className="f-14">
              In order for us to have a smooth set up, we require 1 - 1.5 hours of setup time. Could
              you confirm this is available for us?
            </p>
            {event?.setup?.available_for_setup ? (
              <div className="mb-1">
                <input
                  name="Insurance3"
                  type="radio"
                  id="my-radio"
                  checked={true}
                  className="vertical-align"
                />
                <Label className="mb-0 mx-50 radio-label">
                  {event?.setup?.available_for_setup === "yes" &&
                    "I will verify that sufficient space is allocated at my venue"}
                  {event?.setup?.available_for_setup === "not_needed" &&
                    "A 1.5-hour setup window will NOT be available"}
                  {event?.setup?.available_for_setup === "no" &&
                    "We'll have full access to the final setup space 1.5 hours ahead of time"}
                </Label>
              </div>
            ) : (
              "--"
            )}
            {event?.setup?.is_elevator_available ? (
              <div className="mb-1">
                <p tag="label" className="f-14">
                  We have a lot of stuff to carry. Will an elevator be available? (if needed)
                </p>
                <input
                  name="Insurance4"
                  type="radio"
                  id="my-radio"
                  checked={true}
                  className="vertical-align"
                />

                <Label className="mb-0 mx-50 radio-label">
                  {event?.setup?.is_elevator_available === "yes" &&
                    "Yes - your back will rest easy"}
                  {event?.setup?.is_elevator_available === "not_needed" &&
                    "All at ground level - no need for an elevator"}
                  {event?.setup?.is_elevator_available === "no" &&
                    "Nope - you'll need to load equipment up stairs, by hand"}
                </Label>
              </div>
            ) : (
              "-"
            )}
          </div>
        </CardBody>
      </Card>
    ) : (
      <OnSiteSetupShimmer />
    )}
  </>
);

export default OnSiteSetup;
