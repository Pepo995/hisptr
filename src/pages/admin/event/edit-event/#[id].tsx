// import { useEffect, useMemo, useState } from "react";

// import {
//   Button,
//   Card,
//   CardBody,
//   CardHeader,
//   CardTitle,
//   Col,
//   InputGroup,
//   InputGroupText,
//   Label,
//   Row,
// } from "reactstrap";
// import {
//   COMPANY_REQUIRE,
//   EMAIL_REQUIRED,
//   EMAIL_VALID,
//   EVENT_DATE_REQUIRED,
//   FIRST_NAME_REQUIRED,
//   LAST_NAME_REQUIRE,
//   MARKET_REQUIRED,
//   PACKAGE_REQUIRED,
//   PARTNER_REQUIRED,
//   PHONE_NO_REGEX,
//   PHONE_NO_VALID,
//   PHONE_REQUIRED,
// } from "@constants/ValidationConstants";
// import { Field, Form, Formik } from "formik";
// import Select from "react-select";
// import Flatpickr from "react-flatpickr";
// import { ArrowLeft, Calendar } from "react-feather";
// import Breadcrumbs from "@components/breadcrumbs";
// import {
//   eventDetailApiCall,
//   eventMarketApiCall,
//   eventUpdateApiCall,
//   packageTypeApiCall,
// } from "@redux/action/EventAction";
// import { stateApiCall } from "@redux/action/CountryAction";

// import * as Yup from "yup";
// import { useDispatch } from "react-redux";
// import Link from "next/link";
// import { useRouter } from "next/router";
// import { allPartnerListingApiCall } from "@redux/action/PartnerAction";

// import ShimmerAddEvent from "@components/Shimmer/ShimmerAddEvent";
// import { Helmet } from "react-helmet";
// import { convertDate, formatPrice } from "@utils/Utils";
// import { eventStatusOption } from "@utils/platformUtils";
// import { AvailabilityListAPICall } from "@redux/action/AvailabilityAction";
// import classNames from "classnames";
// import { type ReactElement } from "react";
// import Layout from "@components/layouts/Layout";
// import type { NextPageWithLayout } from "@pages/_app";
// import { events_admin_status } from "@prisma/client";
// import { api } from "@utils/api";
// import ConfirmationModal from "@components/Modal/ConfirmationModal";
// import { toast } from "react-toastify";

// import { event_payment_plan } from "@prisma/client";
// import EventPayments from "@components/EventManagement/EventPayments";

// const EditEvent: NextPageWithLayout = () => {
//   const dispatch = useDispatch();
//   const router = useRouter();

//   const updateEventAdminStatusMutation = api.eventRouter.updateEventAdminStatus.useMutation();

//   const [isLoading, setIsLoading] = useState(false);
//   const [picker, setPicker] = useState();
//   const [value, setValue] = useState(false);
//   const [value1, setValue1] = useState(false);
//   const [stateData, setStateData] = useState([]);
//   const [eventMarkets, seteventMarkets] = useState([]);
//   const [PacakageType, setPacakageType] = useState([]);
//   const [event, setEvent] = useState();
//   const [PartnerData, setPartnerData] = useState([]);
//   const [availabilityOption, setAvailabilityOption] = useState([]);
//   const [market, setMarket] = useState(null);
//   const [availabilityId, setAvailabilityId] = useState(null);

//   const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
//   const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
//   const { data: payments, isLoading: isLoadingPayments } =
//     api.paymentRouter.getEventPayments.useQuery(parseInt(router.query.id! as string), {
//       enabled: router.query.id !== undefined,
//     });

//   const getPartnerList = async () => {
//     if (!availabilityId) return;

//     const res_partner = await dispatch(
//       allPartnerListingApiCall({
//         type: "partner",
//         sort_field: "company",
//         sort_order: "asc",
//         availability_id: availabilityId,
//         request_partner_id: event.partner_id,
//       }),
//     );
//     const partnerArr = [];
//     const filterCompany = res_partner?.data?.data?.users?.filter((e) => e.company);

//     filterCompany?.map((e) => {
//       partnerArr.push({ label: e?.company, value: e?.id });
//     });

//     setPartnerData([...partnerArr]);
//   };
//   useEffect(() => {
//     getPartnerList();
//   }, [availabilityId]);
//   /**
//    * A function that is called when the component is mounted. It fetches data from the API and sets the
//    * state of the component.
//    */
//   const getData = async (id: number) => {
//     setIsLoading(true);
//     // eslint-disable-next-line @typescript-eslint/await-thenable
//     const res = await dispatch(eventDetailApiCall(id) as unknown as AnyAction);

