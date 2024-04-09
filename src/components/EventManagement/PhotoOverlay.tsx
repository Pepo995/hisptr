import { Card, CardBody, CardHeader, CardText, CardTitle, Col, Label, Row } from "reactstrap";
import NoFilter from "@images/no-filter.svg";
import glam from "@images/glam-filter.png";
import bw from "@images/black-white.svg";
import Template1 from "@images/template-1.svg";
import Template2 from "@images/template-2.svg";
import Template3 from "@images/template-3.svg";
import Template4 from "@images/template-4.svg";
import Template5 from "@images/template-5.svg";
import Template6 from "@images/template-6.svg";
import BlackImg from "@images/black BD.svg";
import WhiteImg from "@images/white BD.svg";
import GoldImg from "@images/gold BD.svg";
import GreenImg from "@images/greenscreen BD.svg";
import CustomImg from "@images/custom BD.svg";
import SilverImg from "@images/silver BD.svg";
import NoneImg from "@images/none BD.svg";
import PlaceHolder from "@images/placeholder-image.png";
import ShimmerPhotoOverlay from "@components/Shimmer/ShimmerPhotoOverlay";
import { type EventFromPhp, type Preference } from "@types";
import Image, { type StaticImageData } from "next/image";

type PhotoOverlayProps = {
  event: EventFromPhp;
  filters?: Preference[];
  orientation?: Preference[];
  design?: Preference[];
  backdrop?: Preference[];
  isLoading: boolean;
};

