import React from "react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
let loading = false;
const searchIcon = "/public/search-icon.svg";

const Navbar = ({ passResultsUpDown, setLoading }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [errors, setErrors] = useState(null);

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
    const res = await fetch(`http://localhost:3001/search?q=${q}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
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
  return (
    <>
      <div className="topBar">
        <a href="/">
          <div className="logoDiv">
            <img src="https://picsum.photos/seed/picsum/50/50" alt="" />
          </div>
        </a>

        <div className="searchBarDiv">
          <form onSubmit={search}>
            <input type="text" value={q} onChange={handleSearchInputChange} />
            <button type="submit">
              <img src="/search-icon.svg" alt="Search Icon" />{" "}
              {/* Reference the icon from the public directory */}
            </button>
          </form>
        </div>

        <Link className="profile-image-div" to={"/profile"}>
          {initials(user.first_name, user.last_name)}
        </Link>
      </div>
    </>
  );
};

export default Navbar;
