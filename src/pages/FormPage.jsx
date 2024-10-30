import React from "react";
import { useEffect } from "react";
import Form from "../components/Form";
let token;
let user;

const FormPage = ({ accountState }) => {
  return (
    <>
      {/* <h1>Form Page</h1> */}
      <Form accountState={accountState} />
    </>
  );
};
export default FormPage;
