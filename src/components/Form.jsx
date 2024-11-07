import React, { useState, useEffect } from "react";
import "../styles/FormPage.module.css";
// import styles from '../styles/FormPage.module.css'
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

let errors;

const Form = ({ accountState }) => {
  const navigate = useNavigate();

  const [radioValue, setRadioValue] = useState("");

  const [data, setData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
    reset_filter_level_pin: "",
  });

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
            filter_level: radioValue,
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

  const handleRadioChange = (e) => {
    setRadioValue(e.target.value);
  };

  const handleChange = (e) => {
    // if (e.target.type == "radio") {
    //   setRadioValue(e.target.value);
    // }
    // console.log(e.target.value);
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
    console.log(data);
  };
  return (
    <>
      <div
        className="box"
        style={{ height: accountState == "logging in" ? "100%" : "auto" }}
      >
        <div className="form-container">
          <h1 className="form-header">
            {accountState === "registering" ? "Register" : "Login"}
          </h1>

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
                <fieldset>
                  <legend className="legen-register-form">
                    Please select your filter level:
                  </legend>
                  <div className="radio-form-div">
                    <div className="input-div-row">
                      <input
                        type="radio"
                        name="filterLevel"
                        value="light"
                        onChange={handleRadioChange}
                        checked={radioValue === "light"}
                      />
                      <label htmlFor="contactChoice1">Light</label>
                    </div>
                    <p
                      style={{
                        marginTop: "5px",
                        marginLeft: "10px",
                        fontSize: "1rem",
                      }}
                    >
                      Ensures that content is generally appropriate and free
                      from highly offensive or provocative elements. It provides
                      a basic level of moderation to maintain a respectful and
                      safe environment.
                    </p>

                    <div className="input-div-row">
                      <input
                        type="radio"
                        name="filterLevel"
                        value="mid"
                        onChange={handleRadioChange}
                        checked={radioValue === "mid"}
                      />
                      <label htmlFor="contactChoice2">Mid</label>
                    </div>
                    <p
                      style={{
                        marginTop: "5px",
                        marginLeft: "10px",
                        fontSize: "1rem",
                      }}
                    >
                      Offers a balanced approach to content moderation, ensuring
                      that material adheres to modest standards and avoids
                      excessive disrespect, strong language, and dark themes. It
                      aims to maintain a safe and respectful environment while
                      allowing for some flexibility.
                    </p>

                    <div className="input-div-row">
                      <input
                        type="radio"
                        name="filterLevel"
                        value="strict"
                        onChange={handleRadioChange}
                        checked={radioValue === "strict"}
                      />
                      <label htmlFor="contactChoice3">Strict</label>
                    </div>
                    <p
                      style={{
                        marginTop: "5px",
                        marginLeft: "10px",
                        fontSize: "1rem",
                      }}
                    >
                      Ensures that content is strictly appropriate for an
                      Orthodox Jewish audience, including only Orthodox Jewish
                      music, entertainment, and religious discussion. It
                      excludes all other content to maintain the highest
                      standards.
                    </p>
                    <div className="input-div-row">
                      <input
                        type="radio"
                        name="filterLevel"
                        value="dev"
                        onChange={handleRadioChange}
                        checked={radioValue === "dev"}
                      />
                      <label htmlFor="contactChoice3">
                        Programming related videos
                      </label>
                    </div>
                    <p
                      style={{
                        marginTop: "5px",
                        marginLeft: "10px",
                        fontSize: "1rem",
                      }}
                    >
                      Allows videos that are strictly related to computer
                      programming.
                    </p>
                  </div>
                </fieldset>
              </>
            )}
            <input type="submit" value="Submit" />
          </form>
          <p className="loginTextClass">
            {accountState === "logging in" ? (
              <>
                Not signed up yet? <Link to="/register">Register</Link>
              </>
            ) : (
              <>
                Already have an account? <Link to="/login">Log In</Link>
                {/* {radioValue} */}
              </>
            )}
          </p>
        </div>
      </div>
    </>
  );
};

export default Form;
