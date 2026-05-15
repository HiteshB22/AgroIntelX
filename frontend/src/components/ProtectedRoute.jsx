import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import LoadingSpinner from "./LoadingSpinner";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuthStore();

  if (loading) return <LoadingSpinner message="Verifying authentication..." />;

  if (!user) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;
