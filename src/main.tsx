console.log("main.tsx: script start");
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

console.log("main.tsx: rendering App");
createRoot(document.getElementById("root")!).render(<App />);
