import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import VideoCard from "../components/VideoCard";
import Navbar from "../components/Navbar";

const ChannelPage = () => {
  const [next, setNext] = useState(null);
  const [token, setToken] = useState(null);
  const [channelInfo, setChannelInfo] = useState(null);
  const [channelId, setChannelId] = useState(null);
  const [channelInfoLoading, setChannelInfoLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const getQParams = (query) => {
    return new URLSearchParams(query);
  };

  const fetchChannelInfo = async () => {
    setChannelInfoLoading(true);
    if (token !== null && token !== undefined && token !== "") {
      let url =
        next == null
          ? `http://localhost:3001/channel_info?channel_id=${channelId}`
          : `http://localhost:3001/channel_info?channel_id=${channelId}&next=${next}`;
      console.log(channelId);
      console.log(url);
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      console.log("channeIf", data);
      setChannelInfo(data);
      setNext(data.next);
      setChannelInfoLoading(false);
    } else {
      return;
    }
  };

  useEffect(() => {
    const qParams = getQParams(location.search);
    setToken(localStorage.getItem("token"));
    setChannelId(qParams.get("channelId"));
  }, [location.search]);

  useEffect(() => {
    if (
      channelId &&
      channelId !== null &&
      channelId !== undefined &&
      channelId !== ""
    ) {
      fetchChannelInfo();
    }
  }, [channelId]);
  return (
    <>
      <div className="full-page-container-channel">
        <Navbar />
        {channelInfoLoading ? (
          <h1>Loading...</h1>
        ) : (
          <>
            <div class="channel-header">
              <div class="channel-image">
                {/* {channelInfo?.all_other?.avatar ? (
                  <img
                    src={channelInfo.all_other.avatar.thumbnails[0].url}
                    alt="channel thumbnail"
                    width="200px"
                    height="200px"
                  />
                ) : (
                  )} */}
                {channelInfoLoading ? (
                  <img
                    src="https://picsum.photos/200/200"
                    alt="channel thumbnail"
                  />
                ) : (
                  <>
                    {channelInfo?.all_other?.avatar && (
                      <img
                        src={channelInfo.all_other.avatar.thumbnails[0].url}
                        alt="channel thumbnail"
                        width="200px"
                        height="200px"
                      />
                    )}
                  </>
                )}
              </div>
              <div class="channel-info-text">
                {channelInfo?.all_other && (
                  <>
                    <h1>{channelInfo.all_other.title}</h1>
                    <h4>{channelInfo.all_other.subscriberCountText}</h4>
                  </>
                )}
              </div>
            </div>
            <div className="videos">
              {channelInfo?.videos?.map((video) => (
                <VideoCard video={video} />
              ))}
              <button onClick={fetchChannelInfo}>More Videos</button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ChannelPage;
