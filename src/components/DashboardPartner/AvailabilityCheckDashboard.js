import DataTable from "react-data-table-component";
import { Card, CardBody, CardTitle } from "reactstrap";

import Select from "react-select";
import { convertDate } from "@utils/Utils";
import { AvailabilityStatusUpdateAPICall } from "../../redux/action/AvailabilityAction";
import AvailabilityModal from "@components/Modal/AvaibilityModal";
import { useState } from "react";
import { useDispatch } from "react-redux";
import moment from "moment";
import Link from "next/link";

const availabilityOptions = [
  // { label: 'Select', value: 'select' },
  { label: "Available", value: "available" },
  { label: "Unavailable", value: "unavailable" },
];

const AvailabilityCheckDashboard = ({ list, setList }) => {
  const dispatch = useDispatch();
  const [showUnavailableModal, setShowUnavailableModal] = useState(false);
  const [showUnavailableId, setShowUnavailableId] = useState("false");

  const updateAvailability = async (id, value) => {
    if (value !== "select") {
      const data = {
        availability_id: id,
        status: value,
      };
      const response = await dispatch(AvailabilityStatusUpdateAPICall(data));
      if (response?.status === 200) {
        const temp = [...list];
        temp.map((obj) => {
          if (obj.id === id) obj.status = value;
        });

        setList([...temp]);
      }
    }
  };

  const columns = [
    {
      name: "Availability ID",
      maxWidth: "170px",
      minWidth: "170px",
      selector: (row) => row?.availability?.availability_number,
      sortable: false,
      cell: (row) => (
        <span className="sy-tx-primary f-600">
          #{row?.availability?.availability_number}
        </span>
      ),
    },

    {
      name: "date",
      selector: (row) => row?.date,
      sortable: false,
      maxWidth: "150px",
      cell: (row) => (
        <span className="sy-tx-modal f-400 ">
          {convertDate(row?.availability?.event_date, 3) || "--"}
        </span>
      ),
    },
    {
      name: "city",
      selector: (row) => row?.availability?.city,
      sortable: false,
      minWidth: "150px",
      cell: (row) => (
        <span className="sy-tx-modal f-400">{row?.availability?.city}</span>
      ),
    },
    {
      name: "ACTION",
      width: "190px",
      selector: (row) => row?.status,
      sortable: true,

      cell: (row, i) => {
        const selectedVal = availabilityOptions.find(
          (obj) => row.status === obj.value,
        );
        return (
          <>
            <Select
              id="rows-per-page"
              className={`react-select mx-1 availability-select dashboard-select ${
                selectedVal?.value === "available" && "avail-color"
              } ${selectedVal?.value === "unavailable" && "unavail-color"} `}
              classNamePrefix="select"
              value={selectedVal}
              isDisabled={
                row?.is_assigned ||
                row.availability.event_date <
                  moment(new Date()).format("MM/DD/YYYY")
              }
              options={availabilityOptions}
              menuPortalTarget={document.body}
              onChange={(e) => {
                if (e.value === "unavailable") {
                  setShowUnavailableModal(true);
                  setShowUnavailableId(row?.id);
                  return;
                }
                updateAvailability(row?.id, e.value);
              }}
              isSearchable={false}
              menuPlacement={
                list?.length >= 4 && i > list?.length - 3 ? "top" : "bottom"
              }
            />
          </>
        );
      },
    },
  ];

  return (
    <Card className="bg-white">
      <CardBody className="pb-0">
        <CardTitle className="mb-1 sy-tx-modal font2024 f-600">
          Availability Checks
        </CardTitle>
      </CardBody>
      <div className="react-dataTable upcoming-event-table mb-5">
        <DataTable
          selectableRows
          columns={columns}
          className="react-dataTable"
          data={list}
          noDataComponent={
            "Check back here to see availability checks for events."
          }
        />
      </div>
      <AvailabilityModal
        list={list}
        setList={setList}
        fromDashboard={true}
        id={showUnavailableId}
        centeredModal={showUnavailableModal}
        setCenteredModal={(val) => setShowUnavailableModal(val)}
      />
      <Link
        href="/partner/availability-check"
        className="text-end p-2 sy-tx-primary f-600"
      >
        See all Availability Checks
      </Link>
    </Card>
  );
};

export default AvailabilityCheckDashboard;
