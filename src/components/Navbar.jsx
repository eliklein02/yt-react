import React from "react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFetchApi } from "../tools/useFetchApi";
let loading = false;
const searchIcon = "/public/search-icon.svg";

const Navbar = ({ passResultsUpDown, setLoading, currentPage }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [errors, setErrors] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const fetchApi = useFetchApi();
  // set search query state to the input
  const handleSearchInputChange = (e) => {
    const v = e.target.value;
    setQ(v);
  };

  const search = async (e) => {
    // navigate("/");
    e.preventDefault();
    if (q == "") {
      return;
    }
    setLoading(true);
    const data = await fetchApi(`http://localhost:3001/search?q=${q}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    // const data = await res.json();
    setLoading(false);
    passResultsUpDown(data);
  };

  useEffect(() => {
    if (!token || token === null || token === "") {
      navigate("/login");
    }

    const getUser = async () => {
      const response = await fetch("http://localhost:3001/user_data", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const res = await response.json();
      console.log(res);
      if (res?.user) {
        setUser({
          id: res.user.id,
          first_name: res.user.first_name,
          last_name: res.user.last_name,
          email: res.user.email,
          filter_level: res.user.filter_level,
        });
        console.log(user);
      } else {
        navigate("/login");
      }
    };
    getUser();
  }, [navigate]);

  const initials = (firstName, lastName) => {
    const fullName = firstName + " " + lastName;
    const fullNameAsArray = fullName.split(" ");
    const first = fullNameAsArray[0];
    const last = fullNameAsArray[fullNameAsArray.length - 1];
    const firstInitial = first.split("")[0];
    const lastInitial = last.split("")[0];
    const fullInitials = firstInitial + lastInitial;
    return fullInitials;
  };

  const handleShowProfileModal = () => {
    setShowProfileModal(!showProfileModal);
  };

  const handleShowProfileModalFullNavbar = () => {
    showProfileModal === true
      ? setShowProfileModal(!setShowProfileModal)
      : setShowProfileModal(showProfileModal);
  };
  return (
    <>
      <div className="topBar" onMouseLeave={handleShowProfileModalFullNavbar}>
        <a href="/">
          {/* <div className="logoDiv">
            <img src="https://picsum.photos/seed/picsum/50/50" alt="" />
          </div> */}
          <i className="fa-solid fa-play fa-2xl"></i>
        </a>

        {currentPage === "homePage" && (
          <>
            <div className="searchBarDiv">
              <form onSubmit={search}>
                <input
                  type="text"
                  value={q}
                  onChange={handleSearchInputChange}
                />
                <button type="submit">
                  <i className="fa-solid fa-magnifying-glass"></i>
                  {/* Reference the icon from the public directory */}
                </button>
              </form>
            </div>
          </>
        )}

        <Link
          className="profile-initials-div"
          to={"/profile"}
          onMouseEnter={handleShowProfileModal}
        >
          {initials(user.first_name, user.last_name)}
        </Link>

        <div
          className="profileModal"
          style={{ display: showProfileModal ? "block" : "none" }}
          onMouseLeave={handleShowProfileModal}
        >
          {/* <div className="close-modal">
            <button onClick={handleShowProfileModal}>X</button>
          </div> */}
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
          <Link to={"/profile"}>View Profile</Link>
        </div>
      </div>
    </>
  );
};

export default Navbar;
