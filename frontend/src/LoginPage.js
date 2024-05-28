import { FormControl, Button, useMediaQuery, useTheme } from "@mui/material";
import { useState } from "react";
import CustomTextField from "./CustomTextFieldForLogin";
export default function UserLogin() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [ActiveOption, setActiveOption] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  function switchOption(type) {
    if (type === "register") {
      setActiveOption(1);
    } else if (type === "login") {
      setActiveOption(2);
    }
  }
  const handleName = (e) => {
    setName(e.target.value);
  };
  const handleEmail = (e) => {
    setEmail(e.target.value);
  };
  const handlePass = (e) => {
    setPass(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (ActiveOption === 1) {
      console.log({
        name: name,
        email: email,
        password: pass,
      });
    } else if (ActiveOption === 2) {
      console.log({ email: email, password: pass });
    }
  };
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
            className={`login_option_1 ${ActiveOption === 1 && "active"}`}
            onClick={() => {
              switchOption("register");
            }}
          >
            <p>Register</p>
          </div>
          <div
            className={`login_option_2 ${ActiveOption === 2 && "active"}`}
            onClick={() => {
              switchOption("login");
            }}
          >
            <p>Login</p>
          </div>
        </div>
        <form
          onSubmit={handleSubmit}
          className={`login_form ${ActiveOption === 1 ? "left" : "right"}`}
        >
          {ActiveOption === 1 && (
            <FormControl defaultValue="" required>
              <label>Name</label>
              <CustomTextField
                placeholder="Write your name here"
                value={name}
                onChange={handleName}
              />
            </FormControl>
          )}
          <FormControl defaultValue="" required>
            <label>Email</label>
            <CustomTextField
              placeholder="Write your Email here"
              type="email"
              sx={{ color: "white" }}
              value={email}
              onChange={handleEmail}
            />
          </FormControl>{" "}
          <FormControl defaultValue="" required>
            <label>Password</label>
            <CustomTextField
              placeholder="Write your password here"
              sx={{ color: "white" }}
              type="password"
              value={pass}
              onChange={handlePass}
            />
          </FormControl>
          <FormControl>
            {ActiveOption === 1 ? (
              <Button variant="contained" type="submit">
                Register
              </Button>
            ) : (
              <Button variant="contained" type="submit">
                Login
              </Button>
            )}
          </FormControl>
        </form>
      </div>
    </div>
  );
}
