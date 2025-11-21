import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { user, loading } = useSelector((state) => state.auth);

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/signin" replace />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/user" replace />; 

  return children;
};

export default ProtectedRoute;
