import React from "react";
import Card from "../card/Card";
import { useSelector } from "react-redux";

const AdminDashboard = () => {
  const total = useSelector((state) => state.admin.dashboard?.totals);
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-20 p-4">
        <Card title="Total Users" value={total?.totalUsers} icon="👥" />
        <Card title="Total Sellers" value={total?.totalSellers} icon="👥" />
        <Card title="Total Products" value={total?.totalProducts} icon="👥" />
        <Card title="Total Orders" value={total?.totalOrders} icon="👥" />
      </div>
    </>
  );
};

export default AdminDashboard;
