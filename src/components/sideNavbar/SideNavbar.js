import React, { useState } from "react";
import "./sideNavbar.css";
import { Link, Outlet } from "react-router-dom";

const SideNavbar = () => {
  const [addBackground, setAddBackground] = useState({
    home: "",
    search: "",
    explore: "background_active",
    reels: "",
    message: "",
    profile: "",
  });
  return (
    <div className="sidenav_container">
      <div className="sidebar_left">
        <div className="sidenav_name">
          <p>INSTAGRAM</p>
        </div>
        <div className="sidenav_options">
          <Link to="home" className="sidebar_link">
            <div
              className={`sidenav_option ${addBackground.home} `}
              onClick={() => setAddBackground({ home: "background_active" })}
            >
              <i className="fa-solid fa-house"></i>Home
            </div>
          </Link>
          <Link to="search" className="sidebar_link">
            <div
              className={`sidenav_option ${addBackground.search} `}
              onClick={() => setAddBackground({ search: "background_active" })}
            >
              <i className="fa-solid fa-magnifying-glass"></i>Search
            </div>
          </Link>
          <Link to="explore" className="sidebar_link">
            <div
              className={`sidenav_option ${addBackground.explore} `}
              onClick={() => setAddBackground({ explore: "background_active" })}
            >
              <i className="fa-regular fa-compass"></i>Explore
            </div>
          </Link>

          <Link to="reel" className="sidebar_link">
            <div
              className={`sidenav_option ${addBackground.reels} `}
              onClick={() => setAddBackground({ reels: "background_active" })}
            >
              <i className="fa-solid fa-film"></i>Reels
            </div>
          </Link>
          <Link to="message" className="sidebar_link">
            <div
              className={`sidenav_option ${addBackground.message} `}
              onClick={() => setAddBackground({ message: "background_active" })}
            >
              <i className="fa-solid fa-message"></i>Message
            </div>
          </Link>
          <Link to="profile" className="sidebar_link">
            <div
              className={`sidenav_option ${addBackground.profile} `}
              onClick={() => setAddBackground({ profile: "background_active" })}
            >
              <i className="fa-regular fa-user"></i>Profile
            </div>
          </Link>
        </div>
        <Outlet />
        <Link to="/*" className="sidebar_link">
          <div className="sidenavbar_setting">
            <div className="sidenav_setting">
              <i className="fa-solid fa-gear"></i>
              Log_Out
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default SideNavbar;
