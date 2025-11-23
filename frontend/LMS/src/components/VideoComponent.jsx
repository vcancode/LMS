import React, { useEffect, useRef } from "react";
import videojs from "video.js";
import Hls from "hls.js";
import "video.js/dist/video-js.css";

const VideoPlayer = ({ url }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (!url) return;

    const video = videoRef.current;

    // Use hls.js if browser doesn't support HLS natively
    if (url.endsWith(".m3u8?") && !video.canPlayType("application/vnd.apple.mpegurl")) {
      const hls = new Hls();
      hls.loadSource(url);
      hls.attachMedia(video);
    } else {
      video.src = url; // MP4 or native HLS
    }
  }, [url]);

  return <video ref={videoRef} controls width={600} height={400} />;
};

export default VideoPlayer;
