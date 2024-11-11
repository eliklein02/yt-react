import React from "react";
import { fetchUser } from "../tools/utils";
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useFetchApi } from "../tools/useFetchApi";
import { atom, useAtom } from "jotai";
export const q = atom("");

const searchIcon = "/public/search-icon.svg";

const Navbar = ({ passResultsUpDown, setLoading, currentPage }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setQ] = useAtom(q); // Use the atom here
  const [errors, setErrors] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const fetchApi = useFetchApi();
  // set search query state to the input
  const handleSearchInputChange = (e) => {
    const v = e.target.value;
    setQ(v);
  };

  const search = async (e) => {
    e.preventDefault();
    if (q == "") {
      return;
    }
    setLoading(true);
    const data = await fetchApi(
      `${process.env.REACT_APP_API_URL}/search?q=${searchQuery}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log(data);
    setLoading(false);
    passResultsUpDown(data);
  };

  useEffect(() => {
    const getUser = async () => {
      const response = await fetchUser(token);
      console.log(response);
      if (user === "not logged in") {
        navigate("/login");
        return;
      }
      setUser(response.user);
    };
    getUser();
  }, [location.search]);

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
        {/* icon */}
        <a href="/">
          {/* <div className="logoDiv">
            <img src="https://picsum.photos/seed/picsum/50/50" alt="" />
          </div> */}
          <i className="fa-solid fa-play fa-2xl"></i>
        </a>

        {/* search bar only if homepage */}
        {currentPage === "homePage" && (
          <>
            <div className="searchBarDiv">
              <form onSubmit={search}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                />
                <button type="submit">
                  <i className="fa-solid fa-magnifying-glass"></i>
                </button>
              </form>
            </div>
          </>
        )}

        {/* profile modal */}
        {user && (
          <Link
            className="profile-initials-div"
            to={"/profile"}
            onMouseEnter={handleShowProfileModal}
          >
            {initials(user.first_name, user.last_name)}
          </Link>
        )}

        <div
          className="profileModal"
          style={{ display: showProfileModal ? "flex" : "none" }}
          onMouseLeave={handleShowProfileModal}
        >
          <div className="close-modal">
            <button onClick={handleShowProfileModal}>
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>

          <div className="modal-content">
            <Link to={"/profile"}>View Profile</Link>
            <br />
            <Link to={"/favorites"}>View Favroites</Link>
          </div>

          <div className="logout-modal-div">
            <i className="fa-solid fa-right-from-bracket"></i>
            <Link
              style={{
                color: "black",
                textDecoration: "underline",
                display: "block",
                fontSize: "1.5rem",
              }}
              to={"/logout"}
            >
              Log Out
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