const PhotoOverlay = ({ event, filters, isLoading }: PhotoOverlayProps) => {
  const filterArray = [
    { name: "no_filter", img: NoFilter as StaticImageData },
    { name: "glam_filter", img: glam },
    { name: "black_&_white", img: bw as StaticImageData },
  ];
  const designArray = [
    { name: "design_1", img: Template1 as StaticImageData },
    { name: "design_2", img: Template2 as StaticImageData },
    { name: "design_3", img: Template3 as StaticImageData },
    { name: "design_4", img: Template4 as StaticImageData },
    { name: "design_5", img: Template5 as StaticImageData },
    { name: "design_6", img: Template6 as StaticImageData },
  ];
  const backdropArray = [
    { name: "black", img: BlackImg as StaticImageData },
    { name: "white", img: WhiteImg as StaticImageData },
    { name: "gold", img: GoldImg as StaticImageData },
    { name: "silver", img: SilverImg as StaticImageData },
    { name: "green_screen", img: GreenImg as StaticImageData },
    { name: "custom", img: CustomImg as StaticImageData },
    { name: "none", img: NoneImg as StaticImageData },
  ];
  const filterData = (name: string) => filterArray.find((e) => e.name === name);
  const filterDesign = (name: string) => designArray.find((e) => e.name === name);
  const filterBackDrop = (name: string) => backdropArray.find((e) => e.name === name);

  return (
    <>
      {!isLoading ? (
        <Row className="match-height">
          <Col lg={6}>
            <Card className="bg-white">
              <CardHeader className="p-0 mx-2 mt-2 mb-75">
                <CardTitle className="sy-tx-primary">Your Photo Filter</CardTitle>
              </CardHeader>
              <CardBody>
                <CardText>
                  Please choose the filter that you would like on your photos. Select No Filter if
                  you would not like a filter applied. The filter you choose will be on all photos
                  taken with the booth.
                </CardText>

                <div className="selected-img d-inline-block">
                  {event.photos?.logo ? (
                    <Image
                      className="img-fluid img-border tw-inset-auto tw-w-auto tw-h-auto tw-static"
                      src={filterData(event.photos.logo)?.img.src ?? ""}
                      alt="Event Photo 1"
                      fill
                    />
                  ) : (
                    "--"
                  )}
                  <p className="text-center mt-50 sy-tx-modal f-500 f-14">
                    {filters?.filter((filter) => filter.id === event.photos?.filter_type)?.[0]
                      ?.name ?? "--"}
                  </p>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col lg={6}>
            <Card className="bg-white">
              <CardHeader className="p-0 mx-2 mt-2 mb-75">
                <CardTitle className="sy-tx-primary">Your Custom Photo Layout Design</CardTitle>
              </CardHeader>
              <CardBody>
                <CardText>
                  Please select a template below for how you would like your photos to be oriented.
                  There are multiple options from the classic strip style and card style to the
                  number of photos on each printout.
                </CardText>
                {event.photos ? (
                  <>
                    <div className="custom-photo-layout">
                      {event.photos.orientation_type === "classic" && (
                        <div
                          className={
                            "dimension-border inner-photo-layout1 mx-auto mt-3 d-flex justify-content-center align-items-center sy-tx-black f-500"
                          }
                        >
                          2 : 6
                        </div>
                      )}
                      {event.photos.orientation?.code === "card_horizontal" && (
                        <div
                          className={
                            "dimension-border inner-photo-layout2 mx-auto mt-3 d-flex justify-content-center align-items-center sy-tx-black f-500"
                          }
                        >
                          6 : 4
                        </div>
                      )}
                      {event.photos.orientation?.code === "card_vertical" && (
                        <div
                          className={
                            "dimension-border inner-photo-layout3 mx-auto mt-2 d-flex justify-content-center align-items-center sy-tx-black f-500"
                          }
                        >
                          4 : 6
                        </div>
                      )}
                      <p className="text-center mt-2 sy-tx-modal f-500 f-14">
                        {event.photos.orientation?.name}
                      </p>
                    </div>
                  </>
                ) : (
                  "--"
                )}
              </CardBody>
            </Card>
          </Col>
          <Col lg={6}>
            <Card className="bg-white">
              <CardHeader className="p-0 mx-2 mt-2 mb-75">
                <CardTitle className="sy-tx-primary">Design Template</CardTitle>
              </CardHeader>
              <CardBody>
                <CardText>
                  Below are templates that you can select from for your overlay or print design.
                </CardText>
                {event.photos ? (
                  <div className="selected-img d-inline-block">
                    <Image
                      className="img-fluid img-border tw-inset-auto tw-w-auto tw-h-auto tw-static"
                      src={
                        filterDesign(event.photos.design_type.toString())?.img.src ??
                        PlaceHolder.src
                      }
                      alt="Event Photo"
                      fill
                    />
                  </div>
                ) : (
                  "--"
                )}
              </CardBody>
            </Card>
          </Col>
          <Col lg={6}>
            <Card className="bg-white">
              <CardHeader className="p-0 mx-2 mt-2 mb-75">
                <CardTitle className="sy-tx-primary">Overlay Design</CardTitle>
              </CardHeader>
              <CardBody>
                <div className="d-flex justify-content-between flex-wrap">
                  <div>
                    <div className="d-flex">
                      <Label className="me-25 cu-label">Text - First Line :</Label>
                      <p className="sy-tx-modal f-500 f-14">{event.photos?.first_line ?? "--"}</p>
                    </div>
                    <div className="d-flex">
                      <Label className="me-25 cu-label">Text - Second Line :</Label>
                      <p className="sy-tx-modal f-500 f-14">{event.photos?.second_line ?? "--"}</p>
                    </div>
                  </div>
                  <div>
                    <div className="d-flex">
                      <Label className="me-25 cu-label">Primary Color:</Label>
                      <p className="sy-tx-modal f-500 f-14 d-flex">
                        <span
                          className="color-box me-25"
                          style={{
                            background: event.photos?.primary_color,
                          }}
                        ></span>
                        {event.photos?.primary_color ?? "--"}
                      </p>
                    </div>
                    <div className="d-flex">
                      <Label className="me-25 cu-label">Secondary Color:</Label>
                      <p className="sy-tx-modal f-500 f-14 d-flex">
                        <span
                          className=" color-box me-25"
                          style={{
                            background: event.photos?.secondary_color,
                          }}
                        ></span>
                        {event.photos?.secondary_color ?? "--"}
                      </p>
                    </div>
                  </div>
                </div>
                <hr />
                <div className="other-detail">
                  <h4 className="sy-tx-modal f-500 mb-sm-2">Uploaded Image</h4>
                  {event.photos?.logo ? (
                    <div className="selected-img d-inline-block w-50">
                      <Image
                        className="img-fluid tw-inset-auto tw-w-auto tw-h-auto tw-static"
                        src={event.photos.logo ?? PlaceHolder.src}
                        alt="Event Photo"
                        fill
                      />
                    </div>
                  ) : (
                    "--"
                  )}
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col lg={12}>
            <Card className="bg-white">
              <CardHeader className="p-0 mx-2 mt-2 mb-75">
                <CardTitle className="sy-tx-primary">Backdrop Selection</CardTitle>
              </CardHeader>
              <CardBody>
                <CardText>
                  Below are templates that you selected from for your overlay or print design.
                </CardText>
                {event.photos ? (
                  <div className="selected-img d-inline-block">
                    <Image
                      className="img-fluid img-border tw-inset-auto tw-w-auto tw-h-auto tw-static"
                      src={
                        filterBackDrop(event.photos?.backdrop_type.toString())?.img.src ??
                        PlaceHolder.src
                      }
                      alt="Event Photo"
                      fill
                    />
                  </div>
                ) : (
                  "--"
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      ) : (
        <ShimmerPhotoOverlay />
      )}
    </>
  );
};

export default PhotoOverlay;
