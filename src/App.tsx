import "./App.css";
import { AppRouterPage } from "./theme/pages";
import { Toaster } from "sonner";

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <AppRouterPage />
    </>
  );
}

export default App;