//     setEvent(res?.data?.data?.event);
//     setAvailabilityId(res?.data?.data?.event?.availability_id);
//     /*eslint-disable-next-line */
//     res?.data?.data?.event?.is_event_planner === "yes" && setValue(true);
//     /*eslint-disable-next-line */
//     res?.data?.data?.event?.is_holder_on_reservation === "yes" && setValue1(true);

//     // market
//     const eventArray = [];
//     const res_market_event = await dispatch(
//       eventMarketApiCall({
//         type: "market",
//         sort_field: "name",
//         sort_order: "asc",
//       }),
//     );
//     res_market_event.data.data.preferences.map((e) =>
//       eventArray.push({ label: e.name, value: e.id }),
//     );
//     seteventMarkets(eventArray);
//     // packageType
//     // eslint-disable-next-line @typescript-eslint/await-thenable
//     const res_pacakge_type = await dispatch(packageTypeApiCall() as unknown as AnyAction);
//     const packageArray = [];
//     res_pacakge_type.data.data.packages.map((e) => {
//       packageArray.push({ label: e.title, value: e.id });
//     });
//     setPacakageType(packageArray);
//     // PartnerData
//     // getPartnerList()
//     const res_state = await dispatch(
//       stateApiCall({
//         sort_field: "id",
//         sort_order: "asc",
//       }),
//     );
//     const tempArray: RequestOption[] = [];
//     res_state.data.data.states.map((c) => tempArray.push({ label: c.name, value: c.id }));
//     setStateData(tempArray);
//     setMarket(res?.data?.data?.event?.market?.id);
//     // setPicker({ res?.data?.data?.event?.event_date })
//     const data = {
//       market_id: res?.data?.data?.event?.market?.id,
//       event_date: convertDate(res?.data?.data?.event?.event_date, 3),
//     };
//     const tempAvailabilityArray = [];
//     // eslint-disable-next-line @typescript-eslint/await-thenable
//     const availabilityResponse = await dispatch(
//       AvailabilityListAPICall(data) as unknown as AnyAction,
//     );
//     if (availabilityResponse?.status === 200) {
//       availabilityResponse?.data?.data?.requests?.map(
//         (r) =>
//           /*eslint-disable-next-line */
//           tempAvailabilityArray?.push({
//             label: `#${r?.availability_number} ${r?.location?.name} ${convertDate(
//               r?.event_date,
//               3,
//             )}`,
//             value: r?.id,
//           }),
//       );
//     }
//     setAvailabilityOption(tempAvailabilityArray);
//     setIsLoading(false);
//   };

//   /* The above code is using the useEffect hook to call the getData function when the component mounts. */
//   useEffect(() => {
//     if (router.query.id !== undefined) getData(router.query.id);
//   }, [router.query.id]);

//   // initialValues
//   const initialFormValues = {
//     firstName: event?.first_name,
//     lastName: event?.last_name,
//     email: event?.email,
//     phoneNumber: event?.phone_number,
//     city: event?.city,
//     state: event?.state?.id,
//     date: event?.event_date,
//     PackageType: event?.package?.id,
//     eventMarket: event?.market?.id,
//     plannerFirstname: event?.planner_first_name ? event?.planner_first_name : "",
//     plannerLastname: event?.planner_last_name ? event?.planner_last_name : "",
//     plannerEmailid: event?.planner_email ? event?.planner_email : "",
//     plannerphone: event?.planner_phone_number ? event?.planner_phone_number : "",
//     plannerCname: event?.planner_company_name ? event?.planner_company_name : "",
//     APartner: event?.partner_id,
//     availability_id: event?.availability_id || "",
//     date: event?.event_date,
//     host: event?.host ? `${event?.host?.first_name} ${event?.host?.last_name}` : "",
//     admin_status: event?.admin_status,
//   };

