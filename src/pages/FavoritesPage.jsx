import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";

const FavoritesPage = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("token"));
  const location = useLocation();
  const [favoriteIds, setFavoriteIds] = useState(null);
  const [favorites, setFavorites] = useState(null);
  const [favoritesLoadingFromRails, setFavoritesLoadingFromRails] =
    useState(true);
  const [favoritesLoadingFromAPI, setFavoritesLoadingFromAPI] = useState(true);

  const truncateTitle = (title, maxLength) => {
    return title.length > maxLength
      ? title.substring(0, maxLength) + "..."
      : title;
  };

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
      const response = await fetch("http://localhost:3001/favorites", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
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
      if (favoriteIds !== null) {
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
              return result;
            } catch (error) {
              console.error(error);
              return null;
            }
          })
        );
        setFavorites(fetchedFavorites.filter((f) => f !== null)); // Filter out any null results
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
              >
                <div class="video-card">
                  <div class="thumbnail">
                    <img
                      src={
                        d.thumbnail[2]?.url
                          ? d.thumbnail[2].url
                          : d.thumbnail[1].url
                      }
                      alt="Video Thumbnail"
                    />
                    <span class="duration">{d.lengthSeconds}</span>
                  </div>
                  <div class="content">
                    {/* <img class="channel-icon" src="https://yt3.ggpht.com/ytc/AIdro_m9CJFVl3bEWvGnNnN4G9ErBO2lTpKePWCjx_FQtLWaDww=s68-c-k-c0x00ffffff-no-rj" alt="Channel Icon" /> */}
                    <div class="video-info">
                      <div class="title">{truncateTitle(d.title, 55)}</div>
                      <div class="channel-name">
                        {d.channelTitle}
                        {/* <svg class="verified" viewBox="0 0 24 24">
                                              <path d="M12,2C6.5,2,2,6.5,2,12c0,5.5,4.5,10,10,10s10-4.5,10-10C22,6.5,17.5,2,12,2z M9.8,17.3l-4.2-4.1L7,11.8l2.8,2.7L17,7.4 l1.4,1.4L9.8,17.3z" fill="currentColor"></path>
                                          </svg> */}
                      </div>
                      <div class="metadata">
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
