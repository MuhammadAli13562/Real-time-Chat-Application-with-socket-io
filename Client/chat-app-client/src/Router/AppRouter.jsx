import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import Chats from "../pages/Chats";
import { Register } from "../pages/Register";
import { Login } from "../pages/Login";

export default function AppRouter() {
  console.log("at top of AppRouter");
  return (
    <Router>
      <div className="router-div">
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/chats" element={<Chats />} />
        </Routes>
      </div>
    </Router>
  );
}
