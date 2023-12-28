import React, { useContext, useEffect, useState } from "react";
import "./profile.css";
import { Link, Outlet } from "react-router-dom";
import storeContext from "../../context/store";
import Spinner from "../spinner/Spinner";

const Profile = () => {
  const context = useContext(storeContext);
  const { userToken, setAlertMessage, totalUserPost, setSpinner } = context;

  const [photo, setPhoto] = useState(null);
  const [userDetails, setUserDetails] = useState({
    name: "",
    profilePhoto: "",
    totalFollowing: null,
    totalFollowres: null,
  });

  //making PUT request to update the profile photo
  const handleSubmit = async (e) => {
    setSpinner(true);
    e.preventDefault();
    const formData = new FormData();
    formData.append("photo", photo);
    if (photo) {
      const response = await fetch(
        `${process.env.REACT_APP_PORT_URI}/api/user/userprofile`,
        {
          method: "PUT",
          headers: {
            "auth-token": userToken,
          },
          body: formData,
        }
      );
      const json = await response.json();
      setSpinner(false);
      setAlertMessage(json.message);
      setPhoto(null);
      getProfilePhoto();
    } else {
      setSpinner(false);
      setAlertMessage("please select a photo");
    }
    setPhoto();
    setSpinner(false);
  };

  // making GET request to fetch the profile photo
  const getProfilePhoto = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_PORT_URI}/api/user/getprofilephoto`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": userToken,
        },
      }
    );
    const json = await response.json();
    setUserDetails({
      ...userDetails,
      name: json.userDetails.name,
      profilePhoto: json.userDetails.photo,
      totalFollowing: json.userDetails.following.length,
      totalFollowres: json.userDetails.followers.length,
    });
  };

  useEffect(() => {
    getProfilePhoto();
  }, []);

  return (
    <div className="profile_container">
      <div className="profile_user_detail">
        <div className="profile_user_img">
          <img src={`${userDetails.profilePhoto}`} alt="" />
        </div>
        <div className="profile_user_info">
          <div className="profile_user_info_top">
            <div className="pro_user_name">
              {userDetails.name ? userDetails.name : "User Name"}
            </div>
            <form
              onSubmit={handleSubmit}
              encType="multipart/form-data"
              className="pro_user_form"
            >
              <label htmlFor="file-upload" className="custom-file-upload">
                {" "}
                <input
                  id="file-upload"
                  type="file"
                  accept=".png, .jpg, .jpeg"
                  name="photo"
                  onChange={(e) => setPhoto(e.target.files[0])}
                />
                <p className="custom-file-p">Eidt profile</p>
              </label>
              <button type="submit">Update</button>
            </form>
            <div className="pro_user_setting">
              <i className="fa-solid fa-toolbox"></i>
            </div>
          </div>
          <div className="profile_user_info_bottom">
            <div className="profile_user_posts profile_followes">
              {totalUserPost} posts
            </div>
            <div className="profile_user_following profile_followes">
              {userDetails.totalFollowing} following
            </div>
            <div className="profile_user_followers profile_followes">
              {userDetails.totalFollowres} followers
            </div>
          </div>
        </div>
      </div>

      {/* adding spinner component */}
      <Spinner />
      <div className="profile_user_uploads">
        <Link to="post" className="profile_link" key="POST">
          <div className="pro_uploads">POST</div>
        </Link>
        <Link to="reels" className="profile_link" key="REELS">
          <div className="pro_uploads">REELS</div>
        </Link>
        <Link to="saved" className="profile_link" key="SAVED">
          <div className="pro_uploads">SAVED</div>
        </Link>
        <Link to="tagged" className="profile_link" key="TAGGED">
          <div className="pro_uploads">TAGGED</div>
        </Link>
      </div>
      <Outlet />
    </div>
  );
};

export default Profile;
