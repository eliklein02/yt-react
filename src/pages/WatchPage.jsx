import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import VideoCard from "../components/VideoCard";
import Navbar from "../components/Navbar";
import SkeletonLoader from "../components/SkeletonLoader";
import { fetchUser } from "../tools/utils";

const WatchPage = () => {
  const [videoId, setVideoId] = useState(null);
  const [videoTitle, setVideoTitle] = useState(null);
  const [channelId, setChannelId] = useState(null);
  const [channelInfo, setChannelInfo] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState(null);
  const [channelImgLoading, setChannelImgLoading] = useState(false);
  const [channelInfoLoading, setChannelInfoLoading] = useState(false);
  const [relatedVideosLoading, setRelatedVideosLoading] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isFavorite, setIsFavorite] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [player, setPlayer] = useState(null);
  const playerRef = useRef(null);
  const timePlaying = useRef(null);

  // useeffect for youtube iframe api
  useEffect(() => {
    if (!videoId) {
      return;
    }
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      const player = new window.YT.Player(playerRef.current, {
        videoId: videoId,
        playerVars: {
          rel: 0,
        },
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange,
        },
      });
      setPlayer(player);
    };

    return () => {
      if (player) {
        player.destroy();
      }
    };
  }, [videoId]);

  const onPlayerReady = (event) => {
    console.log("Player is ready");
  };

  const onPlayerStateChange = (event) => {
    switch (event.data) {
      case window.YT.PlayerState.PLAYING:
        timePlaying.current = setTimeout(() => {
          console.log("played for 10 seconds");
          addToWatchHistory(videoId);
        }, 7000); // 10 seconds
        console.log("Video is playing");
        break;
      case window.YT.PlayerState.PAUSED:
        console.log("Video is paused");
        if (timePlaying.current) {
          console.log("cleared");
          console.log(timePlaying.current);
          clearTimeout(timePlaying.current);
        }
        break;
      case window.YT.PlayerState.ENDED:
        console.log("Video has ended");
        break;
      default:
        break;
    }
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

  const getQParams = (query) => {
    return new URLSearchParams(query);
  };

  const addToWatchHistory = async (videoId) => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/add_to_watch_history`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          videoId,
        }),
      }
    );
    const res = await response.json();
    console.log(res);
    if (res.status == "success") {
      console.log(res);
      // console.log("success");
      // setIsFavorite(false);
    }
  };

  // use effect to check if video is favorite
  useEffect(() => {
    if (!videoId) {
      return;
    }
    const isFavorite = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/is_favorite`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            videoId,
          }),
        }
      );
      const res = await response.json();
      if (res.is_favorite == true) {
        setIsFavorite(true);
      }
    };
    isFavorite();
  }, [videoId]);

  const favorite = async () => {
    if (isFavorite == true) {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/unfavorite_video`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            videoId,
          }),
        }
      );
      const res = await response.json();
      if (res.status == "success") {
        console.log(res);
        // console.log("success");
        setIsFavorite(false);
      }
    } else {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/favorite_video`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            videoId,
          }),
        }
      );
      const res = await response.json();
      if (res.status == "success") {
        console.log(res);
        // console.log("success");
        setIsFavorite(true);
      }
    }
  };

  useEffect(() => {
    const qParams = getQParams(location.search);
    // setToken(localStorage.getItem("token"));
    setVideoId(qParams.get("videoId"));
    setChannelId(qParams.get("channelId"));
    setVideoTitle(qParams.get("videoTitle"));
  }, [location.search]);

  // useEffect hook to fetch channel info for thumbnail and title
  useEffect(() => {
    const fetchChannelInfo = async () => {
      setChannelInfoLoading(true);
      if (channelId !== null) {
        console.log(channelId);
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/channel_info?channel_id=${channelId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        console.log("channeIf", data);
        setChannelInfo(data);
        setChannelInfoLoading(false);
      } else {
        return;
      }
    };
    fetchChannelInfo();
  }, [channelId]);

  // use effect to fetch related videos
  useEffect(() => {
    const fetchRelatedVideos = async () => {
      setRelatedVideosLoading(true);
      if (
        token !== null &&
        token !== undefined &&
        token !== "" &&
        videoId !== null
      ) {
        console.log(videoId + "when it matters");
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/related_videos?video_id=${videoId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        console.log("relatedVideos:", data);
        setRelatedVideos(data);
        setRelatedVideosLoading(false);
      } else {
        return;
      }
    };
    fetchRelatedVideos();
  }, [videoId]);

  return (
    <>
      <Navbar />
      <div className="full-page-container">
        <div className="left-side">
          <div className="video-container">
            {/* <iframe
              title="YouTube video player"
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${videoId}?feature=oembed&rel=0`}
              frameBorder="0"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe> */}
            <div
              ref={playerRef}
              id="player"
              style={{ height: "100%", width: "100%" }}
            ></div>
          </div>

          <div className="channel-info">
            {channelInfoLoading ? (
              <>
                <div className="loader-round"></div>
                <div className="loader-rectangle"></div>
              </>
            ) : (
              <>
                {channelInfo?.all_other?.avatar?.thumbnails[0]?.url.length && (
                  <>
                    {/* <img
                      src={channelInfo?.all_other?.avatar?.thumbnails[0]?.url}
                      alt="channel thumbnail"
                    /> */}
                    <div
                      style={{
                        width: "150px",
                        height: 150,
                        backgroundImage: `url("${channelInfo?.all_other?.avatar?.thumbnails[0]?.url}")`,
                        backgroundSize: "cover",
                        borderRadius: "50%",
                      }}
                    ></div>
                    <a href={`/channel?channelId=${channelId}`}>
                      <h1>{channelInfo?.all_other?.title}</h1>
                    </a>
                  </>
                )}
              </>
            )}
            <i
              className={
                isFavorite
                  ? "fa-solid fa-heart fa-2xl fa-icon"
                  : "fa-regular fa-heart fa-2xl fa-icon"
              }
              onClick={favorite}
            ></i>
          </div>
        </div>

        <div className="right-side">
          <>
            {relatedVideosLoading ? (
              <div className="videos-home">
                {Array.from({ length: 20 }).map((_, i) => (
                  <SkeletonLoader key={i} />
                ))}
              </div>
            ) : (
              <>
                {relatedVideos &&
                  relatedVideos.length > 0 &&
                  relatedVideos?.map((video, i) => {
                    return <VideoCard key={i} video={video} />;
                  })}
              </>
            )}
          </>
        </div>
      </div>
    </>
  );
};

export default WatchPage;
