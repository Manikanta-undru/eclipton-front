import React from 'react';
import './style/photos.scss';

function PhotosTab(props) {
  const Grupscate = props.groupattach.map((groupscat, index) => (
    <div className="photo" key={index}>
      <img src={groupscat} alt="photo" />
    </div>
  ));

  return (
    <div className="photosAreaWrapper">
      {props.groupattach.length > 0 ? Grupscate : 'No photos Found'}
    </div>
  );
}

export default PhotosTab;
