import { type ReactElement, useState } from "react";

import { ChevronDown, Trash } from "react-feather";
import { Card, CardBody, CardHeader, CardTitle } from "reactstrap";
import { ShimmerTable } from "react-shimmer-effects";

import Breadcrumbs from "@components/breadcrumbs";

import { Helmet } from "react-helmet";
import DataTable from "react-data-table-component";
import { type NextPageWithLayout } from "@pages/_app";
import Layout from "@components/layouts/Layout";
import { api } from "@utils/api";
import { type PromotionalCode } from "@prisma/client";
import dayjs from "dayjs";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import FormInput from "@components/inputs/FormInput";
import { Checkbox, FormControlLabel } from "@mui/material";
import CheckBox from "@mui/icons-material/CheckBox";

import FormDateInput from "@components/inputs/FormDate";
import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "tailwind.config";
import ConfirmationModal from "@components/Modal/ConfirmationModal";
import { type Config } from "tailwindcss";

const { theme } = resolveConfig<Config>(tailwindConfig);
const inactiveColor = (theme?.colors?.gray as { ["400"]: string })["400"];
const primaryColor = theme?.colors?.primary as string;

const PromotionalCode: NextPageWithLayout = () => {
  const { isLoading: isLoadingPromotionalCodes, data: promotionalCodes } =
    api.promotionalCodeRouter.list.useQuery();

  const createPromotionalCodeMutation = api.promotionalCodeRouter.create.useMutation();

  const deletePromotionalCodeMutation = api.promotionalCodeRouter.delete.useMutation();

  const [deleteModalInfo, setDeleteModalInfo] = useState({ isOpen: false, code: "" });

  const context = api.useContext();

  if (
    isLoadingPromotionalCodes ||
    deletePromotionalCodeMutation.isLoading ||
    createPromotionalCodeMutation.isLoading
  )
    return <ShimmerTable col={7} row={10} />;

  if (!promotionalCodes) return <div>Error loading promotional codes</div>;

  const promotionalCodeColumns = [
    {
      name: "CODE",
      selector: (code: PromotionalCode) => code.code,
      minWidth: "150px",
      maxWidth: "300px",
      sortable: true,
      style: { cursor: "pointer" },
      width: "100",
    },
    {
      name: "DISCOUNT",
      selector: (code: PromotionalCode) => code.discount,
      minWidth: "100px",
      maxWidth: "200px",
      sortable: true,
      style: { cursor: "pointer" },
      width: "100",
    },
    {
      name: "TYPE",
      selector: (code: PromotionalCode) => (code.isPercentage ? "Percentage" : "Cents"),
      minWidth: "100px",
      maxWidth: "200px",
      sortable: true,
      style: { cursor: "pointer" },
      width: "100",
    },
    // {
    //   name: "DELETED",
    //   selector: (code: PromotionalCode) => (!code.isActive ? "Yes" : "No"),
    //   minWidth: "100px",
    //   maxWidth: "150px",
    //   sortable: true,
    //   style: { cursor: "pointer" },
    //   width: "100",
    // }, // Keeping this to be used when logically deleting promotional codes.
    {
      name: "IS ONE TIME",
      selector: (code: PromotionalCode) => (code.isOneTime ? "Yes" : "No"),
      minWidth: "100px",
      maxWidth: "150px",
      sortable: true,
      style: { cursor: "pointer" },
      width: "100",
    },
    {
      name: "EXPIRES AT",
      selector: (code: PromotionalCode) => dayjs(code.expiresAt).format("MM/DD/YYYY"),
      minWidth: "150px",
      maxWidth: "300px",
      sortable: true,
      conditionalCellStyles: [
        {
          when: (code: PromotionalCode) => dayjs(code.expiresAt).isBefore(dayjs().startOf("day")),
          style: {
            backgroundColor: "lightcoral",
          },
          classNames: ["tw-text-white"],
        },
      ],
      style: { cursor: "pointer" },
      width: "100",
    },
    {
      name: "ACTIONS",

      cell: (code: PromotionalCode) => (
        <div className="tw-flex tw-flex-row tw-gap-2">
          <button
            type="button"
            onClick={() => setDeleteModalInfo({ isOpen: true, code: code.code })}
          >
            <Trash />
          </button>
        </div>
      ),
      minWidth: "80px",
      maxWidth: "100px",
      style: { cursor: "pointer" },
      width: "100",
    },
  ];

  const validationSchema = Yup.object({
    code: Yup.string().required("Code is required"),
    discount: Yup.number().required("Discount is required").min(0),
    isPercentageString: Yup.string(),
    isOneTime: Yup.boolean(),
    expiresAt: Yup.date().required("Expiration Date is required"),
  });

  const submitHandler = (
    values: {
      code: string;
      discount: number;
      isPercentageString: string;
      isOneTime: boolean;
      expiresAt: string;
    },
    setSubmitting: (submitting: boolean) => void,
  ) => {
    createPromotionalCodeMutation.mutate(
      {
        ...values,
        discount: values.discount,
        expiresAt: dayjs(values.expiresAt).toDate(),
        isPercentage: values.isPercentageString === "percentage",
      },
      {
        onSuccess: (result) => {
          if (result.success) {
            void context.promotionalCodeRouter.list.invalidate();

            toast.success(result.message ?? "Promotional code created successfully");

            setSubmitting(false);
          }
        },
        onError: (error) => {
          toast.error(error.message ?? "Error creating promotional code");
          setSubmitting(false);
        },
      },
    );
  };

  return (
    <>
      <Helmet>
        <title>Hipstr - Promotional Code Management</title>
      </Helmet>
      <div>
        <Breadcrumbs
          title="Promotional Code Management"
          data={[{ title: "Promotional Code Listing" }]}
        />

        <Card className="bg-white">
          <CardBody className="p-0">
            <div className="p-2">
              <CardHeader className="p-0">
                <CardTitle tag="h4">Promotional Codes</CardTitle>
              </CardHeader>

              {/* CREATE NEW PROMOTIONAL CODE FORM */}
              <Formik
                initialValues={{
                  code: "",
                  discount: 0,
                  isPercentageString: "percentage",
                  isOneTime: false,
                  expiresAt: dayjs(new Date()).format("YYYY-MM-DD"),
                }}
                validationSchema={validationSchema}
                validateOnBlur={true}
                validateOnChange={true}
                onSubmit={(values, { setSubmitting }) => submitHandler(values, setSubmitting)}
              >
                {({ errors, setFieldValue, touched, values, isSubmitting, handleSubmit }) => (
                  <Form className="tw-flex tw-flex-col tw-gap-10" onSubmit={handleSubmit}>
                    {/* CODE */}
                    <div className="tw-flex tw-w-full tw-gap-2">
                      <div className="tw-w-1/2">
                        <FormInput
                          label="Code*"
                          name="code"
                          error={errors.code}
                          isTouched={!!touched.code}
                          placeholder="Insert code"
                        />

                        {/* DISCOUNT */}
                        <FormInput
                          label="Discount*"
                          name="discount"
                          error={errors.discount}
                          isTouched={!!touched.discount}
                          placeholder="Insert discount"
                          type="number"
                        />
                      </div>

                      <div className="tw-w-1/2 tw-gap-3">
                        {/* IS PERCENTAGE */}
                        <div className="tw-flex-col tw-w-full">
                          Type
                          <div className="tw-flex tw-w-full tw-align-middle">
                            <Field
                              type="radio"
                              name="isPercentageString"
                              id="percentage"
                              value="percentage"
                            />
                            <label htmlFor="percentage">&nbsp;Percentage</label>
                          </div>
                          <div className="tw-flex tw-w-full tw-align-middle">
                            <Field
                              type="radio"
                              name="isPercentageString"
                              id="cents"
                              value="cents"
                            />
                            <label htmlFor="cents">&nbsp;Cents</label>
                          </div>
                        </div>

                        {/* IS ONE TIME */}
                        <div className="tw-flex-col tw-w-full">
                          <div className="tw-w-full">
                            <FormControlLabel
                              control={
                                <Checkbox
                                  sx={{
                                    color: inactiveColor,
                                  }}
                                  onChange={(e) => setFieldValue("isOneTime", e.target.checked)}
                                  checked={values.isOneTime}
                                  checkedIcon={
                                    <CheckBox
                                      sx={{
                                        color: primaryColor,
                                      }}
                                    />
                                  }
                                />
                              }
                              label="One time use"
                            />
                          </div>
                        </div>

                        {/* EXPIRES AT */}
                        <div>
                          <FormDateInput
                            label="Expiration Date*"
                            name="expiresAt"
                            error={errors.expiresAt}
                            isTouched={!!touched.expiresAt}
                            placeholder="Select expiration date"
                            defaultValue={dayjs(values.expiresAt)?.format("YYYY-MM-DD")}
                            onChange={(expiresAt) =>
                              setFieldValue(
                                "expiresAt",
                                expiresAt?.[0]
                                  ? dayjs(expiresAt?.[0].toUTCString())?.format("YYYY-MM-DD")
                                  : "",
                              )
                            }
                          />
                        </div>
                      </div>
                    </div>

                    {/* SUBMIT */}
                    <div className="tw-flex tw-w-full tw-justify-center">
                      <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                        Create Promotional Code
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>

            <div className="react-dataTable-promotional-codes">
              <DataTable
                selectableRows
                columns={promotionalCodeColumns}
                className="react-dataTable-promotional-codes"
                sortIcon={<ChevronDown size={10} />}
                data={promotionalCodes}
                highlightOnHover
              />
              <ConfirmationModal
                isOpen={deleteModalInfo.isOpen}
                setIsOpen={(isOpen: boolean) =>
                  setDeleteModalInfo({ isOpen, code: deleteModalInfo.code })
                }
                onConfirm={() => {
                  deletePromotionalCodeMutation.mutate(
                    {
                      code: deleteModalInfo.code,
                    },
                    {
                      onSuccess: (result) => {
                        if (result.success) {
                          void context.promotionalCodeRouter.list.invalidate();

                          toast.success(result.message ?? "Promotional code deleted successfully");
                        }
                      },
                      onError: (error) => {
                        toast.error(error.message ?? "Error deleting promotional code");
                      },
                    },
                  );
                }}
                title="Delete Code"
                description={`You're about to delete the promotional code "${deleteModalInfo.code}", proceed?`}
                confirmText="Yes"
                cancelText="No"
              />
            </div>
          </CardBody>
        </Card>
      </div>
    </>
  );
};

PromotionalCode.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
export default PromotionalCode;
