import React from "react";

const AllUsersCard = ({ users }) => {
  return (
    <div className="md:block">
      <table className="min-w-full bg-white mt-20 text-black rounded-lg overflow-hidden shadow-md">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-3 px-4 text-left">User</th>
            <th className="py-3 px-4 text-left">Email</th>
            <th className="py-3 px-4 text-center">Total Orders</th>
            <th className="py-3 px-4 text-right">Total Amount</th>
          </tr>
        </thead>
        <tbody>
          {users?.map((u) => (
            <tr key={u.userId} className="border-t">
              <td className="py-3 px-4">
                {u.firstName} {u.lastName}
              </td>
              <td className="py-3 px-4">{u.email}</td>
              <td className="py-3 px-4 text-center">{u.totalOrders}</td>
              <td className="py-3 px-4 text-right">
                ₹{u.totalAmount.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllUsersCard;
