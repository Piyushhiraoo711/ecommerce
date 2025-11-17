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
import ProtectedRoute from "../protectedRoute/ProtectedRoute.jsx"
import { Route, Routes } from "react-router-dom";

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

      {/* Seller Routes (Protected) */}
      <Route
        path="/seller"
        element={
          <ProtectedRoute allowedRoles={["seller"]}>
            <DashboardSeller />
          </ProtectedRoute>
        }
      />
      <Route
        path="/seller/dashboard"
        element={
          <ProtectedRoute allowedRoles={["seller"]}>
            <SellerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/seller/create-product"
        element={
          <ProtectedRoute allowedRoles={["seller"]}>
            <CreateProduct />
          </ProtectedRoute>
        }
      />
      <Route
        path="/seller/get-products"
        element={
          <ProtectedRoute allowedRoles={["seller"]}>
            <GetProducts />
          </ProtectedRoute>
        }
      />
      <Route
        path="/seller/get-orders"
        element={
          <ProtectedRoute allowedRoles={["seller"]}>
            <GetOrders />
          </ProtectedRoute>
        }
      />
      <Route
        path="/seller/update-product/:id"
        element={
          <ProtectedRoute allowedRoles={["seller"]}>
            <UpdateProduct />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes (Protected) */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <DashboardAdmin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/all-user"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AllUsers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/all-seller"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AllSellers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/all-products"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AllProducts />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/all-orders"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AllOrders />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
