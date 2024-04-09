import { useState, useEffect, Fragment } from "react";
import { sendNotificationApiCall } from "@redux/action/NotificationAction";
import {
  Button,
  Offcanvas,
  OffcanvasHeader,
  OffcanvasBody,
  Label,
  Input,
} from "reactstrap";
import Select from "react-select";

import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { allPartnerListingApiCall } from "@redux/action/PartnerAction";
import { useDispatch } from "react-redux";
import {
  DESCRIPTION_REQUIRED,
  MAX_DESCRIPTION,
  MAX_TITLE,
  SELECT_MARKET,
  SELECT_PARTNER,
  TITLE_REQUIRE,
} from "@constants/ValidationConstants";
import OffCanvas2Shimmer from "@components/Shimmer/OffCanvas2Shimmer";
import MultiSelectAll from "./MultiSelectAll";
import { preferenceApiCall } from "@redux/action/EventAction";

const OffCanvas2 = ({ updateData }) => {
  const [canvasPlacement, setCanvasPlacement] = useState("start");
  const [canvasOpen, setCanvasOpen] = useState(false);
  const toggleCanvasStart = () => {
    setCanvasPlacement("start");
    setCanvasOpen(!canvasOpen);
  };
  const toggleCanvasEnd = () => {
    setCanvasPlacement("end");
    setCanvasOpen(!canvasOpen);
  };

  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const [marketOptions, setMarketOptions] = useState(null);
  const [market, setMarket] = useState(null);
  const [isUpdate, setIsUpdate] = useState(false);
  const [partnerOption, setPartnerOption] = useState([]);

  /**
   * It takes a market object as an argument, and then makes an API call to get all the partners in that
   * market. It then takes the response and creates an array of objects that can be used in a dropdown
   * menu
   * @param market - The market that the user selects.
   */
  const getPartner = async (market) => {
    if (market !== null) {
      const res = await dispatch(
        allPartnerListingApiCall({
          type: "partner",
          sort_field: "company",
          sort_order: "asc",
          market_id: market?.value,
        }),
      );
      const partnerArr = [];
      res?.data?.data?.users?.map((e) => {
        partnerArr.push({ label: e.company, value: e.id });
      });
      setPartnerOption(partnerArr);
    }
  };
  /**
   * It makes an API call to the backend to get a list of markets, then it sets the state of the
   * marketOptions array to the response from the API call
   */
  const getMarket = async () => {
    setIsLoading(true);
    const marketArray = [];
    const data = { sort_field: "name", sort_order: "asc", type: "market" };
    const response = await dispatch(preferenceApiCall(data));
    response?.data?.data?.preferences?.map((m) =>
      marketArray?.push({ label: m?.name, value: m?.id }),
    );
    setMarketOptions(marketArray);
    setIsLoading(false);
  };
  useEffect(() => {
    getPartner(market);
  }, [isUpdate]);
  useEffect(() => {
    getMarket();
  }, []);

  /**
   * It takes in the values from the form, creates a formData object, appends the values to the formData
   * object, and then sends the formData object to the backend
   * @param values - The values of the form
   */
  const sendNotificationbtn = async (values) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("description", values.description);
    values?.partner?.map((e) => {
      formData.append("users[]", e.value);
    });
    const res = await dispatch(sendNotificationApiCall(formData));
    if ((res.status = 200)) {
      updateData();
      toggleCanvasEnd();
    }
    setIsLoading(false);
  };

  // initialValues
  const initialFormValues = {
    title: "",
    description: "",
    partner: [],
    market: "",
  };
  const validationSchema = Yup.object({
    title: Yup.string().max(50, MAX_TITLE).required(TITLE_REQUIRE),
    description: Yup.string()
      .max(100, MAX_DESCRIPTION)
      .required(DESCRIPTION_REQUIRED),
    partner: Yup.array().min(1, SELECT_PARTNER).required(SELECT_PARTNER),
    market: Yup.string().required(SELECT_MARKET),
  });

  return (
    <Fragment>
      <Button
        color="primary"
        className="custom-btn3 m-0"
        onClick={toggleCanvasEnd}
      >
        Send New Notification
      </Button>

      <Offcanvas
        direction={canvasPlacement}
        isOpen={canvasOpen}
        toggle={toggleCanvasStart}
        className="offcanvas-cu-width"
      >
        <OffcanvasHeader toggle={toggleCanvasStart}>
          Send New Notification
        </OffcanvasHeader>
        {!isLoading ? (
          <>
            <Formik
              initialValues={initialFormValues}
              validationSchema={validationSchema}
              validateOnBlur={true}
              validateOnChange={true}
              onSubmit={sendNotificationbtn}
              enableReinitialize
            >
              {({ errors, setFieldValue, touched, values }) => (
                <Form className="h-100">
                  <OffcanvasBody className="h-100 bg-white">
                    <div className="mt-1">
                      <Label for="status-select">Title</Label>
                      <Field
                        type="text"
                        isClearable={true}
                        className="form-control me-sm-1"
                        name="title"
                        onChange={(e) => {
                          setFieldValue("title", e.target.value);
                        }}
                      />
                      {errors.title && touched.title ? (
                        <span className="text-danger error-msg">
                          {errors?.title}
                        </span>
                      ) : null}
                    </div>
                    <div className="mt-1">
                      <Label for="status-select">Description</Label>
                      <Input
                        name="description"
                        type="textarea"
                        rows="5"
                        className="input-group form-control support-description"
                        placeholder="Enter text here "
                        onChange={(e) => {
                          setFieldValue("description", e.target.value);
                        }}
                      />
                      {errors.description ? (
                        <span className="text-danger error-msg">
                          {errors?.description}
                        </span>
                      ) : null}
                    </div>
                    <div className="mt-1">
                      <Label className="form-label">Select Market</Label>
                      <Select
                        className="react-select "
                        classNamePrefix="select"
                        options={marketOptions}
                        onChange={(e) => {
                          /*eslint-disable-next-line */
                          setFieldValue("market", e?.value),
                            setMarket(e),
                            setIsUpdate(!isUpdate),
                            setFieldValue("partner", []);
                        }}
                        placeholder="Select market"
                      />
                      {errors.market && touched.market ? (
                        <span className="text-danger error-msg">
                          {errors?.market}
                        </span>
                      ) : null}
                    </div>
                    {market && values?.market && (
                      <div className="mt-1">
                        <Label className="form-label">Select Partner</Label>
                        <MultiSelectAll
                          isUpdate={isUpdate}
                          options={partnerOption}
                          setValue={(e) => {
                            setFieldValue("partner", e);
                          }}
                          name="partner"
                        />
                        {errors.partner && touched.partner ? (
                          <span className="text-danger error-msg">
                            {errors?.partner}
                          </span>
                        ) : null}
                      </div>
                    )}

                    <div className="mt-2">
                      <Button className="mb-75 me-75 custom-btn3" type="submit">
                        Send Notification
                      </Button>

                      <Button
                        className="mb-75 custom-btn10"
                        onClick={toggleCanvasEnd}
                      >
                        Cancel
                      </Button>
                    </div>
                  </OffcanvasBody>
                </Form>
              )}
            </Formik>
          </>
        ) : (
          <OffCanvas2Shimmer />
        )}
      </Offcanvas>
    </Fragment>
  );
};

export default OffCanvas2;
