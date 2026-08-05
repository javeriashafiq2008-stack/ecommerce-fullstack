import { Navigate } from "react-router";
import { useSelector } from "react-redux";

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useSelector(
    (state) => state.authentication
  );

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;