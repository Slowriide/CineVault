import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { CineVault } from "./CineVault";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CineVault />
  </StrictMode>
);
