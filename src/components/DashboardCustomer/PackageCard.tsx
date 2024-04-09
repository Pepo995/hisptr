import React, { useState } from "react";
import {
  Card,
  CardBody,
  CardTitle,
  Carousel,
  CarouselItem,
  Modal,
  ModalBody,
  ModalHeader,
} from "reactstrap";

import dummyImage from "@images/placeholder-image.png";
import Image from "next/image";
import { type DashboardInformationEvent } from "@server/api/routers/customer/events";
import { boothsInfo, packageOptions } from "@constants/packages";
import IncludedItems from "@components/onDemandBooking/IncludedItems";

const PackageCard = ({ event }: { event: DashboardInformationEvent }) => {
  const packageData = event?.packages;
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);
  const packageExtras = packageOptions.find((elem) => elem.optValue === packageData?.id);
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <>
      {event !== null ? (
        <Card className="package-card bg-white">
          <CardBody>
            <CardTitle tag="h4" className="sy-tx-modal f-600 font2024 tw-text-xl">
              Your Package
            </CardTitle>
            <div className="flex tw-items-start gap-2 tw-flex-col md:tw-flex-row">
              <div className="flex tw-flex-col">
                <Carousel
                  activeIndex={activeIndex}
                  next={() => setActiveIndex((x) => (x + 1) % 2)}
                  previous={() => setActiveIndex((x) => (x - 1) % 2)}
                  className="tw-w-72 tw-mx-auto tw-mb-2 tw-h-72 tw-flex tw-justify-center tw-items-center tw-rounded-md tw-overflow-hidden"
                >
                  <CarouselItem key={0}>
                    <Image
                      className="tw-self-center tw-w-72 tw-h-72 tw-object-cover"
                      src={packageExtras?.images[0].name.src ?? dummyImage}
                      alt="Card cap"
                      width={300}
                      height={200}
                    />
                  </CarouselItem>
                  <CarouselItem key={1}>
                    {packageData ? (
                      <Image
                        className="tw-self-center tw-w-72 tw-h-72 tw-object-cover"
                        src={boothsInfo.get(packageData?.id)?.imageSrc ?? dummyImage}
                        alt="Card cap"
                        width={300}
                        height={200}
                      />
                    ) : null}
                  </CarouselItem>
                </Carousel>
                <div className="tw-flex tw-justify-center tw-mt-2">
                  <button
                    onClick={() => setActiveIndex(0)}
                    className={`tw-w-3 tw-h-3 tw-rounded-full tw-bg-primary tw-mr-1 ${
                      activeIndex === 0 ? "tw-bg-primary" : "tw-bg-gray-300"
                    }`}
                  ></button>
                  <button
                    onClick={() => setActiveIndex(1)}
                    className={`tw-w-3 tw-h-3 tw-rounded-full tw-bg-primary ${
                      activeIndex === 1 ? "tw-bg-primary" : "tw-bg-gray-300"
                    }`}
                  ></button>
                </div>
              </div>
              <div className="flex tw-flex-col tw-gap-1">
                <CardTitle
                  tag="h4"
                  className="package-title sy-tx-modal f-600 font2024 tw-text-2xl tw-mb-2 tw-text-center md:tw-text-left"
                >
                  {packageData?.title.split(" ")[0]}
                  <span className="sy-tx-primary"> {packageData?.title.split(" ")[1]}</span>
                </CardTitle>
                <div className="sy-tx-black fs14 mb-2">{packageExtras?.subtitle}</div>
                <span className="sy-tx-black fs14 tw-text-center md:tw-text-left tw-mb-2">
                  Your {packageExtras?.title} package includes:
                </span>
                <div className="tw-grow">
                  <IncludedItems
                    items={packageExtras?.included}
                    itemsPerRow={3}
                    textStyle="md:text-lg tw-text-md"
                  />
                </div>
              </div>
            </div>
          </CardBody>
          <Modal isOpen={modal} toggle={toggle} centered={true} className="tw-p-2">
            <ModalHeader toggle={toggle}>Your package includes:</ModalHeader>
            <ModalBody>
              <IncludedItems
                items={packageExtras?.included}
                itemsPerRow={3}
                textStyle="tw-text-lg"
              />
            </ModalBody>
          </Modal>
        </Card>
      ) : (
        <Card className="package-card bg-white">
          <CardBody className="pb-0">
            <CardTitle tag="h4" className="sy-tx-modal f-600 font2024">
              Your Package
            </CardTitle>
            <p className="text-center sy-tx-modal font1624 f-500 mb-0 mt-3">
              The Package you select for your next event will be displayed here
            </p>
          </CardBody>
        </Card>
      )}
    </>
  );
};

export default PackageCard;
