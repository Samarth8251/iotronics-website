import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { PreloadingAnimation } from "./components/PreloadingAnimation.tsx";
import "./index.css";

const Root = () => (
  <>
    <PreloadingAnimation />
    <App />
  </>
);

createRoot(document.getElementById("root")!).render(<Root />);
