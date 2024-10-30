import React, { useState, useEffect } from "react";
import "../styles/FormPage.module.css";
// import styles from '../styles/FormPage.module.css'
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

let errors;

const Form = ({ accountState }) => {
  const navigate = useNavigate();

  const [data, setData] = useState({});

  const login = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          user: {
            email: data.email,
            password: data.password,
          },
        }),
      });
      const res = await response.json();
      if (res.error) {
        errors = res.errors;
      } else {
        localStorage.setItem("token", res.token);
        navigate("/");
      }
    } catch (error) {
      console.log("Login failed:", error);
    }
  };

  const register = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3001/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          user: {
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            password: data.password,
            password_confirmation: data.confirm_password,
            filter_level: data.filter_level,
            reset_filter_level_pin: data.reset_filter_level_pin,
          },
        }),
      });
      const res = await response.json();
      console.log(res);
      if (res.errors) {
        errors = res.errors;
      } else {
        localStorage.setItem("token", res.token);
        navigate("/");
      }
    } catch (error) {
      console.log("Login failed:", error);
    }
  };

  //   useEffect(() => {
  //     setData({
  //       ...data,
  //     });
  //   }, [data]);

  const handleChange = (e) => {
    console.log(e.target.value);
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
    console.log(data);
  };
  return (
    <>
      <div className="box">
        <h1>{accountState === "registering" ? "Register" : "Login"}</h1>

        <form onSubmit={accountState === "registering" ? register : login}>
          {accountState === "registering" && (
            <>
              <div className="inputBox">
                <input
                  type="text"
                  required
                  name="first_name"
                  value={data.first_name}
                  onChange={handleChange}
                />
                <label htmlFor="">First Name</label>
              </div>
              <div className="inputBox">
                <input
                  type="text"
                  required
                  name="last_name"
                  value={data.last_name}
                  onChange={handleChange}
                />
                <label htmlFor="">Last Name</label>
              </div>
            </>
          )}
          <div className="inputBox">
            <input
              type="email"
              required
              name="email"
              value={data.email}
              onChange={handleChange}
            />
            <label htmlFor="">Email</label>
          </div>
          <div className="inputBox">
            <input
              type="password"
              required
              name="password"
              value={data.password}
              onChange={handleChange}
            />
            <label htmlFor="">Password</label>
          </div>
          {accountState === "registering" && (
            <>
              <div className="inputBox">
                <input
                  type="password"
                  required
                  name="confirm_password"
                  value={data.confirm_password}
                  onChange={handleChange}
                />
                <label htmlFor="">Confirm Password</label>
              </div>
              <div className="inputBox">
                <input
                  type="password"
                  required
                  name="reset_filter_level_pin"
                  value={data.reset_filter_level_pin}
                  onChange={handleChange}
                />
                <label htmlFor="">Reset Filter Level Pin</label>
              </div>
              {/* <select name="filter_level" value={data.filter_level} onChange={handleChange}>
                            <option value="" disabled selected>Filter Level</option>
                            <option value="light">Light</option>
                            <option value="mid">Mid</option>
                            <option value="strict">Strict</option>
                        </select> */}
              <fieldset>
                <legend className="legen-register-form">
                  Please select your filter level:
                </legend>
                <div className="radio-form-div">
                  <div className="input-div-row">
                    <input
                      value="light"
                      onChange={handleChange}
                      type="radio"
                      // id="contactChoice1"
                      name="filterLevel"
                      //   value="light"
                    />
                    <label htmlFor="contactChoice1">Light</label>
                  </div>

                  <div className="input-div-row">
                    <input
                      type="radio"
                      // id="contactChoice2"
                      name="filterLevel"
                      value="mid"
                      onChange={handleChange}
                    />
                    <label htmlFor="contactChoice2">Mid</label>
                  </div>

                  <div className="input-div-row">
                    <input
                      type="radio"
                      // id="contactChoice3"
                      name="filterLevel"
                      value="strict"
                      onChange={handleChange}
                    />
                    <label htmlFor="contactChoice3">Strict</label>
                  </div>
                </div>
              </fieldset>
            </>
          )}
          <input type="submit" value="Submit" />
        </form>
        <p className="loginTextClass">
          {accountState === "logging in" ? (
            <>
              'Not signed up yet? <Link to="/register">Register</Link>
            </>
          ) : (
            <>
              'Already have an account? <Link to="/login">Log In</Link>
            </>
          )}
        </p>
      </div>
    </>
  );
};

export default Form;
