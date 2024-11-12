import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import { fetchUser } from "../tools/utils";

const FavoritesPage = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("token"));
  const location = useLocation();
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [favorites, setFavorites] = useState(null);
  const [favoritesLoadingFromRails, setFavoritesLoadingFromRails] =
    useState(true);
  const [favoritesLoadingFromAPI, setFavoritesLoadingFromAPI] = useState(true);
  const [user, setUser] = useState({});

  const truncateTitle = (title, maxLength) => {
    return title.length > maxLength
      ? title.substring(0, maxLength) + "..."
      : title;
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
    };
    getUser();
  }, [location.search]);

  const viewCountFormat = (count) => {
    try {
      const c = parseInt(count?.split(" ")[0].replace(/,/g, ""), 10); // Convert string to number
      return new Intl.NumberFormat("en", { notation: "compact" }).format(c);
    } catch (error) {
      return count;
    }
  };

  useEffect(() => {
    const getFavorites = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/favorites`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const res = await response.json();
      if (res.status == "success") {
        setFavoriteIds(res.favorite_videos);
        setFavoritesLoadingFromRails(false);
      } else {
        return;
      }
    };
    getFavorites();
  }, [location.search]);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (favoriteIds.length > 0) {
        const fetchedFavorites = await Promise.all(
          favoriteIds.map(async (f) => {
            const url = `https://yt-api.p.rapidapi.com/video/info?id=${f}`;
            const options = {
              method: "GET",
              headers: {
                "x-rapidapi-key":
                  "3b606db579msh19b9241eefeafdcp17209fjsn27355d6cc125",
                "x-rapidapi-host": "yt-api.p.rapidapi.com",
              },
            };
            try {
              const response = await fetch(url, options);
              const result = await response.json();
              console.log(result);
              return result;
            } catch (error) {
              console.error(error);
              return null;
            }
          })
        );
        setFavorites(fetchedFavorites);
        setFavoritesLoadingFromAPI(false);
      }
    };

    fetchFavorites();
  }, [favoriteIds]);

  useEffect(() => {
    console.log(favorites);
  }, favorites);

  return (
    <>
      <Navbar />
      {/* {favoritesLoadingFromRails == false ? (
        <> */}
      {favoritesLoadingFromAPI ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="videos-home">
            {favorites?.map((d) => (
              <a
                href={`/watch?videoId=${d.id}&channelId=${d.channelId}&videoTitle=${d.title}`}
                target="_self"
                key={d.videoId}
              >
                <div className="video-card">
                  <div className="thumbnail">
                    <img
                      src={
                        d.thumbnail[2]?.url
                          ? d.thumbnail[2].url
                          : d.thumbnail[1].url
                      }
                      alt="Video Thumbnail"
                    />
                    <span className="duration">{d.lengthSeconds}</span>
                  </div>
                  <div className="content">
                    {/* <img className="channel-icon" src="https://yt3.ggpht.com/ytc/AIdro_m9CJFVl3bEWvGnNnN4G9ErBO2lTpKePWCjx_FQtLWaDww=s68-c-k-c0x00ffffff-no-rj" alt="Channel Icon" /> */}
                    <div className="video-info">
                      <div className="title">{truncateTitle(d.title, 55)}</div>
                      <div className="channel-name">
                        {d.channelTitle}
                        {/* <svg className="verified" viewBox="0 0 24 24">
                                              <path d="M12,2C6.5,2,2,6.5,2,12c0,5.5,4.5,10,10,10s10-4.5,10-10C22,6.5,17.5,2,12,2z M9.8,17.3l-4.2-4.1L7,11.8l2.8,2.7L17,7.4 l1.4,1.4L9.8,17.3z" fill="currentColor"></path>
                                          </svg> */}
                      </div>
                      <div className="metadata">
                        {viewCountFormat(d.viewCount)} views • {d.uploadDate}{" "}
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </>
      )}
    </>
    //   ) : (
    //     <>
    //       <p>Loading...</p>
    //     </>
    //   )}
    //     </>
  );
};

export default FavoritesPage;
