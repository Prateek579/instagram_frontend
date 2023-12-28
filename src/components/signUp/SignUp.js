import React, { useContext, useState } from "react";
import "./signUp.css";
import { Link, useNavigate } from "react-router-dom";
import storeContext from "../../context/store";
import Spinner from "../spinner/Spinner";

const SignUp = () => {
  const context = useContext(storeContext);
  const { setAlertMessage, setUserToken, setLoginUserID, setSpinner } = context;

  const [credentials, setCtedentials] = useState({
    name: "",
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
    if (
      credentials.name !== "" &&
      credentials.email !== "" &&
      credentials.password !== ""
    ) {
      setIsDisable(false);
    }
  };

  const handleSignUp = async () => {
    const { name, email, password } = credentials;
    if (name === "" || email === "" || password === "") {
      setAlertMessage("All fields required");
      navigate("/signup");
    } else {
      setSpinner(true);
      const respose = await fetch(
        `${process.env.REACT_APP_PORT_URI}/api/user/createuser`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, password }),
        }
      );
      const json = await respose.json();
      setSpinner(false);
      setAlertMessage(json.message);
      if (json.success === true) {
        setUserToken(json.authToken);
        setLoginUserID(json.data.id);
      } else {
        navigate("/signup");
      }
    }
  };

  return (
    <div>
      <Spinner />
      <div className="signUp_container">
        <div className="signUp_content">
          <div className="signUp_image"></div>
          <div className="signUp_inputs">
            <input
              type="text"
              placeholder="Name"
              name="name"
              value={credentials.name}
              onChange={(e) => handleInputs(e)}
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={credentials.email}
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
                  onClick={() => handleSignUp()}
                  className="input_signUp_btn"
                  disabled
                >
                  Sing Up
                </button>
              </Link>
            ) : (
              <Link to="/start">
                <button
                  onClick={() => handleSignUp()}
                  className="input_signUp_btn"
                >
                  Sing Up
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
