import React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { fetchUser } from "../tools/utils";

const ProfilePage = () => {
  const [user, setUser] = useState(null);

  const [token, setToken] = useState(localStorage.getItem("token"));

  const navigate = useNavigate();

  const location = useLocation();

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
    };
    getUser();
  }, [location.search]);

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        {user && (
          <>
            <h1 style={{ textAlign: "center" }}>Welcome, {user.first_name}!</h1>
            <div className="details-container">
              <div className="detail-item">
                {user.first_name} {user.last_name}
              </div>
              <div className="detail-item">{user.email}</div>
              <div className="detail-item">
                Filter Level:{" "}
                <span className="highlight">{user.filter_level}</span>
              </div>
            </div>

            {/* container of buttons right under the info */}
            <div className="actions-container-profile">
              {/* view favorites button */}
              <Link className="btn btn-view-favorites" to="/favorites">
                View Favorites
              </Link>

              {/* link to /profiles/edit btn */}
              <Link className="btn btn-update-details" to={"/profile/edit"}>
                Update Details
              </Link>

              {/* logout btn */}
              <div className="btn btn-logout">
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
          </>
        )}
      </div>
    </>
  );
};

export default ProfilePage;
