import React, { useContext, useEffect } from "react";
import "./alert.css";
import storeContext from "../../context/store";

const Alert = () => {
  const context = useContext(storeContext);
  const { alertMessage, setAlertMessage } = context;

  const showAlert = () => {
    if (alertMessage !== "") {
      setTimeout(() => {
        setAlertMessage("");
      }, 3000);
    }
  };

  useEffect(() => {
    showAlert();
  }, [alertMessage]);

  return (
    <>
      {alertMessage ? (
        <div className="alert_container">
          <div className="alert_message">
            Message : <p>{alertMessage}</p>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default Alert;
