import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { SuiClientProvider, WalletProvider } from "@mysten/dapp-kit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@mysten/dapp-kit/dist/index.css";
import { Toaster } from "react-hot-toast";

var queryClient = new QueryClient();
var networks = { testnet: { url: "https://fullnode.testnet.sui.io:443" } };

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <QueryClientProvider client={queryClient}>
    <SuiClientProvider networks={networks} defaultNetwork="testnet">
      <WalletProvider autoConnect>
        <App />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#13131F",
              color: "#F2F2FF",
              border: "1px solid #1E1E30",
              borderRadius: "10px",
              fontSize: "13px",
              fontFamily: "'DM Sans', sans-serif",
            },
            success: {
              iconTheme: { primary: "#00D395", secondary: "#13131F" },
            },
            error: {
              iconTheme: { primary: "#FF4444", secondary: "#13131F" },
            },
          }}
        />
      </WalletProvider>
    </SuiClientProvider>
  </QueryClientProvider>
);