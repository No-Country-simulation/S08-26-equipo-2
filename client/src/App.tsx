import { Route, Routes } from "react-router-dom";
import Home from "./views/Home";
import NotFound from "./views/NotFound";
import LivekitPage from "./views/livekit/LivekitPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="*" element={<NotFound/>} />
      <Route path="/livekit" element={<LivekitPage/>} />
    </Routes>
  );
}

export default App;
