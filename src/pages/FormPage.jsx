import React from "react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchUser } from "../tools/utils.js";
import Form from "../components/Form.jsx";
import { toast } from "react-toastify";

// import { useLocation, useNavigate } from "react-router-dom";

const FormPage = ({ accountState }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("token"));

  // use effect to redirect if no token exists and if yes to fetch the user and store it in user state
  useEffect(() => {
    const getUser = async () => {
      const response = await fetchUser(token);
      if (response === "not logged in") {
        navigate("/login");
      }
      if (response?.message && response?.message === "token is not valid") {
        navigate("logout");
      }
    };
    getUser();
  }, [location.search]);

  return (
    <>
      {/* <h1>Form Page</h1> */}
      <Form accountState={accountState} />
    </>
  );
};
export default FormPage;
