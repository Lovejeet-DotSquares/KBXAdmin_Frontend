import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./router/AppRoutes";
import ToastContainer from "./components/common/ToastContainer";
import GlobalLoader from "./components/common/GlobalLoader";
import { ConfirmProvider } from "./context/ConfirmProvider";
import { AuthProvider } from "./context/AuthProvider";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ToastContainer />
        <ConfirmProvider>
          <GlobalLoader />
          <AppRoutes />
        </ConfirmProvider>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
