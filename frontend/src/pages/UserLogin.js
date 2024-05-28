import {
  FormControl,
  TextField,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useState } from "react";
export default function UserLogin() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [registerActive, setRegisterActive] = useState("active");
  const [LoginActive, setLoginActive] = useState("");
  function switchOption(type) {
    if (type === "register") {
      setRegisterActive("active");
      setLoginActive("");
    } else if (type === "login") {
      setLoginActive("active");
      setRegisterActive("");
    }
  }
  return (
    <div className="login_container">
      <div
        className="login_page"
        style={{
          width: isMobile ? "" : "12em",
        }}
      >
        <h2
          style={{ color: "white", marginBottom: "1em", textAlign: "center" }}
        >
          USER LOGIN
        </h2>
        <div className="login_options">
          <div
            className={`login_option_1 ${registerActive}`}
            onClick={() => {
              switchOption("register");
            }}
          >
            <p>Register</p>
          </div>
          <div
            className={`login_option_2 ${LoginActive}`}
            onClick={() => {
              switchOption("login");
            }}
          >
            <p>Login</p>
          </div>
        </div>
        <div
          className={`login_form ${LoginActive ? "right" : "left"}`}
          component="form"
        >
          {registerActive && (
            <FormControl defaultValue="" required>
              <label>Name</label>
              <TextField
                placeholder="Write your name here"
                sx={{ color: "white" }}
              />
            </FormControl>
          )}
          <FormControl defaultValue="" required>
            <label>Email</label>
            <TextField
              placeholder="Write your Email here"
              type="email"
              sx={{ color: "white" }}
            />
          </FormControl>{" "}
          <FormControl defaultValue="" required>
            <label>Password</label>
            <TextField
              placeholder="Write your password here"
              sx={{ color: "white" }}
              type="password"
            />
          </FormControl>
          <FormControl>
            {LoginActive ? (
              <Button variant="contained" type="submit">LOGIN</Button>
            ) : (
              <Button variant="contained" type="submit">Register</Button>
            )}
          </FormControl>
        </div>
      </div>
    </div>
  );
}