//   /* A validation schema for the form. */
//   const validationSchema =
//     /*eslint-disable */
//     value === true
//       ? Yup.object({
//           firstName: Yup.string().max(25).required(FIRST_NAME_REQUIRED),
//           lastName: Yup.string().max(25).required(LAST_NAME_REQUIRE),
//           email: Yup.string().email(EMAIL_VALID).required(EMAIL_REQUIRED),
//           phoneNumber: Yup.string()
//             .min(8)
//             .matches(PHONE_NO_REGEX, PHONE_NO_VALID)
//             .required(PHONE_REQUIRED),
//           plannerFirstname: Yup.string().max(25).required(FIRST_NAME_REQUIRED),
//           plannerLastname: Yup.string().max(25).required(LAST_NAME_REQUIRE),
//           plannerEmailid: Yup.string().email(EMAIL_VALID).required(EMAIL_REQUIRED),
//           plannerphone: Yup.string()
//             .min(8)
//             .matches(PHONE_NO_REGEX, PHONE_NO_VALID)
//             .required(PHONE_REQUIRED),
//           eventMarket: Yup.string().required(MARKET_REQUIRED),
//           PackageType: Yup.string().required(PACKAGE_REQUIRED),
//           plannerCname: Yup.string().required(COMPANY_REQUIRE),
//           APartner: event?.photos !== null && Yup.string().required(PARTNER_REQUIRED),
//           date: Yup.string().required(EVENT_DATE_REQUIRED),
//         })
//       : Yup.object({
//           firstName: Yup.string().max(25).required(FIRST_NAME_REQUIRED),
//           lastName: Yup.string().max(25).required(LAST_NAME_REQUIRE),
//           email: Yup.string().email(EMAIL_VALID).required(EMAIL_REQUIRED),
//           phoneNumber: Yup.string()
//             .min(8)
//             .matches(PHONE_NO_REGEX, PHONE_NO_VALID)
//             .required(PHONE_REQUIRED),
//           eventMarket: Yup.string().required(MARKET_REQUIRED),
//           PackageType: Yup.string().required(PACKAGE_REQUIRED),
//           APartner: event?.photos !== null && Yup.string().required(PARTNER_REQUIRED),
//           date: Yup.string().required(EVENT_DATE_REQUIRED),
//         });
//   /*eslint-enable */
//   /**
//    * It updates the event details.
//    * @param values - The values of the form.
//    */
//   const EditDetails = async (values) => {
//     setIsLoading(true);
//     const formData = new FormData();
//     formData.append("id", router.query.id);
//     formData.append("partner_id", values.APartner ?? "");
//     formData.append("first_name", values.firstName);
//     formData.append("last_name", values.lastName);
//     formData.append("email", values.email);
//     formData.append("phone_number", values.phoneNumber);
//     formData.append("event_date", convertDate(values.date, 3));
//     formData.append("city", values.city);
//     formData.append("state_id", values.state);
//     formData.append("market", values.eventMarket);
//     formData.append("package_id", values.PackageType);

//     if (value === true) {
//       formData.append("planner_first_name", values.plannerFirstname);
//       formData.append("planner_last_name", values.plannerLastname);
//       formData.append("planner_phone_number", values.plannerphone);
//       formData.append("planner_email", values.plannerEmailid);
//       formData.append("planner_company_name", values.plannerCname);
//     }

//     formData.append("is_event_planner", value === true ? "yes" : "no");
//     formData.append("is_holder_on_reservation", value1 === true ? "yes" : "no");

//     formData.append("availability_id", values.availability_id);
//     formData.append(
//       "admin_status",
//       eventStatusOption.find((status) => status.label === values.admin_status)?.value,
//     );
//     // eslint-disable-next-line @typescript-eslint/await-thenable
//     await dispatch(eventUpdateApiCall(formData, router) as unknown as AnyAction);
//     setIsLoading(false);
//   };
//   /**
//    * This function is used to get the availability list for a specific market and date
//    * @param market - the market id
//    * @param picker - [startDate, endDate]
//    */
//   const getMarket = async (market, picker) => {
//     const data = {
//       market_id: market,
//       event_date: convertDate(picker?.[0], 3),
//     };
//     const tempArray: RequestOption[] = [];
//     // eslint-disable-next-line @typescript-eslint/await-thenable
//     const response = await dispatch(AvailabilityListAPICall(data) as unknown as AnyAction);
//     if (response?.status === 200) {
//       response?.data?.data?.requests?.map(
//         (r) =>
//           tempArray?.push({
//             label: `#${r?.availability_number} ${r?.location?.name} ${convertDate(
//               r?.event_date,
//               2,
//             )}`,
//             value: r?.id,
//           }),
//       );
//     }
//     setAvailabilityOption(tempArray);
//   };

