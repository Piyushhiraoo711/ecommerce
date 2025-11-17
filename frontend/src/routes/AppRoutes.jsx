import { Route, Routes } from "react-router-dom";
import Signin from "../components/authentication/Signin.jsx";
import Signup from "../components/authentication/Signup.jsx";
import ForgetPassword from "../components/authentication/ForgetPassword.jsx";
import ForgetOtpVerify from "../components/authentication/ForgetOtpVerify.jsx";
import ResetOtp from "../components/authentication/ResetOtp.jsx";
import Home from "../components/Home.jsx";
import OtpVerify from "../components/authentication/OtpVerify.jsx";
import AdminDashboard from "../components/adminDashboard/AdminDashboard.jsx";
import AllUsers from "../components/adminDashboard/AllUsers.jsx";
import AllSellers from "../components/adminDashboard/AllSellers.jsx";
import AllProducts from "../components/adminDashboard/AllProducts.jsx";
import AllOrders from "../components/adminDashboard/AllOrders.jsx";
import SellerDashboard from "../components/sellerDashboard/SellerDashboard.jsx";
import CreateProduct from "../components/sellerDashboard/CreateProduct.jsx";
import GetProducts from "../components/sellerDashboard/GetProducts.jsx";
import GetOrders from "../components/sellerDashboard/GetOrders.jsx";
import UpdateProduct from "../components/sellerDashboard/UpdateProduct.jsx";
import GetProductDetails from "../components/userDashboard/GetProductDetails.jsx";
import DashboardAdmin from "../components/adminDashboard/DashboardAdmin.jsx";
import DashboardSeller from "../components/sellerDashboard/DashboardSeller.jsx";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/otp-verify" element={<OtpVerify />} />
      <Route path="/forget-password" element={<ForgetPassword />} />
      <Route path="/forget-otp-verify" element={<ForgetOtpVerify />} />
      <Route path="/reset-password" element={<ResetOtp />} />
      <Route path="/product/:id" element={<GetProductDetails />} />

      {/* Seller Routes */}
      {/* <Route path="/seller" element={<DashboardSeller />} /> */}
      <Route path="/seller/dashboard" element={<SellerDashboard />} />
      <Route path="/seller/create-product" element={<CreateProduct />} />
      <Route path="/seller/get-products" element={<GetProducts />} />
      <Route path="/seller/get-orders" element={<GetOrders />} />
      <Route path="/seller/update-product" element={<UpdateProduct />} />

      {/* Admin Routes */}
      <Route path="/admin" element={<DashboardAdmin />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/all-user" element={<AllUsers />} />
      <Route path="/admin/all-seller" element={<AllSellers />} />
      <Route path="/admin/all-products" element={<AllProducts />} />
      <Route path="/admin/all-orders" element={<AllOrders />} />
    </Routes>
  );
};

export default AppRoutes;
