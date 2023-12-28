import React, { useContext, useEffect, useState } from "react";
import "./home.css";
import storeContext from "../../context/store";
import Spinner from "../spinner/Spinner";
const Home = () => {
  const context = useContext(storeContext);
  const { userToken, setAlertMessage, loginUserID, setSpinner } = context;

  const [profileDetails, setProfileDetails] = useState([]);

  // making fetch request to the server for fetching all the users profiles
  const allProfiles = async () => {
    setSpinner(true);
    try {
      const request = await fetch(
        `${process.env.REACT_APP_PORT_URI}/api/user/allprofile`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const response = await request.json();
      const filterFrofiles = response.profiles.filter(
        (element) => element._id !== loginUserID
      );
      setSpinner(false);
      setProfileDetails(filterFrofiles);
    } catch (error) {
      setSpinner(false);
      console.log("all profile frontend error", error);
    }
  };

  // making fetch request to the server to post a request for follwing a user
  const handleFollwers = async (item) => {
    setSpinner(true);
    const userId = item._id;
    if (userId) {
      const request = await fetch(
        `${process.env.REACT_APP_PORT_URI}/api/user/updatefollowers`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": userToken,
          },
          body: JSON.stringify({ userId }),
        }
      );
      const response = await request.json();
      setSpinner(false);
      setAlertMessage(response.message);
    } else {
      setSpinner(false);
      console.log("Handle followers provide userid");
    }
  };

  useEffect(() => {
    allProfiles();
  }, []);

  return (
    <>
      <div className="home_container">
        <Spinner />

        <div className="home_cards">
          <p className="home_headline">Suggest for you</p>
          {profileDetails.length === 0
            ? ""
            : profileDetails.map((item) => {
                return (
                  <div className="home_card" key={item.photo + 1}>
                    <div className="home_user_image">
                      <img src={`${item.photo}`} alt="home user image" />
                      <div className="home_user_details">
                        <p>{item.name}</p>
                      </div>
                    </div>
                    <div className="home_card_add">
                      <button onClick={() => handleFollwers(item)}>
                        Follow
                      </button>
                    </div>
                  </div>
                );
              })}
        </div>
      </div>
    </>
  );
};

export default Home;
