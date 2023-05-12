import React from 'react';
import './style/viewalbum.scss';

function AlbumsTab(props) {
  const Grupscate = props.groupalbum.map((album, index) => (
    <div
      className="album"
      onClick={(e) => (window.location.href = `/viewalbum/${album._id}`)}
      key={index}
    >
      {album.attachment[0].type == 'Image' ? (
        <img src={album.attachment[0].src} alt="album" />
      ) : (
        <video controls>
          <source src={album.attachment[0].src} type="video/mp4" />
        </video>
      )}

      <span className="albumName">{album.name}</span>
      <span className="photoCount">
        {Object.entries(album.attachment).length} photos
      </span>
    </div>
  ));

  return (
    <div className="albumsAreaWrapper">
      {props.groupalbum.length > 0 ? Grupscate : 'No albums Found'}
    </div>
  );
}

export default AlbumsTab;
