import { ShimmerTable } from "react-shimmer-effects";

function ShimmerViwepartner() {
  return (
    <ShimmerTable responsive className="mt-1">
      <thead>
        <tr>
          <th>Name</th>
          <th>Role</th>
          <th>Email Id</th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td>Peter Charles</td>
          <td>Role 1</td>
          <td>peter123@gmail.com</td>
        </tr>
        <tr>
          <td>Ronald Frest</td>
          <td>Role 2</td>
          <td>ronald123@gmail.com</td>
        </tr>
        <tr>
          <td>Jack Obes</td>
          <td>Role 3</td>
          <td>jack123@gmail.com</td>
        </tr>
        <tr>
          <td>Jerry Milton</td>
          <td>Role 3</td>
          <td>jerry123@gmail.com</td>
        </tr>
      </tbody>
    </ShimmerTable>
  );
}
export default ShimmerViwepartner;
