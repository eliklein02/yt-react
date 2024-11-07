import React from "react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Form from "../components/Form";
// import { useLocation, useNavigate } from "react-router-dom";

const FormPage = ({ accountState }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    console.log("FormPage useEffect");
    if (token) {
      navigate("/");
    }
  }, [location.search]);

  return (
    <>
      {/* <h1>Form Page</h1> */}
      <Form accountState={accountState} />
    </>
  );
};
export default FormPage;
