import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { initReduceMotion } from "@/lib/ui/motion";

initReduceMotion();

createRoot(document.getElementById("root")!).render(<App />);
