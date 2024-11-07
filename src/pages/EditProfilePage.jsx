import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";

const EditProfilePage = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("token"));
  const location = useLocation();

  const [showFilterLevelChange, setShowFilterLevelChange] = useState(false);

  const [user, setUser] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [changeFilterLevelPasswordVar, setChangeFilterLevelPasswordVar] =
    useState("");
  const [selectedFilterLevel, setSelectedFilterLevel] = useState("");

  const handleShowFilterLevelChange = () => {
    setShowFilterLevelChange(!showFilterLevelChange);
  };

  const handleFilterLevelPasswordChange = (e) => {
    setChangeFilterLevelPasswordVar(e.target.value);
  };

  const handleFilterLevelInputChange = (e) => {
    setSelectedFilterLevel(e.target.value);
  };

  const handleFilterLevelChangeSubmit = async () => {
    if (
      changeFilterLevelPasswordVar == "" ||
      changeFilterLevelPasswordVar == null ||
      changeFilterLevelPasswordVar == undefined
    ) {
      console.log("Wrong info provided in var");
    } else if (selectedFilterLevel == null || selectedFilterLevel == "") {
      // change_level_error = "Wrong info provided";
      console.log("Wrong info provided");
      return;
    }
    const response = await fetch("http://localhost:3001/user_data", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        user: {
          filter_level: selectedFilterLevel,
          reset_filter_level_pin: changeFilterLevelPasswordVar,
        },
      }),
    });
    const data = await response.json();
    console.log(data);
    if (data.error) {
      // change_level_error = data.message;
      localStorage.setItem("user", data.user);
    } else {
      navigate("/profile");
    }
  };

  useEffect(() => {
    const getUser = async () => {
      if (token == null || token == "" || token == undefined) {
        navigate("/login");
      }
      if (token) {
        const res = await fetch(`http://localhost:3001/user_data`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setUser(data.user);
        setFirstName(data.user.first_name);
        setLastName(data.user.last_name);
        setEmail(data.user.email);
        // setFirstName(user.first_name);
      } else {
        navigate("/login");
      }
    };
    getUser();
  }, [location.search, token]);

  const handleUpdate = async () => {
    try {
      const response = await fetch("http://localhost:3001/user_data", {
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
      if (data && data.user) {
        // localStorage.setItem("user", JSON.stringify(data.user));
        // setFirstName(data.user.first_name);
        // setUser(data.user);
        navigate("/profile");
      }
    } catch (error) {
      console.log(error);
    }
  };

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
      <Navbar />
      {user && (
        <>
          <div className="form-container-edit-profile">
            <label for="first_name">First Name</label>
            <input
              name="firstName"
              id="first_name"
              type="text"
              value={firstName}
              placeholder="Enter first name"
              onChange={handleChange}
            />

            <label for="last_name">Last Name</label>
            <input
              name="lastName"
              id="last_name"
              type="text"
              value={lastName}
              placeholder="Enter last name"
              onChange={handleChange}
            />

            <label for="email">Email</label>
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
      <button className="filter-btn" onClick={handleShowFilterLevelChange}>
        {" "}
        Change Filter Level{" "}
      </button>

      {showFilterLevelChange && (
        <div class="changeFilterLevelModal">
          <div class="close-modal">
            <button onClick={handleShowFilterLevelChange}>X</button>
          </div>
          <div>
            <input
              required
              type="password"
              onChange={handleFilterLevelPasswordChange}
            />
            <select onChange={handleFilterLevelInputChange}>
              <option value="" disabled selected>
                Filter Level
              </option>
              <option value="strict">Strict</option>
              <option value="mid">Mid</option>
              <option value="light">Light</option>
              <option value="dev">Developer related videos</option>
            </select>
            <button onClick={handleFilterLevelChangeSubmit}>Change</button>
          </div>
        </div>
      )}
    </>
  );
};

export default EditProfilePage;
