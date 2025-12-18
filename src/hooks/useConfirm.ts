import { useContext } from "react";
import { ConfirmContext } from "../context/ConfirmContext";

export const useConfirm = () => useContext(ConfirmContext);
