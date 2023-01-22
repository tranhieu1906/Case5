import React, { useEffect, useState } from "react";
import {
  exploreOutline,
  homeFill,
  homeOutline,
  likeOutline,
  likeFill,
  messageFill,
  messageOutline,
  postUploadOutline,
} from "./SvgIcons";
import { Link, useLocation } from "react-router-dom";
import ProfileDetails from "./ProfileDetails";
import NotificationDetails from "./NotificationDetails";
import NewPost from "./NewPost";
import { useSelector } from "react-redux";
import SearchBox from "./SearchBar/SearchBox";
import logo from "../../assests/images/5a4e432a2da5ad73df7efe7a.png";

const Header = () => {
  const { user } = useSelector((state) => state.user);

  const [profileToggle, setProfileToggle] = useState(false);
  const [newPost, setNewPost] = useState(false);

  const location = useLocation();
  const [onHome, setOnHome] = useState(false);
  const [onChat, setOnChat] = useState(false);
  const [Notification, setNotification] = useState(false);

  useEffect(() => {
    setOnHome(location.pathname === "/");
    setOnChat(location.pathname.split("/").includes("direct"));
  }, [location]);

  return (
    <nav className="fixed top-0 w-full border-b bg-white z-10">
      <div className="flex flex-row justify-between items-center py-2 px-3.5 sm:w-full sm:py-2 sm:px-4 md:w-full md:py-2 md:px-6 xl:w-4/6 xl:py-3 xl:px-8 mx-auto">
        <Link to="/">
          <img
            draggable="false"
            className="mt-1.5 w-full h-full object-contain"
            src={logo}
            alt="logo"
            style={{ width: "100px", height: "35px" }}
          />
        </Link>

        <SearchBox />
        <div className="flex items-center space-x-6 sm:mr-5">
          <Link to="/">
            {profileToggle || !onHome ? homeOutline : homeFill}
          </Link>

          <Link to="/direct/inbox">
            {onChat ? messageFill : messageOutline}
          </Link>

          <div onClick={() => setNewPost(true)} className="cursor-pointer">
            {postUploadOutline}
          </div>

          <span className="hidden sm:block">{exploreOutline}</span>
          <span
            className={`cursor-pointer`}
            onClick={() => setNotification(!Notification)}
          >
            {Notification ? likeFill : likeOutline}
          </span>

          <div
            onClick={() => setProfileToggle(!profileToggle)}
            className={`${
              (profileToggle && "border-black border") ||
              (!onHome && !onChat && "border-black border")
            } rounded-full cursor-pointer h-7 w-7 p-[0.5px]`}
          >
            <img
              draggable="false"
              loading="lazy"
              className="w-full h-full rounded-full object-cover"
              src={user.profile_picture}
              alt=""
            />
          </div>
        </div>

        {profileToggle && (
          <ProfileDetails setProfileToggle={setProfileToggle} />
        )}
        {Notification && (
          <NotificationDetails setNotification={setNotification} />
        )}

        <NewPost newPost={newPost} setNewPost={setNewPost} />
      </div>
    </nav>
  );
};

export default Header;
