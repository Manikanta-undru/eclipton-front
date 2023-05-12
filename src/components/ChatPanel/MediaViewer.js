import React from 'react';
import './MediaViewer.scss';

function MediaViewer({ src, type, setMediaPreviewSrc }) {
  return (
    <div className="media-viewer">
      <div className="container">
        <div className="media-box">
          {type === 'image' ? <img src={src} /> : ''}
          {type === 'video' ? <video src={src} controls /> : ''}
          <div className="closebtn" onClick={() => setMediaPreviewSrc(null)}>
            <i className="fa fa-times" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MediaViewer;
