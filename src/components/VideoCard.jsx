import React from "react";
let channelId = "";

const VideoCard = ({ video }) => {
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

  return (
    <>
      <a
        href={`/watch?videoId=${video.video.videoId}&channelId=${
          video.video.channelId !== undefined
            ? video.video.channelId
            : channelId
        }&videoTitle=${video.video.title}`}
        target="_self"
      >
        <div class="video-card">
          <div class="thumbnail">
            <img
              src={
                video.video.thumbnails[1]?.url
                  ? video.video.thumbnails[1].url
                  : video.video.thumbnails[0].url
              }
              alt="Video Thumbnail"
            />
            <span class="duration">{video.video.lengthText}</span>
          </div>
          <div class="content">
            {/* <img class="channel-icon" src="https://yt3.ggpht.com/ytc/AIdro_m9CJFVl3bEWvGnNnN4G9ErBO2lTpKePWCjx_FQtLWaDww=s68-c-k-c0x00ffffff-no-rj" alt="Channel Icon" /> */}
            <div class="video-info">
              <div class="title">{truncateTitle(video.video.title, 55)}</div>
              <div class="channel-name">
                {video.video.channelName}
                {/* <svg class="verified" viewBox="0 0 24 24">
                                    <path d="M12,2C6.5,2,2,6.5,2,12c0,5.5,4.5,10,10,10s10-4.5,10-10C22,6.5,17.5,2,12,2z M9.8,17.3l-4.2-4.1L7,11.8l2.8,2.7L17,7.4 l1.4,1.4L9.8,17.3z" fill="currentColor"></path>
                                </svg> */}
              </div>
              <div class="metadata">
                {viewCountFormat(video.video.viewCountText)} views •{" "}
                {video.video.publishedTimeText}{" "}
              </div>
            </div>
          </div>
        </div>
      </a>
    </>
  );
};

export default VideoCard;
