import { useEffect } from "react";
import { setPageTitle } from "../utils/setPageTitle";
import { useAuth } from "./useAuth";

export const usePageTitle = (title: string) => {
  const role = useAuth();
  useEffect(() => {
    setPageTitle(title, role.role);
  }, [title, role.role]);
};
