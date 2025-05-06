import { FormControl, Button, useMediaQuery, useTheme } from "@mui/material";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import CustomTextField from "./CustomTextFieldForLogin";
import { AuthContext } from "./functions/AuthContext";
import { AdminAuthContext } from "./functions/AdminAuthContext";
export default function Login({ type }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const { adminLogin } = useContext(AdminAuthContext);
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
  function resetData() {
    setName("");
    setEmail("");
    setPass("");
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (type === "user") {
      if (ActiveOption === 1) {
        const data = {
          name: name,
          email: email,
          password: pass,
        };
        await fetch(`${process.env.REACT_APP_SERVER_URL}/signup`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })
          .then((response) => {
            return response.json().then((data) => {
              if (!response.ok) {
                alert(data.message);
                resetData();
              }
              return data;
            });
          })
          .then((data) => {
            if (data.message === "Success") {
              const user = {
                name: name,
                id: data.result,
              };
              login({ user });
              resetData();
              navigate("/");
            }
          });
      } else if (ActiveOption === 2) {
        const data = { email: email, password: pass };
        await fetch(`${process.env.REACT_APP_SERVER_URL}/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })
          .then(async (response) => {
            const data = await response.json();
            if (data.message === " You are banned by the administrator") {
              alert(data.message);
              return false;
            }
            return data;
          })
          .then(async (data) => {
            if (data.message === "Success") {
              const user = {
                name: data.result.name,
                id: data.result._id,
              };
              login({ user });
              navigate("/");
              resetData();
            } else {
              alert(data.message);
              resetData();
            }
          })
          .catch((error) => {
            console.error(
              "There was a problem with the fetch operation:",
              error
            );
          });
      }
    } else if (type === "admin") {
      const data = { password: pass };
      await fetch(`${process.env.REACT_APP_SERVER_URL}/admin-login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => {
          return response.json().then((data) => {
            if (!response.ok) {
              alert("Invalid Credentials");
              resetData();
            }
            return data;
          });
        })
        .then((data) => {
          if (data.message === "Success") {
            adminLogin();
            resetData();
          }
        });
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
          style={{
            color: "white",
            marginBottom: "1em",
            textTransform: "uppercase",
            textAlign: "center",
          }}
        >
          {type} LOGIN
        </h2>
        <div className="login_options">
          {type === "user" ? (
            <>
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
            </>
          ) : (
            <div></div>
          )}
        </div>
        <form
          onSubmit={handleSubmit}
          className={`login_form ${ActiveOption === 1 ? "left" : "right"}`}
        >
          {type === "user" && ActiveOption === 1 && (
            <FormControl defaultValue="" required>
              <label>Name</label>
              <CustomTextField
                placeholder="Write your name here"
                value={name}
                onChange={handleName}
              />
            </FormControl>
          )}
          {type === "user" && (
            <>
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
            </>
          )}
          {type !== "user" && (
            <div>
              {" "}
              <FormControl defaultValue="" required>
                <label>Enter your code</label>
                <CustomTextField
                  placeholder="Write your Code here"
                  sx={{ color: "white" }}
                  type="password"
                  value={pass}
                  onChange={handlePass}
                />
              </FormControl>
            </div>
          )}

          <FormControl>
            {type === "user" && ActiveOption === 1 && (
              <Button variant="contained" type="submit">
                Register
              </Button>
            )}
            {type === "user" && ActiveOption === 2 && (
              <Button variant="contained" type="submit">
                Login
              </Button>
            )}
            {type === "admin" && (
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
