import { Route, Routes } from "react-router-dom";
import Home from "./views/Home";
import NotFound from "./views/NotFound";
import LivekitPage from "./views/livekit/LivekitPage";
import Signup from "./views-auth/Signup";
import Login from "./views-auth/Login";
import ForgotPassword from "./views-auth/ForgotPassword";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="forgot-password" element= {<ForgotPassword/>}/>
      <Route path="*" element={<NotFound/>} />
      <Route path="/livekit" element={<LivekitPage/>} />
    </Routes>
  );
}

export default App;
