import React from "react";
function NoDataFound({ message, bgWhite = false }) {
  return (
    <>
      {" "}
      <div className={`no-data w-100 text-center${bgWhite ? " bg-white" : ""}`}>
        {message ? (
          <p className="font14">No {message} found</p>
        ) : (
          <p>No Data Found</p>
        )}
      </div>
    </>
  );
}
export default NoDataFound;
