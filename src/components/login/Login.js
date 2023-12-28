import React, { useContext, useState } from "react";
import "./login.css";
import { Link, useNavigate } from "react-router-dom";
import storeContext from "../../context/store";
import Spinner from "../spinner/Spinner";

const Login = () => {
  const context = useContext(storeContext);
  const { setAlertMessage, setUserToken, setLoginUserID, setSpinner } = context;

  const [credentials, setCtedentials] = useState({
    emai: "",
    password: "",
  });
  const [isDisable, setIsDisable] = useState(true);
  const navigate = useNavigate();

  const handleInputs = (e) => {
    setCtedentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
    if (credentials.email !== "" && credentials.password !== "") {
      setIsDisable(false);
    }
  };

  const handleLogin = async () => {
    const { email, password } = credentials;
    if (email === "" || password === "") {
      setAlertMessage("All fields required");
      navigate("/");
    } else {
      setSpinner(true);

      const respose = await fetch(
        `${process.env.REACT_APP_PORT_URI}/api/user/loginuser`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );
      const json = await respose.json();
      setSpinner(false);
      setAlertMessage(json.message);
      if (json.success === true) {
        setLoginUserID(json.data.id);
        setUserToken(json.authToken);
      } else {
        navigate("/");
      }
    }
  };

  return (
    <>
      <Spinner />
      <div className="login_container">
        <div className="login_content">
          <div className="login_image"></div>
          <div className="login_inputs">
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={credentials.name}
              onChange={(e) => handleInputs(e)}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={credentials.password}
              onChange={(e) => handleInputs(e)}
            />
            {isDisable ? (
              <Link to="/start">
                <button
                  className="input_login_btn"
                  disabled
                  onClick={() => handleLogin()}
                >
                  Login
                </button>
              </Link>
            ) : (
              <Link to="/start">
                <button
                  className="input_login_btn"
                  onClick={() => handleLogin()}
                >
                  Login
                </button>
              </Link>
            )}
          </div>
          <Link to="/signup">
            <div className="input_signUp">
              Don't have an account? <p>Sign up</p>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Login;
