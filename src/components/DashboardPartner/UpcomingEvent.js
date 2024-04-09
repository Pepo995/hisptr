import DataTable from "react-data-table-component";
import { Card, CardTitle } from "reactstrap";
import Avatar from "@components/avatar";
import { FirstUpperCase, LastChar, convertDate } from "@utils/Utils";

import Link from "next/link";

// import dummyImg from '../../assets/images/portrait/small/avatar-s-9.jpg'
// import { useState } from 'react'

// const dummyData = [
//     {
//         event_number: '91716',
//         profile_img: dummyImg,
//         email: 'dugoko@tiljez.io',
//         first_name: 'Sweden',
//         last_name: 'Sweden',
//         date: '09 Feb 2020',
//         city: 'san francisco'
//     },
//     {
//         event_number: '91716',
//         profile_img: dummyImg,
//         email: 'dugoko@tiljez.io',
//         first_name: 'Sweden',
//         last_name: 'Sweden',
//         date: '09 Feb 2020',
//         city: 'san francisco'
//     },
//     {
//         event_number: '91716',
//         profile_img: dummyImg,
//         email: 'dugoko@tiljez.io',
//         first_name: 'Sweden',
//         last_name: 'Sweden',
//         date: '09 Feb 2020',
//         city: 'san francisco'
//     },
//     {
//         event_number: '91716',
//         profile_img: dummyImg,
//         email: 'dugoko@tiljez.io',
//         first_name: 'Sweden',
//         last_name: 'Sweden',
//         date: '09 Feb 2020',
//         city: 'san francisco'
//     }
// ]
const UpcomingEvent = ({ eventList }) => {
  const onRowClicked = (row) => {
    history.push({
      pathname: `/event-management/view-event-detail/${row?.id}`,
    });
  };
  const columns = [
    {
      name: "Event ID",
      maxWidth: "112px",
      selector: (row) => row?.event_number,
      sortable: false,
      cell: (row) => (
        <Link
          href={{
            pathname: `/event-management/view-event-detail/${row?.id}`,
          }}
        >
          <span className="sy-tx-primary f-600">#{row?.event_number}</span>
        </Link>
      ),
    },
    {
      name: "Customer Name",
      minWidth: "170px",
      selector: (row) => row?.customer_name,
      sortable: false,
      cell: (row) => (
        <Link
          href={{
            pathname: `/event-management/view-event-detail/${row?.id}`,
          }}
        >
          <div className="d-flex w-100 align-items-center">
            {row?.profile_img ? (
              <Avatar img={row?.profile_img} />
            ) : (
              <Avatar
                /*eslint-disable-next-line */
                content={
                  `${FirstUpperCase(row?.first_name)}` + " " + `${FirstUpperCase(row?.last_name)}`
                }
                showOnlyInitials
                className="cu-avatar"
              />
            )}
            <div className="text-truncate ms-1">
              <span className="d-block f-600 text-truncate sy-tx-modal">
                {FirstUpperCase(row?.first_name)} {LastChar(row?.last_name)}.
              </span>
              <small className="d-block text-truncate sy-tx-modal">{row.email}</small>
            </div>
          </div>
        </Link>
      ),
    },
    {
      name: "date",
      selector: (row) => row?.date,
      sortable: false,
      maxWidth: "136px",
      cell: (row) => (
        <Link
          href={{
            pathname: `/event-management/view-event-detail/${row?.id}`,
          }}
        >
          <span className="sy-tx-modal f-400 ">{convertDate(row?.event_date, 3)}</span>
        </Link>
      ),
    },
    {
      name: "city",
      selector: (row) => row?.city,
      sortable: false,
      maxWidth: "136px",
      cell: (row) => (
        <Link
          href={{
            pathname: `/event-management/view-event-detail/${row?.id}`,
          }}
        >
          <span className="sy-tx-modal f-400">{row?.city}</span>
        </Link>
      ),
    },
  ];
  return (
    <Card className="bg-white">
      <div className="upcoming-event-card">
        <CardTitle className="mb-1 sy-tx-modal font2024 f-600">Upcoming Events</CardTitle>
      </div>
      <div className="react-dataTable upcoming-event-table mb-1">
        <DataTable
          selectableRows
          columns={columns}
          className="react-dataTable"
          data={eventList}
          onRowClicked={onRowClicked}
          noDataComponent={
            "Check back here to see your upcoming events after they’ve been assigned to you."
          }
        />
      </div>
    </Card>
  );
};

export default UpcomingEvent;