//   /* The above code is using the useEffect hook to call the getMarket function when the market and picker
//   state variables are not null. */
//   useEffect(() => {
//     if (market !== null && picker && picker?.length !== 0) {
//       getMarket(market, picker);
//     }
//   }, [market, picker]);

//   const renderConfirmationModals = useMemo(
//     () => (
//       <>
//         <ConfirmationModal
//           isOpen={isConfirmModalOpen}
//           setIsOpen={setIsConfirmModalOpen}
//           onConfirm={async () => {
//             setIsLoading(true);

//             const res = await updateEventAdminStatusMutation.mutateAsync({
//               eventId: event?.id,
//               adminStatus: events_admin_status.confirmed,
//             });

//             if (res.success) {
//               toast.success("Event confirmed successfully!");
//               return router.reload();
//             }

//             setIsLoading(false);
//             toast.error("Something went wrong!");
//           }}
//           title="Confirm Event"
//           description="You're about to confirm the event, proceed?"
//           confirmText="Yes"
//           cancelText="No"
//         />
//         <ConfirmationModal
//           isOpen={isCancelModalOpen}
//           setIsOpen={setIsCancelModalOpen}
//           onConfirm={async () => {
//             setIsLoading(true);

//             const res = await updateEventAdminStatusMutation.mutateAsync({
//               eventId: event?.id,
//               adminStatus: events_admin_status.cancelled,
//             });

//             if (res.success) {
//               toast.success("Event cancelled successfully!");
//               return router.reload();
//             }

//             setIsLoading(false);
//             toast.error("Something went wrong!");
//           }}
//           title="Cancel Event"
//           description="You're about to cancel the event, proceed?"
//           confirmText="Yes"
//           cancelText="No"
//         />
//       </>
//     ),
//     [event?.id, isCancelModalOpen, isConfirmModalOpen, router, updateEventAdminStatusMutation],
//   );

//   if (isLoadingPayments) return <ShimmerAddEvent />;

//   return (
//     <>
//       <Helmet>
//         <title>Hipstr - Edit Event</title>
//       </Helmet>
//       <div>
//         <Breadcrumbs
//           title="Event Management"
//           data={[{ title: "Events List", link: "/admin/event" }, { title: "Edit Event" }]}
//         />

//         {!isLoading ? (
//           <Card className="bg-white">
//             <CardHeader>
//               <CardTitle tag="h4" className="sy-tx-primary f-600">
//                 <Link href="/admin/event">
//                   {" "}
//                   <ArrowLeft className="sy-tx-primary me-50" />
//                 </Link>
//                 Event Details
//               </CardTitle>
//             </CardHeader>
//             <CardBody>
//               <Row>
//                 <Col>
//                   <Label>Event Number</Label>
//                   <p className="sy-tx-modal f-500">{event?.event_number}</p>

//                   <Label>Event Total Price</Label>
//                   <p className="sy-tx-modal f-500">
//                     ${formatPrice(event?.total_price_in_cents / 100)}
//                   </p>
//                 </Col>
//                 <Col>
//                   <Label>Event Total Paid</Label>
//                   <p className="sy-tx-modal f-500">
//                     ${formatPrice(event?.amount_paid_in_cents / 100)}
//                   </p>

