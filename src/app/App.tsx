import { BrowserRouter } from "react-router-dom";
import { ConnectionProvider } from "@/context/ConnectionContext";
import { LiveblocksProvider } from "@liveblocks/react";
import { ToastContainer } from "react-toastify";
import AppRouter from "./AppRouter";
import "./App.css";

function App() {
  return (
    <LiveblocksProvider publicApiKey={import.meta.env.VITE_LIVEBLOCKS_PUBLIC_KEY}>
      <ConnectionProvider>
        <BrowserRouter>
        <div className="px-5">
          <AppRouter />
          </div>
          <ToastContainer />
        </BrowserRouter>
      </ConnectionProvider>
    </LiveblocksProvider>
  );
}

export default App;
