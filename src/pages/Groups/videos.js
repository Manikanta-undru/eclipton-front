import React, { useState } from 'react';
import images from '../../assets/images/images';
import './style/videos.scss';

function VideosTab(props) {
  const [videos, setVideos] = useState(props.groupvideos);

  const setVideoPlayMode = () => {
    const newVideo = videos.map((video) => {
      video.autoPlay = !video.autoPlay;
      video.controls = !video.controls;
      return video;
    });
    setVideos(newVideo);
  };
  console.log(videos, 'videos');
  const videoplay = videos.map((video, i) => (
    <div className="video" key={i}>
      {/* <video width="700" controls>
                    <source src={postdatas.groupspost.attachment} type="video/mp4" />
                  </video> */}
      <video controls>
        <source src={video.src} type="video/mp4" />
      </video>
      {!video.autoPlay && (
        <img
          className="play"
          onClick={() => setVideoPlayMode()}
          src={images.playButton}
          alt="photo"
        />
      )}
    </div>
  ));

  return (
    <div className="videosAreaWrapper">
      {videos.length > 0 ? videoplay : 'No videos Found'}
    </div>
  );
}

export default VideosTab;
