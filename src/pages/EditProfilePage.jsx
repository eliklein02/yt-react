import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import { fetchUser } from "../tools/utils";
import { toast, Bounce } from "react-toastify";

const EditProfilePage = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("token"));
  const location = useLocation();
  const [showFilterLevelChange, setShowFilterLevelChange] = useState(false);
  const [radioValue, setRadioValue] = useState("");
  // const handleChangeFilterLevel = (e) => {
  //   // if (e.target.type == "radio") {
  //   //   setRadioValue(e.target.value);
  //   // }
  //   // console.log(e.target.value);
  //   setData({
  //     ...data,
  //     [e.target.name]: e.target.value,
  //   });
  //   console.log(data);
  // };
  const [user, setUser] = useState({});
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [changeFilterLevelPasswordVar, setChangeFilterLevelPasswordVar] =
    useState("");
  // const [selectedFilterLevel, setSelectedFilterLevel] = useState("");

  // function that handles state change of radio values for filter level change in the modal
  const handleRadioChange = (e) => {
    setRadioValue(e.target.value);
  };
  // function to handle state whether or not sensitive info modal should be shows
  const handleShowFilterLevelChange = () => {
    setShowFilterLevelChange(!showFilterLevelChange);
  };

  // handles state change for filter level reset pin in modal
  const handleFilterLevelPasswordChange = (e) => {
    setChangeFilterLevelPasswordVar(e.target.value);
  };

  // const handleFilterLevelInputChange = (e) => {
  //   setSelectedFilterLevel(e.target.value);
  // };

  // function that handles submit and errors for filter level change
  const handleFilterLevelChangeSubmit = async () => {
    if (
      changeFilterLevelPasswordVar == "" ||
      changeFilterLevelPasswordVar == null ||
      changeFilterLevelPasswordVar == undefined
    ) {
      toast.error("Missing Pin :)", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      return;
    }
    if (radioValue == null || radioValue == "") {
      // change_level_error = "Wrong info provided";
      toast.error("You must select a filter level", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      return;
    }
    const response = await fetch(`${process.env.REACT_APP_API_URL}/users`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        user: {
          filter_level: radioValue,
          reset_filter_level_pin: changeFilterLevelPasswordVar,
        },
      }),
    });
    const data = await response.json();
    // console.log(data);
    if (data.update_error) {
      toast.error(`${data.message}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      return;
    } else {
      toast.success("Updated Filter Level", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      navigate("/profile");
    }
  };

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
      setUser(response.user);
      setFirstName(response.user.first_name);
      setLastName(response.user.last_name);
      setEmail(response.user.email);
    };
    getUser();
  }, [location.search]);

  // function to handle update and errors for updating regular information
  const handleUpdate = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/users`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user: {
            email: email,
            first_name: firstName,
            last_name: lastName,
          },
        }),
      });
      const data = await response.json();
      if (data && data.success) {
        // localStorage.setItem("user", JSON.stringify(data.user));
        // setFirstName(data.user.first_name);
        // setUser(data.user);
        toast.success("Updated successfully", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
        navigate("/profile");
      } else {
        toast.error(`${data?.errors[0]}`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  // function to handle change for inputs in form for regular information
  const handleChange = (e) => {
    console.log(e.target.name);
    if (e.target.name === "firstName") {
      setFirstName(e.target.value);
    } else if (e.target.name === "lastName") {
      setLastName(e.target.value);
    } else if (e.target.name === "email") {
      setEmail(e.target.value);
    }
  };

  return (
    <>
      <div className="edit-profile-page-full-page-container">
        <Navbar />

        {/* regular information change form */}
        {user && (
          <>
            <div className="form-container-edit-profile">
              <label htmlFor="first_name">First Name</label>
              <input
                name="firstName"
                id="first_name"
                type="text"
                value={firstName}
                placeholder="Enter first name"
                onChange={handleChange}
              />

              <label htmlFor="last_name">Last Name</label>
              <input
                name="lastName"
                id="last_name"
                type="text"
                value={lastName}
                placeholder="Enter last name"
                onChange={handleChange}
              />

              <label htmlFor="email">Email</label>
              <input
                name="email"
                id="email"
                type="email"
                value={email}
                placeholder="Enter email"
                onChange={handleChange}
              />

              <button className="btn-edit-profile" onClick={handleUpdate}>
                Update Details
              </button>
            </div>
          </>
        )}

        {/* show filter level change modal button */}
        <button
          className="change-sensitive-info-popup-btn"
          onClick={handleShowFilterLevelChange}
        >
          {" "}
          Edit Sensitive Information{" "}
        </button>
      </div>

      {/* filter level change modal */}
      {showFilterLevelChange && (
        <div className="change-sensitive-info-popup-full-page">
          <div className="change-sensitive-info-popup-form">
            <div className="close-modal">
              <button onClick={handleShowFilterLevelChange}>X</button>
            </div>
            <div>
              <div className="filter-level-reset-pin-div">
                <label>Filter level reset pin:</label>
                <input
                  required
                  type="password"
                  onChange={handleFilterLevelPasswordChange}
                />
              </div>
              {/* <select onChange={handleFilterLevelInputChange}>
                <option value="" disabled selected>
                  Filter Level
                </option>
                <option value="strict">Strict</option>
                <option value="mid">Mid</option>
                <option value="light">Light</option>
                <option value="dev">Developer related videos</option>
              </select> */}
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
                    Ensures that content is generally appropriate and free from
                    highly offensive or provocative elements. It provides a
                    basic level of moderation to maintain a respectful and safe
                    environment.
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
                    Ensures that content is strictly appropriate for an Orthodox
                    Jewish audience, including only Orthodox Jewish music,
                    entertainment, and religious discussion. It excludes all
                    other content to maintain the highest standards.
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
              <button onClick={handleFilterLevelChangeSubmit}>Change</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EditProfilePage;
