import React from "react";
import AllProducts from "./userDashboard/AllProducts.jsx";
import UserNavbar from "./userDashboard/UserNavbar.jsx";

const Home = () => {
  return (
    <div>
      <UserNavbar />
      <AllProducts />
    </div>
  );
};

export default Home;
