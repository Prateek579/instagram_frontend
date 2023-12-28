import React, { useContext, useState } from "react";
import "./search.css";
import Spinner from "../spinner/Spinner";
import storeContext from "../../context/store";
const Search = () => {
  const [profileDetails, setProfileDetails] = useState([]);
  const [searchName, setSearchName] = useState("");

  const context = useContext(storeContext);
  const { setSpinner } = context;

  const handleSearchProfile = async (e) => {
    setSpinner(true);
    e.preventDefault();
    const request = await fetch(
      `${process.env.REACT_APP_PORT_URI}/api/user/profile/${searchName}`,
      {
        method: "GET",
        headers: {
          "Content-type": "application/json",
        },
      }
    );
    const response = await request.json();
    if (response.success === true) {
      setSpinner(false);
      setProfileDetails(response.userProfile);
    }
  };

  return (
    <>
      <Spinner />
      <div className="search_container">
        <div className="search_bar">
          <div className="search_text">Search</div>
          <div className="search_input">
            <form className="form" onSubmit={handleSearchProfile}>
              <input
                type="text"
                placeholder="Search"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
              />
            </form>
            <i
              className="fa-regular fa-circle-xmark"
              onClick={() => setSearchName("")}
            ></i>
          </div>
        </div>
        <div className="search_results">
          {profileDetails.length === 0
            ? ""
            : profileDetails.map((item) => {
                return (
                  <div className="search_card" key={item.photo + 13}>
                    <div className="search_user_image">
                      <img src={`${item.photo}`} alt="search user image" />
                      <div className="search_user_details">
                        <p>{item.name}</p>
                      </div>
                    </div>
                    <div className="search_user_followers">
                      <p>Followers</p> {item.followers.length}
                    </div>
                  </div>
                );
              })}
        </div>
      </div>
    </>
  );
};

export default Search;
