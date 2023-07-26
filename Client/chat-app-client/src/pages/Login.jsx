import "../styles/custom.css";
import { muiExports } from "../assets/materialUI";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { socket } from "../utils/socket";

export function Login() {
  console.log("at top of Login");
  const { Button, TextField, LoginIcon } = muiExports;

  const navigate = useNavigate();
  const [user, setuser] = useState("");
  const [pass, setpass] = useState("");
  const [msg, setmsg] = useState("");
  const [disable, setdisable] = useState(false);

  function handleSignIn() {
    setdisable(true);

    function callback1(response) {
      localStorage.setItem("token", response.headers.token);
      socket.auth.token = localStorage.getItem("token");
      setmsg("Succesfully Login");
      setdisable(false);
      navigate("/chats");
    }
    function callback2(response) {
      const errorMsg = response.response.data.error;
      console.log("ERROR FROM SERVER : ", errorMsg);
      setmsg(errorMsg);
      setdisable(false);
    }

    axios
      .post(
        "http://localhost:3000/login",
        {},
        {
          headers: {
            username: user,
            password: pass,
          },
        }
      )
      .then(callback1, callback2);
  }

  return (
    <div>
      <div className="auth-wrapper">
        <TextField
          variant="filled"
          label="Username"
          type="Username"
          onChange={(e) => setuser(e.target.value)}
        />
        <TextField
          variant="filled"
          label="Password"
          type="password"
          onChange={(e) => setpass(e.target.value)}
        />
        <Button
          disabled={disable}
          variant="contained"
          endIcon={<LoginIcon />}
          onClick={handleSignIn}
        >
          Log In
        </Button>
        {msg !== "" && <div style={{ color: "Red" }}>{msg}</div>}
      </div>
    </div>
  );
}
