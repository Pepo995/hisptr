import { useState } from "react";
import { ChevronDown, Edit } from "react-feather";
import DeleteModal from "../Modal/DeleteModal";
import { ROLE } from "@constants/CommonConstants";
import DataTable from "react-data-table-component";
import Link from "next/link";

const RoleTable = ({ role, refresh, roleAccess, isLoading }) => {
  const [deleteModel, setDeleteModel] = useState(false);
  const [deleteID, setDeleteID] = useState(null);
  const columns = [
    {
      name: "Role name",
      selector: (row) => row?.name,
      minWidth: "300px",
      maxWidth: "300px",
      style: { cursor: "pointer" },
      sortable: true,
      width: "100",
      cell: (row) => <span className="sy-tx-modal2 f-400">{row?.name}</span>,
    },
    {
      omit: roleAccess?.edit_access !== 1 && roleAccess?.delete_access !== 1,
      name: "ACTIONS",
      style: { cursor: "pointer" },
      minWidth: "110px",
      maxWidth: "110px",
      selector: (row) => (
        <>
          {(roleAccess?.delete_access === 1 || roleAccess?.edit_access === 1) && (
            <div class="d-flex align-items-center permissions-actions new-roll-a">
              {roleAccess?.edit_access === 1 && (
                <Link href={{ pathname: `/admin/role/edit-role/${row.id}` }}>
                  <span class="iconify sy-tx-modal2">
                    <Edit />
                  </span>
                </Link>
              )}

              {roleAccess?.delete_access === 1 && (
                <button
                  type="button"
                  class="btn btn-icon btn btn-transparent btn-sm"
                  onClick={() => {
                    /*eslint-disable-next-line */
                    setDeleteModel(!deleteModel), setDeleteID(row?.id);
                  }}
                >
                  <DeleteModal
                    description={row?.name}
                    id={deleteID}
                    code={ROLE}
                    refresh={() => refresh()}
                    open={deleteModel}
                  />
                </button>
              )}
            </div>
          )}
        </>
      ),
    },
  ];
  const onRowClicked = (row) => {
    router.push({
      pathname: `/admin/role/edit-role/${row.id}`,
    });
  };
  return (
    <div>
      {!isLoading && (
        <div className="react-dataTable">
          <DataTable
            selectableRows
            columns={columns}
            className="react-dataTable"
            sortIcon={<ChevronDown size={10} />}
            onRowClicked={onRowClicked}
            data={role}
            highlightOnHover
          />
        </div>
      )}
    </div>
  );
};
export default RoleTable;
