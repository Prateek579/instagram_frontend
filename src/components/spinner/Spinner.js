import React, { useContext } from "react";
import "./spinner.css";
import loader from "./loader.gif";
import storeContext from "../../context/store";

const Spinner = () => {
  const context = useContext(storeContext);
  const { spinner } = context;

  return (
    <>
      {spinner === true ? (
        <div className="spinner_container">
          <img src={loader} alt="loading" className="spinner_img" />
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default Spinner;
