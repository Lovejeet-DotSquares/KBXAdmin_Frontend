import { ToastContainer as ToastifyContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ToastContainer = () => (
    <ToastifyContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
    />
);

export default ToastContainer;