//                   <Label>Payment Plan</Label>
//                   <p className="sy-tx-modal f-500">
//                     {event_payment_plan.full === event?.payment_plan
//                       ? "Paid in full"
//                       : "Paid partial"}
//                   </p>
//                 </Col>
//               </Row>
//               <Formik
//                 initialValues={initialFormValues}
//                 validationSchema={validationSchema}
//                 validateOnBlur={true}
//                 validateOnChange={true}
//                 onSubmit={EditDetails}
//                 enableReinitialize
//               >
//                 {({ errors, setFieldValue, touched, values }) => (
//                   <Form>
//                     <Row>
//                       <Col md="3" sm="12" className="mb-1">
//                         <Label className="form-label cu-label" for="nameMulti">
//                           First Name on the Account
//                           <span className="sy-tx-primary">*</span>
//                         </Label>
//                         <Field
//                           type="text"
//                           name="firstName"
//                           id="nameMulti"
//                           placeholder="Enter first name"
//                           className="form-control custom-input"
//                         />
//                         {errors.firstName && touched.firstName ? (
//                           <span className="text-danger error-msg">{errors?.firstName}</span>
//                         ) : null}
//                       </Col>
//                       <Col md="3" sm="12" className="mb-1">
//                         <Label className="form-label cu-label" for="lastNameMulti">
//                           Last Name on the Account
//                           <span className="sy-tx-primary">*</span>
//                         </Label>
//                         <Field
//                           type="text"
//                           name="lastName"
//                           id="lastNameMulti"
//                           placeholder="Enter last name"
//                           className="form-control custom-input"
//                         />
//                         {errors.lastName && touched.lastName ? (
//                           <span className="text-danger error-msg">{errors?.lastName}</span>
//                         ) : null}
//                       </Col>
//                       <Col md="6" sm="12" className="mb-1">
//                         <Label className="form-label cu-label" for="default-picker">
//                           Date of the Event
//                           <span className="sy-tx-primary">*</span>
//                         </Label>
//                         <InputGroup className="cu-input-group">
//                           <Flatpickr
//                             name="date"
//                             value={values?.date}
//                             className={classNames("form-control  mb-0 mt-0 border-right")}
//                             options={{
//                               minDate: "today",
//                               dateFormat: "m/d/Y",
//                               disableMobile: "true",
//                             }}
//                             placeholder={values?.date}
//                             onChange={(date) => {
//                               /*eslint-disable-next-line */
//                               setPicker(date),
//                                 setFieldValue("date", convertDate(date[0], 2)),
//                                 setFieldValue("availability_id", "");
//                             }}
//                             id="default-picker"
//                           />
//                           <InputGroupText className="border-bottom-n">
//                             <Calendar size={14} />
//                           </InputGroupText>
//                         </InputGroup>
//                       </Col>
//                       <Col md="6" sm="12" className="mb-1">
//                         <Label className="form-label cu-label" for="email">
//                           Email ID<span className="sy-tx-primary">*</span>
//                         </Label>
//                         <Field
//                           type="email"
//                           name="email"
//                           id="email"
//                           placeholder="enter email address"
//                           className="form-control"
//                           disabled
//                         />
//                         {errors.email && touched.email ? (
//                           <span className="text-danger error-msg">{errors?.email}</span>
//                         ) : null}
//                       </Col>
//                       <Col md="6" sm="12" className="mb-1">
//                         <Label className="form-label cu-label" for="phone">
//                           Best Phone Number to Reach You
//                           <span className="sy-tx-primary">*</span>
//                         </Label>
//                         <Field
//                           type="phone"
//                           name="phoneNumber"
//                           id="phone"
//                           placeholder="Enter phone number"
//                           className="form-control"
//                           disabled
//                         />
//                         {errors.phoneNumber && touched.phoneNumber ? (
//                           <span className="text-danger error-msg">{errors?.phoneNumber}</span>
//                         ) : null}
//                       </Col>
//                       <Col md="6" sm="12" className="mb-1">
//                         <Label className="form-label cu-label" for="city">
//                           Event City
//                         </Label>
//                         <Field
//                           type="text"
//                           name="city"
//                           id="city"
//                           placeholder="Enter city"
//                           className="form-control"
//                         />
//                       </Col>
//                       <Col md="6" sm="12" className="mb-1">
//                         <Label className="form-label cu-label" for="city">
//                           Event State
//                         </Label>
//                         <Select
//                           className="react-select "
//                           classNamePrefix="select"
//                           name="state"
//                           options={stateData}
//                           placeholder="Select"
//                           value={stateData?.find((r) => r.value === values.state)}
//                           onChange={(e) => setFieldValue("state", e.value)}
//                         />
//                       </Col>
//                       <Col md="6" sm="12" className="mb-1">
//                         <Label className="form-label cu-label" for="city">
//                           Event Market
//                         </Label>
//                         <Select
//                           name="eventMarket"
//                           className="react-select "
//                           classNamePrefix="select"
//                           options={eventMarkets}
//                           value={eventMarkets?.find((r) => r.value === values.eventMarket)}
//                           placeholder="Select market"
//                           onChange={(e) => {
//                             /*eslint-disable-next-line */
//                             setFieldValue("eventMarket", e.value),
//                               setMarket(e.value),
//                               setFieldValue("availability_id", "");
//                           }}
//                         />
//                         {errors.eventMarket && touched.eventMarket ? (
//                           <span className="text-danger error-msg">{errors?.eventMarket}</span>
//                         ) : null}
//                       </Col>
//                       <Col md="6" sm="12" className="mb-1">
//                         <Label className="form-label cu-label" for="city">
//                           Package Type
//                         </Label>
//                         <Select
//                           name="PackageType"
//                           className="react-select "
//                           classNamePrefix="select"
//                           options={PacakageType}
//                           placeholder="Select package"
//                           value={PacakageType?.find((r) => r.value === values.PackageType)}
//                           onChange={(e) => setFieldValue("PackageType", e.value)}
//                         />
//                         {errors.PackageType && touched.PackageType ? (
//                           <span className="text-danger error-msg">{errors?.PackageType}</span>
//                         ) : null}
//                       </Col>
//                       <Col md="6" sm="12" className="mb-1">
//                         <Label className="form-label cu-label" for="city">
//                           Availability ID
//                         </Label>
//                         <Select
//                           className="react-select "
//                           classNamePrefix="select"
//                           name="availability_id"
//                           options={availabilityOption}
//                           placeholder={
//                             availabilityOption?.length === 0
//                               ? "No option available"
//                               : "Select availability ID"
//                           }
//                           isDisabled={availabilityOption?.length === 0}
//                           value={
//                             availabilityOption?.length !== 0
//                               ? availabilityOption?.find((r) => r.value === values.availability_id)
//                               : null
//                           }
//                           onChange={(e) => {
//                             setFieldValue("availability_id", e.value);
//                             setAvailabilityId(e.value);
//                           }}
//                         />
//                         {errors?.availability_id && touched?.availability_id ? (
//                           <span className="text-danger error-msg">{errors?.availability_id}</span>
//                         ) : null}
//                       </Col>
//                       <Col md="6" sm="12" className="mb-1">
//                         <Label className="form-label cu-label" for="city">
//                           Assign to Partner
//                         </Label>

