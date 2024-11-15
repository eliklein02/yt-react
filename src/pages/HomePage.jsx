import React from "react";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import VideoCard from "../components/VideoCard";
import SkeletonLoader from "../components/SkeletonLoader";
import { useFetchApi } from "../tools/useFetchApi";
import { atom, useAtom } from "jotai";
import { q } from "../components/Navbar"; // Import the q atom
import { fetchUser } from "../tools/utils";

const HomePage = () => {
  // state to store the user after being fetched from the backend
  const [user, setUser] = useState(null);

  // state whether or not the load more videos function is in progress
  const [loadingMore, setLoadingMore] = useState(false);

  // state for information in the url
  const location = useLocation();

  // state for token
  const [token, setToken] = useState(localStorage.getItem("token"));

  // atom state from the imported search query from Navbar (q) to be able to load more videos
  const [searchQuery, setQ] = useAtom(q); // Use the atom here

  // state for whether or not the initial search is in progress
  const [loading, setLoading] = useState(false);

  // state to store pagination token
  const [nextPageToken, setNextPageToken] = useState(null);

  // navigator for redirecting
  const navigate = useNavigate();

  // initialize videos from search results state
  const [videos, setVideos] = useState([]);

  // initialize channels from search results state
  const [channels, setChannels] = useState([]);

  // fetch api from tools/use fetch api
  const fetchApi = useFetchApi();

  // function to fetch more videos and add them to the existing array
  const getMoreVideos = async () => {
    // console.log(nextPageToken);
    if (
      nextPageToken !== null &&
      nextPageToken !== undefined &&
      nextPageToken !== ""
    ) {
      setLoadingMore(true);
      let url = `${process.env.REACT_APP_API_URL}/search?q=${searchQuery}&next=${nextPageToken}`;
      const data = await fetchApi(url, {
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "69420",
        },
      });
      // console.log(data);
      let resultsVideos = data.filtered_videos.filter((i) => i.video);
      let resultsChannels = data.filtered_videos.filter((i) => i.channel);
      setVideos((prev) => [...prev, ...resultsVideos]);
    }
    setLoadingMore(false);
  };

  // use effect to redirect if no token exists and if yes to fetch the user and store it in user state
  useEffect(() => {
    console.log(process.env);
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

  // function that takes the results passed from the Navbar and processes it and stores it in the state
  const functionToGetResults = (results) => {
    let resultsVideos = results.filtered_videos.filter((i) => i.video);
    let resultsChannels = results.filtered_videos.filter((i) => i.channel);
    setVideos(resultsVideos);
    setChannels(resultsChannels);
    setNextPageToken(results.next_token);

    // console.log(resultsVideos);
    // console.log(resultsChannels);
  };

  // useefecct to log the next page token for pagination
  // useEffect(() => {
  //   console.log(nextPageToken);
  // }, [nextPageToken]);

  return (
    <>
      <Navbar
        passResultsUpDown={functionToGetResults}
        setLoading={setLoading}
        currentPage={"homePage"}
      />
      {/* {q} */}

      {loading && (
        <div className="videos-home">
          {Array.from({ length: 20 }).map((_, i) => (
            <SkeletonLoader key={i} />
          ))}
        </div>
      )}

      {videos.length > 0 && (
        <>
          <div className="videos-home">
            {videos.map((video, i) => (
              <VideoCard key={i} video={video} />
            ))}
          </div>
          <div className="load-more-btn-container">
            <button className="load-more-btn" onClick={getMoreVideos}>
              {loadingMore ? "Loading More..." : "Load More Videos"}
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default HomePage;
