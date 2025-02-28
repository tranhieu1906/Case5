import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { UPDATE_PROFILE_RESET } from "../../../constants/userConstants";
import {
  clearErrors,
  loadUser,
  updateProfile,
} from "../../../service/userAction";
import MetaData from "../../Layouts/MetaData";

const UpdateProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const avatarInput = useRef(null);

  const { user } = useSelector((state) => state.user);
  const { error, isUpdated, loading } = useSelector((state) => state.profile);

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [oldAvatar, setOldAvatar] = useState("");
  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");

  const handleUpdate = (e) => {
    e.preventDefault()

    const formData = new FormData();
    formData.set("name", name);
    formData.set("username", username);
    formData.set("email", email);
    formData.set("avatar", avatar);

    dispatch(updateProfile(formData));
  };

  const handleAvatarChange = (e) => {
    const reader = new FileReader();
    setAvatar("");
    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatarPreview(reader.result);
      }
    };
    reader.readAsDataURL(e.target.files[0]);
    setAvatar(e.target.files[0]);
  };

  useEffect(() => {
    if (user) {
      setName(user.name);
      setUsername(user.username);
      setEmail(user.email);
      setOldAvatar(user.profile_picture);
    }
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    if (isUpdated) {
      toast.success("Profile Updated");
      dispatch(loadUser());
      navigate(`/${username}`);

      dispatch({ type: UPDATE_PROFILE_RESET });
    }
  }, [dispatch, user, error, isUpdated, navigate, username]);

  return (
    <>
      <MetaData title="Edit Profile • Instagram" />

      <form
        onSubmit={handleUpdate}
        encType="multipart/form-data"
        className="flex flex-col gap-4 py-4 px-4 sm:py-10 sm:px-24 sm:w-3/4"
      >
        <div className="flex items-center gap-8 ml-20">
          <div className="w-11 h-11">
            <img
              draggable="false"
              className="w-full h-full rounded-full border object-cover"
              src={avatarPreview ? avatarPreview : oldAvatar}
              alt="avatar"
            />
          </div>
          <div className="flex flex-col gap-0">
            <span className="text-xl">{username}</span>
            <label
              onClick={(e) => avatarInput.current.click()}
              className="text-sm font-medium text-primary-blue cursor-pointer"
            >
              Change Profile Photo
            </label>
            <input
              type="file"
              accept="image/*"
              name="avatar"
              ref={avatarInput}
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>
        </div>
        <div className="flex w-full gap-8 text-right items-center">
          <span className="w-1/4 font-semibold">Name</span>
          <input
            className="border rounded p-1 w-3/4"
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="flex w-full gap-8 text-right items-center">
          <span className="w-1/4 font-semibold">Username</span>
          <input
            className="border rounded p-1 w-3/4"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="flex w-full gap-8 text-right items-center">
          <span className="w-1/4 font-semibold">Email</span>
          <input
            className="border rounded p-1 w-3/4"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-primary-blue font-medium rounded text-white py-2 w-40 mx-auto text-sm"
        >
          Submit
        </button>
      </form>
    </>
  );
};

export default UpdateProfile;
