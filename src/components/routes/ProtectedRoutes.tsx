import { useAuth } from "@/context/AuthContext";
import type { PropsWithChildren } from "react";
import { Navigate } from "react-router";
import { CustomLoading } from "../custom/CustomLoading";

export const AuthenticatedRoute = ({ children }: PropsWithChildren) => {
  const { session, loading } = useAuth();

  if (loading) return <CustomLoading />;

  if (!session) return <Navigate to={"/auth"} />;

  return children;
};

export const NotAuthenticatedRoute = ({ children }: PropsWithChildren) => {
  const { session, loading } = useAuth();

  if (loading) return <CustomLoading />;

  if (session) return <Navigate to={"/"} />;

  return children;
};
