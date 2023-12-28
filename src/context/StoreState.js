import { useEffect, useState } from "react";
import storeContext from "./store";

const StoreState = (props) => {
  const [userToken, setUserToken] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [totalUserPost, setTotalUserPost] = useState();
  const [loginUserID, setLoginUserID] = useState("");
  const [spinner, setSpinner] = useState(false);

  return (
    <storeContext.Provider
      value={{
        userToken,
        setUserToken,
        alertMessage,
        setAlertMessage,
        totalUserPost,
        setTotalUserPost,
        loginUserID,
        setLoginUserID,
        spinner,
        setSpinner,
      }}
    >
      {props.children}
    </storeContext.Provider>
  );
};

export default StoreState;
