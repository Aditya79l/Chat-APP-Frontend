import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  // Get the item from localStorage. If it doesn't exist, it will be null.
  const userInfoString = localStorage.getItem("userInfo");

  // Parse the JSON string only if it exists and is not the string "undefined".
  const currentUser =
    userInfoString && userInfoString !== "undefined"
      ? JSON.parse(userInfoString)
      : null;
  const token = currentUser?.token;

  return token ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
