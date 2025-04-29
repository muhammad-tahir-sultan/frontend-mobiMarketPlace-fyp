import { ReactElement } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { UserReducerInitialState } from "../types/reducer-types";
import Loader from "./loader";

interface Props {
  isAuthenticated: boolean;
  children?: ReactElement;
  adminOnly?: boolean;
  admin?: boolean;
  redirect?: string;
}

const ProtectedRoute = ({ isAuthenticated, adminOnly, children, admin, redirect = "/" }: Props) => {
  const { loading } = useSelector((state: { userReducer: UserReducerInitialState }) => state.userReducer);

  if (loading) return <Loader />; // Prevent premature redirect while loading

  if (!isAuthenticated) return <Navigate to={redirect} />;
  if (adminOnly && !admin) return <Navigate to={redirect} />;

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