//                         <Select
//                           className="react-select "
//                           classNamePrefix="select"
//                           name="APartner"
//                           options={PartnerData}
//                           placeholder="Select partner"
//                           value={
//                             PartnerData && PartnerData.length
//                               ? PartnerData?.find((r) => r.value === values.APartner)
//                               : {}
//                           }
//                           onChange={(e) => setFieldValue("APartner", e.value)}
//                           isDisabled={!PartnerData || PartnerData.length === 0}
//                         />
//                         {errors.APartner && touched.APartner ? (
//                           <span className="text-danger error-msg">{errors?.APartner}</span>
//                         ) : null}
//                       </Col>
//                       <Col md="6" sm="12" className="mb-1">
//                         <Label className="form-label cu-label" for="host">
//                           Assigned Host
//                         </Label>
//                         <Field
//                           type="text"
//                           disabled={true}
//                           name="host"
//                           id="host"
//                           placeholder="Host name"
//                           className="form-control"
//                         />
//                       </Col>

//                       {event?.admin_status ===
//                         eventStatusOption.find(
//                           (status) => status.value === events_admin_status.awaiting,
//                         )?.label && (
//                         <Col md="6" sm="12" className="mb-1">
//                           <span className="form-label cu-label">Confirm or cancel event</span>
//                           <div>
//                             <Button
//                               className="custom-btn3 me-75 mb-75"
//                               type="button"
//                               onClick={() => setIsConfirmModalOpen(true)}
//                             >
//                               Confirm
//                             </Button>
//                             <Button
//                               className="custom-btn3 me-75 mb-75"
//                               type="button"
//                               onClick={() => setIsCancelModalOpen(true)}
//                             >
//                               Cancel
//                             </Button>
//                           </div>

//                           {renderConfirmationModals}
//                         </Col>
//                       )}
//                     </Row>

//                     {payments && (
//                       <Row>
//                         <EventPayments payments={payments} />
//                       </Row>
//                     )}

//                     <div className="mt-sm-3 mt-1">
//                       <Button className="custom-btn3 me-75 mb-75" type="submit">
//                         Save Changes{" "}
//                       </Button>
//                       <Link href="/admin/event">
//                         <Button className="custom-btn8 mb-75">Cancel</Button>
//                       </Link>
//                     </div>
//                   </Form>
//                 )}
//               </Formik>
//             </CardBody>
//           </Card>
//         ) : (
//           <ShimmerAddEvent />
//         )}
//       </div>
//     </>
//   );
// };

// EditEvent.getLayout = function getLayout(page: ReactElement) {
//   return <Layout>{page}</Layout>;
// };
// export default EditEvent;

export default function EditEvent() {
  return <div>Event Edit</div>;
}
