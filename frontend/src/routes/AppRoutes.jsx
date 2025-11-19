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
import DashboardAdmin from "../components/adminDashboard/AdminLayout.jsx";
import ProtectedRoute from "../protectedRoute/ProtectedRoute.jsx";
import { Route, Routes } from "react-router-dom";
import MyProfile from "../components/userDashboard/MyProfile.jsx";
import UpdateProfile from "../components/userDashboard/UpdateProfile.jsx";
import PlaceOrder from "../components/userDashboard/PlaceOrder.jsx";
import MyOrders from "../components/userDashboard/MyOrders.jsx";
import Cart from "../components/userDashboard/Cart.jsx";
import SellerLayout from "../components/sellerDashboard/SellerLayout.jsx";
import AdminLayout from "../components/adminDashboard/AdminLayout.jsx";
import TopUsers from "../components/adminDashboard/TopUsers.jsx";
import TopSellers from "../components/adminDashboard/TopSellers.jsx";
import TopProducts from "../components/adminDashboard/TopProducts.jsx";
import OrderByStatus from "../components/adminDashboard/OrderByStatus.jsx";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/otp-verify" element={<OtpVerify />} />
      <Route path="/forget-password" element={<ForgetPassword />} />
      <Route path="/forget-otp-verify" element={<ForgetOtpVerify />} />
      <Route path="/reset-password" element={<ResetOtp />} />
      <Route path="/product/:id" element={<GetProductDetails />} />
      <Route path="/profile" element={<MyProfile />} />
      <Route path="/update-profile" element={<UpdateProfile />} />
      <Route path="/place-order/:id" element={<PlaceOrder />} />
      <Route path="/my-orders" element={<MyOrders />} />
      <Route path="/cart" element={<Cart />} />

      {/* Seller Routes (Protected) */}
      <Route
        path="/seller"
        element={
          <ProtectedRoute allowedRoles={["seller"]}>
            <SellerLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<SellerDashboard />} />
        <Route path="create-product" element={<CreateProduct />} />
        <Route path="get-products" element={<GetProducts />} />
        <Route path="get-orders" element={<GetOrders />} />
        <Route path="update-product/:id" element={<UpdateProduct />} />
      </Route>

      {/* Admin Routes (Protected) */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="all-user" element={<AllUsers />} />
        <Route path="all-seller" element={<AllSellers />} />
        <Route path="all-products" element={<AllProducts />} />
        <Route path="all-orders" element={<AllOrders />} />

        <Route path="top-users" element={<TopUsers />} />
        <Route path="top-sellers" element={<TopSellers />} />
        <Route path="top-products" element={<TopProducts />} />
        <Route path="order-by-status" element={<OrderByStatus />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
