import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import VideoCard from "../components/VideoCard";
import Navbar from "../components/Navbar";
import { fetchUser } from "../tools/utils";

const ChannelPage = () => {
  const [next, setNext] = useState(null);

  const [token, setToken] = useState(localStorage.getItem("token"));

  const [channelInfo, setChannelInfo] = useState(null);

  const [channelTitle, setChannelTitle] = useState("");

  const [channelSubscriberCount, setChannelSubscriberCount] = useState("");

  const [channelVideos, setChannelVideos] = useState([]);

  const [channelId, setChannelId] = useState(null);

  const [channelInfoLoading, setChannelInfoLoading] = useState(false);

  const [thumbnailUrl, setThumbnailUrl] = useState("");

  const location = useLocation();

  const navigate = useNavigate();

  const getQParams = (query) => {
    return new URLSearchParams(query);
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
    };
    getUser();
  }, [location.search]);

  useEffect(() => {
    const qParams = getQParams(location.search);
    setToken(localStorage.getItem("token"));
    setChannelId(qParams.get("channelId"));
  }, [location.search]);

  const fetchChannelInfo = async () => {
    setChannelInfoLoading(true);
    if (channelId) {
      let url =
        next == null
          ? `${process.env.REACT_APP_API_URL}/channel_info?channel_id=${channelId}`
          : `${process.env.REACT_APP_API_URL}/channel_info?channel_id=${channelId}&next=${next}`;
      console.log(channelId);
      // console.log(url);
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      // console.log("channeIf", data);
      setChannelInfo((prevData) => ({ ...prevData, ...data }));
      setThumbnailUrl(data?.all_other?.avatar?.thumbnails[0].url);
      setChannelVideos((prev) => [...prev, ...data.videos]);
      setChannelTitle(data?.all_other?.title);
      setChannelSubscriberCount(data?.all_other?.subscriberCountText);
      setNext(data.next);
      setChannelInfoLoading(false);
    } else {
      return;
    }
  };

  useEffect(() => {
    console.log("channelInfo", channelInfo);
    console.log("channel videos", channelVideos);
  }, [channelInfo]);

  useEffect(() => {
    if (
      channelId &&
      channelId !== null &&
      // channelId !== undefined &&
      channelId !== ""
    ) {
      fetchChannelInfo();
    }
  }, [channelId]);
  return (
    <>
      <div className="full-page-container-channel">
        <Navbar />
        <div className="channel-header">
          {channelTitle == "" ? (
            <>
              <div className="channel-image">
                <div className="loader-round"></div>
              </div>
              <div className="channel-info-text">
                <div className="loader-rectangle"></div>
              </div>
            </>
          ) : (
            <>
              <div className="channel-image">
                {/* {console.log(thumbnailUrl)} */}
                {thumbnailUrl && (
                  <img
                    // src={channelInfo?.all_other?.avatar?.thumbnails[0].url}
                    src={thumbnailUrl}
                    alt="channel"
                    height={150}
                    width={150}
                    onError={(e) => console.log(e)}
                  />
                )}
              </div>
              {channelInfo?.all_other && (
                <div className="channel-info-text">
                  <h1>{channelTitle}</h1>
                  <h4>{channelSubscriberCount}</h4>
                </div>
              )}
            </>
          )}
        </div>
        <div className="videos-channel">
          {channelVideos.length > 0 && (
            <>
              {channelVideos?.map((video) => (
                <VideoCard video={video} key={video.videoId} />
              ))}
            </>
          )}
          <button className="load-more-btn" onClick={fetchChannelInfo}>
            More Videos
          </button>
        </div>
      </div>
    </>
  );
};

export default ChannelPage;
