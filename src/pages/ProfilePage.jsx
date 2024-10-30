import React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // setToken(localStorage.getItem("token"));
    const getUser = async () => {
      if (token == null || token == "" || token == undefined) {
        navigate("/login");
      }
      if (token) {
        console.log(token);
        const res = await fetch(`http://localhost:3001/user_data`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        console.log("channeIf", data);
        setUser(data.user);
      } else {
        console.log(token);
        navigate("/login");
      }
    };
    getUser();
  }, [location.search, token]);

  return (
    <>
      <Navbar />
      {JSON.stringify(user)}
      <Link
        style={{
          color: "black",
          textDecoration: "underline",
          display: "block",
          fontSize: "1.5rem",
        }}
        to={"/logout"}
      >
        Log out
      </Link>
    </>
  );
};

export default ProfilePage;
