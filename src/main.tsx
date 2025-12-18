import ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProvider } from "./context/ThemeProvider";
import { QueryProvider } from "./query/QueryProvider";
ReactDOM.createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <QueryProvider>
      <App />
    </QueryProvider>
  </ThemeProvider>
);
